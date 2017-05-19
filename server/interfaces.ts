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

export interface ITopic {
	id: number;
	title: string,
	order: number,
	slug: string,
	image_ids: number[],
	total_posts: number,
	last_post_id: number
}

export interface IPost {
	id: number;
	title: string,
	body_raw: string,
	body_html: string,
	slug: string,
	total_posts: number,
	description: string,
	keyword: string,
	created_at: number,
	updated_at: number,
	user_id: number,
	post_id: number,
	topic_id: number,
	image_ids: number[]
}

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
export interface IState {
	app: IAppState,
	admin: IAdminState
}

export interface IAppState {
	hash?: string;
	errors?: string[];
	info?: string[];
	selectedPost?: IPost,
	spinner?: {
		counter: number;
		show: boolean;
	};
	currentUser?: IUser;
};

export interface IAdminState {
	selectedTopic?: ITopic;
	listViews?: {
		users?: IListViewState;
		topics?: IListViewState;
	}
};

export interface IListViewState {
	object: string,
	page: number;
	list: any;
	perPage: number;
	totalPages: number;
}

export interface IAppAction extends Action {
	payload?: any;
}

export interface IConfig {
    dbPath: string;
    modules: string[];
    baseUrl: string;
    title: string;
    adminEmail: string;
    noreplyEmail: string
    recaptchaKey: string;
    recaptchaSecret: string;
}


export enum FieldTypes {
    STRING,
    DATE,
	DATETIME,
	BOOLEAN,
	NUMBER,
	CURRENCY
}

export interface IField {
	name: string;
	label: string;
	type: FieldTypes;
	editable?: boolean;
}
