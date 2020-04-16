// Queue.js

import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancelletionMail';
import redisConfig from '../config/redis';

// Para cada job se cria uma fila -- Ex: CancellationMail.
const jobs = [CancellationMail];

class Queue {
    constructor() {
        this.queues = {}; // Armazena os jobs nessa var.

        this.init();
    }

    // Aramzena a fila que possua a conexão com o banco n relacional -- Redis.
    // Bee == Fila. Ex: CancellationMail.
    init() {
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),

                handle, // Processa o job. Recebe as infos e realiza a tarefa em segundo plano. Ex: envia o email.
            };
        });
    }

    // Adiciona novos itens dentro da fila.
    add(queue, job) {
        return this.queues[queue].bee.createJob(job).save();
    }

    // Processa as filas.
    processQueue() {
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key];

            bee.on('failed', this.handleFailure).process(handle);
        });
    }
\
    // Monitora falhas na fila e mostra onde tá o erro.
    handleFailure(job, error) {
        console.log(`Queue ${job.queue.name}: FAILED`, error);
    }
}

export default new Queue();
