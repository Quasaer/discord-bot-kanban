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

const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
const Board = require('./models/Board')(sequelize, Sequelize.DataTypes);
const Tasks = require('./models/Tasks')(sequelize, Sequelize.DataTypes);
const ColumnStatus = require('./models/Column_Status')(sequelize, Sequelize.DataTypes);
const ColumnTrack = require('./models/Column_Track')(sequelize, Sequelize.DataTypes);
const Column = require('./models/Column')(sequelize, Sequelize.DataTypes);
const Config = require('./models/Config')(sequelize, Sequelize.DataTypes);
const TaskAssignment = require('./models/Task_Assignment')(sequelize, Sequelize.DataTypes);


// const test_created_at = Math.floor(+new Date() / 1000); //calculates date as integer
// Board.create({ name: 'test', start_date_time_stamp: '15', end_date_time_stamp: '', created_at_date_time_stamp: test_created_at, updated_at_date_time_stamp: test_created_at, created_by_user_id: '1', updated_by_user_id: '1'});



//users
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

async function findColumnByColumnOrderNumberAndBoardId(columnOrderNumber, boardId) { //function to find user
	const foundColumn = await Column.findOne({
		where: { column_order_number: columnOrderNumber, board_id: boardId }, });
	return foundColumn;
};

module.exports = { 
	addUser, 
	findUser, 
	addBoard, 
	findBoardByName, 
	findAllColumnStatus, 
	addColumn,
	findColumnByColumnOrderNumberAndBoardId,
	addColumnTrackRecord
}; //only export function calls
