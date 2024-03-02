const express = require("express") ;
const mongoose = require("mongoose")

const app = express() ;
app.use(express.json()) ;

const PORT = 8080

const api = require("./api") ;

app.use("/api", api)

app.listen(PORT, ()=>console.log("Server is running on 8080, localhost:8080/"))

process.on('SIGINT', ()=>{
    console.log("zamykanie połączenia z mongo")
    db.close(()=>process.exit)
})