module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Column_status', {
		column_status_id:{
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
		
	}, {
		timestamps: false,
	});
};