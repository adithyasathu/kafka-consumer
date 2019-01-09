import { log } from "./index";
import { IConsumer, IWorker } from "./interfaces";

// defining callback function for consumer message handling gives us more control on data and error handling
export const messageHandler = (err , data) => {
    if (err) {
        log.error(err);
        return err;
    }
    let msg = null;
    // meta data can be used to know the current watermark stage and calculate the catch to do
    if (data && Buffer.isBuffer(data.value)) {
        const meta = {
            offset: data.offset,
            partition: data.partition,
            size: data.size,
            topic: data.topic,
            timestamp: data.timestamp,
        };
        msg = JSON.parse(data.value.toString());
        // TODO: log data to elastic
        log.info(`meta : ${JSON.stringify(meta)}`);
        log.info(`data:  ${JSON.stringify(msg)}`);

    }

    return msg;
};

export class Worker implements IWorker {

  private consumer: IConsumer;

  constructor(consumer: IConsumer) {
      this.consumer = consumer;
  }

  public async start() {
    log.info("Starting worker ..");
    this.consumer.start(messageHandler);

 }

  public async stop() {
      this.consumer.stop(); // wait for graceful stop
  }

}
