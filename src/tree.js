'use strict';

const co = require('co');

const GitSource = require('./GitSource');
const FileSystemSource = require('./FileSystemSource');
const Display = require('./Display');

const result = {};

//TODO: fall back to ls readdir if we aren't in a repo
function handleData(entry) {
  let partOfResult = result;

  const entryParts = entry.split('/');

  for (let index = 0; index < entryParts.length; index++) {
    const entryPart = entryParts[index];

    if (index + 1 === entryParts.length) {
      partOfResult[entryPart] = null;
    } else {
      if (!partOfResult[entryPart]) {
        partOfResult[entryPart] = {};
      }

      partOfResult = partOfResult[entryPart];
    }
  }
}

module.exports = function tree(targetPath) {
  return co(function*() {
    try {
      const gitSource = new GitSource();
      let entries = yield gitSource.readFiles(targetPath);

      // if the result is null, it wasn't a repo
      if (!entries) {
        const fsSource = new FileSystemSource();
        entries = yield fsSource.readFiles(targetPath);
      }

      entries.forEach(entry => handleData(entry));

      const displayer = new Display();
      displayer.displayFiles(result, targetPath)
    } catch(err) {
      console.error('tree error: ', err);
      process.exit(-1); // unexpected error
    }
  });
};
