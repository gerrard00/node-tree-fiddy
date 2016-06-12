const tree = require('./src/tree');

const targetPath = (process.argv.length == 3) ?
  process.argv[2] : '.';

tree(targetPath);
