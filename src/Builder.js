'use strict';

class Builder
{
  constructor() {
    this.output = {};
  }

  addEntry(entry, extraData) {
    let partOfResult = this.output;

    const entryParts = entry.split('/');

    for (let index = 0; index < entryParts.length; index++) {
      const entryPart = entryParts[index];

      if (!partOfResult.children) {
        partOfResult.children = {};
      }

      if (!partOfResult.children[entryPart]) {
        partOfResult = partOfResult.children[entryPart] = {};
      } else {
        partOfResult = partOfResult.children[entryPart];
      }
    }

    // the entry part is now our lowest level node
    // add any extra data that was provided
    if (extraData) {
      Object.assign(partOfResult, extraData);
    }
  }

  getOutput() {
    // quick hack to eliminate root item
    return this.output;
  }
}

module.exports = Builder;
