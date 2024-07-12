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
    const plaverTag = '#'+req.params.param;

    

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
            
        console.log("Connecté en tant que : " + connection.threadId);

        connection.query("UPDATE joueursFR SET clanID = 'blacklist', noClanDuration = ?, lastChecked = CURRENT_TIMESTAMP WHERE id = ?", [null, plaverTag], (err, result) => {
            if(err){
                connection.end();
                console.log("Erreur de requête : " + err.stack)
                res.status(500).send("Erreur de requête : " + err.stack);
                return;
            }
            connection.end()
            res.status(200).json({message : `le joueur ${plaverTag} a bien été blacklisté`})
            return
            })
        });
})
    


module.exports = router; // on renvoie l'url