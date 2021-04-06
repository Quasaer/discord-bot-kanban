module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Config', {
		config_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
            autoIncrement: true,
		},

		channel_bind_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        server_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        prefix: {
            type: DataTypes.STRING,
            allowNull: false,
        },
	}, {
		timestamps: false,
	});
};