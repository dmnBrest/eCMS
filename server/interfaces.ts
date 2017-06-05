import { Action } from 'redux';
import * as Sequelize from 'sequelize';

// CONSTANTS
export const INTERNAL_ERROR = 'Internal Error';

// MODELS
export interface IUser {
	id?: string;
	username?: string;
	password?: string;
	email?: string;
	created_at?: number;
	login_at?: number;
	slug?: string;
	verification_code?: string;
	reset_password_token?: string;
	reset_password_token_at?: number;
	is_blocked?: boolean;
	is_admin?: boolean;
	is_writer?: boolean;
};
export interface UserInstance extends Sequelize.Instance<IUser>, IUser {}
export interface UserModel extends Sequelize.Model<UserInstance, IUser> {}

export interface ITopic {
	id?: string;
	title?: string,
	order?: number,
	slug?: string,
	image_ids?: number[],
	total_posts?: number,
	last_post_id?: string,
	Posts?: IPost[]

}
export interface TopicInstance extends Sequelize.Instance<ITopic>, ITopic {}
export interface TopicModel extends Sequelize.Model<TopicInstance, ITopic> {}

export interface IPost {
	id?: string;
	title?: string,
	body_raw?: string,
	body_html?: string,
	slug?: string,
	description?: string,
	keywords?: string,
	created_at?: number,
	updated_at?: number,
	user_id?: string,
	topic_id?: string,
	Topic?: ITopic,
	image_ids?: string[],
	last_comment_id?: string;
	total_comments?: number,
	Comments?: IComment[]
}
export interface PostInstance extends Sequelize.Instance<IPost>, IPost {}
export interface PostModel extends Sequelize.Model<PostInstance, IPost> {}

export interface IComment {
	id?: string;
	body_raw?: string,
	body_html?: string,
	created_at?: number,
	updated_at?: number,
	user_id?: string,
	post_id?: string,
	Post?: IPost
}
export interface CommentInstance extends Sequelize.Instance<IComment>, IComment {}
export interface CommentModel extends Sequelize.Model<CommentInstance, IComment> {}


export interface IImage {
	id?: string;
	title?: string,
	filename?: string,
	url?: string,
	created_at?: number,
	updated_at?: number,
	user_id?: string
}
export interface ImageInstance extends Sequelize.Instance<IImage>, IImage {}
export interface ImageModel extends Sequelize.Model<ImageInstance, IImage> {}

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
	selectedTopic?: ITopic,
	selectedPost?: IPost,
	spinner?: ISpinner;
	currentUser?: IUser;
	preview?: IBBCodeRarserResponse;
};

export interface ISpinner {
	counter: number;
	show: boolean;
}

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

export interface IBBCodeRarserResponse {
	html: string;
	error: boolean;
	errorQueue: string[];
}
