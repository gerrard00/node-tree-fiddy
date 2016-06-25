'use strict';

const chai = require('chai');
require('co-mocha');
const should = chai.should();
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const mockSpawn = require('mock-spawn');
const childProcess = require('child_process');

const Builder = require('../src/Builder');

describe('GitSource', function(){
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('reads file from git repo', function *() {
    const expectedFiles = [ 'foo',
      'foo/bar',
      'foo/baz',
      'foo/baz/baz1',
      'foo/baz/baz2' ];
    const expectedTree = { some: 'tree' };

    const mySpawn = mockSpawn();
    mySpawn.sequence.add(mySpawn.simple(0,
      (`
      foo
      foo/bar
      foo/baz
      foo/baz/baz1`).replace(/^\s*/gm, '')));

    mySpawn.sequence.add(mySpawn.simple(0,
      'foo/baz/baz2'));

    childProcess.spawn = mySpawn;

    // TODO: confirm we are actually calling addEntry correctly
    const stubBuilder =
      sinon
        .stub(Builder.prototype, 'getOutput')
        .returns(expectedTree);

    const GitSource = require('../src/GitSource');
    const gitSource = new GitSource();
    const result = yield gitSource.readFiles('foo');

    result.should.be.eql(expectedTree);
  });
});
