import fs from 'fs';
import MacroValidator from '../src/macroValidator';

jest.mock('fs');

describe('MacroValidator test suite', () => {
  describe('validate', () => {
    describe('given macros directory does not contain any file', () => {
      it('should return 0', () => {
        const validator = new MacroValidator('macros', [], {});

        expect(validator.validate()).toEqual(0);
      });
    });

    describe('given all files are valid', () => {
      beforeEach(() => {
        fs.readFileSync.mockReturnValue(JSON.stringify({ value: 0 }));
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should return 0', () => {
        const validator = new MacroValidator('macros', ['test.json'], {
          type: 'object',
          properties: { value: { type: 'integer' } },
        });

        expect(validator.validate()).toEqual(0);
      });
    });

    describe('given a file is invalid', () => {
      beforeEach(() => {
        fs.readFileSync.mockReturnValue(JSON.stringify({ value: 'test' }));
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should return 420', () => {
        const validator = new MacroValidator('macros', ['test.json'], {
          type: 'object',
          properties: { value: { type: 'integer' } },
        });

        expect(validator.validate()).toEqual(420);
      });
    });

    describe('given a file is not valid JSON', () => {
      beforeEach(() => {
        fs.readFileSync.mockReturnValue('invalid json');
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should return 69', () => {
        const validator = new MacroValidator('macros', ['test.json'], {
          type: 'object',
          properties: { value: { type: 'integer' } },
        });

        expect(validator.validate()).toEqual(69);
      });
    });

    describe('given first file is valid and next file is invalid', () => {
      beforeEach(() => {
        fs.readFileSync.mockReturnValueOnce(JSON.stringify({ value: 1 }));
        fs.readFileSync.mockReturnValueOnce(JSON.stringify({ value: 'test' }));
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should return 420', () => {
        const validator = new MacroValidator('macros', ['valid.json', 'invalid.json'], {
          type: 'object',
          properties: { value: { type: 'integer' } },
        });

        expect(validator.validate()).toEqual(420);
      });
    });

    describe('given first file is invalid and next file is valid', () => {
      beforeEach(() => {
        fs.readFileSync.mockReturnValueOnce(JSON.stringify({ value: 'test' }));
        fs.readFileSync.mockReturnValueOnce(JSON.stringify({ value: 1 }));
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should return 420', () => {
        const validator = new MacroValidator('macros', ['invalid.json', 'valid.json'], {
          type: 'object',
          properties: { value: { type: 'integer' } },
        });

        expect(validator.validate()).toEqual(420);
      });
    });

    describe('given first file is valid and next file is not valid JSON', () => {
      beforeEach(() => {
        fs.readFileSync.mockReturnValueOnce(JSON.stringify({ value: 1 }));
        fs.readFileSync.mockReturnValueOnce('invalid json');
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should return 69', () => {
        const validator = new MacroValidator('macros', ['valid.json', 'invalid.json'], {
          type: 'object',
          properties: { value: { type: 'integer' } },
        });

        expect(validator.validate()).toEqual(69);
      });
    });

    describe('given first file is invalid JSON and next file is valid', () => {
      beforeEach(() => {
        fs.readFileSync.mockReturnValueOnce('invalid json');
        fs.readFileSync.mockReturnValueOnce(JSON.stringify({ value: 1 }));
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should return 69', () => {
        const validator = new MacroValidator('macros', ['invalid.json', 'valid.json'], {
          type: 'object',
          properties: { value: { type: 'integer' } },
        });

        expect(validator.validate()).toEqual(69);
      });
    });
  });
});
