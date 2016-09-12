# grunt-ncftp-push [![NPM version](https://badge.fury.io/js/grunt-ncftp-push.png)](https://badge.fury.io/js/grunt-ncftp-push) [![Build Status](https://travis-ci.org/bignall/grunt-ncftp-push.svg?branch=master)](https://travis-ci.org/bignall/grunt-ncftp-push) [![Coverage Status](https://coveralls.io/repos/github/bignall/grunt-ncftp-push/badge.svg?branch=master)](https://coveralls.io/github/bignall/grunt-ncftp-push?branch=master) [![dependencies](https://david-dm.org/bignall/grunt-ncftp-push.png)](https://david-dm.org/bignall/grunt-ncftp-push) [![Analytics](https://ga-beacon.appspot.com/UA-44748521-8/grunt-ncftp-push/readme)](https://github.com/igrigorik/ga-beacon) [![License](https://img.shields.io/npm/l/grunt-ncftp-push.svg?style=plastic)](LICENSE)

> Deploy your files to a FTP server <br>

## Getting Started
### Requirements
Grunt `~0.4.5`<br>
[Ncftp](http://ncftp.com/)

#### Optional Requirements

Grunt watch

[![NPM](https://nodei.co/npm/grunt-ncftp-push.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/grunt-ncftp-push/)

### Install

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ncftp-push --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ncftp-push');
```

## Usage

Grunt-ncftp-push adds two grunt taks you can use.

### The "ncftp_push" task

#### Overview

The `ncftp_push` task pushes all the files given to it to the ftp server.  Usually you would use this to upload your entire project or parts of your project to the ftp server at once.  

#### Usage
In your project's Gruntfile, add a section named `ncftp_push` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ncftp_push: {
    all: {
      options: {
        dest: 'destination/directory/on/ftp/server'
      },
      files: [{expand: true, src: ['trunk/*', '!trunk/composer*']}]
    }
  }
})
```

#### Options

All options are optional but you'll at least want to specify a destination directory
otherwise it will go to the root directory of the ftp account.

##### dest
Type: `String`<br>
Default: `/`<br>
Required: false

Destination of where you want your files pushed to, relative to the host.

##### srcBase
Type: `String`<br>
Default: ``<br>
Required: false

Base of your source files relative to the project base that you want trimmed
from the file names prior to uploading them to make the filename correct relative
to the dest.

##### authFile
Type: `String`<br>
Default: `.ftpauth`<br>
Required: false

File to get the destination host and authorization credentials from. Default filename is `.ftpauth`.  File should be in the following format:

```txt
host my.hostname.com
user myUsername
pass myPassword
```

Note that spacing is important and lines starting with # and blank lines will be ignored. For more information on this file see the ncftp docs.

##### redial
Type: `Integer`<br>
Default: 3<br>
Required: false 

Maximum number of retry attempts

##### ncftpPath
Type: `String`<br>
Default: ``<br>
Required: false

Path to the ncftpput command. `` means that the command can be executed without specifying a path. If a path is used it must contain the trailing slash.

##### join
Type: `String`<br>
Default: `&&`<br>
Required: false

How to join the commands together when there are multiple files. Options are `&&`, `&`, and `;`. The default is `&&` which means only run the next command if the previous one succeeded. `;` will run the commands sequentially and `&` will run the commands concurrently. Running the commands concurrently is usually not a good idea since most ftp servers have limits on concurrent connections. See the documentation for grunt-shell for more information on these options.

##### shellOptions
Type: `Object`<br>
Default: {} <br>
Required: false

Additional options to pass to the grunt-shell task. See the documents for grunt-shell for more information on the options that can be included.

##### debug
Type: `Boolean`<br>
Default: `false`<br>
Required: false

Enable debug mode for the ncftpput command to allow for verbose messages.  This can be useful if the commands are failing and you can't see why. The entire conversation with the server will be output. See the ncftp documentation for more information.

##### debugFile
Type: `String`<br>
Default: `stdout`<br>
Required: false

File to send the debug info to if debug is true. The special string `stdout` means it will be sent to the terminal.

### The "ncftp_watch" task

#### Overview 

The `ncftp_watch` task is meant to be used with `grunt watch`. It pushes changed files to the server when the `watch` event fires.  If one task is already running it will keep track of the changed files and run another task when the current one is finished.

#### Usage
In your project's Gruntfile, add a section named `ncftp_watch` to the data object passed into `grunt.initConfig()`. Also add a sub-task to the `watch` task in your grunt config that runs the `ncftp_watch` task.

```js
grunt.initConfig({
  watch: {
    ncftp_watch: {
      files: [ 'trunk/**/*', '!trunk/composer*'],
      tasks: ['ncftp_watch'],
      options: {
        atBegin: true,
        spawn: false,
        debounceDelay: 500
      }
    }
  },
  ncftp_watch: {
      options: {
        dest: 'wp-content/plugins/credit-helper-elite',
        srcBase: 'trunk/'
      },
      files: ['trunk/**', '!trunk/composer*']
    }
  }
})
```

#### `ncftp_watch` Options

The `ncftp_watch` task can have all the same options as the `ncftp_push` task.  These options will be used in configuring an `ncftp_push:watch` task which will be started up as needed. 

The files given to this task will be used to match against changed files so that only files that match these patterns are uploaded to the server.

#### `watch` `ncftp_watch` Options

The `ncftp_watch` sub-task of the `watch` task is a typical `watch` task.  

You should include `atBegin: true` so that the `ncftp_watch` command runs when `grunt watch` first starts up. This sets up the watchers to catch the changed files and keep track of whether the `ncftp_push:watch` task is queued, and start it up if there are already changed files (there shouldn't be at this point, so the `ncftp_push:watch` task won't run at this point). If you don't set `atBegin` to true the watchers will start up the first time the `ncftp_watch` task is run, but any changed files that came before that run will not be uploaded. 

`spawn` must be set to false. The `ncftp_watch` task must run in the same process as the `watch` task so that it can capture `watch` events and internal `ncftp_start` and `ncftp_finish` events emmitted by the `ncftp_push` task. 

`debounceDelay` can be set to whatever works for you but the default `500` seems to work well (so it can technically be left off).

The `ncftp_watch` task should be your last `watch` task. This way it can capture all changed files from tasks that came before it and run an additional `ncftp_push:watch` task if there are any remaining changed files that haven't been pushed to the server yet when it runs (usually the watchers will have taken care of this so it won't start at this point).  

When you make changes to a file that causes changes to other files to be made by other watch tasks you will typically see the `ncftp_push:watch` task run multiple times.  This is because the event watcher catches the files and queues up an `ncftp_push:watch` task, then more changed files are caught while that task is waiting to be run, so when that `ncftp_push:watch` task finishes another one is queued. More files may be caught after that task is queued so it can happen again. As long as there are changed files in the queue it will queue another task each time the previous one finishes. 

This can also be useful to configure livereload to automatically reload your web page when files are changed. Just add `livereload: true` to the options. Check out the `grunt watch` documentation about configuring and using livereload.

### Usage Examples

#### Sample .ftpauth file

This file's default name is `.ftpauth` and is in the same directory as your `Gruntfile.js`.  You should add this file to your `.gitignore` so that it is not uploaded to your git repository or specify another file that is not in your project path.

The format of this file is specified by `ncftp` and more documentation on it can be found in the `ncftp` docs. It contains the hostname, username and password for the destination ftp server.

```txt
host my.hostname.com
user myUsername
pass myPassword
```

#### Extras
You can specify a destination inside your files objects like so:
```js
{expand: true,cwd: 'test',src: ['**/*']},
{expand: true,cwd: 'tasks',src: ['**/*'], dest: 'test/' }
```
This will allow you to configure where you push your code in case you want to push to a diretory structure that is different from your local one.  The dest here <strong>MUST</strong> be relative to the root destination.

Source files can be individual files or they can be directories. Directories will be pushed recursively so all files and other directories within that directory will be pushed to the destination.  So if you want to include an entire directory to upload do it like so:

```js
{expand: true, src: ['mydirectory']}
```

This works only for the `ncftp_push` task. The `ncftp_watch` task can only have one destination since files come from the `watch` events.

### Notes
The output from `ncftpput` appears in the terminal twice. I don't believe the commands are being run twice it's just output twice. It has something to do with `grunt-shell`. I welcome any suggestions for how to solve it but for now it will just be there twice.

## Dependencies
This plugin uses Sindre Sorhus [`grunt-shell`](https://github.com/sindresorhus/grunt-shell) module.

## To do
Combine files with the same destination to a single `ncftpput` command.

## Acknowledgements
This module was originally based on the `grunt-ftp-push` module by Robert Winterbottom and many of the utility functions are the same or very similar but the task code is now very different.

## Contributing
Fork the repo. Make your changes then submit a pull request.

Please add unit tests in the root of the test folder for any new or changed functionality and please try to make sure that `npm test` will pass before submitting a pull request.

Thanks for contributing!

## Release History
<ul>
<li>2016/09/11 Initial release
</ul>
