'use strict';
import Generator from 'yeoman-generator';
import chalk from 'chalk';
import yosay from 'yosay';
import path from 'path';

export default class extends Generator {
  answers;
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
            'aciiFX/.gitignore-template',
            'aciiFX/node_modules',
            'aciiFX/dist',
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

    // copy template gitignore file 
    this.fs.copy(
      this.templatePath('aciiFX/.gitignore-template'),
      this.destinationPath('aciiFX/.gitignore')
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
    this.log(chalk.blueBright('Installing node modules...'));
    this.spawnSync('npm', ['install'], {
        cwd: targetDir
    });
    this.log(chalk.greenBright('Node modules installed'));
  }
};
