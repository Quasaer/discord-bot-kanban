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

const Column_Status = require('./models/Column_Status')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const status = [
		Column_Status.upsert({ name: 'Active' }),
		Column_Status.upsert({ name: 'Done' })
	];
	await Promise.all(status);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);