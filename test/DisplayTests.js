'use strict';

const chai = require('chai');
const should = chai.should();
const sinon = require('sinon');

const Display = require('../src/Display');

describe('Display', function() {
  it('can display', function() {
    // arrange

    const inputTree = {
      isDirectory: true,
      children: {
        bar: {},
        baz: {
          isDirectory: true,
          children: {
            baz1: {},
            baz2: {}
          }
        },
        // note: qux is an empty directory
        qux: {
          isDirectory: true
        },
      }
    };
// TODO: ugly
    const expectedOutput = `.
├── bar
├─┬ baz
│ ├── baz1
│ └── baz2
└── qux

2 directories, 3 files
`;

    // act

    const sut = new Display();
    const actualOutput = sut.displayFiles(inputTree, '.');

    // assert

    actualOutput.should.be.equal(expectedOutput);
  });
});
