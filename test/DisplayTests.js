'use strict';

const chai = require('chai');
const should = chai.should();
const sinon = require('sinon');

const Display = require('../src/Display');

describe('Display', function() {
  it('can display a tree', function() {
    // arrange

    const inputTree = {
      foo: {
        bar: null,
        baz: {
          baz1: null,
          baz2: null
        }
      }
    };
// TODO: ugly
    const expectedOutput = `.
└─┬ foo
  ├── bar
  └─┬ baz
    ├── baz1
    └── baz2
`;

    // act

    const sut = new Display();
    const actualOutput = sut.displayFiles(inputTree, '.');

    actualOutput.should.be.equal(expectedOutput);
  });
});
