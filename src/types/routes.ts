import { IncomingMessage, ServerResponse } from "node:http";
import { Methods } from "./methods";


type RequestHandler = (req: IncomingMessage, res: ServerResponse) => void;

export type Routes = {
  [path: string]: {
    [method in Methods]?: RequestHandler;
  };
};