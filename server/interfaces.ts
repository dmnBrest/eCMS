import { Action } from 'redux';

// CONSTANTS
export const INTERNAL_ERROR = 'Internal Error';

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
	rememberme: boolean,
};

export interface IResetForm {
	email: string;
};

export interface INewPasswordForm {
	password: string;
	confirmPassword: string;
	email: string;
	token: string;
};

export const enum ResultStatus {
    SUCCESS,
    ERROR
}

export interface IResults {
	status: ResultStatus;
	errors?: string[];
	payload?: any;
}

export interface IRegisterForm {
	username: string;
	email: string;
	password: string;
	token: string;
};

export interface ISettingsForm {
	username: string;
	email: string;
	changePassword: boolean;
	oldPassword: string;
	password: string;
	confirmPassword: string;
};


// MICS
export interface ISpinner {
	counter: number;
	show: boolean
}

export interface IAppState {
	errors: string[];
	info: string[];
	spinner: ISpinner;
	currentUser: IUser;
};

export interface IAppAction extends Action {
	payload?: any;
}

export interface IConfig {
    dbPath: string,
    modules: string[],
    baseUrl: string,
    title: string,
    adminEmail: string,
    noreplyEmail: string
    recaptchaKey: string,
    recaptchaSecret: string
}
