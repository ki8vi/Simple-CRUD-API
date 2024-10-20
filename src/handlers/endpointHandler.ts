import { IncomingMessage, ServerResponse } from "node:http";
import { UsersData } from "../state/usersData";
import { CONSTANTS } from "../constants/constants";
import { Methods } from "../types/methods";
import sendResp from "../helpers/sendResp";
import { validate as idValidateUUID } from "uuid";

const users = UsersData.getInstance();

export const endpointHandler = async (req: IncomingMessage, res: ServerResponse) => {
    const { url, method } = req;
    const splitedUrl = url?.split('/');
    const userId = splitedUrl?.[splitedUrl?.indexOf(CONSTANTS.USERS_ENDPOINT) + 1]
    const cleanedUrl = url?.replace(/^\/+|\/+$/g, '');
    try{
        switch(method) {
            case Methods.GET:
                if (!userId && cleanedUrl === `${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`) {
                    const allUsersData = await users.getUsers();
                    sendResp(res, CONSTANTS.CODE_200, allUsersData);
                } else if (userId) {
                    if (!idValidateUUID(userId)) {
                        sendResp(res, CONSTANTS.CODE_400, 'Invalid user id!');
                        return;
                    }
                    const user = await users.getUserById(userId);
                    if (!user) {
                        sendResp(res, CONSTANTS.CODE_404, 'User does not exist!');
                    } else {
                        sendResp(res, CONSTANTS.CODE_200, user);
                    }
                } else {
                    sendResp(res, CONSTANTS.CODE_404, 'Endpoint does not exist');
                }
                break;
            case Methods.POST:
                if (cleanedUrl === `${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}`) {
                    let reqBody = '';
                    req.on('data', (ch) => {
                        reqBody += ch.toString();
                    });

                    req.on('end', async () => {
                        try {
                            const { username, age, hobbies } = JSON.parse(reqBody);
                            if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
                                sendResp(res, CONSTANTS.CODE_400,'Missing required fields');
                                return;
                            }
                            const newUser = await users.createUser(username, age, hobbies);
                            sendResp(res, CONSTANTS.CODE_201, newUser);
                        } catch {
                            sendResp(res, CONSTANTS.CODE_400, 'JSON invalid');
                        }
                    });
                } else {
                    sendResp(res, CONSTANTS.CODE_404, 'Endpoint does not exist');
                }
                break;
            case Methods.PUT:
                    if (userId && cleanedUrl === `${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}/${userId}`) {
                        if (!idValidateUUID(userId)) {
                            sendResp(res, CONSTANTS.CODE_400, 'Invalid user id!');
                            return;
                        }
    
                        let reqBody = '';
                        req.on('data', (ch) => {
                            reqBody += ch.toString();
                        });
    
                        req.on('end', async () => {
                            try {
                                const updatedData = JSON.parse(reqBody);
                                const updatedUser = await users.updateUser(userId, updatedData);
                                const { username, age, hobbies } = JSON.parse(reqBody);
                                if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
                                    sendResp(res, CONSTANTS.CODE_400, 'Missing required fields');
                                    return;
                                } else if (!updatedUser) {
                                    sendResp(res, CONSTANTS.CODE_404, 'User not found!');
                                } else {
                                    sendResp(res, CONSTANTS.CODE_200, updatedUser);
                                }
                            } catch {
                                sendResp(res, CONSTANTS.CODE_400, 'JSON invalid'); 
                            }
                        });
                    } else {
                        sendResp(res, CONSTANTS.CODE_404, 'Endpoint does not exist');
                    }
                    break;
    
            case Methods.DELETE:
                    if (userId && cleanedUrl === `${CONSTANTS.BASE_URL}/${CONSTANTS.USERS_ENDPOINT}/${userId}`) {
                        if (!idValidateUUID(userId)) {
                            sendResp(res, CONSTANTS.CODE_400, 'Invalid user id!');
                            return;
                        }
    
                        const isRemoved = await users.deleteUser(userId);
                        if (!isRemoved) {
                            sendResp(res, CONSTANTS.CODE_404, 'User not found!');
                        } else {
                            sendResp(res, CONSTANTS.CODE_204);
                        }
                    } else {
                        sendResp(res, CONSTANTS.CODE_404, 'Endpoint does not exist');
                    }
                    break;
            default:
                sendResp(res, CONSTANTS.CODE_404, 'Method not processed by server');
                break;
        }
    } catch {
        sendResp(res, CONSTANTS.CODE_500, 'Error by the server side!');
    }
} 
