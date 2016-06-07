'use strict';

const events = require('events');
const spawn = require('child_process').spawn;
const split2 = require('split2');
let foo;


function executeCommand(gitSource, extraArguments) {
  const args = ['ls-files'];

  if (extraArguments) {
    args.push(...extraArguments);
  }

  const ls = spawn('git', args);
  ls.stdout
    .pipe(split2())
    .on('data', data => {
      gitSource._handleDataCallbacks(data);
    });


  ls.stderr.on('data', (data) => {
    gitSource._handleErrorCallbacks(data);
  });

  ls.on('close', (code) => {
    if (code !== 0) {
      // TODO: do something
      console.error('Uh oh');
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
  }

  readFiles() {
    this.numberOfCommandsProcessed = 0;
    executeCommand(this);
    executeCommand(this, ['--other', '--exclude-standard']);
  }

  _handleDataCallbacks(data) {
    this.emit('data', data);
  }

  _handleDoneCallbacks() {
    if (++this.numberOfCommandsProcessed === this.numberOfCommandsToProcess) {
      this.emit('done');
    }
  }

  _handleErrorCallbacks(error) {
    // TODO: do something
    console.error(error);
  }
}

module.exports = GitSource;
