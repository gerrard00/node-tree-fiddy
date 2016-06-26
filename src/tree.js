'use strict';

const co = require('co');

const Display = require('./Display');

module.exports = function tree(sources, targetPath, preprocessor) {
  return co(function*() {
    let fileTree;

    for(let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {

      fileTree = yield sources[sourceIndex].readFiles(targetPath);

      // if the result is not null, we have found a good source
      if (fileTree) {
        break;
      }
    }

    preprocessor(fileTree, targetPath);

    const displayer = new Display();
    const output = displayer.displayFiles(fileTree, targetPath)

    return output;
  });
};
