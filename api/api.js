const mongoose = require("mongoose")
const express = require("express") ;
const router = express.Router();
const {isValidDocument, errorHandler, idValidation} = require("./dataProcessingHelper")

const dataBase = "Orzechy"
const url = `mongodb://localhost:27017/${dataBase}`

router.use(`/${dataBase}/:id`, idValidation)

mongoose.connect(url)

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", ()=>{console.log("connected to mongoDb")})

//definicja schematu
const schema = new mongoose.Schema({
    id:{type: Number, required: true},
    name: {type: String, required: true},
    latina: {type: String, required: false},
    origin_location: {type: String, required: true},
    delete_password: {type: String, required: false}
})

//tworzenie Modelu
const Model = mongoose.model("Orzech", schema, "Nuts")

router.get("/", (req,res)=>{
    res.send("connected to application")
})

router.get(`/${dataBase}`, async (req,res)=>{
    try{
        const allObjects = await Model.find({})

        res.send(allObjects)
    }catch(err){
        errorHandler(res, err)
    }
})

router.get(`/${dataBase}/:id`, async (req,res)=>{
    try{
        const object = await Model.findOne({id: req.myId})

        if(!object){
            return res.status(404).json({message: "Document not found"})
        }

        res.send(object)

    }catch(err){
        errorHandler(res, err)
    }
})
router.post(`/${dataBase}`, async (req, res)=>{
    try{
        const newDocument = req.body
        const result = new Model(newDocument)
        await result.save()

        return res.status(500).json({message:"Document added successfully"})
   } catch(err){
        errorHandler(res, err)
    }
})

router.delete(`/${dataBase}/:id/:password?`, async (req,res)=>{
    try{
        const object = await Model.findOne({id: req.myId})

        if(req.params.password == undefined){
            var password = ""
        }
        else{
            var password = req.params.password
        }

        if(object.delete_password == password){

            const objectToDelete = await Model.deleteOne({id: req.myId})

            if(objectToDelete.deletedCount === 0){
                return res.status(404).json({message: "Doc not found"})
            }
        }
        else{
            return res.status(400).json({message: "Not correct password"})
        }

        res.json({message: "deleted"})
    }
    catch(err){
        errorHandler(res, err)
    }
})

router.put(`/${dataBase}/:id`, async (req,res)=>{
    try{
        const object = req.body
        if(!isValidDocument(object)){
            return res.status(400).json({message: "Invalid document format"})
        }

        const result = await Model.findOneAndReplace({id: req.myId}, object, {new: true})

        if(result.matchedCount === 0){
            return res.status(404).json({message: "Doc not found"})
        }

        if(result.modifiedCount === 0){
            return res.status(400).json({message: "Can't modificate"})
        }

        res.json({message:"new object"})

    }catch(err){
        errorHandler(res,err)
    }
})
router.patch(`/${dataBase}/:id`, async (req,res)=>{
    try{
        const object = req.body
        if(!isValidDocument(object)){
            return res.status(400).json({message: "Invalid document format"})
        }

        const result = await Model.updateOne({id: req.myId}, {$set:object})

        if(result.matchedCount === 0){
            return res.status(404).json({message: "Doc not found"})
        }

        if(result.modifiedCount === 0){
            return res.status(400).json({message: "Can't modificate"})
        }

        res.json({message:"new object"})

    }catch(err){
        errorHandler(res,err)
    }
})

module.exports = router;