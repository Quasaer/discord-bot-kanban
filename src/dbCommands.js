const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './src/KanbanDB.db',
	define: {
		timestamps: false,
		freezeTableName: true,
	}
});
// models
const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
const Boards = require('./models/Board')(sequelize, Sequelize.DataTypes);
const Tasks = require('./models/Tasks')(sequelize, Sequelize.DataTypes);
const Column_Status = require('./models/Column_Status')(sequelize, Sequelize.DataTypes);
const Column_Track = require('./models/Column_Track')(sequelize, Sequelize.DataTypes);
const Columns = require('./models/Column')(sequelize, Sequelize.DataTypes);
const Config = require('./models/Config')(sequelize, Sequelize.DataTypes);
const Task_Assignment = require('./models/Task_Assignment')(sequelize, Sequelize.DataTypes);
// global scope
async function addUser(username) { //function to add user
	const created_at = Math.floor(+new Date() / 1000); //calculates date as integer
	await Users.create({ discord_username: username, created_at_date_stamp: created_at}).catch(error => { //adds to database
		console.log(error);
	});
}; 

async function findUser(username) { //function to find user
	const finduser = await Users.findOne({
		where: { discord_username: username }, //attempts to match username paramter (target.tag) to column name discord_username
	});
	return finduser;
};

async function addBindId(channelId, serverId) { //function to add BindID to db
	await Config.create({ channel_bind_id: channelId, server_id: serverId, prefix: '%'}).catch(error => { //adds to config table in database
		console.log(error);
	});
};

async function updateBindId(channelId, serverId) { //function to update BindID to db
	await Config.update({channel_bind_id: channelId, prefix: '%'}, {where: { server_id: serverId}}).catch(error => { //updates config table in database
		console.log(error);
	});
}; 

async function findBindIdByServerId(serverId) { //function to find server id
	const findBind = await Config.findOne({
		where: { server_id: serverId }, //attempts to match server id in db to the server id of the current message
	});
	return findBind;
};

async function findBindIdByChannelId(channelId) { //function to find channel id
	const findBindId = await Config.findOne({
		where: { channel_bind_id: channelId },//attempts to match channel id in db to the channel id of the current message
	});
	return findBindId;
};

module.exports = { addUser, findUser, addBindId, findBindIdByServerId, updateBindId, findBindIdByChannelId }; //only export function calls
