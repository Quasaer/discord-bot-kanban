const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './src/database.sqlite',
});
const sequelize1 = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './src/KanbanDB.db',
});

const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems')(sequelize, Sequelize.DataTypes);
const Users1 = require('./models/Users1')(sequelize1, Sequelize.DataTypes);
// const boards = require('./models/Boards')(sequelize1, Sequelize.DataTypes);
// const tasks = require('./models/Tasks')(sequelize1, Sequelize.DataTypes);
// const Column_Status = require('./models/Column_Status')(sequelize1, Sequelize.DataTypes);
// const Column_Track = require('./models/Column_Track')(sequelize1, Sequelize.DataTypes);
// const Columns = require('./models/Columns')(sequelize1, Sequelize.DataTypes);
// const config = require('./models/Config')(sequelize1, Sequelize.DataTypes);
// const Task_Assignment = require('./models/Task_Assignment')(sequelize1, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

/* eslint-disable-next-line func-names */
Users.prototype.addItem = async function(item) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item.id },
	});

	if (userItem) {
		userItem.amount += 1;
		return userItem.save();
	}

	return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
};

/* eslint-disable-next-line func-names */
Users.prototype.getItems = function() {
	return UserItems.findAll({
		where: { user_id: this.user_id },
		include: ['item'],
	});
};

module.exports = { Users, CurrencyShop, UserItems, Users1 };