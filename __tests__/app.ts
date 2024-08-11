'use strict';
const path = require('path');
const assert = require('yeoman-assert');

describe('generator-aciifx-cli:app', function () {
  beforeAll(() => {
    this.templatesDir = path.join(__dirname, '../generators/app/templates');
  });

  it('aciiFX exists', () => {
    assert.file([`${this.templatesDir}/aciiFX`]);
  });
});