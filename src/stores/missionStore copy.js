import { makeAutoObservable, runInAction } from 'mobx';
import { supabase } from "@/utilities/supabaseClient";
import {fakeMissions} from "@/utilities/fakeMissions.js";
import { roleData } from "@/utilities/roles.js";

class MissionStore {
	missions = [];

	featuredMission = {};
	upcomingMissions = [];
	archivedMissions = [];

	availableMaps = [];
	availableRoles = [];

	posts = [];
	loading = false;
	error = null;

	constructor() {
		makeAutoObservable(this);
		
		this.loadMissions();
		//this.missions = fakeMissions;
	}

	async loadMissions() {
		this.loading = true;
		/*const { data, error } = await supabase.from("missions").select("*").order("date", { ascending: false });

		runInAction(() => {
			if (error) {
				console.error(error);
			} else {
				//this.missions = data || [];
				this.missions = fakeMissions;
				this.getUpcomingMissions();
				this.getFeaturedMission();
			
			
		});}*/

		runInAction(() => {
			this.missions = fakeMissions;
			this.availableRoles = roleData;
			this.getFeaturedMission();
			this.getUpcomingMissions();
			this.getArchivedMissions();
			this.getAvailableMaps();
			this.loading = false;
		});		
	}

	async addMission(missionData) {
		const newMission = {...missionData, created_at: new Date(), slug: this.generateSlug(postData.title)};
		const { data, error } = await supabase.from("missions").insert(newMission);

		if (error) {
			console.error(error);
		} else if (data) {
			runInAction(() => {
				this.missions.unshift(data[0]);
			});
		}
	}

	async addPost(postData) {
		const newPost = {...postData, created_at: new Date(), slug: this.generateSlug(postData.title)};
		const { data, error } = await supabase.from("blog").insert(newPost);

		if (error) {
			console.error(error);
		} else if (data) {
			runInAction(() => {
				this.posts.unshift(data[0]);
			});
		}
	}

	async updatePost(id, updates) {
		const index = this.posts.findIndex(post => post.id === id);
		if (index !== -1) {
			this.posts[index] = { 
				...this.posts[index], 
				...updates,
				slug: updates.title ? this.generateSlug(updates.title) : this.posts[index].slug
			};

			const { error } = await supabase.from('blog').update(this.posts[index]).eq('id', id);
		}
	}

	async deletePost(id) {
		this.posts = this.posts.filter(post => post.id !== id);
		const response = await supabase.from('blog').delete().eq('id', id);
	}

	getFeaturedMission() {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const upcoming = this.missions.filter(m => new Date(m.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date));

		if(upcoming.length > 0) {
			const featuredDate = new Date(upcoming[0].date);
			featuredDate.setHours(0, 0, 0, 0);

			const futureDate = new Date();
			futureDate.setHours(0, 0, 0, 0);
			futureDate.setDate(futureDate.getDate() + 7);

			if(featuredDate <= futureDate) {
				this.featuredMission = upcoming[0];
			} else {
				this.featuredMission = null;
			}
		} else {
			this.featuredMission = null;
		}
	}

	getUpcomingMissions() {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const futureDate = new Date();
		futureDate.setHours(0, 0, 0, 0);
		futureDate.setDate(futureDate.getDate() + 7);

		const upcoming = this.missions.filter(m => new Date(m.date) >= today && new Date(m.date) > futureDate).sort((a, b) => new Date(a.date) - new Date(b.date));
		this.upcomingMissions = upcoming;		
	}

	getArchivedMissions() {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		this.archivedMissions = this.missions.filter(m => new Date(m.date) < today).sort((a, b) => new Date(b.date) - new Date(a.date));
	}

	getAvailableMaps() {
		var uniqueMaps = [];

		for (const missionIndex in this.missions) {
			const map = this.missions[missionIndex].map;

			if(!(uniqueMaps.includes(map))) {
				uniqueMaps.push(map)
			}
		}

		this.availableMaps = uniqueMaps.sort((a, b) => {
			const nameA = a.toUpperCase(); // ignore upper and lowercase
			const nameB = b.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}

			// names must be equal
			return 0;
		});
	}

	generateSlug(title) {
		return title
		.toLowerCase()
		.replace(/[čć]/g, 'c')
		.replace(/[đ]/g, 'd')
		.replace(/[š]/g, 's')
		.replace(/[ž]/g, 'z')
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();
	}

	get latestPosts() {
		return this.posts
		.slice()
		.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
	}

	get featuredPosts() {
		return this.posts.filter(post => post.featured);
	}

	getFilteredPosts(searchTerm = '') {
		return this.posts.filter(post => 
		post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
		post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
		);
	}

}

export const missionStore = new MissionStore();