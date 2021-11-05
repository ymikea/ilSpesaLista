const express = require("express")
const app = express()
const mongoose = require("mongoose")

const userRoutes = require('./routes/userRoutes')


app.use(express.json());
app.use(express.urlencoded({ extended: true }))


// const url = "mongodb://127.0.0.1:27017/ilSpesaLista"
const url = "mongodb+srv://ymikea:MongoPassYeku@cluster0.nydx1.mongodb.net/ilSpesaLista?retryWrites=true&w=majority"
mongoose.connect(url)
let db = mongoose.connection
db.on("error", (err)=>{console.log(err)})
db.once("open",()=>{console.log("Database started!")})


app.use(userRoutes)
app.get("/api",(req, res)=>{
    res.send("Api IS UP")
})

app.listen(3000, ()=>{
    console.log("Server Started at port 3000 ...")
})