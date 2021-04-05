module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Users', {
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
            autoIncrement: true,
		},

		discord_username: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		created_at_date_stamp: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};