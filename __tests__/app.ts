'use strict';
const path = require('path');
const assert = require('yeoman-assert');

describe('generator-aciifx-cli:app', function () {
  beforeAll(() => { });

  it('aciiFX exists', () => {
    assert.file([`${path.join(__dirname, '../generators/app/templates')}/aciiFX`]);
  });
});