import express  from "express";
import bodyParser from 'body-parser';
import { DataTypes, Sequelize } from "sequelize";
import { configDotenv } from "dotenv";
configDotenv()
const app = express()

const PORT = 8666

app.use(bodyParser.json())

const sequelize = new Sequelize( process.env.DATABASE_NAME as string, process.env.SERVER_NAME as string, process.env.DATABASE_PASSWORD,
    {
        host: "localhost",
        dialect: "mysql"
    }
    )

    try {
        sequelize.authenticate()
        console.log("Connection to database established");
    } catch (error) {
        console.log("error creating connection to databse", error)
    }

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: { 
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
}, {  
    modelName: "User",
    timestamps: false,
})

//  Sync Model
try {
    User.sync();
    console.log("Table Created");
  } catch (error) {
    console.log("Error creating table");
  }
app.get("/", (req, res) => {
    res.status(200).json({
        message: "SUceesully routed"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})