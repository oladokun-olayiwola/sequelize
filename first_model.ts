import express from "express";
import {Sequelize, DataTypes} from "sequelize";
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 5555
const app = express()


// Connect ot the Database
const sequelize = new Sequelize( process.env.DATABASE_NAME as string, process.env.SERVER_NAME as string, process.env.DATABASE_PASSWORD,
    {
        host: "localhost",
        dialect: "mysql"
    }
    )
    
sequelize.sync();

// Authenticate Connection
sequelize.authenticate().then(() => {
    console.log('Connection has been established!')}
).catch((error) => {
    console.error('Unable to connect to the database:', error)}
)

// Create Model
const User = sequelize.define("first_test", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    rollNo: DataTypes.INTEGER,
    email: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('0', '1'),
        defaultValue: "1",
    },
    created_at: {
        type: DataTypes.DATE(),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },
    updated_at: {
        type: DataTypes.DATE(),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },
}, {  
    modelName: "User",
    timestamps: false,
})

// Sync model

sequelize.sync()

// Default page route
app.get("/", (_, res) => {
    res.send("Youkoso");
})

// Listen for server connections
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} sir`)})
