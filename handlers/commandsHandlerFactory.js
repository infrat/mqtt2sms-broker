const commandsHandlerFactory = (config, logger, client, mapping) => {
    return async(message) => {
        const { STATE_TOPIC, ALARM_SMS_NUMBER, SMSGW_OUTGOING_TOPIC } = config;
        const result = mapping.filter(({ command }) => command === message);
        if (result.length === 0) {
            throw Error(`Unrecognized command ${message}`);
        }
        const { mqttState, smsCommand } = result[0];
        logger.trace('Command recognized, params resolved: ', { backResponse: mqttState, smsCommand });

        await client.publish(STATE_TOPIC, mqttState);
        logger.trace(`MQTT message '${mqttState}' published to '${STATE_TOPIC}'`);

        const smsBody = { recipient: ALARM_SMS_NUMBER, body: smsCommand };

        await client.publish(SMSGW_OUTGOING_TOPIC, JSON.stringify(smsBody));
        logger.trace(`MQTT message '${JSON.stringify(smsBody)}' published to '${SMSGW_OUTGOING_TOPIC}'`);
    }
};

module.exports = commandsHandlerFactory;
