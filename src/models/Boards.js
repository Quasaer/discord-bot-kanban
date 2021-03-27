module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Board', {
		board_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        start_date_time_stamp: {
            type: DataTypes.INTEGER,
            timestamps: true,
            allowNull: false,
        },

        end_date_time_stamp: {
            type: DataTypes.INTEGER,
            timestamps: true,
            allowNull: false,
        },

        created_at_date_time_stamp: {
            type: DataTypes.INTEGER,
            timestamps: true,
            // createdAt: 'created_at_date_time_stamp',
            allowNull: false,
        },

        updated_at_date_time_stamp: {
            type: DataTypes.INTEGER,
            timestamps: true,
            allowNull: false,
        },

        updated_by_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        created_by_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
	}, {
		timestamps: false,
	});
};