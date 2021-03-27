module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Task_assignment', {
		task_assignment_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},

		task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    created_at_date_time_stamp: {
      type: DataTypes.INTEGER,
      timestamps: true,
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