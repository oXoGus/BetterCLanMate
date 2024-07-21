const express = require('express')
const loggerMiddleware = require('./loggerMiddleware');

const port = 5000

// on créer l'application
const app = express()

//  le middleware pour traiter les données JSON
app.use(express.json());

//  le middleware pour traiter les données URL-encodées
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware)

// on définit la route principale (c'est la page : bcm/api/)
app.get('/', (req, res) => {
    res.json({message : "page d'acceuil de l'api de BetterCLanMate"})
})

const searchPlayerWithNoClan = require('./get.routes/searchPlayerWithNoClan')
app.use("/get/searchPlayerWithNoClan", searchPlayerWithNoClan)

const deletePlayerWithNoClan = require('./put.routes/blackListPlayerWithNoClan')
app.use("/put/blackListPlayerWithNoClan", deletePlayerWithNoClan)

const markPlayerChecked = require('./put.routes/markPlayerChecked')
app.use("/put/markPlayerChecked", markPlayerChecked)

app.listen(port, () => {console.log("le serveur est en ligne !")}) // on demare le serveur sur le port et on envoie un message dans les log