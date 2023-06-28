function getEnvironmentVariable(name) {
    const variable = process.env[name];
    if (!variable) {
        throw new Error(`Environment variable "${name}" is not defined`);
    }
    return variable;
}

function prepareResponse(smsNumber, smsText) {
    return {
        sender: smsNumber,
        body: smsText.replace(/\r?\n|\r/g, ' ')
    }
}

module.exports = { getEnvironmentVariable, prepareResponse };
