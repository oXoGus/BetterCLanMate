function loggerMiddleware(req, res, next) {
  // Récupérer l'adresse IP du client
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${clientIp}`);
  
  next(); // Con  appelé à la fonction next pour sortir du midleware et executer la requete voulue
}

// on exporte le middleware pour qu'il puisse etre appeler dans le index.js
module.exports = loggerMiddleware;
