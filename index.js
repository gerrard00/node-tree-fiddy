'use strict';
// commands : git ls-files && git ls-files --other --exclude-standard

const spawn = require('child_process').spawn;
const split2 = require('split2');
const archy = require('archy');

const result = {};
let completeProcesses = 0;

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

function addEntry(entry) {
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

function processComplete() {
  if (++completeProcesses === 2) {
    const archyFriendlyResult = convertToArchyFriendly(result, '.');
    // console.log(JSON.stringify(archyFriendlyResult, null, 4));
    console.log(archy(archyFriendlyResult));
  }
}

function executeCommand(extraArguments) {
  const args = ['ls-files'];

  if (extraArguments) {
    args.push(...extraArguments);
  }

  const ls = spawn('git', args);
  ls.stdout
    .pipe(split2())
    .on('data', addEntry);

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    if (code !== 0) {
      // TODO: do something
      console.error('Uh oh');
      return;
    }

    processComplete();
  });
}

executeCommand();
executeCommand(['--other', '--exclude-standard']);

