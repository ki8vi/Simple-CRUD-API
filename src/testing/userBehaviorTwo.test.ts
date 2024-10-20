import request from 'supertest';
import start from '../startServer';
import { Server } from 'node:http';
import { User } from '../types/user';
import { CONSTANTS } from '../constants/constants';
import { UsersData } from '../state/usersData';

const usersData = UsersData.getInstance();

describe('User behavior two, testing server for errors', () => {
    const newUserTest: Omit<User, 'id'> = { 
        username: 'Billy', 
        age: 56, 
        hobbies: ['coding', 'rap', 'sci-fi'] 
    };
    let myServer: Server;
    let userId: string = '';

    beforeAll(async () => {
        myServer = start(Number(2000));
        const resp = await request(myServer).post(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`).send(newUserTest);
        userId = resp.body.id;
    });

    afterAll((done) => {
        if (myServer) {
            myServer.close(() => {
                done();
            });
        } else {
            done();
        }
        jest.clearAllMocks();
        usersData.resetUsers();
    });

    test('Should return error and statuscode 400 if entered invalid UUID id after GET request user by id', async () => {
        const invalidUserUUID = userId.concat('*')
        const resp = await request(myServer).get(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}/${invalidUserUUID}`);
        expect(resp.status).toBe(CONSTANTS.CODE_400);
        expect(resp.body).toBe('Invalid user id!');
    });

    test('Should return error and statuscode 404 if user do not exist after GET request user by id', async () => {
        const invalidUserId = userId.slice(0, -5).concat('ab0a0');
        const resp = await request(myServer).get(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}/${invalidUserId}`);
        userId = resp.body.id;
        expect(resp.status).toBe(CONSTANTS.CODE_404);
        expect(resp.body).toBe('User does not exist!');
    });

    test('Should return error and statuscode 404 in case invalid endpoint', async () => {
        const INVALID_ENDPOINT = 'invalid';
        const resp = await request(myServer).get(`/${CONSTANTS.BASE_URL}/${INVALID_ENDPOINT}`);
        expect(resp.status).toBe(CONSTANTS.CODE_404);
        expect(resp.body).toBe('Endpoint does not exist');
    });

    test('Should return error and statuscode 404 in case not processed method', async () => {
        const resp = await request(myServer).patch(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`);
        expect(resp.body).toBe('Method not processed by server');
        expect(resp.status).toBe(CONSTANTS.CODE_404);
    });

    test('Should return error and statuscode 400 in case missing required fields after POST request', async () => {
        const missingFieldsUserObject = { username: 'I am miss fields' };
        const resp = await request(myServer).post(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`).send(missingFieldsUserObject);
        expect(resp.status).toBe(CONSTANTS.CODE_400);
        expect(resp.body).toBe('Missing required fields');
    });

    test('Should return error and status code 500 in case server error', async () => {
        const originalGetMethod = usersData.getUsers;
        usersData.getUsers = jest.fn().mockImplementation(() => {
            return Promise.reject(new Error('Crash'));
        });
        const resp = await request(myServer).get(`/${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`);
        expect(resp.status).toBe(CONSTANTS.CODE_500);
        expect(resp.body).toBe('Error by the server side!');
        usersData.getUsers = originalGetMethod;
        usersData.resetUsers();
    });
});
