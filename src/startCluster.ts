import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import 'dotenv/config';
import { createServer } from 'node:http';
import { endpointHandler } from './handlers/endpointHandler';
import { User } from './types/user';
import { UsersData } from './state/usersData';
import { isMultiMode } from './helpers/argvParser';
import { join } from 'path';
import { Worker, parentPort } from 'node:worker_threads';


export interface UserAction {
    act: string;
    data: User[] | [];
}

const users = UsersData.getInstance();

export const syncUsersWithWorkers = async () => {
    const allUsersData = await users.getUsers();
    for (const id in cluster.workers) {
        if (cluster.workers[id]) {
            console.log('masg from syncFn:',allUsersData)
            cluster.workers[id].send({ act: 'syncUsers', data: allUsersData });
        }
    }
};
const workers: any = [];
const PORT = 8000;
if(isMultiMode()) {
    if (cluster.isPrimary) {
       
        const msgToWorkers = () => {
            for (let i in workers) {
                const worker = workers[i];
                worker.send({ cmd: 'broadcast', numReqs: 'hello' });
              }
        }
        for (let i = 1; i < availableParallelism(); i += 1) {
            const worker = cluster.fork();
            worker.on('message', (msg) => {
                if(msg.cmd === 'broadcast') msgToWorkers()
            })
            workers.push(worker);
        }
    
        cluster.on('exit', () => {
                cluster.fork();
        });
    
        console.log(`Main process started at PORT: ${PORT}`);
    
    } else {
        if(cluster.worker) {
            const port = Number(PORT) + cluster.worker.id;
            const usersInWorker: User[] = [];
        
            process.on('message', (message: UserAction) => {
                console.log('from workers:', message)
                if (message.act === 'syncUsers') {
                    const updatedUsers = message.data;
                    usersInWorker.length = 0;
                    usersInWorker.push(...updatedUsers);
                    console.log(`Worker ${process.pid} updated users:`, usersInWorker);
                }
            });

            createServer(endpointHandler).listen(port, () => {
                console.log(`Worker ${process.pid} listening on port ${port}`);
            });
        

        }
    }
}
