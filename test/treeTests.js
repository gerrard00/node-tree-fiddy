'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
require('co-mocha');
chai.should();

const Display = require('../src/Display');

const sut = require('../src/tree');

chai.use(sinonChai);

describe('Tree', function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('tries multiple sources',
     function *() {
       // arrange
       const dirPath = 'foo';
       const treeToDisplay = { something: 'to display' };

       const sources = [{
         readFiles: () => Promise.resolve(null),
       }, {
         readFiles: () => Promise.resolve(treeToDisplay),
       }];

       const spyPreprocessor = sandbox.spy();

       const displayStub =
         sandbox.stub(Display.prototype, 'displayFiles')
          .withArgs(treeToDisplay);

       // act
       yield sut(sources, dirPath, spyPreprocessor);

       // assert
       spyPreprocessor.should.have.been.calledWith(treeToDisplay);
       displayStub.should.have.been.calledWith(treeToDisplay);
     });
});
