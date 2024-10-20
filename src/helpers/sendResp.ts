import { ServerResponse } from "node:http";

const sendResp = (res: ServerResponse, statusCode: number, message?: object | string) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(message || {}));
};

export default sendResp;