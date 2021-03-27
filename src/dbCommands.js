const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './src/KanbanDB.db',
});

const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
const Boards = require('./models/Boards')(sequelize, Sequelize.DataTypes);
const Tasks = require('./models/Tasks')(sequelize, Sequelize.DataTypes);
const Column_Status = require('./models/Column_Status')(sequelize, Sequelize.DataTypes);
const Column_Track = require('./models/Column_Track')(sequelize, Sequelize.DataTypes);
const Columns = require('./models/Columns')(sequelize, Sequelize.DataTypes);
const Config = require('./models/Config')(sequelize, Sequelize.DataTypes);
const Task_Assignment = require('./models/Task_Assignment')(sequelize, Sequelize.DataTypes);

async function addUser(username) {
		const created_at = Math.floor(+new Date() / 1000); 
		await Users.create({ discord_username: username, created_at_date_stamp: created_at}).catch(error => {
			console.log(error);
		});
};

module.exports = { Users, addUser }; //only export function calls
