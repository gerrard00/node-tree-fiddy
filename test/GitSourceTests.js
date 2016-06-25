'use strict';

const chai = require('chai');
require('co-mocha');
const should = chai.should();
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const mockSpawn = require('mock-spawn');


describe('GitSource', function(){
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('reads file from git repo', function *() {
    const expectedResult = [ 'foo',
      'foo/bar',
      'foo/baz',
      'foo/baz/baz1',
      'foo/baz/baz2' ];

    const mySpawn = mockSpawn();
    mySpawn.sequence.add(mySpawn.simple(0, 
      (`
      foo
      foo/bar
      foo/baz
      foo/baz/baz1`).replace(/^\s*/gm, '')));

    mySpawn.sequence.add(mySpawn.simple(0, 
      'foo/baz/baz2'));

    const GitSource = require('../src/GitSource');
    const gitSource = new GitSource(mySpawn);
    const result = yield gitSource.readFiles('foo');

    result.should.be.eql(expectedResult);
  });
});
