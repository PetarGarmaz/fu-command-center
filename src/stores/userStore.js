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

	constructor() {
		makeAutoObservable(this);

		this.loadUsers();
	}

	loadUsers = async () => {
		this.loading = true;
		const { data, error } = await supabase.from("users").select("*").order("username", { ascending: false });

		runInAction(() => {
			if (error) {
				console.error(error);
			} else {
				this.allUsers = data;
				
				this.loadCurrentUser();
			}
		});

		this.loading = false;
	};

	loadCurrentUser = async () => {
		const { data: { user, error} } = await supabase.auth.getUser();
		this.currentUser = await this.allUsers.find(u => u.user_id == user?.id);

		if(user && !this.currentUser) {
			console.log(this.currentUser);
			this.addUser(user);
		};

		this.loaded = true;
	}

	signInWithDiscord = async () => {
		const { providerData, error } = await supabase.auth.signInWithOAuth({provider: 'discord',});

		this.loadCurrentUser();
	};

	signOut = async () => {
		const { error } = await supabase.auth.signOut();

		this.currentUser = null;
	};

	addUser = async (newUser) => {
		var isAdmin = false;
		var isMember = false;
		const { data: { session } } = await supabase.auth.getSession();

		const discordAccessToken = session?.provider_token;

		const res = await fetch("https://discord.com/api/users/@me/guilds", {
			headers: {
				Authorization: `Bearer ${discordAccessToken}`
			}
		});

		const guilds = await res.json();

		for (let i = 0; i < guilds.length; i++) {
			if(guilds[i].id == "282514718445273089") {
				const roleResponse = await fetch(`https://discord.com/api/users/@me/guilds/${guilds[i].id}/member`, {headers: {Authorization: "Bearer " + discordAccessToken}});
				const memberInfo = await roleResponse.json();

				for (let j = 0; j < memberInfo.roles.length; j++) {
					if(memberInfo.roles[j] == "598258350718713864") {
						isMember = true;
					};

					if(memberInfo.roles[j] == "714949430649815140") {
						isAdmin = true;
					}
				}
			};
		};

		const user = {user_id: newUser.id, created_at: new Date(), username: newUser.user_metadata.full_name, avatar_url: newUser.user_metadata.avatar_url, isMember: isMember, isAdmin: isAdmin };

		const { data, error } = await supabase.from("users").insert(user);

		if (error) {
			console.error(error);
		} else if (data) {
			runInAction(() => {
				this.allUsers.unshift(data[0]);
			});
		}

		return true;
	};

	get createdMissions() {
		return missionStore.missions.filter(mission => mission.creator === this.currentUser.id).length;
	}
};

export const userStore = new UserStore();