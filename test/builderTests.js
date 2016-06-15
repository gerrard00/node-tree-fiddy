'use strict';

const chai = require('chai');
const should = chai.should();

const Builder = require('../src/Builder');

describe.only('builds a tree', function() {
  it('can build a normal tree', function() {
    const expectedOutput = {
      'foo' : {
        'bar': null,
        'baz': {
          'baz1' : null,
          'baz2' : null
        }
      }
    };

    const sut = new Builder();
    sut.addEntry('foo');
    sut.addEntry('foo/bar');
    sut.addEntry('foo/baz');
    sut.addEntry('foo/baz1');
    sut.addEntry('foo/baz2');

    const output = sut.getOutput();

    expectedOutput.should.be.eql(output);
  });
});
