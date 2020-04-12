// NotificationController.js

import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
    async index(request, response) {
        const checkIsProvider = await User.findOne({
            where: { id: request.userId, provider: true },
        });

        if (!checkIsProvider) {
            return response
                .status(401)
                .json({ error: 'Only provider can load notifications.' });
        }

        const notifications = await Notification.find({ user: request.userId })
            .sort({ createAt: 'desc' }) // Lista numa ordem decrescente.
            .limit(20);

        return response.json(notifications);
    }
}

export default new NotificationController();
