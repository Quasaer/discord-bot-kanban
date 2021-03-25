module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Tasks", {
        id: DataTypes.INTEGER,
        primaryKey: true,

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
            timestamps: true,
            allowNull: false,
        },

        created_at_date_time_stamp: {
            type: DataTypes.INTEGER,
            timestamps: true,
            allowNull: false,
        },

        created_by_user_id: {
            type: DataTypes.INTEGER,
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
    });
  };