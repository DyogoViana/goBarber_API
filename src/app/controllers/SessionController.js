import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
    async store(requisicao, resposta) {
        const schema = Yup.object().shape({
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(requisicao.body))) {
            return resposta.status(400).json({ error: 'Validation fails.' });
        }

        const { email, password } = requisicao.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return resposta.status(401).json({ error: 'User not founnd' });
        }

        if (!(await user.checkPassword(password))) {
            return resposta
                .status(401)
                .json({ error: 'Password does not match.' });
        }

        const { id, name } = user;

        return resposta.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
