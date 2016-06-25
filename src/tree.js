'use strict';

const co = require('co');

const Builder = require('./Builder');
const Display = require('./Display');

module.exports = function tree(sources, targetPath) {
  return co(function*() {
    let entries = null;
    let source;

    for(let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
      entries = yield sources[sourceIndex].readFiles(targetPath);

      // if the result is not null, we have found a good source
      if (entries) {
        break;
      }
    }

    const builder = new Builder();
    entries.forEach(entry => builder.addEntry(entry));

    const fileTree = builder.getOutput();
    const displayer = new Display();
    const output = displayer.displayFiles(fileTree, targetPath)

    return output;
  });
};
