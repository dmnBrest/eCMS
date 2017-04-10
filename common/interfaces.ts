// MODELS
export interface IUser {
	id: number;
	username?: string;
	password?: string;
	email?: string;
};

// FORMS
export interface ILoginForm {
	email: string;
	password: string;
	rememberme?: boolean
};

// MICS
export interface ISpinner {
	counter: number;
	show: boolean
}
