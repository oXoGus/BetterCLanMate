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
            
            console.log("Connecté en tant que : " + connection.threadId);
            
            // on part du principe que le joueur n'a pas rejoint de clan entre temps 
            // TODO : on init un var clanID en true et on entre dans une boucle tant que le joueur a rejoint un clan enter temps on recherche le joueurs suivant et on supprime le precedent
            connection.query("SELECT id, noClanDuration FROM joueursFR WHERE clanID IS NULL AND hdv > ? AND tr > ? AND inviteTimestamp IS NULL ORDER BY noClanDuration DESC LIMIT 1; ", [clanData["requiredTownhallLevel"], clanData["requiredTrophies"]], (err, result) => {
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

                var playerID = result[0].id.slice(1)
                // on recup toutes les data du joueur en back pour cacher le header de l'api de coc
                axios.get(`https://api.clashofclans.com/v1/players/%23${playerID}`, {headers : apiHeader})
                .then((response) => {
                    connection.end();
                    res.status(200).json([response.data, result[0]])
                    return
                })
                .catch((error) => {
                    connection.end();
                    res.status(500).json({message : "la requête a echoué", error : error})
                    return
                })

            })
        });
    })
    .catch((error) => {
        console.log(error)
        // si le clan n'existe pas
        res.status(422).json({message : "le clan n'existe pas"})
        return
    });
    

})

module.exports = router; // on renvoie l'url