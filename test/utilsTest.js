var fileMocks = require('./mocks/fileObjects');
var mocks = require('./mocks/utilMocks');
var utils = require('../tasks/utils');
var expect = require('chai').expect;

describe('ncftp_push - utils.optionsAreValid', function () {
  'use strict';

  it('should always return true', function () {
    expect(utils.optionsAreValid(mocks.optionsUsername)).to.be.true;
    expect(utils.optionsAreValid(mocks.optionsAuthKey)).to.be.true;
  });

  /*
  it('should return false if either host or dest are not in the provided options', function () {
    expect(utils.optionsAreValid(mocks.optionsInvalid)).to.be.false;
  });
	*/
});

describe('ncftp_push - utils.trimCwd', function () {
  'use strict';

  it('should return the filepath minus the cwd provided if the cwd provided is at the beginning of the filepath', function () {
    expect(utils.trimCwd(mocks.validCwdTest.filepath, mocks.validCwdTest.cwd)).to.equal(mocks.validCwdTest.result);
  });

  it('should return the filepath if the cwd provided is not at the beginning of the path', function () {
    expect(utils.trimCwd(mocks.invalidCwdTest.filepath, mocks.invalidCwdTest.cwd)).to.equal(mocks.invalidCwdTest.result);
  });

  it('should return the filepath if a cwd is not provided or undefined', function () {
    expect(utils.trimCwd(mocks.invalidCwdTest.filepath)).to.equal(mocks.invalidCwdTest.result);
  });

});

describe('ncftp_push - utils.arrayContainsSrcFile', function () {
  'use strict';

  it('should return true when passed a souce and an array of files containing that source', function () {
    expect(utils.arrayContainsSrcFile(mocks.arrayMatch.files, mocks.arrayMatch.duplicateSrc)).to.be.true;
  });

  it('should return false when passed a source and an array of files that does not have that source', function () {
    expect(utils.arrayContainsSrcFile(mocks.arrayMatch.files, mocks.arrayMatch.uniqueSrc)).to.be.false;
  });

});

describe('ncftp_push - utils.getPathWithDest', function () {
  'use strict';

  it('should return a filePath object when the destination is contained in the array', function () {
    var file = mocks.arrayMatch.duplicateDest;
    var expected = mocks.arrayMatch.files[2];
    var result = utils.getPathWithDest(mocks.arrayMatch.files, file);
    expect(result).to.equal(expected);
  });

  it('should return undefined when the destination is not contained in the array', function () {
    var file = mocks.arrayMatch.uniqueDest;
    var result = utils.getPathWithDest(mocks.arrayMatch.files, file);
    expect(result).to.not.exist;
  });
});


describe('ncftp_push - utils.getFilePaths', function () {
  'use strict';

  it('should return an array of normalized filepaths', function () {
    var results = utils.getFilePaths(fileMocks.test.base, '', fileMocks.test.files);
    expect(results.length).to.equal(fileMocks.test.paths.length);
    results.forEach(function (file) {
      expect(file.src).to.exist;
      expect(file.dest).to.exist;
      expect(file.isDir).to.exist;
      file.src.forEach(function (src){
        expect(utils.arrayContainsSrcFile(fileMocks.test.paths, src)).to.be.true;
      });
    });
  });

  it('should accomodate relative destinations specified at the file level to be included in paths', function () {
    var file = fileMocks.test.files[4];
    var expected = fileMocks.test.relativeDestResult;
    var result = utils.getFilePaths(fileMocks.test.base, '', [file])[0];
    expect(result.dest).to.equal(expected.dest);
    expect(result.dest).to.not.equal(expected.badPath);
  });

  it('should remove the current working directory from the filepath', function () {
    var file = fileMocks.test.files[0];
    var result = utils.getFilePaths(fileMocks.test.base, '', [file])[0];
    // First remove the base from the path, as we dont need to test the basepath, just the relative file path
    // and the basepath may contain a directory similar to the cwd which would skew the results
    var relativePath = result.dest.replace(fileMocks.test.base, '');
    expect(relativePath.search(file.orig.cwd)).to.equal(-1);
  });

  it('should not contain any duplicates', function () {
    var results = utils.getFilePaths(fileMocks.test.base, '', fileMocks.test.files);
    expect(results.length).to.equal(fileMocks.test.paths.length);

    var allUnique = results.every(function (file, firstIndex) {
        return results.every(function (file2, secondIndex) {
          // Return true if the destinations are not the same or if the index
          // is the same because that means its the same file
          return file.src !== file2.src || firstIndex === secondIndex;
        });
    });
    expect(allUnique).to.be.true;
  });

  it('should remove the srcBase from the file path', function() {
		var file = fileMocks.test.srcBaseFile;
		var expected = fileMocks.test.srcBaseResult;
		var result = utils.getFilePaths(fileMocks.test.base, fileMocks.test.srcBase, [file]);
		expect(result.length).to.equal(1);
		expect(result[0].dest).to.equal(expected.dest);
  });

});

describe('ncftp_push - utils.createShellCommand', function () {
  'use strict';

  it('should return command using the default options and file passed into it', function () {
	var expected = fileMocks.test.command[0];
	var results = utils.createShellCommand(fileMocks.test.options[0], [fileMocks.test.srcBaseResult]);
    expect(results.length).to.equal(expected.length);
    expect(results[0]).to.equal(expected[0]);
  });

  it('should return use the alternate auth path, no retries and default debug path from options and file passed into it', function () {
	var expected = fileMocks.test.command[1];
	var results = utils.createShellCommand(fileMocks.test.options[1], [fileMocks.test.srcBaseResult]);
    expect(results.length).to.equal(expected.length);
    expect(results[0]).to.equal(expected[0]);
  });

  it('should return use the alternate debug path from options and file passed into it', function () {
	var expected = fileMocks.test.command[2];
	var results = utils.createShellCommand(fileMocks.test.options[2], [fileMocks.test.srcBaseResult]);
    expect(results.length).to.equal(expected.length);
    expect(results[0]).to.equal(expected[0]);
  });

  it('should return use the default options and multiple files passed into it', function () {
	var expected = fileMocks.test.command[3];
	var results = utils.createShellCommand(fileMocks.test.options[0], [fileMocks.test.paths[0], fileMocks.test.paths[1]]);
	expect(results.length).to.equal(expected.length);
    expect(results[0]).to.equal(expected[0]);
    expect(results[1]).to.equal(expected[1]);
  });

  it('should use -R when directory is used', function () {
    var expected = fileMocks.test.command[4];
    var results = utils.createShellCommand(fileMocks.test.options[0], [fileMocks.test.dirFileResult]);
    expect(results.length).to.equal(expected.length);
    expect(results[0]).to.equal(expected[0]);
  });

  it('should use specify multiple files when multiple src files are defined', function () {
    var expected = fileMocks.test.command[5];
    var results = utils.createShellCommand(fileMocks.test.options[0], [fileMocks.test.multipleSrcFileResult]);
    expect(results.length).to.equal(expected.length);
    expect(results[0]).to.equal(expected[0]);
  });
});

