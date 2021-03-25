module.exports = (sequelize, DataTypes) => {​​​​​​​​
    returnsequelize.define("Columns", {​​​​​​​​
        id:DataTypes.INTEGER,
        primaryKey:true,

        name: {​​​​​​​​
            type:DataTypes.STRING,
            allowNull:false,
        }​​​​​​​​,

        task_limit: {​​​​​​​​
            type:DataTypes.INTEGER,
            allowNull:false,
        }​​​​​​​​,

        board_id: {​​​​​​​​
            type:DataTypes.INTEGER,
            allowNull:false,
        }​​​​​​​​,

        column_order_number: {​​​​​​​​
            type:DataTypes.INTEGER,
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

        updated_at_date_time_stamp: {​​​​​​​​
            type:DataTypes.INTEGER,
            timestamps:true,
            allowNull:false,
        }​​​​​​​​,

        updated_by_user_id: {​​​​​​​​
            type:DataTypes.INTEGER,
            allowNull:false,
        }​​​​​​​​,
    }​​​​​​​​);
}​​​​​​​​;

