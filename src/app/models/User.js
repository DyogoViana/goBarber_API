import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL, // Não existe na base de dados, apenas no código.
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );

        // Salva antes de ir pro banco de dados.
        this.addHook('beforeSave', async user => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8); // Número referente a complexidade da senha.
            }
        });

        return this;
    }

    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    }

    // Valida a senha.
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
