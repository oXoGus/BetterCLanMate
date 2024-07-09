const express = require("express")
const dotenv = require("dotenv")
const mysql = require("mysql2")
const axios = require("axios")

const router = express.Router() // on cherche l'url sur laquelle on est pour traitée les data

dotenv.config()

const apiHeader = {
    'authorization' : process.env.API_KEY
}

router.get("/:param", (req, res) => {

    // on verif que le tag du clan est valide
    let clanTag = req.params.param;

    axios.get(`https://api.clashofclans.com/v1/clans/%23${clanTag}`, {headers : apiHeader})
    .then((response) => {

        // si le clan existe bien 
        const clanData = response.data;

        const connection  = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USERr,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            });
    
        connection.connect((err) => {
            if(err){
                console.log("Erreur de connexion : " + err.stack)
                res.send("Erreur de connexion : " + err.stack);
                return;
            }

            connection.query("SELECT id FROM joueursFR WHERE clanID IS NULL AND hdv > ? AND tr > ? ORDER BY noClanDuration DESC LIMIT 1; ", [clanData["requiredTrophies"], clanData["requiredTownhallLevel"]], (err, result) => {
                if(err){
                    console.log("Erreur de requête : " + err.stack)
                    res.send("Erreur de requête : " + err.stack);
                    return;
                }
                res.json(result[0])
            })
        });


        

        res.json(clanData)
        return
    })
    .catch((error) => {

        // si le clan n'existe pas
        res.status(404).json({message : "le clan n'existe pas"})
        return
    });
    

})

module.exports = router; // on renvoie l'url