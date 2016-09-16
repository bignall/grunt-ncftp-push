/*eslint-disable*/
module.exports = {
  optionsUsername: {
    host: 'sample.server.com',
    dest: '/html/test/',
    username: 'myUsername',
    password: 'myPassword',
    debug: true
  },
  optionsAuthKey: {
    authKey: 'serverA',
    host: 'sample.server.com',
    dest: '/html/test/',
    port: 21
  },
  optionsInvalid: {
    authKey: 'serverA',
    dest: '/html/test/',
    port: 21
  },
  validCwdTest: {
    filepath: 'foo/bar/baz/index.js',
    cwd: 'foo/bar',
    result: '/baz/index.js'
  },
  invalidCwdTest: {
    filepath: 'foo/bar/baz/index.js',
    cwd: 'baz/ball',
    result: 'foo/bar/baz/index.js'
  },
  arrayMatch: {
    files: [{
      'src': ['test/files/Test.txt', 'test/files/Test2.txt'],
      'dest': '/html/test/files/Test.txt'
    }, {
      'src': ['test/files/js/alert.js'],
      'dest': '/html/test/files/js/alert.js'
    }, {
      'src': ['tasks/utils.js'],
      'dest': '/html/test/test/utils.js'
    }],
    uniqueSrc: 'test/files/js/console.js',
    duplicateSrc: 'test/files/Test.txt',
    uniqueDest: '/html/test/files/DoesNotExist.txt',
    duplicateDest: '/html/test/test/utils.js'
  },
  /*
    We should never encounter bad filepaths like this, but just in case, lets make sure we can handle it.
    This should create a situation where empty strings or duplicates could find their way in
  */
  dirPathBad: {
    files: [
      '/foo//bar/baz/doo/index.js',
      '/foo/bar/baz/doo/index.js',
      '//foo/wat/baz/doo/index.js'
    ],
    expected: [
      '/foo',
      '/foo/bar',
      '/foo/bar/baz',
      '/foo/bar/baz/doo',
      '/foo/wat',
      '/foo/wat/baz',
      '/foo/wat/baz/doo',
    ]
  }
};
