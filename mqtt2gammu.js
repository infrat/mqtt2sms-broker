const mqtt = require('async-mqtt');
const config = require('./config');
const { exec } = require("child_process");
const logger = require('simple-node-logger').createSimpleLogger();
logger.setLevel(config.LOG_LEVEL);
const { MQTT_BROKER_URL, SMSGW_OUTGOING_TOPIC } = config;
const client  = mqtt.connect(config.MQTT_BROKER_URL, {
    username: config.MQTT_USER,
    password: config.MQTT_PASSWORD
});

const handle = async (topic, message) => {
    try {
        const parsed = JSON.parse(message.toString());
        const {recipient, body} = parsed;
        logger.info(`Message received: `, parsed);
        logger.info('SHELL: calling gammu-smsd-inject.');
        exec(`su gammu -s /bin/bash -c 'gammu-smsd-inject TEXT ${recipient} -text "${body}"'`, async (err, stdout, stderr) => {
            if (err || stderr) {
                logger.error('SHELL: unable to call gammu-smsd-inject: \n', err.stack || stderr.stack);
                logger.error('Terminating mqtt2gammu.');
                await client.end();
                process.exit(1);
            }
            logger.trace('SHELL: gammu-smsd-inject executed successfully: ', stdout);
        });
    } catch (err) {
        logger.error('Error occurred: ', err.stack);
    }
};

const main = async() => {
    logger.info(`Successfully connected to MQTT broker: ${MQTT_BROKER_URL}`);
    const granted = await client.subscribe(SMSGW_OUTGOING_TOPIC);
    logger.info(`Successfully subscribed to '${granted[0].topic}'.`);

    client.on('message', handle);
};

client.on('connect', main);


