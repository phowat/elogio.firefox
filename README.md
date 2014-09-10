elogio.firefox
==============

Firefox addon for Elog.io

## Building

Most convenient way to build the extension is via Grunt, the JS task runner. http://gruntjs.com/

### Pre-requisites

You need to have following installed:

 * **node.js** - http://nodejs.org/ As soon as you have it installed, you should have npm (node package manager) in your
   shell.
 * **python** - https://www.python.org/download/releases/2.7.8/ The 2.5+ version is required, the 3 for is not working. Python
   is required for the Mozilla SDK to function.
   * On unix-like systems, you may encounter an issue - since they allow python 2.x installed together with python 3.x,
     the python executable may be called `python2`. As a result, the SDK will try to run off version 3, since it expects
     the python to be called `python`, which is currently version 3.
     To work around the issue, please check the Arch wikipage: https://wiki.archlinux.org/index.php/python#Dealing_with_version_problem_in_build_scripts
 * **grunt** - assuming you have `npm` in your `$PATH`, as root, type in `npm install -g grunt-cli`. This installs you a `grunt-cli`,
   so you should now have `grunt` command on your shell too.
 * **bower** - bower is used to manage dependencies. In order to install it, run `npm install -g bower`.

There is no need to manually download and install the Mozilla SDK or any other third parties, the build system
does this for you.

### Building and running extension with grunt

Navigate to the source root (folder containing this README).

Before you run any grunt tasks, you need `npm` to download grunt itself and its dependencies (specified in package.json).
`npm install`. Npm will download all the required packages for you.

Here you can do following:

 * `grunt lint` - runs the jshint process with the appropriate check rules for the chrome and injected pieces.
 * `grunt bower` - downloads bower-managed dependencies used in extension.
 * `grunt run` - runs the extension in browser (basically, comes down to `cfx run` command in the end).
 * `grunt dist-debug` - in the `dist` folder, creates a packaged extension (XPI) ready to be passed over. The sources
   are not processed anyhow. Surely, this implies the lint check also passes.
 * `grunt dist-minified` - pretty same as `dist-debug`, except for that the sources were minified and obfuscated, to make
   the downloadable XPI minimal. Same location.


## Development notes

Please refer to the appropriate page - [Development section](Development.md). In short, you'll need the very same environment as for building
plus a text editor.

