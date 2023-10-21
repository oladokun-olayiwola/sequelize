import express from "express";
import bodyParser from "body-parser";
import  {appRoutes}  from "./routes";
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 5555
const app = express()


    
app.use(bodyParser.json())


app.use("/", appRoutes);

 
// Listen for server connections
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} sir`)})
