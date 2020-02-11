// Importações
import { Router } from 'express'; // Importação do 'Express'.

const routes = new Router();

routes.get('/', (requisicao, resposta) =>
  resposta.json({ message: 'Follow White Rabb1t' })
);

export default routes;
