import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (requisicao, resposta, next) => {
    const authHeader = requisicao.headers.authorization;

    if (!authHeader) {
        return resposta.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        requisicao.userId = decoded.id;

        return next();
    } catch (err) {
        return resposta.status(401).json({ error: 'Token invalid' });
    }
};
