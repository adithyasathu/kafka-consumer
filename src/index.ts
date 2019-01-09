import * as config from "config";
import { Worker } from "./worker";
import {IWorker} from "./interfaces";
import {Consumer} from "./consumer";
import * as Logger from "simple-node-logger";
const kafkaConfig: any = config.get("worker.kafka");
export const log = Logger.createSimpleLogger();

export function bootstrap()  {
    let worker: IWorker = null;
    try {
        worker = new Worker(new Consumer(kafkaConfig));
        worker.start();
    } catch (e) {
        log.error(e);
        worker.stop();
    }
}
