/*
 * grunt-ncftp-push
 * https://bignall.github.io/grunt-ncftp-push/
 *
 * Copyright (c) 2016 Rosina Bignall
 * Licensed under the MIT license.
 */
var messages = require('./messages');
var utils = require('./utils');
var path = require('path');

module.exports = function (grunt) {
  'use strict';

  var basepath,
      options,
      shellOptions,
      done,
      running = false,
      watcherStarted = false,
      startNcftp = null;

  grunt.registerMultiTask('ncftp_push', 'Transfer files using FTP.', function() {

    var files,
        commands,
        callback;

    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      dest: '/', // Destination directory on server
      srcBase: '', // Source base to trim from files
      authFile: '.ftpauth', // File to get ftp account info from
      redial: 3, // Maximum retry attempts
      ncftpPath: '', // Path to ncftpput
      debug: false, // Log debug info?
      debugFile: 'stdout', // file to log debug info to if enabled
      join: '&&', // How to run the processes when there are multiple files
      shellOptions: {} // options to pass to the shell task
    });

    // Tell Grunt not to finish until my async methods are completed, calling done() to finish
    done = this.async();

    // Check for minimum requirements
    if (!utils.optionsAreValid(options)) {
      grunt.log.warn(messages.invalidRequirements);
      done(false);
      return;
    }

    // If there are no files provided, bail out with a warning
    if (this.files.length === 0) {
      grunt.log.warn(messages.noFiles);
      done(false);
      return;
    }

    // Remove invalid paths from this.files
    this.files.forEach(function (file) {
      file.src = file.src.filter(function (filepath) {
        // If the file does not exist, remove it
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn(messages.fileNotExist(filepath));
          return false;
        }

        // Keep files and directories
        return grunt.file.isFile(filepath) || grunt.file.isDir(filepath);
      });
      file.info = file.src.map(function(filepath) {
        return {path: filepath, isDir: grunt.file.isDir(filepath)};
      });
    });

    // Basepath of where to push
    basepath = path.posix.normalize(options.dest);

    // Get list of file objects to push, containing src, dest and isDir properties
    files = utils.getFilePaths(basepath, options.srcBase, this.files);

    // If there are no files to push, bail now
    if (files && files.length === 0) {
      grunt.log.writeln(messages.noNewFiles);
      done();
    }

    // Let the world know we're running
    grunt.event.emit('ncftp_start', files);

    // Create the shell command
    commands = utils.createShellCommand(options, files);

    // run the shell command
    callback = options.shellOptions.callback;
    shellOptions = {command: commands.join(options.join), options: options.shellOptions};
    shellOptions.options.callback = function(err, stdout, stderr, cb) {
      grunt.event.emit('ncftp_finish');
      if (callback) {
        callback(err, stdout, stderr, cb);
      } else {
        cb(err);
      }
    };
    grunt.config('shell.ncftp', shellOptions);
    grunt.task.run('shell:ncftp');

    done();
  });

  grunt.registerTask('ncftp_watch', 'Use with watch to capture file changes', function() {
    // Start up the watcher if it hasn't already been started
    if (!watcherStarted) {
      var changedFiles = Object.create(null),
        fileFilter = grunt.config.get('ncftp_watch').files;

      grunt.config('ncftp_push.watch.options', this.options());

      startNcftp = function()
      {
        if (!running && Object.keys(changedFiles).length)
        {
          running = true;
          var files = Object.keys(changedFiles).map(function(file)
            {
              return {expand: true, src: file};
            });

          grunt.config('ncftp_push.watch.files', files);
          grunt.task.run('ncftp_push:watch');
          } else {
            running = false;
          }
      };

      grunt.event.on('watch', function(action, filepath) {
        if (fileFilter && grunt.file.isMatch(fileFilter, filepath))
        {
          changedFiles[filepath] = action;
          if (!running)
          {
            startNcftp();
          }
        }
      });

      grunt.event.on('ncftp_start', function(files) {
        running = true;
        Object.keys(changedFiles).forEach(function(filepath) {
          if (utils.arrayContainsFile(files, filepath)) {
            delete changedFiles[filepath];
          }
        });
      });

      grunt.event.on('ncftp_finish', function() {
        running = false; startNcftp();
      });

      watcherStarted = true;
    }

    // In case we were started because files changed, start running
    if (!running) {
      startNcftp();
    }
  });

};
