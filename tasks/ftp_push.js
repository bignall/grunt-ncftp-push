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
//require('grunt-shell');

module.exports = function (grunt) {
  'use strict';

  var basepath,
      options,
      shellOptions,
      done,
      running = false,
      watcherStarted = false,
      startNcftp = null;

  /**
  * Based off of whats in the options, create a credentials object
  * @param {object} options - grunt options provided to the plugin
  * @return {object} {username: '...', password: '...'}
  */
  /*
  var getCredentials = function getCredentials(gruntOptions) {
    if (gruntOptions.authKey && grunt.file.exists('.ftpauth')) {
      return JSON.parse(grunt.file.read('.ftpauth'))[gruntOptions.authKey];
    } else if (gruntOptions.username && gruntOptions.password) {
      return { username: gruntOptions.username, password: gruntOptions.password };
    } else {
      // Warn the user we are attempting an anonymous login
      grunt.log.warn(messages.anonymousLogin);
      return { username: null, password: null };
    }
  };
	*/

  /**
  * Helper function that uses a recursive style for creating directories until none remain
  * @param {array} directories - Array of directory paths that will be necessary to upload files
  * @param {function} callback - function to trigger when all directories have been created
  */
  /*
  var pushDirectories = function pushDirectories(directories, callback) {
    var index = 0;

    /**
    * Recursive helper used as callback for server.raw.mkd
    * @param {error} err - Error message if something went wrong
    * /
    var processDir = function processDir (err) {
      // Fail if any error other then 550 is present, 550 is Directory Already Exists
      // these directories must exist to continue
      if (err) {
        if (err.code !== 550) { grunt.fail.warn(err); }
      } else {
        grunt.log.ok(messages.directoryCreated(directories[index]));
      }

      ++index;
      // If there is more directories to process then keep going
      if (index < directories.length) {
        server.raw.mkd(directories[index], processDir);
      } else {
        callback();
      }
    };

    // Start processing dirs or end if none are present
    if (index < directories.length) {
      server.raw.mkd(directories[index], processDir);
    } else {
      callback();
    }
  };
  */

  /**
  * Helper function that uses a recursive style for uploading files until none remain
  * @param {object[]} files - Array of file objects to upload, {src: '...', dest: '...'}
  */
  /*
  var uploadFiles = function uploadFiles(files) {
    var index = 0,
        file = files[index];

    /**
    * Recursive helper used as callback for server.raw.put
    * @param {error} err - Error message if something went wrong
    * /
    var processFile = function processFile (err) {
      if (err) {
        grunt.log.warn(messages.fileTransferFail(file.dest, err));
      } else {
        grunt.log.ok(messages.fileTransferSuccess(file.dest));
      }

      ++index;
      // If there are more files, then keep pushing
      if (index < files.length) {
        file = files[index];
        server.put(grunt.file.read(file.src, { encoding: null }), file.dest, processFile);
      } else {
        // Close the connection, we are complete
        server.raw.quit(function(quitErr) {
          if (quitErr) {
            grunt.log.error(quitErr);
            done(false);
          }
          server.destroy();
          grunt.log.ok(messages.connectionClosed);
          done();
        });
      }
    };

    // Start uploading files
    server.put(grunt.file.read(file.src, { encoding: null }), file.dest, processFile);
  };
	*/

  grunt.registerMultiTask('ncftp_push', 'Transfer files using FTP.', function() {

    var files,
        commands,
        callback;

    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      //incrementalUpdates: true,
      // autoReconnect: true,
      // reconnectLimit: 3,
      //hideCredentials: false,
      //keepAlive: 60000
			dest: '', // Destination directory on server
			srcBase: '', // Source base to trim from files
			authFile: '.ftpauth', // File to get ftp account info from
			redial: 3, // Maximum retry attempts
			ncftp: '', // Path to ncftpput
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
    // Get Credentials
    //creds = getCredentials(options);
    // Get list of file objects to push, containing src & dest properties
    files = utils.getFilePaths(basepath, options.srcBase, this.files);
    //- Only get changes if incrementalUpdates is on
    /*
    if (options.incrementalUpdates) {
      // Filter these files based on whether or not they have been updated since the last push
      updated = utils.updateCacheGetChanges(cache.get(), files);
      // set the cache and grab the updated files list
      files = updated.files;
      cache.set(updated.cache);
    }
    */
    // Get a list of the required directories to push so the files can be uploaded
    // getDirectoryPaths takes an array of strings, get a string[] of destinations
    /*
    destinations = utils.getDestinations(files);
    dirs = utils.getDirectoryPaths(destinations);
    */
    // Create the FileServer
    /*
    server = new Ftp({
      host: options.host,
      port: options.port || 21,
      debugMode: options.debug || false
    });

    // set keep alive
    server.keepAlive(options.keepAlive);
     */
    // Log if in debug mode
    /*
    if (options.debug) {
      server.on('jsftp_debug', function(eventType, data) {
        grunt.log.write(messages.debug(eventType));
        grunt.log.write(JSON.stringify(data, null, 2));
      });
    }
    */

    // If there are no files to push, bail now
    if (files && files.length === 0) {
      grunt.log.writeln(messages.noNewFiles);
      done();
    }

    // Authenticate with the server and begin pushing files up
    /*
    server.auth(creds.username, creds.password, function(err) {
      // Use <username> in out put if they chose to hide username
      var usernameForOutput = options.hideCredentials ? '<username>' : creds.username;
      // If there is an error, just fail
      if (err) {
        grunt.fail.fatal(messages.authFailure(usernameForOutput));
      } else {
        grunt.log.ok(messages.authSuccess(usernameForOutput));
      }
      // Push directories first
      pushDirectories(dirs, function () {
        // Directories have successfully been pushed, now upload files
        uploadFiles(files);
      });

    });
		*/
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

    //grunt.event.emit('ncftp_finish');
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
