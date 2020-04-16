// Importações
import { Router } from 'express'; // Importação do 'Express'.

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// Post
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/appointments', AppointmentController.store);
routes.post('/files', upload.single('file'), FileController.store);

// Use
routes.use(authMiddleware);

// Put
routes.put('/users', UserController.update);
routes.put('/notifications/:id', NotificationController.update);

// Get
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);
routes.get('/appointments', AppointmentController.index);
routes.get('/schedule', ScheduleController.index);
routes.get('/notifications', NotificationController.index);

// Delete
routes.delete('/appointments/:id', AppointmentController.delete);

export default routes;
