export interface IWorker {
    start();
    stop();
}

export interface IConsumer {
    start(messageHandler: any);
    stop();
}
