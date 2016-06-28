'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function directoryIdentifier(tree, targetPath) {
  const hasChildren = tree.hasOwnProperty('children');

  if (!tree.hasOwnProperty('isDirectory')) {
    tree.isDirectory = hasChildren ||
      fs.lstatSync(targetPath).isDirectory();
  }

  if (!hasChildren) {
    return;
  }

  // process children
  for (const key of Object.keys(tree.children)) {
    directoryIdentifier(tree.children[key], path.join(targetPath, key));
  }
};
