const express = require('express')
const loggerMiddleware = require('./loggerMiddleware');

const port = 5000

// on créer l'application
const app = express()

app.use(loggerMiddleware)

// on définit la route principale (c'est la page : bcm/api/)
app.get('/', (req, res) => {
    res.json({message : "page d'acceuil de l'api de BetterCLanMate"})
})

const searchPlayerWithNoClan = require('./get.routes/searchPlayerWithNoClan')
app.use("/get/searchPlayerWithNoClan", searchPlayerWithNoClan)

app.listen(port, () => {console.log("le serveur est en ligne !")}) // on demare le serveur sur le port et on envoie un message dans les log