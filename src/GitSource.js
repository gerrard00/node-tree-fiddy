'use strict';

const spawn = require('child_process').spawn;
const split2 = require('split2');

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

    ls.on('close', (code) => {
      if (errorBuffers.length > 0) {
        const errorString = Buffer.concat(errorBuffers).toString();
        return reject(errorString);
      }

      // TODO: 128 seems to happen for not a git repo, but it's only for that error.
      // ignore exit codes for now
      // if (code !== 0 && code != 128) {
      //   return reject(`Bad exit code ${code}`);
      // }

      resolve(dataBuffers);
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
      return [...trackedResults, ...untrackedResults];
    } catch (err) {
      // not a repo, return null
      if(err.toString().match(/Not a git repository/)) {
        return null;
      }

      throw err;
    }
  }
}

module.exports = GitSource;
