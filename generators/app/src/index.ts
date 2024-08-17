import Generator = require('yeoman-generator');
const chalk = require('chalk');
import yosay = require('yosay');
import path = require('path');

interface PromptAnswers {
  demo: boolean
}
module.exports = class extends Generator {
  answers: PromptAnswers;
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the ${chalk.red('generator-aciifx-cli')} generator!`
      )
    );

    this.answers = await this.prompt([
      {
        type: "confirm",
        name: "demo",
        message: "Would you like to generate the demo dir too? (Use this only for test or playground projects)",
      }
    ]);
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

    // copy env file if env file not already exists
    const destinationEnvPath = this.destinationPath('aciiFX/.env');

    if (!this.fs.exists(destinationEnvPath)) {
      this.fs.copy(
        this.templatePath('aciiFX/.env-template'),
        destinationEnvPath
      );
    }

    // copy template env file 
    this.fs.copy(
      this.templatePath('aciiFX/.env-template'),
      this.destinationPath('aciiFX/.env-template')
    );

    // copy demo file
    if (this.answers.demo) {
      // -> demo direction install
      this.fs.copy(
        this.templatePath('demo'),
        this.destinationPath('demo')
      );
    }
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
