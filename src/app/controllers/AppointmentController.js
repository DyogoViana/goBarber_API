// AppointmentController.js

import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
    async store(request, response) {
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date(),
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
                error: 'you can only create appointment with providers',
            });
        }

        // Verifica se é uma data passada. Arredonda a hora, ex: 16:00:00
        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date())) {
            return response
                .status(400)
                .json({ error: 'Past dates are not permitted' });
        }

        // Verifica se a disponibilidade.
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            },
        });

        if (checkAvailability) {
            return response
                .status(400)
                .json({ error: 'Appointment date is not available' });
        }

        const appointment = await Appointment.create({
            user_id: request.userId,
            provider_id,
            date: hourStart,
        });

        return response.json(appointment);
    }
}

export default new AppointmentController();
