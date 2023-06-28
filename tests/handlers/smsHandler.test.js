const smsHandlerFactory = require('../../handlers/smsHandlerFactory');
const { configMock, loggerMock, clientMock, mapSmsMock } = require('../helpers/mocksHelper');

const smsHandler = smsHandlerFactory(configMock, loggerMock, clientMock, mapSmsMock);

const VALID_NUMBER = '+48888888888';
const INVALID_NUMBER = '+48888777888';
const ARMED_MESSAGE = 'Home security. Zone 1 armed.';

describe('smsHandler', () => {
    test('smsHandler should reject empty message', async() => {
        // arrange
        const emptyMessage  = '';

        // act / assert
        await expect(smsHandler(emptyMessage)).rejects.toThrow();
    });
    test('smsHandler should reject invalid message payload', async() => {
        // arrange
        const invalidMessage  = 'abcd';

        // act / assert
        await expect(smsHandler(invalidMessage)).rejects.toThrow();
    });
    test('smsHandler should reject unknown object in payload', async() => {
        // arrange
        const unknownMessage  = JSON.stringify({
            favourite: { drink: 'beer', food: 'pizza', language: 'cobol' }
        });

        // act / assert
        await expect(smsHandler(unknownMessage)).rejects.toThrow();
    });
    test('smsHandler should reject unknown smsnumber in payload', async() => {
        // arrange
        const unknownNumberMessage  = JSON.stringify({
            sender: INVALID_NUMBER,
            body: 'Hi dude!'
        });

        // act / assert
        await expect(smsHandler(unknownNumberMessage)).rejects.toThrow();
    });

    test('smsHandler shouldn\'t publish anything to MQTT if message body not matched with map', async() => {
        // arrange
        const unknownMessage  = JSON.stringify({
            sender: VALID_NUMBER,
            body: 'Hi dude!'
        });

        // act
        await smsHandler(unknownMessage);

        // assert
        expect(clientMock.publish.mock.calls.length).toEqual(0);
    });

    test('smsHandler should publish message to MQTT if message body matched with map', async() => {
        // arrange
        const unknownMessage  = JSON.stringify({
            sender: VALID_NUMBER,
            body: ARMED_MESSAGE
        });
        const { STATE_TOPIC } = configMock;
        const { mqttState } = mapSmsMock[1];
        const expectedMQTTOpts = { retain: true };

        // act
        await smsHandler(unknownMessage);

        // assert
        expect(clientMock.publish.mock.calls[0]).toEqual([ STATE_TOPIC, mqttState, expectedMQTTOpts ]);
    });
});
