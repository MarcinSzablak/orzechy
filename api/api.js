const express = require("express")
const nuts = require("../nuts/nuts")
const joi = require('joi');

const router = express.Router();

const nutSchema = joi.object({
    name: joi.string().required(),
    latina: joi.string().required(),
    origin_location: joi.string().required(),
    delete_password: joi.string().required(),
});

router.get("/nuts", (req,res)=>{
    res.json(nuts.list("sad")) ;
})

router.get("/nut/:id", (req,res)=>{
    res.json(nuts.get(req.params.id))
})

router.post("/nuts", (req,res)=>{
    const { error, value } = nutSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    res.json(nuts.add(value));
});

router.put("/nut/:id", (req, res) => {
    const { id } = req.params;

    const { error, value } = nutSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    res.json(nuts.put(id, value));
});

router.delete("/nut/:id/:password", (req,res)=>{
    res.json(nuts.delete(res,req.params.id, req.params.password));
})

module.exports = router ;
