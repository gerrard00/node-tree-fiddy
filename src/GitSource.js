const split2 = require('split2');
const spawn = require('child_process').spawn;
const Builder = require('./Builder');

function executeCommand(path, extraArguments) {
  return new Promise((resolve, reject) => {
    const args = ['ls-files'];
    const dataBuffers = [];
    const errorBuffers = [];

    if (extraArguments) {
      args.push(...extraArguments);
    }

    const ls = spawn('git', args, { cwd: path });
    ls.stdout
      .pipe(split2())
      .on('data', data => {
        dataBuffers.push(data);
      });


    ls.stderr.on('data', (data) => {
      errorBuffers.push(data);
    });

    ls.on('close', () => {
      if (errorBuffers.length > 0) {
        const errorString = Buffer.concat(errorBuffers).toString();
        return reject(errorString);
      }

      return resolve(dataBuffers);
    });
  });
}

class GitSource
{
  constructor() {
    this.numberOfCommandsToProcess = 2;
    this.isRepo = true;
  }

  *readFiles(path) {
    try {
      const trackedResults =
        yield executeCommand(path);
      const untrackedResults =
        yield executeCommand(path, ['--other', '--exclude-standard']);

      if (!trackedResults || !untrackedResults) {
        throw new Error('Unexpected null results from git commands.');
      }

      const builder = new Builder();
      trackedResults.forEach(entry => builder.addEntry(entry));
      untrackedResults.forEach(entry => builder.addEntry(entry));

      const fileTree = builder.getOutput();
      return fileTree;
    } catch (err) {
      // not a repo, return null
      if (err.toString().match(/Not a git repository/)) {
        return null;
      }

      throw err;
    }
  }
}

module.exports = GitSource;
