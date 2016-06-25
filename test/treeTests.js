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
       const treeToDisplay = { something: 'to display' };

       const sources = [ {
         readFiles : () => Promise.resolve(null)
       }, {
         readFiles: () => Promise.resolve(treeToDisplay)
       }];

       const displayStub =
         sandbox.stub(Display.prototype, 'displayFiles')
          .withArgs(treeToDisplay);

       // act
       const result = yield sut(sources, dirPath);

       // assert
       displayStub.should.have.been.called;
     });
});
