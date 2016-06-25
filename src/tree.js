'use strict';

const co = require('co');

const GitSource = require('./GitSource');
const FileSystemSource = require('./FileSystemSource');
const Builder = require('./Builder');
const Display = require('./Display');

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

      const builder = new Builder();
      entries.forEach(entry => builder.addEntry(entry));

      const fileTree = builder.getOutput();
      const displayer = new Display();
      const output = displayer.displayFiles(fileTree, targetPath)
      console.log(output);
    } catch(err) {
      console.error('tree error: ', err);
      process.exit(-1); // unexpected error
    }
  });
};
