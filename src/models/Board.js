module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Board', {
		board_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},

		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		start_date_time_stamp: {
			type: DataTypes.INTEGER,
		},

        end_date_time_stamp: {
			type: DataTypes.INTEGER,
		},

        created_at_date_time_stamp: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},

        updated_at_date_time_stamp: {
			type: DataTypes.INTEGER,
		},

        updated_by_user_id: {
			type: DataTypes.INTEGER,
		},

        created_by_user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};