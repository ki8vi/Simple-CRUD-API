import request from 'supertest';
import { Server } from 'node:http';
import { User } from '../types/user';
import { CONSTANTS } from '../constants/constants';
import start from '../startServer';

describe('User behavior one, testing server for crud', () => {
    const newUserTest: Omit<User, 'id'> = { 
        username: 'Billy', 
        age: 56, 
        hobbies: ['coding', 'rap', 'sci-fi'] 
    };
    let myServer: Server;
    let userId: string = '';

    beforeAll((done) => {
        myServer = start(Number(3000));
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
    test('Array of users should be empty after first GET request for all users', async () => {
        const resp = await request(myServer).get(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`);
        expect(resp.status).toBe(CONSTANTS.CODE_200);
        expect(resp.body).toHaveLength(0);
        expect(resp.body).toEqual([]);
    });

    test('Array of users should contains new user object after POST request', async () => {
        const resp = await request(myServer).post(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`).send(newUserTest);
        userId = resp.body.id;
        expect(resp.status).toBe(CONSTANTS.CODE_201);
        expect(resp.body.username).toBe(newUserTest.username);
        expect(resp.body.age).toBe(newUserTest.age);
        expect(resp.body.hobbies).toEqual(newUserTest.hobbies);
    });

    test('Server must return a specific user by id after GET request', async () => {
        const resp = await request(myServer).get(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}/${userId}`);
        expect(resp.status).toBe(CONSTANTS.CODE_200);
        expect(resp.body.username).toBe(newUserTest.username);
        expect(resp.body.age).toBe(newUserTest.age);
        expect(resp.body.hobbies).toEqual(newUserTest.hobbies);
        expect(resp.body.id).toBe(userId);
    });

    test('User object with specific id should updated after PUT request', async () => {
        const updatedUserTest = {
            username: 'Fillipo',
            age: 25,
            hobbies: ['music', 'gym', 'girls', 'moon']
        }
        const resp = await request(myServer).put(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}/${userId}`).send(updatedUserTest);
        expect(resp.body.id).toBe(userId);
        expect(resp.status).toBe(CONSTANTS.CODE_200);
        expect(resp.body.username).toBe(updatedUserTest.username);
        expect(resp.body.age).toBe(updatedUserTest.age);
        expect(resp.body.hobbies).toEqual(updatedUserTest.hobbies);
    });

    test('Created user should be deleted after DELETE request', async () => {
        const resp = await request(myServer).delete(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}/${userId}`);
        expect(resp.status).toBe(CONSTANTS.CODE_204);
    });

    test('Deleted user should not be returned after GET request by id', async () => {
        const resp = await request(myServer).get(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}/${userId}`);
        expect(resp.body).toBe('User does not exist!');
        expect(resp.statusCode).toBe(CONSTANTS.CODE_404);
    });
});
