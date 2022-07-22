module.exports = function (grunt) {
	require('time-grunt')(grunt)

	var config = require('./.screeps.json')
	var branch = grunt.option('branch') || config.branch
	var token = grunt.option('token') || config.token
	var ptr = grunt.option('ptr') ? true : config.ptr

	grunt.loadNpmTasks('grunt-screeps')
	grunt.loadNpmTasks('grunt-contrib-clean')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-file-append')
	grunt.loadNpmTasks('grunt-jsbeautifier')
	grunt.loadNpmTasks('grunt-rsync')

	var currentDate = new Date()

	// Output the current date and branch
	grunt.log.subhead(
		'Task Start: ' + currentDate.toLocaleString()
	)
	grunt.log.writeln('Branch: ' + branch)

	grunt.initConfig({
		screeps: {
			options: {
				token: token,
				branch: branch,
				ptr: false,
			},
			dist: {
				src: ['dist/*.js'],
			},
		},

		// Remove all files from the dist folder
		clean: {
			dist: ['dist'],
		},

		// Copy all source files into the dist folder, flattening the folder structure by converting path delimiters to dots
		copy: {
			// Pushes the game code to the dist folder so it can be modified before being sent to the screeps server
			screeps: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: '**',
						dest: 'dist/',
						filter: 'isFile',
						rename: function (dest, src) {
							// Change the path name utilize fullstops for folders
							return (
								dest +
								src.replace(/\//g, '.')
							)
						},
					},
				],
			},
		},

		//Add version variable using current timestamp
		file_append: {
			versioning: {
				files: [
					{
						append:
							'global.SCRIPT_VERSION = ' +
							currentDate.getTime() +
							'\n',
						input: 'dist/version.js',
					},
				],
			},
		},

		//Apply code styling
		jsbeautifier: {
			modify: {
				src: ['src/**/*.js'],
				options: {
					config: '.jsbeautifyrc',
				},
			},
			verify: {
				src: ['src/**/*.js'],
				options: {
					mode: 'VERIFY_ONLY',
					config: '.jsbeautifyrc',
				},
			},
		},
	})

	grunt.registerTask('default', [
		'clean',
		'jsbeautifier:modify',
		'copy:screeps',
		'file_append:versioning',
		'screeps',
	])

	grunt.registerTask('test', ['jsbeautifier:verify'])
	grunt.registerTask('pretty', ['jsbeautifier:modify'])
}
