import { makeAutoObservable, runInAction } from 'mobx';
import { supabase } from "@/utilities/supabaseClient";
import { fakeMissions } from "@/utilities/fakeMissions.js";
import { roleData } from "@/utilities/roles.js";

class MissionStore {
	missions = [];

	featuredMission = null;
	upcomingMissions = [];
	archivedMissions = [];

	filteredUpcomingMissions = [];
	filteredArchivedMissions = [];

	availableMaps = [];
	availableRoles = [];

	currentUpcomingPage = 1;
	currentArchivedPage = 1;
	cardsPerPage = 6;
	
	loading = false;
	error = null;

	constructor() {
		makeAutoObservable(this);
		this.loadMissions();
	}

	async loadMissions() {
		this.loading = true;
		const { data, error } = await supabase.from("missions").select("*").order("date", { ascending: false });


		runInAction(() => {
			if (error) {
				console.error(error);
			} else {
				this.missions = data;

				this.filteredUpcomingMissions = this.missions;
				this.filteredArchivedMissions = this.missions;

				this.availableRoles = roleData;
				this.getFeaturedMission();
				this.getUpcomingMissions();
				this.getArchivedMissions();
				this.getAvailableMaps();
			}
		});		

		this.loading = false;
	}

	async addMission(missionData) {
		const slug = this.generateSlug(missionData.title);
		const similarTitle = this.missions.some(mission => mission.slug == slug);
		const newSlug = similarTitle ? this.generateSlug(missionData.title + "-" + similarTitle.date) : slug;
		const newMission = {...missionData, created_at: new Date(), slug: newSlug};

		const { data, error } = await supabase.from("missions").insert(newMission);

		if (error) {
			console.error(error);
		} else if (data) {
			runInAction(() => {
				this.missions.unshift(data[0]);
			});
		}

		return true;
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

		const upcoming = this.filteredUpcomingMissions.filter(m => new Date(m.date) >= today && new Date(m.date) > futureDate).sort((a, b) => new Date(a.date) - new Date(b.date));
		this.upcomingMissions = upcoming;		
	}

	getArchivedMissions() {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		this.archivedMissions = this.filteredArchivedMissions.filter(m => new Date(m.date) < today).sort((a, b) => new Date(b.date) - new Date(a.date));
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

	getFilteredUpcomingMissions(search, terrain, role) {
		const filteredMissions = this.missions.filter(mission => 
			mission.title.toLowerCase().includes(search.toLowerCase()) &&
			mission.map.toLowerCase().includes(terrain.toLowerCase()) &&
			mission.roles.some(r => r.name.toLowerCase().includes(role))
		);

		this.filteredUpcomingMissions = filteredMissions;
		this.getUpcomingMissions();
	}

	getFilteredArchivedMissions(search, terrain, status) {
		const filteredMissions = this.missions.filter(mission => 
			mission.title.toLowerCase().includes(search.toLowerCase()) &&
			mission.map.toLowerCase().includes(terrain.toLowerCase()) &&
			mission.status.toLowerCase().includes(status)
		);

		this.filteredArchivedMissions = filteredMissions;
		this.getArchivedMissions();
	}

	get totalUpcomingPages() {
		return Math.ceil(this.upcomingMissions.length / this.cardsPerPage);
	}

	get totalArchivedPages() {
		return Math.ceil(this.archivedMissions.length / this.cardsPerPage);
	}

	get paginatedUpcomingMissions() {
		const start = (this.currentUpcomingPage - 1) * this.cardsPerPage;
		const end = start + this.cardsPerPage;
		return this.upcomingMissions.slice(start, end);
	}

	get paginatedArchivedMissions() {
		const start = (this.currentArchivedPage - 1) * this.cardsPerPage;
		const end = start + this.cardsPerPage;
		return this.archivedMissions.slice(start, end);
	}

	setCurrentUpcomingPage (page) {
		this.currentUpcomingPage = page;
	}

	setCurrentArchivedPage (page) {
		this.currentArchivedPage = page;
	}
}

export const missionStore = new MissionStore();