module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Column", {
        column_id:  {
			type: DataTypes.INTEGER,
			primaryKey: true,
            autoIncrement: true,
		},

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        task_limit: {
            type: DataTypes.INTEGER,
        },

        board_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        column_order_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        created_at_date_time_stamp: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        created_by_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        updated_at_date_time_stamp: {
            type: DataTypes.INTEGER,
        },

        updated_by_user_id: {
            type: DataTypes.INTEGER,
        },
    }, {
		timestamps: false,
	});
  };