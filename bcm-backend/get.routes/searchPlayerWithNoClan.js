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
    
    const connection  = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USERr,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    });
    
    const requiredTrophies = 3500
    const requiredTownhallLevel = 13

    connection.connect((err) => {
        if(err){
            console.log("Erreur de connexion : " + err.stack)
            res.send("Erreur de connexion : " + err.stack);
            return;
        }    
        // on part du principe que le joueur n'a pas rejoint de clan entre temps 
        // TODO : on init un var clanID en true et on entre dans une boucle tant que le joueur a rejoint un clan enter temps on recherche le joueurs suivant et on supprime le precedent
        connection.query("SELECT * FROM joueursFR WHERE clanID IS NULL AND hdv > ? AND tr > ? AND inviteTimestamp IS NULL AND attackWins > 0 ORDER BY noClanDuration DESC LIMIT 1;", [requiredTownhallLevel, requiredTrophies], (err, result) => {
            if(err){
                connection.end();
                console.log("Erreur de requête : " + err.stack)
                res.send("Erreur de requête : " + err.stack);
                return;
            }

            if (result.length == 0) {
                res.status(403).json({message : "aucun joueur ne correspond aux critères de votre clan"})
                connection.end();
                return
            }       

            connection.end();
            res.status(200).json(
                [
                    result[0], 
                    {
                        "requiredTrophies" : requiredTrophies, 
                        "requiredTownhallLevel" : requiredTownhallLevel
                    }
                ] 
            )
            return
        })
    });
})

module.exports = router; // on renvoie l'url