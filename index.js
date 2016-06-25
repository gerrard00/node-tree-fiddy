#!/usr/bin/env node

const GitSource = require('./src/GitSource');
const FileSystemSource = require('./src/FileSystemSource');
const tree = require('./src/tree');

const targetPath = (process.argv.length == 3) ?
  process.argv[2] : '.';

// sources in priority order
const sources = [ new GitSource(), new FileSystemSource() ];

tree(sources, targetPath)
  .then(output => console.log(output))
  .catch(err => {
    console.error(err);
    process.exit(-1);
  });
