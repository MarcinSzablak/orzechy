const express = require("express") ;
const app = express() ;
const nuts = require("./nuts/nuts") ;
const api = require("./api") ;

app.use(express.json()) ;
app.use("/api", api)

app.get("/", (req,res)=>{
    res.send("ok");
})

app.listen(8080, ()=>console.log("Server is running on the port 8080")) ;
