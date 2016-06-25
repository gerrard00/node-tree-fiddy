'use strict';

const chai = require('chai');
const should = chai.should();
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
require('co-mocha');

const GitSource = require('../src/GitSource');
const FileSystemSource = require('../src/FileSystemSource');
const Display = require('../src/Display');

const archy = require('archy');

const sut = require('../src/tree');

chai.use(sinonChai);

describe('Tree', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('falls back to normal processing if not in git repo',
     function *() {
       // arrange
       const dirPath = 'foo';
       const fsResult = ['bar', 'baz'];
       const expectedDisplayObject = {
         bar: null,
         baz: null
       };

       sandbox.stub(GitSource.prototype, 'readFiles', function() {
         return Promise.resolve(null);
       });

       const fsStub =
         sandbox.stub(FileSystemSource.prototype, 'readFiles', function () {
          return Promise.resolve(fsResult);
         });
       const displayStub =
         sandbox.stub(Display.prototype, 'displayFiles')
          .withArgs(expectedDisplayObject);

       // act
       const result = yield sut(dirPath);

       // assert
       fsStub.should.have.been.called;
       displayStub.should.have.been.called;
     });
});
