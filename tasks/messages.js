module.exports = {
  invalidRequirements: 'You did not provide the minimum requirements.  Please refer to the following documentation for information. https://github.com/Robert-W/grunt-ftp-push#required-options',
  noNewFiles: 'No new files to push. If you want to force push all your files, set incrementalUpdates to true in your options.',
  noFiles: 'No files detected. Pleade check your configuration.',
  fileNotExist: function (path) { return 'Source file ' + path + ' not found.'; }
};
