'use strict';

const events = require('events');
const fs = require('fs');

class FileSystemSource extends events.EventEmitter
{
  constructor() {
    super();
  }

  readFiles(path) {
    fs.readdir(path, (err, data) => {
      // TODO: error handling
    });
  }

  _handleDataCallbacks(data) {
    this.emit('data', data);
  }

  _handleDoneCallbacks() {
    this.emit('done');
  }

  _handleErrorCallbacks(error) {
    // if we're just not in a git repo, just emit done
    if (error.match(/Not a git repository/)) {
      this.emit('notsupported');
    } else {
      this.emit('error', error);
    }
  }
}

module.exports = FileSystemSource;
