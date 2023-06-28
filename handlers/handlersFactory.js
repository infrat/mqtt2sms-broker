const smsHandlerFactory = require('./smsHandlerFactory');
const commandsHandlerFactory = require('./commandsHandlerFactory');

const handlersFactory = (config, logger, client) => {
    const { ALARM_DEVICE } = config;
    const commandsMapping = require('../mappings/commands2sms/default');
    const smsMappings = require(`../mappings/sms2states/${ALARM_DEVICE}.json`);

    const smsHandler = smsHandlerFactory(config, logger, client, smsMappings);
    const commandsHandler = commandsHandlerFactory(config, logger, client, commandsMapping);
    return async ( topic, messageBuffer ) => {
        const { COMMANDS_TOPIC, SMSGW_INCOMING_TOPIC } = config;
        const message = messageBuffer.toString();
        logger.info(`Message received. Topic: ${topic}, Message: ${message}`);
        switch (topic) {
            case COMMANDS_TOPIC:
                try {
                    await commandsHandler(message);
                } catch (err) {
                    const details = {
                        message: err.toString(),
                        mqttMessage: message,
                        stack: err.stack
                    };
                    logger.error(
                        `Error occurred on handling MQTT command. Details: \n`,
                        JSON.stringify(details, null, 2)
                    );
                }
                break;
            case SMSGW_INCOMING_TOPIC:
                try {
                    await smsHandler(message);
                } catch (err) {
                    const details = {
                        message: err.toString(),
                        mqttMessage: message,
                        stack: err.stack
                    };
                    logger.error(
                        `Error occurred on handling SMS. Details: \n`,
                        JSON.stringify(details, null, 2)
                    );
                }
                break;
        }
    }
};

module.exports = handlersFactory;
