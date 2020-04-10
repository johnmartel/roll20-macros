import fs from 'fs';
import schema from './src/macro.schema.json';
import MacroValidator from './src/macroValidator.js';

const files = fs.readdirSync('macros');
const validator = new MacroValidator('macros', files, schema);
const exitCode = validator.validate();

process.exit(exitCode);
