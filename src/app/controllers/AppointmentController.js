// AppointmentController.js

import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import CancelletionMail from '../jobs/CancelletionMail';
import Queue from '../../lib/Queue';

class AppointmentController {
    // List / Index
    async index(request, response) {
        const { page = 1 } = request.query;

        const appointment = await Appointment.findAll({
            where: { user_id: request.userId, canceled_at: null },
            order: ['date'],
            attributes: ['id', 'date'],
            limit: 20,
            offset: (page - 1) * 20,
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                },
            ],
        });

        return response.json(appointment);
    }

    // Store
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
            date,
        });

        // Notify appointment provider.
        const user = await User.findByPk(request.userId);
        const formattedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            { locale: pt }
        );

        await Notification.create({
            content: `New appointment from ${user.name} at ${formattedDate}`,
            user: provider_id,
        });

        return response.json(appointment);
    }

    // Delete.
    async delete(request, response) {
        const appointment = await Appointment.findByPk(request.params.id, {
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['name', 'email'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                },
            ],
        });

        if (appointment.user_id !== request.userId) {
            return response.status(401).json({
                error: "You don't have permission to cancel this appointment.",
            });
        }

        const dateWithSub = subHours(appointment.date, 2); // Subtrai duas horas.

        if (isBefore(dateWithSub, new Date())) {
            return response.status(401).json({
                error: 'You can only cancel appointment 2 hours in advance.',
            });
        }

        appointment.canceled_at = new Date();

        await appointment.save();

        await Queue.add(CancelletionMail.key, {
            appointment,
        });

        return response.json(appointment);
    }
}

export default new AppointmentController();
