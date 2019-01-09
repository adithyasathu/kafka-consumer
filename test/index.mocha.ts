import * as TypeMoq from 'typemoq';
import { expect } from 'chai';
import { messageHandler, Worker} from '../src/worker';
import { Consumer } from "../src/consumer";
import { IConsumer } from "../src/interfaces";

describe('Kafka Consumer : Message Handler Test', () => {
    let worker = null;

    afterEach(() => {
        if (worker) { worker.stop(); }
    });

    it('handle the message', () => {
        // Arrange
        const consumer: TypeMoq.IMock<IConsumer> = TypeMoq.Mock.ofType<Consumer>();
        const data = { name : 'Adi'};
        const kafkaMessage = {
            offset: 2,
            partition: 3,
            size: 312,
            topic: 'dummy-topic',
            timestamp: 15423526727687,
            value: Buffer.from(JSON.stringify(data)),
        };

        consumer.setup((c) => c.start(messageHandler)).returns(() => {
            const processed  = messageHandler(null, kafkaMessage);
            expect(processed).to.be.deep.eq(data);
        });

        // Act
        worker = new Worker(consumer.object);
        worker.start();
    });

    it('handle empty message', () => {
        // Arrange
        const consumer: TypeMoq.IMock<IConsumer> = TypeMoq.Mock.ofType<Consumer>();

        consumer.setup((c) => c.start(messageHandler)).returns(() => {
            const processed  = messageHandler(null, null);
            expect(processed).to.be.deep.eq(null);
        });

        // Act
        worker = new Worker(consumer.object);
        worker.start();
    });

    it('handle unexpected message', () => {
        // Arrange
        const consumer: TypeMoq.IMock<IConsumer> = TypeMoq.Mock.ofType<Consumer>();
        const kafkaMessage = {
            offset: 2,
            partition: 3,
            size: 312,
            topic: 'dummy-topic',
            timestamp: 15423526727687,
            value: null,
        };

        consumer.setup((c) => c.start(messageHandler)).returns(() => {
            const processed  = messageHandler(null, kafkaMessage);
            expect(processed).to.be.deep.eq(null);
        });

        // Act
        worker = new Worker(consumer.object);
        worker.start();
    });

    it('handle the error', () => {
        // Arrange
        const consumer: TypeMoq.IMock<IConsumer> = TypeMoq.Mock.ofType<Consumer>();
        const error = { type : 'Error'};

        consumer.setup((c) => c.start(messageHandler)).returns(() => {
            const processed  = messageHandler(error, null);
            expect(processed).to.be.deep.eq(error);
        });

        // Act
        worker = new Worker(consumer.object);
        worker.start();
    });
});
