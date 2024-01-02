import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import { DataTypes, Sequelize } from "sequelize";
import { configDotenv } from "dotenv";
import bcrypt from "bcrypt";
import { createErrorResponse, errorHandler, validateUserType } from "./middlewares";
import { StatusCodes } from 'http-status-codes';
import { LoginRequest, RegistrationRequest, UserData } from "./IUser";
import JWT from "jsonwebtoken"

configDotenv()
const app = express()

const PORT = 6666

app.use(bodyParser.json())


const sequelize = new Sequelize(process.env.DATABASE_NAME as string, process.env.SERVER_NAME as string, process.env.DATABASE_PASSWORD,
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

// Default endpoint 
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Successfully routed"
    })
})

// Register User
app.post("/", validateUserType, async (req: Request, res: Response) => {
    const { name, email, password, status }: RegistrationRequest = req.body
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const existingUser = await User.findOne({
            where: { email },
        })
        if (existingUser) {
            return createErrorResponse(res, StatusCodes.BAD_REQUEST, "User already exists", true)
        }
        const user = await User.create({
            name, email, password: hashedPassword, status
        })
        res.status(StatusCodes.CREATED).json({
            error: false,
            message: "User created successfully",
            user
        })
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
})

// User Login
app.post("/login", async (req: Request, res: Response) => {
    const { email, password }: LoginRequest = req.body

    const existingUser: UserData | null = await User.findOne({
        where: { email },
    }) as UserData | null
    if (!existingUser) {
        return createErrorResponse(res, StatusCodes.BAD_REQUEST, "User not found", true)
    }
    const checkPassword = await bcrypt.compare(password, existingUser.password)
    if (!checkPassword) {
        return createErrorResponse(res, StatusCodes.BAD_REQUEST, "Invalid Password", true)
    }
    const { email: userEmail, id } = existingUser
    const userToken = JWT.sign({ userEmail, id }, process.env.JWT_SECRET as string, {
        expiresIn: "2 days",
    })

    res.status(StatusCodes.OK).json({
        error: false,
        message: "User logged in",
        user: existingUser,
        token: userToken,
    })

})

app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})