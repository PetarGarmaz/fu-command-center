import { makeAutoObservable, runInAction } from 'mobx';

class FormStore {
	formData = {
		title: "",
		creator: {},
		host: "",
		type: "Main",
		date: "2025-11-14",
		map: "",
		sections: [
			{ title: "Situation", description: "" }
		],
		image: "",
		status: "",
		statusDesc: "",
		roles: [],
		attachedMission: {}
	};

	isSubmitting = false;
	submitSuccess = false;

	constructor() {
		makeAutoObservable(this);
	}

	setSubmitSuccess = (state) => {
		this.submitSuccess = state;
	}

	addSection = () => {
		const newSections = this.formData.sections;
		newSections.push({title: "", description: ""}); 
		this.setFormData({...this.formData, sections: newSections});
	}

	addRole = () => {
		const newRoles = this.formData.roles;
		newRoles.push({name: "empty", slots: 1}); 
		this.setFormData({...this.formData, roles: newRoles});
	}

	removeRole = (index) => {
		const newRoles = this.formData.roles;
		newRoles.splice(index, 1); 
		this.setFormData({...this.formData, roles: newRoles});
	}

	removeSection = (index) => {
		const newSections = this.formData.sections;
		newSections.splice(index, 1); 
		this.setFormData({...this.formData, sections: newSections});
	}

	setFormData = (data) => {
		this.formData = data;
	}

	handleInputChange = (e) => {
		if(e.target.id == "title") {
			this.setFormData({...this.formData, title: e.target.value});
		} else if (e.target.id == "host") {
			this.setFormData({...this.formData, host: e.target.value});
		} else if (e.target.id == "date") {
			this.setFormData({...this.formData, date: e.target.value});
		} else if (e.target.id == "terrain") {
			this.setFormData({...this.formData, map: e.target.value});
		};
	}

	handleBriefingChange = (e, idx) => {
		if(e.target.id == "briefing_title") {
			this.setFormData({...this.formData, sections: this.formData.sections.map((section, index) =>
				index === idx ? { ...section, title: e.target.value } : section),
			})
		}

		if(e.target.id == "briefing_desc") {
			this.setFormData({...this.formData, sections: this.formData.sections.map((section, index) =>
				index === idx ? { ...section, description: e.target.value } : section),
			})
		}
	}

	handleRolesChange = (e, idx) => {
		if(e.target.id == "roles_name") {
			this.setFormData({...this.formData, roles: this.formData.roles.map((role, index) =>
				index === idx ? { ...role, name: e.target.value } : role),
			})
		}

		if(e.target.id == "roles_slots") {
			this.setFormData({...this.formData, roles: this.formData.roles.map((role, index) =>
				index === idx ? { ...role, slots: e.target.value } : role),
			})
		}
	}

};

export const formStore = new FormStore();