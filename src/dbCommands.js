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
async function addBoard(userModel, boardName, startDateInput, deadlineDateInput) { //function to add user
	// console.log(username);
	userId = userModel.user_id;
	
	const created_at = Math.floor(+new Date() / 1000); //calculates date as integer
	const board = await Board.create({ 
		name: boardName, 
		start_date_time_stamp: startDateInput,
		end_date_time_stamp: deadlineDateInput, 
		created_at_date_time_stamp: created_at,
		created_by_user_id: userId, 
	}).catch(error => { //adds to database (not doing userid)
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
async function addColumnTrackRecord(userModel, columnModel, columnStatusModel) { //function to add user
	// console.log(username);
	userId = userModel.user_id;
	columnId = columnModel.column_id;
	// console.log(columnStatusModel);
	statusId = columnStatusModel.column_status_id;
	// console.log(statusId);
	const created_at = Math.floor(+new Date() / 1000); //calculates date as integer
	const columnTrackRecord = await ColumnTrack.create({ 
		column_id: columnId, 
		column_status_id: statusId,
		created_at_date_time_stamp: created_at,
		created_by_user_id: userId, 
	}).catch(error => { //adds to database (not doing userid)
		console.log(error);
	});
	return columnTrackRecord;
};

//column
async function addColumn(userModel, ColumnName, boardId, columnOrderNumber) { //function to add user
	// console.log(username);
	userId = userModel.user_id;
	// console.log(boardModel);

	
	const created_at = Math.floor(+new Date() / 1000); //calculates date as integer
	const column = await Column.create({ 
		name: ColumnName, 
		board_id: boardId,
		column_order_number: columnOrderNumber,
		created_at_date_time_stamp: created_at,
		created_by_user_id: userId, 
	}).catch(error => { //adds to database (not doing userid)
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

async function updateBoard(board){
	const updated_at = Math.floor(+new Date() / 1000); //calculates date as integer
	const boardModel = await Board.update({
		name: board.name, 
		start_date_time_stamp: board.startDate,
		end_date_time_stamp: board.deadlineDate, 
		updated_at_date_time_stamp: updated_at,
		updated_by_user_id: board.userId,
	}, {where: { board_id: board.id}}).catch(error => { //updates config table in database
		console.log(error);
	});
	return boardModel;
};

async function findColumnNameByBoardIdAndName(boardId, columnName) { //function to find server id
	const columnModel = await Column.findOne({
		where: { name: columnName, board_id: boardId }, //attempts to match server id in db to the server id of the current message
	});
	return columnModel;
};

async function updateColumn(board){
	const updated_at = Math.floor(+new Date() / 1000); //calculates date as integer
	const columnModel = await Column.update({
		name: board.columnInputName,
		updated_at_date_time_stamp: updated_at,
		updated_by_user_id: board.userId,
	}, {where: { name: board.column, board_id: board.id}}).catch(error => { //updates config table in database
		console.log(error);
	});
	return columnModel;
};


module.exports = { 
	addUser,
	findUser,
	createConfig,
	findConfigByServerId,
	updateBindId ,
	findBoardByName,
	addBoard,
	addColumn,
	addColumnTrackRecord,
	findAllColumnStatus,
	updateBoard,
	findColumnNameByBoardIdAndName,
	updateColumn,
}; //only export function calls
