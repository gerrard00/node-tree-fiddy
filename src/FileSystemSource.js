'use strict';

const fs = require('fs');
const path = require('path');
const Builder = require('./Builder');

//TODO: interdependency, send this in as an argument
const GitSource = require('./GitSource');
const gitSourceInstance = new GitSource();

function *walkDirectory(targetPath, builder, rootPath) {
  let isRoot = !rootPath;

  if (isRoot) {
    rootPath = targetPath;
  }

  const files = fs.readdirSync(targetPath);

  for (let file of files) {
    const fullPath = path.join(targetPath, file);
    const relativePath = path.relative(rootPath, fullPath);
    builder.addEntry(relativePath);

    if(fs.lstatSync(fullPath).isDirectory()) {
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

      let handledByGit = false;

      if (isRepo) {
        // try to get an object from git, may get nothing
        const gitObject = yield gitSourceInstance.readFiles(fullPath);

        // if we got git a gi object, add it to our builder
        if (gitObject) {
          handledByGit = true;
          builder.addEntry(relativePath, gitObject);
        }
      }

      // if we got here it's not a repo, or we had a git problem
      if (!handledByGit) {
        yield *walkDirectory(fullPath, builder, rootPath);
      }
    }
  }
}

class FileSystemSource
{
  *readFiles(targetPath) {
    const builder = new Builder();
    yield walkDirectory(targetPath, builder);

    const fileTree = builder.getOutput();
    return fileTree;
  }
}

module.exports = FileSystemSource;
