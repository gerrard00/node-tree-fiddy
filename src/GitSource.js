'use strict';

const events = require('events');
const spawn = require('child_process').spawn;
const split2 = require('split2');

function executeCommand(gitSource, path, extraArguments) {
  const args = ['ls-files'];
  const errorBuffers = [];

  if (extraArguments) {
    args.push(...extraArguments);
  }

  const ls = spawn('git', args, { cwd: path });
  ls.stdout
    .pipe(split2())
    .on('data', data => {
      gitSource._handleDataCallbacks(data);
    });


  ls.stderr.on('data', (data) => {
    errorBuffers.push(data);
  });

  ls.on('close', (code) => {
    if (errorBuffers.length > 0) {
      const errorString = Buffer.concat(errorBuffers).toString();
      gitSource._handleErrorCallbacks(errorString);
    }
    if (code !== 0) {
      // TODO: do something
      console.error(`Uh oh, bad exit code ${code}`);
      return;
    }

    gitSource._handleDoneCallbacks();
  });
}

class GitSource extends events.EventEmitter
{
  constructor() {
    super();
    this.numberOfCommandsToProcess = 2;
    this.isRepo = true;
  }

  readFiles(path) {

    this.numberOfCommandsProcessed = 0;
    executeCommand(this, path);
    executeCommand(this, path, ['--other', '--exclude-standard']);
  }

  _handleDataCallbacks(data) {
    this.emit('data', data);
  }

  _handleDoneCallbacks() {
    if (this.isRepo && 
        ++this.numberOfCommandsProcessed === 
          this.numberOfCommandsToProcess) {
      this.emit('done');
    }
  }

  _handleErrorCallbacks(error) {
    // if we're just not in a git repo, just emit done
    if (error.match(/Not a git repository/)) {
      if (this.isRepo) {
        this.isRepo = false;
        this.emit('notsupported');
      }
    } else {
      this.emit('error', error);
    }
  }
}

module.exports = GitSource;
