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

function addUser(username) {
	// Users.prototype.addUsers = async function(user) {
	// 	return user.create({ user_id: this.user_id});
	// };
	// console.log("success "+user);
	// try {
		//add user to db

		const created_at = Math.floor(+new Date() / 1000); 
		Users.create({ user_id: null, discord_username: username, created_at_date_stamp: created_at}).then(
			a => {
				console.log(a);
			}
		)
		.catch(error => {
			console.log(error);
		});
		// console.log(a);
		// return 1; //return the stored row id
	// } catch (error) {
		// return false;
	// }
	// return `Successfully added `;
};

module.exports = { Users, addUser }; //only export function calls
