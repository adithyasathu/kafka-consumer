import { log } from "./index";
import { KafkaConsumer } from "node-rdkafka";
import { IConsumer } from "./interfaces";

export class Consumer implements IConsumer {

    private consumer: KafkaConsumer;
    private readonly topic: string;

    constructor(options: any) {
        this.topic = options.topic;
        this.consumer = new KafkaConsumer(options.client, options.topics);
    }

    public async start(messageHandler) {
        log.info("Starting consumer ..");
        this.consumer.connect();

        // initiate the consumer
        this.consumer.on('ready', () => {
           this.consumer.subscribe([this.topic]);
           this.consumer.consume(messageHandler);
        });

        this.consumer.on('event.error', (err) => {
            log.error('Error ',  err);
        });

        this.consumer.on('event.log', (err) => {
            log.error('Error ',  err);
        });

        this.consumer.on('disconnected', (err) => {
            log.error('Error ',  err);
        });
    }

    public async stop() {
        log.info(`Disconnecting consumer ..`);
        this.consumer.unsubscribe();
        this.consumer.disconnect();
    }

}
