'use strict';

const archy = require('archy');
const GitSource = require('./src/GitSource');


const result = {};

//TODO: fall back to ls readdir if we aren't in a repo

function convertToArchyFriendly(original, name) {
  const result = {
    label : name,
  };

  result.nodes = Object.keys(original).map(key => {
    const currentItem = original[key];

    if (!currentItem) {
      return key;
    }

    return convertToArchyFriendly(currentItem, key);
  });

  return result;
}

// function processComplete() {
// }

// for (let entry of git.getFiles()) {
//   console.log('--->', entry);
// }

const gitSource = new GitSource();

gitSource.on('data', entry => {
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
});

gitSource.on('done', () => {
  const archyFriendlyResult = convertToArchyFriendly(result, '.');
  console.log(archy(archyFriendlyResult));
});

gitSource.readFiles('.');
