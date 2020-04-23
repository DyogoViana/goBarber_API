// Configurações da parte de autenticação da aplicação.

export default {
    secret: process.env.APP_SECRET,
    expiresIn: '7d',
};
