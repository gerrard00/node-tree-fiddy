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

class Display {
  displayFiles(fileTree) {
    const archyFriendlyResult = convertToArchyFriendly(fileTree, '.');
    console.log(archy(archyFriendlyResult));
  }
}

module.exports = Display;
