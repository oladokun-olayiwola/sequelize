import { DataTypes, Model, Sequelize } from "sequelize";
import { Router } from "express";
import dotenv from "dotenv"

dotenv.config()


// Connect to the Database
const sequelize = new Sequelize( process.env.DATABASE_NAME as string, process.env.SERVER_NAME as string, process.env.DATABASE_PASSWORD,
    {
        host: "localhost",
        dialect: "mysql"
    }
    )
const router = Router()


sequelize.sync();


// Authenticate Connection
sequelize.authenticate().then(() => {
    console.log('Connection has been established!')}
).catch((error) => {
    console.error('Unable to connect to the database:', error)}
)

// Create Model
class User extends Model {};
User.init({
   id: {
       type: DataTypes.INTEGER,
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
   },
   name: {
       type: DataTypes.STRING,
       allowNull: false,
   },
   email: {
       type: DataTypes.STRING,
       unique: true,
       allowNull: false, 
   },
   status: {
       type: DataTypes.ENUM("0", "1"),
       defaultValue: "1"
   },
   rollNo: {
       type: DataTypes.STRING,
   }
}, {modelName: 'secondTest', timestamps: true,sequelize})


//  Sync Model 
sequelize.sync()

// Default page route
router.get("/", (_, res) => {
    res.send("Youkoso");
});

router.post("/user", async (req,res) => {
    try{
        const user = await User.create(req.body)
        res.status(200).send({error: "false", result: user, message: "User created Successfully"});
    }
    catch(err){
        res.status(500).send({error: true, result: err, message: "Couldn't create user"})
    }
})

router.post("/bulk-user", async (req, res) => {
    try {
        const user = await User.bulkCreate(req.body)
        res.status(200).send({error: false, result: user, message: "User created successully"})
    } catch (error) {
        res.status(500).send({error: true, result: error, message: "Couldn't create user"})
    }
})

export const appRoutes = router