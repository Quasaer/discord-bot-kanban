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
const Column_Status = require('./models/Column_Status')(sequelize, Sequelize.DataTypes);
const Column_Track = require('./models/Column_Track')(sequelize, Sequelize.DataTypes);
const Columns = require('./models/Column')(sequelize, Sequelize.DataTypes);
const Config = require('./models/Config')(sequelize, Sequelize.DataTypes);
const Task_Assignment = require('./models/Task_Assignment')(sequelize, Sequelize.DataTypes);


// const test_created_at = Math.floor(+new Date() / 1000); //calculates date as integer
// Board.create({ name: 'test', start_date_time_stamp: '15', end_date_time_stamp: '', created_at_date_time_stamp: test_created_at, updated_at_date_time_stamp: test_created_at, created_by_user_id: '1', updated_by_user_id: '1'});



//users
async function addUser(username) { //function to add user
	const created_at = Math.floor(+new Date() / 1000); //calculates date as integer
	await Users.create({ discord_username: username, created_at_date_stamp: created_at}).catch(error => { //adds to database
		console.log(error);
	});
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
	await Board.create({ 
		name: boardName, 
		start_date_time_stamp: startDateInput,
		end_date_time_stamp: deadlineDateInput, 
		created_at_date_time_stamp: created_at,
		created_by_user_id: userId, 
	}).catch(error => { //adds to database (not doing userid)
		console.log(error);
	});
};

async function findBoardByName(boardName) { //function to find user
	const foundBoardByName = await Board.findOne({
		where: { name: boardName }, });
	return foundBoardByName;
};

//column status

//column track

//column
async function addColumn(userModel, ColumnName, boardModel) { //function to add user
	// console.log(username);
	userId = userModel.user_id;
	// console.log(boardModel);
	boardID = boardModel.board_id;
	
	const created_at = Math.floor(+new Date() / 1000); //calculates date as integer
	await Board.create({ 
		name: ColumnName, 
		board_id: boardID,
		created_at_date_time_stamp: created_at,
		created_by_user_id: userId, 
	}).catch(error => { //adds to database (not doing userid)
		console.log(error);
	});
};

module.exports = { addUser, findUser, addBoard, findBoardByName, addColumn}; //only export function calls
