const commandsHandlerFactory = require('../../handlers/commandsHandlerFactory');
const { configMock, loggerMock, clientMock, mapCommandMock } = require('../helpers/mocksHelper');

const commandsHandler = commandsHandlerFactory(configMock, loggerMock, clientMock, mapCommandMock);

describe('commandsHandler', () => {
    test('commandsHandler should reject unknown command', async() => {
        // arrange
        const unknownCommand  = 'DO_A_BEATBOX';

        // act / assert
        await expect(commandsHandler(unknownCommand)).rejects.toThrow();
    });

    test('commandsHandler should resolve known command and publish expected payloads to MQTT', async() => {
        const { STATE_TOPIC, SMSGW_OUTGOING_TOPIC, ALARM_SMS_NUMBER } = configMock;

        // arrange
        const knownCommand  = 'ARM';
        const { mqttState, smsCommand } = mapCommandMock[0];
        const expectedPayload = JSON.stringify({ recipient: ALARM_SMS_NUMBER, body: smsCommand });

        // act
        const result = await commandsHandler(knownCommand);

        // assert
        expect(clientMock.publish.mock.calls[0]).toEqual([STATE_TOPIC, mqttState ]);
        expect(clientMock.publish.mock.calls[1]).toEqual( [SMSGW_OUTGOING_TOPIC, expectedPayload]);
    });
});
