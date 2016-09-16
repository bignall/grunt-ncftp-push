var path = require('path');

var utils = {
  /**
  * @description Check if the user has provided the required options
  * @param {object} options - No options are required
  * @return {bool} bool representing if the provided options are valid
  */
  optionsAreValid: function (options) {
    return typeof options === 'object';
  },

  /**
  * @description Trim the cwd from the filepath, so if cwd is foo and filepath is foo/bar/bacon.jam,
  *     trim off the foo and only return the bar/bacon.jam
  * @param {string} filepath - filepath we want to trim cwd from
  * @param {string} cwd - the cwd to remove from the beginning of the path
  * @return {string} filepath with the cwd removed or the provided path if the cwd is not valid
  */
  trimCwd: function (filepath, cwd) {
    if (typeof cwd === 'string' && filepath.substr(0, cwd.length) === cwd) {
      filepath = filepath.substr(cwd.length);
    }
    return path.posix.normalize(filepath);
  },

  /**
  * @description Takes an array of file objects and returns an array of file paths, This will need to do a few things
  *     it will need to trim cwd from paths, use optional relative destinations, and avoid duplicates
  * @param {string} basePath - Base path provided by options.dest
  * @param {string} srcBase - Source base for files, will be trimmed from files in creating destination
  * @param {object[]} files - Array of file objects found by grunt
  * @return {object[]} returns a complete array of file path objects, {src: '...', dest: '...'}
  */
  getFilePaths: function (basePath, srcBase, files) {
    var filePaths = [],
        destination;

    // Files must be of type array, if not, return an empty array
    if (Object.prototype.toString.call(files) !== '[object Array]') { return []; }

    files.forEach(function (file) {
      // For each src file we have
      file.info.forEach(function (info) {
        var filepath = info.path;
        // Make sure the path is normalized
        filepath = path.posix.normalize(filepath);
        // Trim the cwd from the path to prepare it for the destination
        destination = utils.trimCwd(filepath, file.orig.cwd);
        if (srcBase.length) {
          destination = utils.trimCwd(destination, srcBase);
        }
        // Set up the relative destination if one is provided
        if (file.orig.dest) {
          destination = path.posix.join(basePath, file.orig.dest, destination);
        } else {
          destination = path.posix.join(basePath, destination);
        }
        // Remove the filename from the destination
        destination = path.posix.dirname(destination);

        // If a the file src is not in the array, add the file, this matched on source
        if (!utils.arrayContainsSrcFile(filePaths, filepath)) {
          var filePath = utils.getPathWithDest(filePaths, destination);
          if (filePath) {
            filePath.src.push(filepath);
            filePath.isDir = info.isDir || filePath.isDir;
          } else {
            filePaths.push({
              src: [filepath],
              dest: destination,
              isDir: info.isDir
            });
          }
        }

      }); // Inner for-each

    }); // Outer for-each

    return filePaths;
  },

  /**
  * @description Takes an array [{src: ['..'], dest: "..", isDir: boolean} and a files source path and checks if the array contains it
  * @param {object[]} files - Array of FilePath Objects
  * @param {string} source - Source of the File
  * @return {boolean} whether or not the array of files contained a file with the same source
  */
  arrayContainsSrcFile: function (files, source) {
    return files.some(function (file) { return file.src.indexOf(source) !== -1; });
  },

  /**
   * @description Takes an array of filePaths and a destination path and returns the element containing it or undefined
   * @param {object[]} files - Array of FilePath objects
   * @param {string} destination - Destination path
   * return {object|undefined} element in the array containing the destination or undefined
   */
  getPathWithDest: function (files, destination) {
    return files.find(function(file) { return file.dest === destination; });
  },

  /**
   * @description Takes an options object and a array of file paths and creates the shell command
   * @param {object} options - ncftp_push options object
   * @param {array} files - array of file paths { src: '..', dest: '..' }
   * @return {string} the shell command to run
   */
  createShellCommand: function (options, files) {
    var command = [];
    files.forEach(function(file) {
      var recurse = (file.isDir) ? '-R' : '';
      command.push(options.ncftpPath + 'ncftpput ' + recurse
        + ' -m -f ' + options.authFile
        + ((options.redial) ? ' -r ' + options.redial : '')
        + ((options.debug) ? ' -d ' + options.debugFile : '')
        + ' ' + file.dest + ' ' + file.src.join(' '));
    });
    return command;
  }

};

module.exports = utils;
