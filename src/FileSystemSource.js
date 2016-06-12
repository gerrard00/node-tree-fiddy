'use strict';

const events = require('events');
const fs = require('fs');
const path = require('path');

function walkDirectory(fsSource, targetPath, rootPath) {
  const entries = [];
  let isRoot = !rootPath;

  if (isRoot) {
    rootPath = targetPath;
  }

  const files = fs.readdirSync(targetPath);
   
  for (let file of files) {
    const fullPath = path.join(targetPath, file);
    entries.push(fullPath);

    if(fs.statSync(fullPath).isDirectory()) {
        const childEntries = walkDirectory(fsSource, fullPath, rootPath); 
        //TODO: we really need to process the full chain, could have git children
        entries.push(...childEntries);
    }
  }

  return entries;
}

class FileSystemSource extends events.EventEmitter
{
  constructor() {
    super();
  }

  readFiles(targetPath) {
    const entries = walkDirectory(this, targetPath);

    for(let entry of entries) {
      this.emit('data', path.relative(targetPath, entry));
    }

    this.emit('done');
  }
}

module.exports = FileSystemSource;
