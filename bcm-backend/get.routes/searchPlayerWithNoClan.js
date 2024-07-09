const express = require("express")
const dotenv = require("dotenv")
const mysql = require("mysql2")
const axios = require("axios")

const router = express.Router() // on cherche l'url sur laquelle on est pour traitée les data

dotenv.config()

router.get("/:param", (req, res) => {

    // on verif que le tag du clan est valide
    clanTag = req.params.param;

    // on retire le #
    clanTag = clanTag.substring(1);

    axios.get(`https://api.clashofclans.com/v1/clans/%23${clanTag}`)
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.log(error);
    });



    
    const connection  = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USERr,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        });

    res.json({message : "page d'acceuil de l'api de pppp"})

})

module.exports = router; // on renvoie l'url