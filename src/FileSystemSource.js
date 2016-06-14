'use strict';

const fs = require('fs');
const path = require('path');

//TODO: interdependency, send this in as an argument
const GitSource = require('./GitSource');
const gitSourceInstance = new GitSource();

function *walkDirectory(fsSource, targetPath, rootPath) {
  const entries = [];
  let isRoot = !rootPath;

  if (isRoot) {
    rootPath = targetPath;
  }

  const files = fs.readdirSync(targetPath);

  for (let file of files) {
    const fullPath = path.join(targetPath, file);
    const relativePath = path.relative(rootPath, fullPath);
    entries.push(relativePath);

    if(fs.statSync(fullPath).isDirectory()) {
      // check for a .git sub-folder
      let isRepo = false;

      try {
        // will throw if no git sub-folder
        fs.statSync(path.join(fullPath, '.git'));
        isRepo = true;
      } catch(err) {
        // only catch ENOENT
        if (err.toString().match(/ENOENT/)) {
          isRepo = false;
        } else {
          throw err;
        }
      }

      let childEntries;

      if (isRepo) {
        // try to get results from git, may get nothing
        childEntries = yield gitSourceInstance.readFiles(fullPath);

        // if we got git entries, add the relative path as a prefix
        if (childEntries) {
          childEntries =
            childEntries.map(entry =>
              path.join(relativePath, entry));
        }
      }

      // if we got here it's not a repo, or we had a git problem
      if (!childEntries) {
        childEntries = yield *walkDirectory(fsSource, fullPath, rootPath);
      }

      entries.push(...childEntries);
    }
  }

  return entries;
}

class FileSystemSource
{
  *readFiles(targetPath) {
    const entries = yield walkDirectory(this, targetPath);

    return entries;
  }
}

module.exports = FileSystemSource;
