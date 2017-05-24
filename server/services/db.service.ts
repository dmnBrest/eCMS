import { IMain, IDatabase } from 'pg-promise';
import { appConfig } from './../config';
import * as pgPromise from 'pg-promise';
import * as Sequelize from 'sequelize';
import * as I from './../interfaces';
import { v4 as uuidV4} from 'uuid';

let pgp:IMain = pgPromise({
	// Initialization Options
	query: (e) => {
		console.log('Query:');
		console.log(e.query);
	}
});

export const db:IDatabase<any> = pgp(appConfig.dbPath);

export const sequelize = new Sequelize(appConfig.dbPath);

sequelize
	.authenticate()
	.then(() => {
		console.log('Sequelize: Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Sequelize: Unable to connect to the database:', err);
	});

export let User = sequelize.define<I.UserInstance, I.IUser>("User",
	{
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		username: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		email: {
			type: Sequelize.STRING(255),
			allowNull: false,
			unique: true
		},
		password: {
			type: Sequelize.STRING(1024),
			allowNull: false
		},
		slug: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		verification_code: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		reset_password_token: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		reset_password_token_at: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		is_blocked: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		is_admin: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		is_writer: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		created_at: {
			type: Sequelize.INTEGER,
			defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)'),
			allowNull: false
		},
		updated_at: {
			type: Sequelize.INTEGER,
			defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)'),
			allowNull: false
		},
		login_at: {
			type: Sequelize.INTEGER,
			allowNull: true
		}
	},
	{
		tableName: "user",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	});

export let Topic = sequelize.define<I.TopicInstance, I.ITopic>("Topic",
	{
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		title: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		order: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		slug: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		is_hidden: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		total_posts: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		// last_post_id: {
		// 	type: Sequelize.UUID,
		// 	allowNull: true
		// },
		image_ids: {
			type: Sequelize.ARRAY(Sequelize.UUID),
			allowNull: true
		}
	},
	{
		tableName: "topic",
		timestamps: false,
	});

export let Post = sequelize.define<I.PostInstance, I.IPost>("Post",
	{
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		title: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		slug: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		keywords: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		description: {
			type: Sequelize.STRING(1024),
			allowNull: false
		},
		body_raw: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		body_html: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		// topic_id: {
		// 	type: Sequelize.UUID,
		// 	allowNull: false
		// },
		// post_id: {
		// 	type: Sequelize.UUID,
		// 	allowNull: true
		// },
		total_posts: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		// last_post_id: {
		// 	type: Sequelize.UUID,
		// 	allowNull: true
		// },
		image_ids: {
			type: Sequelize.ARRAY(Sequelize.UUID),
			allowNull: true
		},
		// user_id: {
		// 	type: Sequelize.UUID,
		// 	allowNull: true
		// },
		created_at: {
			type: Sequelize.INTEGER,
			defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)'),
			allowNull: false
		},
		updated_at: {
			type: Sequelize.INTEGER,
			defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)'),
			allowNull: false
		},
	},
	{
		tableName: "post",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	});

export let Image = sequelize.define<I.ImageInstance, I.IImage>("Image",
	{
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		filename: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		url: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		title: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		// user_id: {
		// 	type: Sequelize.UUID,
		// 	allowNull: true
		// },
		created_at: {
			type: Sequelize.INTEGER,
			defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)'),
			allowNull: false
		},
		updated_at: {
			type: Sequelize.INTEGER,
			defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)'),
			allowNull: false
		},
	},
	{
		tableName: "image",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	});

Topic.hasMany(Post, {foreignKey: 'topic_id'})
Post.hasMany(Post, {foreignKey: 'post_id'})
Post.belongsTo(Topic, {foreignKey: 'topic_id'})
Post.belongsTo(User, {foreignKey: 'user_id'})

sequelize.sync() // CREATE TABLE IF NOT EXIST (DROP - {force: true})
// .then(() => {
// 	// Table created
// 	return User.create({
// 		username: 'Doom1',
// 		email: 'doom1@doom1.com',
// 		password: 'XXXXXXXXX',
// 		created_at: 0,
// 		slug: 'x1'
// 	});
// })
// .then((user) => {
// 	setTimeout(() => {
// 		user.update({
// 			username: 'Doom2'
// 		})
// 	}, 3000)
// });