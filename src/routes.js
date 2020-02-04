const { Router } = require("express"); // Importação do 'Express'.

const routes = new Router();

routes.get("/", (requisicao, resposta) => {
    return resposta.json({ message: "Follow White Rabb1t" });
});

module.exports = routes;