module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Boards", {
        id: {
			type: DataTypes.INTEGAR,
			primaryKey: true, //ps says primary key true required
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
    });
};