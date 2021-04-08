const { User } = require('discord.js');
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
const Board = require('./models/Board')(sequelize, Sequelize.DataTypes);
const Tasks = require('./models/Tasks')(sequelize, Sequelize.DataTypes);
const ColumnStatus = require('./models/Column_Status')(sequelize, Sequelize.DataTypes);
const ColumnTrack = require('./models/Column_Track')(sequelize, Sequelize.DataTypes);
const Column = require('./models/Column')(sequelize, Sequelize.DataTypes);
const Config = require('./models/Config')(sequelize, Sequelize.DataTypes);
const Task_Assignment = require('./models/Task_Assignment')(sequelize, Sequelize.DataTypes);
// global scope
async function addUser(username) { //function to add user
	const created_at = Math.floor(+new Date() / 1000); //calculates date as integer
	const user = await Users.create({ discord_username: username, created_at_date_stamp: created_at}).catch(error => { //adds to database
		console.log(error);
	});
	return user;
}; 

async function findUser(username) { //function to find user
	const foundUser = await Users.findOne({
		where: { discord_username: username }, //attempts to match username paramter (target.tag) to column name discord_username
	});
	return foundUser;
};

//boards
async function createBoard(data) { //function to add user
	data["created_at_date_time_stamp"] = Math.floor(+new Date() / 1000); //calculates date as integer
	const board = await Board.create(data).catch(error => { //adds to database (not doing userid)
		console.log(error);
	});
	return board;
};

async function findBoardByName(boardName) { //function to find user
	const foundBoardByName = await Board.findOne({
		where: { name: boardName }, });
	return foundBoardByName;
};

//column status
async function findAllColumnStatus(){
	const allStatus = await ColumnStatus.findAll({
		attributes: ['column_status_id'] 
	});
	return allStatus;
};

//column track
async function addColumnTrackRecord(data) { //function to add user
	data["created_at_date_time_stamp"] = Math.floor(+new Date() / 1000); //calculates date as integer
	await ColumnTrack.create(data).catch(error => { //adds to database (not doing userid)
		console.log(error);
	});
};

//column
async function addColumn(data) { //function to add user
	data["created_at_date_time_stamp"] = Math.floor(+new Date() / 1000); //calculates date as integer
	const column = await Column.create(data).catch(error => { //adds to database (not doing userid)
		console.log(error);
	});
	return column;
};

async function createConfig(serverId) { //function to add config record to db
	await Config.create({ server_id: serverId, prefix: '%'}).catch(error => { //adds to config table in database
		console.log(error);
	});
};

async function updateBindId(channelId, serverId) { //function to update BindID to db
	await Config.update({channel_bind_id: channelId}, {where: { server_id: serverId}}).catch(error => { //updates config table in database
		console.log(error);
	});
}; 

async function findConfigByServerId(serverId) { //function to find server id
	const configModel = await Config.findOne({
		where: { server_id: serverId }, //attempts to match server id in db to the server id of the current message
	});
	return configModel;
};

async function updateBoard(data){
	data.updatedFields["updated_at_date_time_stamp"] = Math.floor(+new Date() / 1000); //calculates date as integer
	await Board.update(data.updatedFields, {where: data.updateCondition}).catch(error => { //updates config table in database
		console.log(error);
	});
};

async function findColumnNameByBoardIdAndName(boardId, columnName) { //function to find server id
	const columnModel = await Column.findOne({
		where: { name: columnName, board_id: boardId }, //attempts to match server id in db to the server id of the current message
	});
	return columnModel;
};

async function updateColumn(data){
	data.updatedFields["updated_at_date_time_stamp"] = Math.floor(+new Date() / 1000); //calculates date as integer
	await Column.update(
			data.updatedFields, 
			{where: data.updateCondition}
		).catch(error => { //updates config table in database
		console.log(error);
	});
};

//get date
function getFormattedDate(dateInput){
	let formattedDate;
	if(dateInput === '') {
		formattedDate = 'Nothing'
	} else {
		let date = new Date(dateInput);
		let year = date.getFullYear();
		let month = date.getMonth();
		month += 1;
		let day = date.getDate();

		formattedDate = year + '-' + month + '-' + day; 
		// console.log(formattedDate);
	}
	
	return formattedDate;
}


module.exports = { 
	addUser,
	findUser,
	createConfig,
	findConfigByServerId,
	updateBindId ,
	findBoardByName,
	createBoard,
	addColumn,
	addColumnTrackRecord,
	findAllColumnStatus,
	updateBoard,
	findColumnNameByBoardIdAndName,
	updateColumn,
	getFormattedDate,
}; //only export function calls
