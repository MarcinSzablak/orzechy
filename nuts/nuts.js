const fs = require("fs")
const path = require("path")

let nuts = require("./nutsDB")

function copy(obj){
    return JSON.parse(JSON.stringify(obj))
}

function findNutById(idNut){
    idNut = parseInt(idNut)
    return nuts.find( p => p.id === idNut)
}

function getNextId(){
    let lastNut = nuts[nuts.length - 1]
    return lastNut ? lastNut.id + 1 : 1;
}

function getNut(idNut){
    return copy(findNutById(idNut))
}

function listNuts(){
    return copy(nuts)
}

function addNut(nutData){
    //console.log("dane: ", nutData);
    nutData.id = getNextId() ;
    
    nuts.push(nutData) ;

    save();

    return getNut(nutData.id)

}

function save(){
    fs.writeFile(
        path.join(__dirname, "nutsDB.json" ),
        JSON.stringify(nuts, null, 4),
        (err) => {
            if(err){
                console.log("Błąd podczas zapisywania danych");
            } else {
                console.log("Plik został zapisany")
            }
        }
    );
}

function updateNut(idNut, updatedNutData) {
    console.log("1")
    idNut = parseInt(idNut);
    const nutToUpdate = nuts.find(nut => nut.id === idNut);

    if (!nutToUpdate) {
        return { error: "Nut not found" };
    }

    nutToUpdate.name = updatedNutData.name || nutToUpdate.name;
    nutToUpdate.latina = updatedNutData.latina || nutToUpdate.latina;
    nutToUpdate.origin_location = updatedNutData.origin_location || nutToUpdate.origin_location;
    nutToUpdate.delete_password = updatedNutData.delete_password || nutToUpdate.delete_password;

    save();
    return getNut(idNut);
}

function deleteNut(res,idNut, passwordNut){
    idNut = parseInt(idNut)
    toReturn = nuts.find(nut => nut.id === idNut)
    if(toReturn.delete_password != passwordNut){
        return res.status(400).json({ error: "Wrong Password" });
    }
    nuts = nuts.filter(nut => nut.id !== idNut)

    save()
    return(toReturn)
}

module.exports = {
    list: listNuts,
    get: getNut,
    add: addNut,
    delete: deleteNut,
    put: updateNut,
}

