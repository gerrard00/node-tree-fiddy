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

function getSummary(fileTree, providedSummary) {
  let summary = providedSummary ||  {
    fileCount: 0, 
    // start at - 1, because the target directory shouldn't be counted
    directoryCount: -1
  };

  if (fileTree.isDirectory) {
    summary.directoryCount++;
  } else {
    summary.fileCount++;
  }

  if (fileTree.children) {
    for(const child in fileTree.children) {
      getSummary(fileTree.children[child], summary);
    }
  }

  return summary;
}

class Display {
  displayFiles(fileTree, rootPath) {
    const archyFriendlyTree =
      convertToArchyFriendly(fileTree, rootPath);

    const treeOutput = archy(archyFriendlyTree);

    const summary = getSummary(fileTree);

    return `${treeOutput}\n${summary.directoryCount} directories, ${summary.fileCount} files\n`;
  }
}

module.exports = Display;
