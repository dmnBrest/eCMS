import { Action } from 'redux';


// MODELS
export interface IUser {
	id: number;
	username: string;
	password: string;
	email: string;
	created_at: number;
	login_at?: number;
	slug: string;
	verification_code: string;
	is_blocked: boolean;
	is_admin: boolean;
};

// FORMS
export interface ILoginForm {
	email: string;
	password: string;
	rememberme?: boolean
};

export interface IRegisterForm {
	username: string;
	email: string;
	password: string;
};

// MICS
export interface ISpinner {
	counter: number;
	show: boolean
}

export interface IAppState {
	errors: string[];
	spinner: ISpinner;
	currentUser: IUser;
};

export interface IAppAction extends Action {
	payload?: any;
}
