const archy = require('archy');
const path = require('path');

function convertToArchyFriendly(original, name) {
  const result = {
    label : name,
  };

  if (original.children) {
    result.nodes = Object.keys(original.children).map(key => {
      const currentItem = original.children[key];

      if (!currentItem) {
        return key;
      }

      return convertToArchyFriendly(currentItem, key);
    });
  }

  return result;
}

class Display {
  displayFiles(fileTree, rootPath) {
    const archyFriendlyResult =
      convertToArchyFriendly(fileTree, rootPath);

    return archy(archyFriendlyResult);
  }
}

module.exports = Display;
