import { DataTypes, Model, Sequelize } from "sequelize";
import { Router } from "express";
import dotenv from "dotenv"
import { Where } from "sequelize/types/utils";

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
try {
    sequelize.sync()
    console.log("Table Created");
} catch (error) {
    console.log("Error creating table");
    
}

// Default page route
router.get("/", (_, res) => {
    res.send("Youkoso");
});

// Find all Users
router.get('/users', async (req, res) => {
    return  await User.findAll().then(
        users => {res.status(200).json({error: "false",message: "Results fetched",data: users});}
    ).catch(error => {res.status(400).json({error: "true",message: "User not found",}); console.log(error);
    });

})

// Find User by specified fields
router.get('/user', async (req, res) => {
    return  await User.findAll({
        where: {
            status: "0"
        }
}).then(
        users => {res.status(200).json({error: "false",message: "Results fetched",data: users});}
    ).catch(error => {res.status(400).json({error: "true",message: "User not found",}); console.log(error);
    });

})

// Create a User
router.post("/user", async (req,res) => {
    try{
        const user = await User.create(req.body)
        res.status(200).send({error: "false", result: user, message: "User created Successfully"});
    }
    catch(err){
        res.status(500).send({error: true, result: err, message: "Couldn't create user"})
    }
})

// Create Multiple Users
router.post("/bulk-user", async (req, res) => {
    try {
        const user = await User.bulkCreate(req.body)
        res.status(200).send({error: false, result: user, message: "User created successully"})
    } catch (error) {
        res.status(500).send({error: true, result: error, message: "Couldn't create user"})
    }
})

// Find user by ID
router.put("/user", (req, res) => {
    try {
       const user = User.update({
        name: req.body.name,
        email: req.body.email,
        }, {where: {
        id: req.body.id
        }})
        res.status(200).json({error: "false", message: "User updated Successfully", result: user})
    }
    catch(error) {
        res.status(400).json({error: "true", message: "Failed to create user", result: error})
    }
})

export const appRoutes = router