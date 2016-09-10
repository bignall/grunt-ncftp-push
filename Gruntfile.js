/*
 * grunt-ncftp-push
 * https://bignall.github.io/grunt-ncftp-push/
 *
 * Copyright (c) 2016 Rosina Bignall
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';
  // Project configuration.
  grunt.initConfig({

    ncftp_push: {
      default: {
        options: {
    			dest: '', // Destination path on ftp server
    			srcBase: '', // Source base to trim from files
    			authFile: '.ftpauth', // File to get ftp account info from
    			redial: 3, // Maximum retry attempts
        	ncftp: '', // Path to ncftpput
    			debug: false, // Log debug info?
    			debugFile: 'stdout', // file to log debug info to if enabled
    			shellOptions: {} // options to pass to the shell task
        },
        files: [ // Enable Dynamic Expansion, Src matches are relative to this path, Actual Pattern(s) to match
          {expand: true, cwd: 'files/nested/another', src: ['*.js'], dest: './files/js'},
          {expand: true, cwd: './', src: ['files/js/**/*.js']}
        ]
      },

      sample: {
        options: {
          debug: true // Show Debugging information
        },
        files: [
          {expand: true, cwd: './', src: ['files/nested/another/sample.js']}
        ]
      },

      local: {
        options: {
        	authFile: '.ftpauth.local' // You've created a local ftpauth file
        },
        files: [
          {expand: true, cwd: './', src: ['files/js/**/*.js']}
        ]
      }

    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['ncftp_push:default']);
  grunt.registerTask('sample', ['ncftp_push:sample']);
  grunt.registerTask('local', ['ncftp_push:local']);

};
