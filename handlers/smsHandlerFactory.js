'use strict';

const smsHandlerFactory = (config, logger, client, mappings) => {
    return async (message) => {
        const buildRegEx = (keywords) => {
            const pattern = "(?=.*?\\b" + keywords.join(")(?=.*?\\b") + ").*";
            return new RegExp(pattern, 'i');
        };

        const smsObjectParser = (message) => {
            if (!message) {
                throw Error('Message body empty.');
            }
            const { ALARM_SMS_NUMBER } = config;

            const smsObject = JSON.parse(message);

            const { sender, body } = smsObject;
            if (sender !== ALARM_SMS_NUMBER) {
                throw Error('Unrecognized/missing Alarm SMS number');
            }
            if (!body) {
                throw Error('Missing SMS body');
            }
            return smsObject;
        };

        const { body } = smsObjectParser(message);
        const { STATE_TOPIC } = config;

        for (const { smsKeywords, mqttState } of mappings) {
            logger.trace('Testing keywords: ', smsKeywords, ' against SMS body: ', body);
            const regex = buildRegEx(smsKeywords);
            if (!regex.test(body)) {
                continue;
            }
            logger.info('SMS body successfully matched with keywords: ', smsKeywords);
            logger.info('Sending response: ', mqttState);

            await client.publish(STATE_TOPIC, mqttState, { retain: true });
            logger.trace(`MQTT message '${mqttState}' published to '${STATE_TOPIC}'`);

            return;
        }
        logger.info('SMS body can\'t be successfully matched with keywords. Message unrecognized.');
    };
};

module.exports = smsHandlerFactory;
