import loggers from '../src/config/logger.js';
import chai from 'chai';
import winston from 'winston';

const expect = chai.expect;

const errorLevels = ['debug', 'http', 'info', 'notice', 'warn', 'error', 'fatal'];


describe('Test del logger', () => {
    it('Debe retornar un logger por cada nivel de error', () => {
        const logger = loggers;
        expect(logger).to.be.an.instanceOf(winston.Logger);

    });

    it('Debe retornar un logger con el nivel de error indicado', () => {
        errorLevels.forEach((level) => {
            const logger = loggers;
            expect(logger.levels[level]).to.be.equal(logger.levels[level]);
        });
    });
    
});
