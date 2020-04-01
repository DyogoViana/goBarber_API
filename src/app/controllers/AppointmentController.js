// AappointmentController.js

import * as Yup from 'yup';
import User from '../models/User';
import Appointment from '../models/Appointment';

class AappointmentController {
    async store(request, response) {
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(request.body))) {
            return response.status(400).json({ error: 'Validation fails' });
        }

        const { provider_id, date } = request.body;

        // Check if provider_id is a provider.
        const checkIsProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });

        if (!checkIsProvider) {
            return response.status(401).json({
                error: 'you can only create appointment with prooviders',
            });
        }

        const appointment = await Appointment.create({
            user_id: request.userId,
            provider_id,
            date,
        });

        return response.json(appointment);
    }
}

export default new AappointmentController();
