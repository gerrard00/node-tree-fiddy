'use strict';

const archy = require('archy');
const GitSource = require('./src/GitSource');
const FileSystemSource = require('./src/FileSystemSource');
const Display = require('./src/Display');

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

function displayData(fileTree) {
  const displayer = new Display();
  displayer.displayFiles(fileTree)
}

module.exports = function index(path) {
  const gitSource = new GitSource();

  gitSource.on('data', handleData);
  gitSource.on('done', () => displayData(result));
  gitSource.on('error', error => {
    console.error('git failed', error);
  });

  gitSource.on('notsupported', () => {
    // fallback to the fs
    const fsSource = new FileSystemSource();
    fsSource.on('data', handleData);
    fsSource.on('done', () => displayData(result));
    //TODO: handle errors:
    fsSource.on('error', error => {
      console.error('fs failed', error);
    });
    fsSource.readFiles(path);
  });

  gitSource.readFiles(path);
};
