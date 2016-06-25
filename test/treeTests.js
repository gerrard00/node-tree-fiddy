'use strict';

const chai = require('chai');
const should = chai.should();
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
require('co-mocha');

const Builder = require('../src/Builder');
const Display = require('../src/Display');

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

  it('tries multiple sources',
     function *() {
       // arrange
       const dirPath = 'foo';
       const fsResult = ['bar', 'baz'];
       const expectedDisplayObject = { something: 'to display' };

       const sources = [ {
         readFiles : () => Promise.resolve(null)
       }, {
         readFiles: () => Promise.resolve(fsResult)
       }];

       const builderStub =
         sandbox.stub(Builder.prototype, 'getOutput')
          .returns(expectedDisplayObject);
       const displayStub =
         sandbox.stub(Display.prototype, 'displayFiles')
          .withArgs(expectedDisplayObject);

       // act
       const result = yield sut(sources, dirPath);

       // assert
       builderStub.should.have.been.called;
       displayStub.should.have.been.called;
     });
});
