module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Users', {
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},

		discord_username: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		created_at_date_stamp: {
			type: DataTypes.INTEGER,
			timestamps: true,
			// createdAt: 'created_at_date_time_stamp',
			allowNull: false,
		},
		// createdAt: {
		// 	type: DataTypes.REAL,
		// 	allowNull: false,
		// },
		// updateAt: {
		// 	type: DataTypes.REAL,
		// 	allowNull: false,
		// },
	}, {
		timestamps: false,
	});
};