class Builder
{
  constructor() {
    this.output = {};
  }

  addEntry(entry) {
    let partOfResult = this.output;

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

  getOutput() {
    return this.output;
  }
}

module.exports = Builder;
