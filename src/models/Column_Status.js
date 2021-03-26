// module.exports = (sequelize, DataTypes) => {​​​​​​​​
//     return sequelize.define("Column_status", {​​​​​​​​
//         column_status_id:DataTypes.INTEGER,
//         primaryKey:true,

//         name: {​​​​​​​​
//             type:DataTypes.STRING,
//             allowNull:false,
//         }​​​​​​​​,

//         created_at_date_time_stamp: {​​​​​​​​
//             type:DataTypes.INTEGER,
//             timestamps:true,
//             allowNull:false,
//         }​​​​​​​​,

//         created_by_user_id: {​​​​​​​​
//             type:DataTypes.INTEGER,
//             allowNull:false,
//         }​​​​​​​​,
//     }​​​​​​​​);
// }​​​​​​​​;


module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Column_status', {
		column_status_id:DataTypes.INTEGER,
		primaryKey: true,

        name: {
            type: DataTypes.STRING,
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