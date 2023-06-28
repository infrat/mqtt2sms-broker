const { prepareResponse, getEnvironmentVariable } = require('../../utils/cli');

describe('utils/cli.js', () => {
    test('preparesResponse should return object matching expected structure', () => {
        // arrange
        const smsNumber = '+48888888888';
        const smsText = "Security system\n\rarmed";

        // act
        const result = prepareResponse(smsNumber, smsText);

        // assert
        expect(result.body && result.sender).toBeTruthy();
    });

    test('preparesResponse should prepare object with escaped newline characters', () => {
        // arrange
        const smsNumber = '+48888888888';
        const smsText = "Security system\n\rarming area 1";

        // act
        const result = prepareResponse(smsNumber, smsText);

        // assert
        expect(result.body.match(('(\r\n|\r|\n)'))).toBeNull();
    });

    test('getEnvironmentVariable should throw an error if environment variable doesn\'t exists', () => {
        // arrange
        const envBackup = {};
        Object.assign(envBackup, process.env);
        process.env = {};

        // assert
        expect(() => getEnvironmentVariable('UNEXISTING_VARIABLE')).toThrow();

        // cleanup
        process.env = envBackup;
    });
});
