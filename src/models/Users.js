// module.exports = (sequelize, DataTypes) => {
// 	return sequelize.define("User", {
// 		id: DataTypes.INTEGER,

// 		discord_username: {
// 		type: DataTypes.STRING,
// 		allowNull: false,
// 		},

// 		created_at_date_stamp: {
// 		type: DataTypes.INTEGER,
// 		timestamps: true,
// 		allowNull: false,
// 		},
// 	});
// };

module.exports = (sequelize, DataTypes) => {
	return sequelize.define("Users", {
		id: {
			type: DataTypes.INTEGAR,
			primaryKey: true, //ps says primary key true required
		},

		discord_username: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		created_at_date_stamp: {
			type: DataTypes.INTEGER,
			timestamps: true,
			allowNull: false,
		},
	});
};