module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Column_track", {
        id: DataTypes.INTEGER,
        primaryKey: true,

        column_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        column_status_id: {
            type: DataTypes.INTEGER,
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
    });
};