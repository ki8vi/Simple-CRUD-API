import request from 'supertest';
import { Server } from 'node:http';
import { User } from '../types/user';
import { CONSTANTS } from '../constants/constants';
import start from '../startServer';

describe('User behavior three, unexpected user requests amount', () => {
    let myServer: Server;

    const fakeUsersToCreate: Omit<User, 'id'>[] = [
        { username: 'AliBaba', age: 25, hobbies: [] },
        { username: 'Gaga', age: 30, hobbies: ['eating', 'sleeping', 'tualeting'] },
        { username: 'Jack', age: 20, hobbies: ['painting'] },
        { username: 'Ho', age: 25, hobbies: ['reading'] },
        { username: 'Wenkys', age: 30, hobbies: ['writing'] },
        { username: 'BabaAli', age: 20, hobbies: ['living'] },
    ];

    beforeAll((done) => {
        myServer = start(Number(1000));
        done();
    });

    afterAll((done) => {
        if (myServer) {
            myServer.close(() => {
                done();
            });
        } else {
            done();
        }
    });
   
    test('Should correctly process if change hobbies array size', async () => {
        const newInsaneUser = fakeUsersToCreate[0]
        const newUserWithHobbies = { ...newInsaneUser, hobbies: ['cars', 'mars', 'bars', 'shmars', 'fars'] };
        const resp = await request(myServer).post(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`).send(newInsaneUser);
        const resp2 = await request(myServer).put(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}/${resp.body.id}`).send(newUserWithHobbies);
        expect(resp.status).toBe(CONSTANTS.CODE_201);
        expect(resp2.status).toBe(CONSTANTS.CODE_200);
        expect(resp2.body.hobbies).toHaveLength(5);
    });

    test('Should correctly process of deleting a lot of users', async () => {
        fakeUsersToCreate.forEach(async (fakeUser) => {
            const resp = await request(myServer).post(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`).send(fakeUser);
            expect(resp.status).toBe(CONSTANTS.CODE_201);
        })
        const allResps = await request(myServer).get(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`);
        allResps.body.forEach(async (fakeUser: User) => {
            const deleteResp = await request(myServer).delete(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}/${fakeUser.id}`);
            expect(deleteResp.status).toBe(CONSTANTS.CODE_204);
        });   
        const getAllRespAfterDelete = await request(myServer).get(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`);
        expect(getAllRespAfterDelete.status).toBe(CONSTANTS.CODE_200);
        expect(getAllRespAfterDelete.body).toHaveLength(0);
    });

    test('Should correctly process a lot of simultaneous requests by user', async () => {   
        const createPromises = fakeUsersToCreate.map((user) => 
            request(myServer).post(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`).send(user)
        );
        const responses = await Promise.all(createPromises);
        responses.forEach((resp) => {
            expect(resp.status).toBe(CONSTANTS.CODE_201);
        });
        const allResps = await request(myServer).get(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`);
        expect(allResps.status).toBe(CONSTANTS.CODE_200);
        expect(allResps.body).toHaveLength(fakeUsersToCreate.length);
    });

    test('Should correctly handle invalid JSON format', async () => {
        const invalidJsonFormat = "{ 'username': 'I am invalid Jason', 'age': 23, 'hobbies': ['serializing']";
        const resp = await request(myServer).post(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`).send(invalidJsonFormat);
        expect(resp.status).toBe(CONSTANTS.CODE_400);
        expect(resp.body).toBe('JSON invalid');
    });
});
