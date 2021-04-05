module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Tasks", {
        task_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
            autoIncrement: true,
		},

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        column_track_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        task_assignment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        deadline_date_time_stamp: {
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
            allowNull: false,
        },

        updated_by_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
		timestamps: false,
	});
  };