# node-tree-fiddy

# Don't use this, you can easily setup a shell alias: https://gist.github.com/gerrard00/405266273b22c81e3cfa9241608de05f


The tree utility is very useful, unless you are in a folder that contains something like a node project. When used in a folder like that you just wind up seeing hundreds of files from your node_modules folder. This is a hacky replacement that does not show ignored files based on your .gitignore file.

<a href="https://asciinema.org/a/ddgtztnvdk9emwsvqfmj0tlxr" target="_blank"><img src="https://asciinema.org/a/ddgtztnvdk9emwsvqfmj0tlxr.png" /></a>

At this point it's in a super alpha state. I'll keep improving it as time allows.

## Usage

```sh
# install yo
npm install --global tree-fiddy

# run it
node-tree-fiddy .
```

You may want to setup an alias to use tree-fiddy instead of tree:

```sh
alias tree='node-tree-fiddy'
```
