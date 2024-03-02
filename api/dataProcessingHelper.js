function isValidDocument(doc){
    return doc && typeof(doc) === "object" && Object.keys(doc).length > 0
}

function errorHandler(res, err){
    console.error(err)
    return res.status(500).json({error: err.message})
}

function isIdValid(id){
    return !isNaN(id)
}

function idValidation(req, res, next){
    const id = parseInt(req.params.id)
    if(!isIdValid(id)){
        return res.status(400).json({message: "invalid id"})
    }
    req.myId = id

    next()
}

module.exports = {isValidDocument, errorHandler, idValidation}