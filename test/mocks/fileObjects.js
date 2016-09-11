/*eslint-disable*/
module.exports = {
  'test': {
    'files': [{
        "src": ['test/files/Test.txt'],
        "info": [{'path': 'test/files/Test.txt', 'isDir': false}],
        "orig": {
            "expand": true,
            "cwd": 'test',
            "src": ['**/*']
        },
        "dest": 'files/Test.txt'
    }, {
        "src": ['test/files/js/alert.js'],
        "info": [{'path': 'test/files/js/alert.js', 'isDir': false}],
        "orig": {
            "expand": true,
            "cwd": 'test',
            "src": ['**/*']
        },
        "dest": 'files/js/alert.js'
    }, {
        "src": ['test/files/nested/another/sample.js'],
        "info": [{'path': 'test/files/nested/another/sample.js', 'isDir': false}],
        "orig": {
            "expand": true,
            "cwd": 'test',
            "src": ['**/*']
        },
        "dest": 'files/nested/another/sample.js'
    }, {
        "src": ['tasks/ftp_push.js'],
        "info": [{'path': 'tasks/ftp_push.js', 'isDir': false}],
        "dest": 'tasks/ftp_push.js',
        "orig": {
            "expand": true,
            "cwd": 'tasks',
            "src": ['**/*'],
            "dest": 'test/'
        }
    }, {
        "src": ['tasks/utils.js'],
        "info": [{'path': 'tasks/utils.js', 'isDir': false}],
        "dest": 'tasks/utils.js',
        "orig": {
            "expand": true,
            "cwd": 'tasks',
            "src": ['**/*'],
            "dest": 'test/'
        }
    }],
    'paths': [{
      'src': 'test/files/Test.txt',
      'dest': '/html/test/files',
      'isDir': false
    }, {
      'src': 'test/files/js/alert.js',
      'dest': '/html/test/files/js',
      'isDir': false
    }, {
      'src': 'test/files/nested/another/sample.js',
      'dest': '/html/test/files/nested/another',
      'isDir': false
    }, {
      'src': 'tasks/ftp_push.js',
      'dest': '/html/test/test',
      'isDir': false
    }, {
      'src': 'tasks/utils.js',
      'dest': '/html/test/test',
      // This wont normally be in the results, but will use this to test to make sure the path is correct
      'badPath': '/html/test/tasks/utils.js',
      'isDir':false
    }],
    'srcBaseFile': {
    	'src': ['test/trunk/files/nested/another/sample.js'],
        "info": [{'path': 'test/trunk/files/nested/another/sample.js', 'isDir': false}],
    	'orig': {
    		'expand': true,
    		'cwd': 'test',
    		'src': ['**/*'],
    	},
    	'dest': 'nested/another/sample.js'
    },
    'srcBaseResult': {
    	'src': 'test/trunk/files/nested/another/sample.js',
    	'dest': '/html/test/files/nested/another',
    	'isDir': false
    },
    'dirFile': {
      'src': 'test/trunk/files/nested/another',
      "info": [{'path': 'test/trunk/files/nested/another', 'isDir': false}],
      'orig': {
          'expand': true,
          'cwd': 'test',
      },
      'dest': 'files/nested/another'
    },
    'dirFileResult': {
      'src': 'test/trunk/files/nested/another',
      'dest': '/html/test/files/nested',
      'isDir': true,
    },
    'base': '/html/test/',
    'srcBase': '/trunk',
    'options': [{
			'authFile': '.ftpauth', // File to get ftp account info from
			'redial': 3, // Maximum retry attempts
			'ncftpPath': '', // Path to ncftpput
			'debug': false, // Log debug info?
			'debugFile': 'stdout', // file to log debug info to if enabled
    }, {
			'authFile': '.altftpauth', // File to get ftp account info from
			'redial': 0, // Maximum retry attempts
			'ncftpPath': '/bin/', // Path to ncftpput
			'debug': true, // Log debug info?
			'debugFile': 'stdout', // file to log debug info to if enabled
    }, {
			'authFile': '.ftpauth', // File to get ftp account info from
			'redial': 3, // Maximum retry attempts
			'ncftpPath': '', // Path to ncftpput
			'debug': true, // Log debug info?
			'debugFile': '/tmp/debug.txt', // file to log debug info to if enabled
    }],
    'command': [
      ['ncftpput  -m -f .ftpauth -r 3 /html/test/files/nested/another test/trunk/files/nested/another/sample.js'],
      ['/bin/ncftpput  -m -f .altftpauth -d stdout /html/test/files/nested/another test/trunk/files/nested/another/sample.js'],
      ['ncftpput  -m -f .ftpauth -r 3 -d /tmp/debug.txt /html/test/files/nested/another test/trunk/files/nested/another/sample.js'],
      ['ncftpput  -m -f .ftpauth -r 3 /html/test/files test/files/Test.txt', 
       'ncftpput  -m -f .ftpauth -r 3 /html/test/files/js test/files/js/alert.js'],
      ['ncftpput -R -m -f .ftpauth -r 3 /html/test/files/nested test/trunk/files/nested/another']
    ]
  }
};
