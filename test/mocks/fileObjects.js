/*eslint-disable*/
module.exports = {
  'test': {
    'files': [{
        "src": ['test/files/Test.txt'],
        "orig": {
            "expand": true,
            "cwd": 'test',
            "src": ['**/*']
        },
        "dest": 'files/Test.txt'
    }, {
        "src": ['test/files/js/alert.js'],
        "orig": {
            "expand": true,
            "cwd": 'test',
            "src": ['**/*']
        },
        "dest": 'files/js/alert.js'
    }, {
        "src": ['test/files/nested/another/sample.js'],
        "orig": {
            "expand": true,
            "cwd": 'test',
            "src": ['**/*']
        },
        "dest": 'files/nested/another/sample.js'
    }, {
        "src": ['tasks/ftp_push.js'],
        "dest": 'tasks/ftp_push.js',
        "orig": {
            "expand": true,
            "cwd": 'tasks',
            "src": ['**/*'],
            "dest": 'test/'
        }
    }, {
        "src": ['tasks/utils.js'],
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
      'dest': '/html/test/files/Test.txt'
    }, {
      'src': 'test/files/js/alert.js',
      'dest': '/html/test/files/js/alert.js'
    }, {
      'src': 'test/nested/another/sample.js',
      'dest': '/html/test/files/nested/another/sample.js'
    }, {
      'src': 'tasks/ftp_push.js',
      'dest': '/html/test/test/ftp_push.js'
    }, {
      'src': 'tasks/utils.js',
      'dest': '/html/test/test/utils.js',
      // This wont normally be in the results, but will use this to test to make sure the path is correct
      'badPath': '/html/test/tasks/utils.js'
    }],
    'srcBaseFile': {
    	'src': ['test/trunk/files/nested/another/sample.js'],
    	'orig': {
    		'expand': true,
    		'cwd': 'test',
    		'src': ['**/*'],
    	},
    	'dest': 'nested/another/sample.js'
    },
    'srcBaseResult': {
    	'src': 'test/trunk/files/nested/another/sample.js',
    	'dest': '/html/test/files/nested/another/sample.js'
    },
    'base': '/html/test/',
    'srcBase': '/trunk',
    'options': [{
			'authFile': '.ftpauth', // File to get ftp account info from
			'redial': 3, // Maximum retry attempts
			'ncftp': '', // Path to ncftpput
			'debug': false, // Log debug info?
			'debugFile': 'stdout', // file to log debug info to if enabled
    }, {
			'authFile': '.altftpauth', // File to get ftp account info from
			'redial': 0, // Maximum retry attempts
			'ncftp': '/bin/', // Path to ncftpput
			'debug': true, // Log debug info?
			'debugFile': 'stdout', // file to log debug info to if enabled
    }, {
			'authFile': '.ftpauth', // File to get ftp account info from
			'redial': 3, // Maximum retry attempts
			'ncftp': '', // Path to ncftpput
			'debug': true, // Log debug info?
			'debugFile': '/tmp/debug.txt', // file to log debug info to if enabled
    }],
    'command': [
      'ncftpput -b -R -m -f .ftpauth -r 3 /html/test/files/nested/another/sample.js test/trunk/files/nested/another/sample.js;',
      '/bin/ncftpput -b -R -m -f .altftpauth -d stdout /html/test/files/nested/another/sample.js test/trunk/files/nested/another/sample.js;',
      'ncftpput -b -R -m -f .ftpauth -r 3 -d /tmp/debug.txt /html/test/files/nested/another/sample.js test/trunk/files/nested/another/sample.js;',
      'ncftpput -b -R -m -f .ftpauth -r 3 /html/test/files/Test.txt test/files/Test.txt;ncftpput -b -R -m -f .ftpauth -r 3 /html/test/files/js/alert.js test/files/js/alert.js;'
    ]
  }
};
