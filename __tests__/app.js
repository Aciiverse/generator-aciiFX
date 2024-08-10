'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-aciifx-cli:app', () => {
  beforeAll(() => {
    this.templatesDir = path.join(__dirname, '../generators/app/templates');
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ someAnswer: true });
  });

  it('aciiFX exists', () => {
    assert.file([`${this.templatesDir}/aciiFX`]);
  });
});
