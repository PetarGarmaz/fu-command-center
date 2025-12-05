import { makeAutoObservable, runInAction } from 'mobx';
import { supabase } from "@/utilities/supabaseClient";
import { missionStore } from '@/stores/missionStore'

class UserStore {
	currentUser = null;

	allUsers = [];

	isAdmin = false;
	isMember = false;

	loading = false;
	loaded = true;

	sessionInitialized = false;

	constructor() {
		makeAutoObservable(this);

		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_IN') {
				const authInitiated = localStorage.getItem("authInitiated");

				if (authInitiated && session) {
					this.loadUsers(true);
					localStorage.removeItem("authInitiated");
				} else {
					//Have a session and its initialized
					this.loadUsers(false);
				}
			};
		});

		//Dont have a session
		if(!data) {
			this.loadUsers(false);
		};
	}

	loadUsers = async (isSignup) => {
		this.loading = true;
		const { data, error } = await supabase.from("users").select("*").order("username", { ascending: false });

		runInAction(() => {
			if (error) {
				console.error(error);
			} else {
				this.allUsers = data;
				this.loadCurrentUser(isSignup);
			}
		});

		this.loading = false;
	};

	loadCurrentUser = async (isSignup) => {
		const { data: { session } } = await supabase.auth.getSession();

		if(!session) return null;

		const newUser = session.user;
		const existingUser = this.allUsers.find(user => user.user_id == newUser.id);

		if(isSignup) {
			const {isMember, isAdmin} = await this.getUserRoles(session);

			//Check if user is in DB
			if(!existingUser) {
				runInAction(() => {
					this.addNewUser(newUser, isMember, isAdmin);
				})
			} else {
				const needsUpdate = existingUser.username !== newUser.user_metadata.full_name || existingUser.avatar_url !== newUser.user_metadata.avatar_url || existingUser.isMember !== isMember || existingUser.isAdmin !== isAdmin
				
				//Check if the user is still the same one...or if he needs an update
				if(!needsUpdate) {
					runInAction(() => {
						this.currentUser = existingUser;
					});
				} else {
					runInAction(() => {
						const updatedUser = {...existingUser, username: newUser.user_metadata.full_name, avatar_url: newUser.user_metadata.avatar_url, isMember: isMember, isAdmin: isAdmin };
						this.updateUser(updatedUser);
					})
				};
			}
		} else {
			runInAction(() => {
				this.currentUser = existingUser;
				this.loaded = true;
			});
		}
	}

	signInWithDiscord = async () => {
		localStorage.setItem("authInitiated", "true");
		const { providerData, error } = await supabase.auth.signInWithOAuth({
			provider: 'discord',
			options: {
				scopes: "identify email guilds guilds.members.read"
			}
		});

		return providerData;
	};

	signOut = async () => {
		const { error } = await supabase.auth.signOut();

		this.currentUser = null;
		this.loaded = false;
	};

	getUserRoles = async (session) => {
		//Get bearer token and auth user
		const discordAccessToken = session?.provider_token;
		
		//See if is in FU server
		const responseGuilds = await fetch(`https://discord.com/api/users/@me/guilds`, {headers: {Authorization: "Bearer " + discordAccessToken}});
		const guilds = await responseGuilds.json();
		const fuGuild = guilds.find(guild => guild.id === "282514718445273089");
		if(!fuGuild) return false;

		//Check for roles
		let isAdmin = false;
		let isMember = false;
		const responseMember = await fetch(`https://discord.com/api/users/@me/guilds/282514718445273089/member`, {headers: {Authorization: "Bearer " + discordAccessToken}});
		const memberInfo = await responseMember.json();

		if(memberInfo.roles.includes("598258350718713864")) {
			isMember = true;
		};

		if(memberInfo.roles.includes("714949430649815140")) {
			isAdmin = true;
		};

		return { isMember: isMember, isAdmin: isAdmin };
	};

	addNewUser = async (newUser, isMember, isAdmin) => {
		const user = {user_id: newUser.id, created_at: new Date(), username: newUser.user_metadata.full_name, avatar_url: newUser.user_metadata.avatar_url, isMember: isMember, isAdmin: isAdmin };
		const { data, error } = await supabase.from("users").insert(user);

		if (error) {
			console.error(error);
		} else if (data) {
			runInAction(() => {
				this.allUsers.unshift(data[0]);
				this.currentUser = data[0];
				this.loaded = true;
			});
		}
	}

	updateUser = async (updatedUser) => {
		const index = this.allUsers.findIndex(user => user.id === updatedUser.id);

		if(index !== -1) {
			const { error } = await supabase.from('users').update(updatedUser).eq('id', updatedUser.id);
		
			if (error) {
				console.error(error);
			} else {
				runInAction(() => {
					this.allUsers[index] = { ...this.allUsers[index], ...updatedUser};
					this.currentUser = updatedUser;
					this.loaded = true;
				});
			}
		}
	}

	get createdMissions() {
		if(!this.currentUser) return 0;
		return missionStore.missions.filter(mission => mission.creator === this.currentUser.id).length;
	}
};

export const userStore = new UserStore();