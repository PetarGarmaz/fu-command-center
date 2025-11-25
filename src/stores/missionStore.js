import { makeAutoObservable, runInAction } from 'mobx';
import { supabase } from "@/utilities/supabaseClient";
import { roleData } from "@/utilities/roles.js";

class MissionStore {
	missions = [];
	allCreators = [];

	featuredMission = null;
	featuredMissionOptional = null;
	upcomingMissions = [];
	archivedMissions = [];
	profileMissions = [];
	mainMissions = [];

	filteredUpcomingMissions = [];
	filteredArchivedMissions = [];
	filteredProfileMissions = [];

	availableMaps = [];
	availableRoles = [];
	availableHosts = [];

	currentUpcomingPage = 1;
	currentArchivedPage = 1;
	currentProfilePage = 1;
	cardsPerPage = 6;

	currentProfile = null;
	
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
				this.filteredProfileMissions = this.missions;

				this.availableRoles = roleData;
				this.getFeaturedMission();
				this.getUpcomingMissions();
				this.getArchivedMissions();
				this.getAvailableMaps();
				this.getAvailableHosts();
				this.getMainMissions();
			}
		});		

		this.loading = false;
	}

	async addMission(missionData, creator, processedImage, date) {
		const slug = this.generateSlug(missionData.title);
		const similarTitle = this.missions.some(mission => mission.slug == slug);
		const newSlug = similarTitle ? this.generateSlug(missionData.title + "-" + similarTitle.date) : slug;
		const newMission = {...missionData, created_at: new Date(), slug: newSlug, creator: creator.id, image: processedImage, date: date};

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

	async editMission(id, missionData, creator, processedImage, date) {
		const index = this.missions.findIndex(mission => mission.id === id);
		const newSlug = missionData.title ? this.generateSlug(missionData.title + "-" + missionData.date) : this.missions[index].slug;

		const newMission = {...missionData, slug: newSlug, creator: creator.id, image: processedImage, date: date};

		if (index !== -1) {
			this.missions[index] = { ...this.missions[index], ...newMission};
			const { error } = await supabase.from('missions').update(this.missions[index]).eq('id', id);

			return true;
		}

		return false;
	}

	async deleteMission(id) {
		this.missions = this.missions.filter(mission => mission.id !== id);
		const response = await supabase.from('missions').delete().eq('id', id);
	}

	getFeaturedMission() {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const upcoming = this.missions.filter(m => new Date(m.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date));

		if(upcoming.length > 0) {
			const upcomingMain = upcoming.find(m => m.type === "main");
			const upcomingOptional = upcoming.find(m => m.type !== "main");

			const futureDate = new Date();
			futureDate.setHours(0, 0, 0, 0);
			futureDate.setDate(futureDate.getDate() + 7);

			if(upcomingMain) {
				const featuredDate = new Date(upcomingMain.date);
				featuredDate.setHours(0, 0, 0, 0);

				if(featuredDate <= futureDate) {
					this.featuredMission = upcomingMain;
				} else {
					this.featuredMission = null;
				}
			};

			if(upcomingOptional) {
				const featuredDate = new Date(upcomingOptional.date);
				featuredDate.setHours(0, 0, 0, 0);

				if(featuredDate <= futureDate) {
					this.featuredMissionOptional = upcomingOptional;
				} else {
					this.featuredMission = null;
				}
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

		const upcoming = this.filteredUpcomingMissions.filter(m => new Date(m.date) > futureDate).sort((a, b) => new Date(a.date) - new Date(b.date));
		this.upcomingMissions = upcoming;

		console.log(upcoming);	
	}

	getProfileMissions() {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const futureDate = new Date();
		futureDate.setHours(0, 0, 0, 0);
		futureDate.setDate(futureDate.getDate() + 7);

		const myMissions = this.filteredProfileMissions.filter(m => m.creator == this.currentProfile?.id).sort((a, b) => new Date(a.date) - new Date(b.date));
		this.profileMissions = myMissions;	
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

	getAvailableHosts() {
		var uniqueHosts = [];

		for (const missionIndex in this.missions) {
			const host = this.missions[missionIndex].host;

			if(!(uniqueHosts.includes(host))) {
				uniqueHosts.push(host)
			}
		}

		this.availableHosts = uniqueHosts.sort((a, b) => {
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

	getFilteredUpcomingMissions(search, host, terrain, role) {
		const filteredMissions = this.missions.filter(m => 
			(!search || m.title.toLowerCase().includes(search.toLowerCase())) &&
			(!host || m.host.toLowerCase().includes(host.toLowerCase())) &&
			(!terrain || m.map.toLowerCase().includes(terrain.toLowerCase())) &&
			(!role || m.roles.some(r => r.name.toLowerCase().includes(role.toLowerCase())))
		);

		this.filteredUpcomingMissions = filteredMissions;
		this.getUpcomingMissions();
	}

	getFilteredArchivedMissions(search, host, terrain, status) {
		const filteredMissions = this.missions.filter(mission => 
			(!search || mission.title.toLowerCase().includes(search.toLowerCase())) &&
			(!host || mission.host.toLowerCase().includes(host.toLowerCase())) &&
			(!terrain || mission.map.toLowerCase().includes(terrain.toLowerCase())) &&
			(!status || mission.status.toLowerCase().includes(status))
		);

		this.filteredArchivedMissions = filteredMissions;
		this.getArchivedMissions();
	}

	getFilteredProfileMissions(search, host, terrain) {
		const filteredMissions = this.missions.filter(mission => 
			(!search || mission.title.toLowerCase().includes(search.toLowerCase())) &&
			(!host || mission.host.toLowerCase().includes(host.toLowerCase())) &&
			(!terrain || mission.map.toLowerCase().includes(terrain.toLowerCase()))
		);

		this.filteredProfileMissions = filteredMissions;
		this.getProfileMissions(this.currentProfile);
	}

	getMainMissions() {
		const filteredMissions = this.missions.filter(mission => mission.type.includes("main")).sort((a, b) => new Date(a.date) - new Date(b.date));
		this.mainMissions = filteredMissions;
	}

	get totalUpcomingPages() {
		return Math.ceil(this.upcomingMissions.length / this.cardsPerPage);
	}

	get totalArchivedPages() {
		return Math.ceil(this.archivedMissions.length / this.cardsPerPage);
	}

	get totalProfilePages() {
		return Math.ceil(this.profileMissions.length / 10);
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

	get paginatedProfileMissions() {
		const start = (this.currentProfilePage - 1) * 10;
		const end = start + 10;
		return this.profileMissions.slice(start, end);
	}

	setCurrentUpcomingPage (page) {
		this.currentUpcomingPage = page;
	}

	setCurrentArchivedPage (page) {
		this.currentArchivedPage = page;
	}

	setCurrentProfilePage (page) {
		this.currentProfilePage = page;
	}

	setCurrentProfile (profile) {
		this.currentProfile = profile;
	}

	setAllCreators = () => {
		this.allCreators = this.missions.map(mission => mission.creator);
	}
}

export const missionStore = new MissionStore();