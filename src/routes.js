// Importações
import { Router } from 'express'; // Importação do 'Express'.
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (requisicao, resposta) => {
    const user = await User.create({
        name: 'White Rabb1t',
        email: 'follow.white.rabb1t@gmail.com',
        password_hash: 'freedom',
    });

    return resposta.json(user);
});

export default routes;
