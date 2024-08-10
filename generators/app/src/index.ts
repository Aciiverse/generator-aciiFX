import Generator = require('yeoman-generator');
const chalk = require('chalk');
import yosay = require('yosay');
import path = require('path');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the ${chalk.red('generator-aciifx-cli')} generator!`
      )
    );
  }

  writing() {
    this.fs.copy(
      this.templatePath('aciiFX'),
      this.destinationPath('aciiFX'),
      {
        globOptions: {
          ignore: [
            'aciiFX/.env',
            'node_modules',
            'aciiFX/dist'
          ]
        }
      }
    );

    // Copy Env file
    this.fs.copy(
      this.templatePath('aciiFX/.env-template'),
      this.destinationPath('aciiFX/.env')
    );
  }

  install() {
    const targetDir = path.join(this.destinationRoot(), 'aciiFX');

    process.chdir(targetDir);
    this.installDependencies({
      bower: false,
      npm: true,
      yarn: false,
    });
  }
};
