import fs from 'fs';
import jsonschema from 'jsonschema';

export default class MacroValidator {
  constructor(rootDir, filenames, schema) {
    this.rootDir = rootDir;
    this.filenames = filenames;
    this.schema = schema;
    this.validator = new jsonschema.Validator();
  }

  validate() {
    let exitCode = 0;
    this.filenames.forEach((filename) => {
      try {
        const fileContent = fs.readFileSync(`${this.rootDir}/${filename}`, { encoding: 'utf8' });
        const result = this.validator.validate(JSON.parse(fileContent), this.schema);
        if (!result.valid) {
          console.error(`${filename}: ${result.errors}`);
          exitCode = exitCode || 420;
        } else {
          console.debug(`${filename}: OK!`);
        }
      } catch (error) {
        console.error(`${filename}: Invalid json`);
        exitCode = exitCode || 69;
      }
    });

    return exitCode;
  }
}
