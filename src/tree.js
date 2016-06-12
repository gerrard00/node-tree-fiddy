'use strict';

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

function displayData(fileTree, name) {
  const displayer = new Display();
  displayer.displayFiles(fileTree, name)
}

module.exports = function tree(targetPath) {
  const gitSource = new GitSource();

  gitSource.on('data', handleData);
  gitSource.on('done', () => displayData(result, targetPath));
  gitSource.on('error', error => {
    console.error('git failed', error);
  });

  gitSource.on('notsupported', () => {
    // fallback to the fs
    const fsSource = new FileSystemSource();
    fsSource.on('data', handleData);
    fsSource.on('done', () => displayData(result, targetPath));
    //TODO: handle errors:
    fsSource.on('error', error => {
      console.error('fs failed', error);
    });
    fsSource.readFiles(targetPath);
  });

  gitSource.readFiles(targetPath);
};
