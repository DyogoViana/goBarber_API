import User from '../models/User';

class UserController {
    async store(requisicao, resposta) {
        const userExists = await User.findOne({
            where: { email: requisicao.body.email },
        });

        if (userExists) {
            return resposta.status(400).json({ error: 'User already exists.' });
        }

        const { id, name, email, provider } = await User.create(requisicao.body);

        return resposta.json({
            id,
            name,
            email,
            provider,
        });
    }
}

export default new UserController();
