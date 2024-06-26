const express = require('express')

const port = 5000

// on créer l'application
const app = express()

// on définit la route principale (c'est la page : bcm/api/)
app.get('/', (req, res) => {
    res.json({message : "page d'acceuil de l'api de BetterCLanMate"})
})

const playerWithNoClan = require('./get.routes/playerWithNoClan')
app.use("/get/playerWithNoClan", playerWithNoClan)