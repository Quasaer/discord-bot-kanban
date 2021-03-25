module.exports = (sequelize, DataTypes) => {​​​​​​​​
    returnsequelize.define("Column_status", {​​​​​​​​
        id:DataTypes.INTEGER,
        primaryKey:true,

        name: {​​​​​​​​
            type:DataTypes.STRING,
            allowNull:false,
        }​​​​​​​​,

        created_at_date_time_stamp: {​​​​​​​​
            type:DataTypes.INTEGER,
            timestamps:true,
            allowNull:false,
        }​​​​​​​​,

        created_by_user_id: {​​​​​​​​
            type:DataTypes.INTEGER,
            allowNull:false,
        }​​​​​​​​,
    }​​​​​​​​);
}​​​​​​​​;


