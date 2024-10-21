// import cluster from 'node:cluster';
// import { availableParallelism } from 'node:os';
// import 'dotenv/config';
// import { createServer } from 'node:http';
// import { endpointHandler } from './handlers/endpointHandler';
// import { User } from './types/user';
// import { UsersData } from './state/usersData';
// import { isMultiMode } from './helpers/argvParser';
// import { join } from 'path';
// import { Worker, parentPort } from 'node:worker_threads';


// export interface UserAction {
//     act: string;
//     data: User[] | [];
// }

// const users = UsersData.getInstance();

// const workers: any = [];
// const PORT = 8000;
// if(isMultiMode()) {
//     if (cluster.isPrimary) {
//         //TODO
  
    
//     } else {
    
//         //TODO
//     }
// }
