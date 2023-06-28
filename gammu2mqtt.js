const mqtt = require('async-mqtt');
const config = require('./config');
const logger = require('simple-node-logger').createSimpleLogger();
const { prepareResponse, getEnvironmentVariable } = require('./utils/cli');

logger.setLevel(config.LOG_LEVEL);

const { MQTT_BROKER_URL, SMSGW_INCOMING_TOPIC } = config;
const client  = mqtt.connect(config.MQTT_BROKER_URL, {
    username: config.MQTT_USER,
    password: config.MQTT_PASSWORD
});

const main = async() => {
    logger.trace(`Successfully connected to MQTT broker: ${MQTT_BROKER_URL}`);
    try {
        const smsNumber = getEnvironmentVariable('SMS_1_NUMBER');
        const smsText = getEnvironmentVariable('SMS_1_TEXT');
        const response = prepareResponse(smsNumber, smsText);
        await client.publish(SMSGW_INCOMING_TOPIC, JSON.stringify(response));
        logger.info(`Message published to '${SMSGW_INCOMING_TOPIC}': `, response);
        await client.end();
        logger.trace('MQTT Client closed.');
    } catch (err) {
        const details = {
            message: err.toString(),
            stack: err.stack
        };
        logger.error(`Critical error occurred. Terminating. Details: \n`, JSON.stringify(details, null, 2));
        await client.end();
        process.exit(1);
    }
};

client.on('connect', main);
