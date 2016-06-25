'use strict';

const chai = require('chai');
const should = chai.should();

const Builder = require('../src/Builder');

describe('Builder', function() {
  it('can build a normal tree', function() {
    const expectedOutput = {
      'children': {
        'foo' : {
          'children': {
            'bar': {},
            'baz': {
              'children': {
                'baz1' : {},
                'baz2' : {}
              }
            }
          }
        }
      }
    };

    const sut = new Builder();
    sut.addEntry('foo');
    sut.addEntry('foo/bar');
    sut.addEntry('foo/baz');
    sut.addEntry('foo/baz/baz1');
    sut.addEntry('foo/baz/baz2');

    const actualOutput = sut.getOutput();

    actualOutput.should.be.eql(expectedOutput);
  });

  it('can store extra data', function() {
    const expectedOutput = {
      'children': {
        'batman': {
          'is_cool': true
        },
        'robin': {}
      }
    };

    const sut = new Builder();
    // this entry has extra data
    sut.addEntry('batman', { is_cool: true });
    sut.addEntry('robin');

    const actualOutput = sut.getOutput();

    actualOutput.should.be.eql(expectedOutput);
  });
});
