const mqtt = require('async-mqtt');
const config = require('./config');
const handlersFactory = require('./handlers/handlersFactory');
const logger = require('simple-node-logger').createSimpleLogger();
logger.setLevel(config.LOG_LEVEL);

const client  = mqtt.connect(config.MQTT_BROKER_URL, {
    username: config.MQTT_USER,
    password: config.MQTT_PASSWORD
});

const registerSubscriptions = async() => {
    const { COMMANDS_TOPIC, SMSGW_INCOMING_TOPIC } = config;
    for (const topic of [COMMANDS_TOPIC, SMSGW_INCOMING_TOPIC]) {
        const granted = await client.subscribe(topic);
        logger.info(`Successfully subscribed to '${granted[0].topic}'.`);
    }
};

const main = async() => {
    const handlers = handlersFactory(config, logger, client);
    const { MQTT_BROKER_URL, ALARM_SMS_NUMBER } = config;
    logger.info(`Successfully connected to MQTT broker: ${MQTT_BROKER_URL}`);
    logger.info(`Alarm device SMS number: ${ALARM_SMS_NUMBER}`);
    try {
        await registerSubscriptions();
        client.on('message', handlers);
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


