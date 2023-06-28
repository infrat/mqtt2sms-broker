const configMock = {
    ALARM_DEVICE: "custom_device",
    ALARM_SMS_NUMBER: "+48888888888",
    COMMANDS_TOPIC: "home/alarm/set",
    LOG_LEVEL: "info",
    MQTT_BROKER_URL: "mqtt://127.0.0.1",
    MQTT_PASSWORD: "mqtt",
    MQTT_USER: "mqtt",
    SMSGW_INCOMING_TOPIC: "home/smsgateway/incoming",
    SMSGW_OUTGOING_TOPIC: "home/smsgateway/outgoing",
    STATE_TOPIC: "home/alarm"
};

const loggerMock = {
    info: jest.fn(),
    trace: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};

const clientMock = {
    publish: jest.fn()
};

const mapSmsMock = [
    {
        "smsKeywords": [
            "security",
            "zone 2",
            "armed"
        ],
        "mqttState": "armed_night"
    },
    {
        "smsKeywords": [
            "security",
            "zone 1",
            "armed"
        ],
        "mqttState": "armed_home"
    },
    {
        "smsKeywords": [
            "disarmed"
        ],
        "mqttState": "disarmed"
    }
];

const mapCommandMock = [
    {
        "command": "ARM",
        "mqttState": "arming",
        "smsCommand": "ARM_sms"
    },
    {
        "command": "DISARM",
        "mqttState": "disarming",
        "smsCommand": "DISARM_sms"
    }
];

module.exports = { configMock, loggerMock, clientMock, mapSmsMock, mapCommandMock };
