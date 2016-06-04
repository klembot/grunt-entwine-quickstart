var downloadFile = require('download-file');
var filenamify = require('filenamify');
var inquirer = require('inquirer');
var loadingSpinner = require('loading-spinner');
var jsonFormat = require('json-format');
var NwBuilder = require('nw-builder');
var path = require('path');
var twinePath = require('twine-utils/path').storyDirectorySync();
var wrap = require('wordwrap')(80);

function say(text) {
	console.log(wrap(text));
}

function filename(name) {
	return filenamify(name).replace(/\s/g, '-');
}

// Try reading in project settings. If the file doesn't exist, then create some
// basic defaults.

try {
	var projectSettings = require('./entwine-project-settings.json');
}
catch (e) {
	projectSettings = {
		twineStories: [],
		extraPaths: [],
		name: '',
		startPassage: ''
	};
}

module.exports = function(grunt) {
	require('jit-grunt')(grunt);

	// Tasks for building the constructed story.

	grunt.initConfig({
		clean: [
			// Clears out our dist/ folder.

			'dist/'
		],

		copy: {
			// This copies selected story files from our Twine directory to
			// twine-stories/.

			fromTwineDirectory: {
				src: projectSettings.twineStories,
				dest: 'twine-stories/',
				expand: true,
				flatten: true
			},

			// This copies all asset files (images, audio, etc.) under src/
			// to the dist/web/ directory. Feel free to add other file suffixes
			// below.

			assets: {
				src: 'src/**/*.{aiff,bmp,jpeg,jpg,gif,mp3,mp4,ogg,ogv,pdf,' +
					'png,tif,tiff,wav,webm}',
				dest: 'dist/web/',
				expand: true,
				flatten: true,
				filter: 'isFile'
			}
		},

		entwine: {
			// This builds the constructed story at dist/web/ from all stories,
			// CSS and JavaScript files under twine-stories/ and anywhere in src/.
			// Twee source files are also compiled.

			default: {
				files: {
					['dist/web/' + filename(projectSettings.name) + '.html']: [
						'twine-stories/*.html',
						'src/**/*.{css,html,js,twee,tw,txt}'
					].concat(projectSettings.extraPaths)
				},
				options: {
					format: 'format.js',
					name: projectSettings.name,
					startPassage: projectSettings.startPassage
				}
			}
		}
	});

	// Builds an app from dist/web/ using nw-builder. Right now this only works
	// with the 0.12 release series of NW.js, so the version is pinned here.

	grunt.registerTask('nwjs', function() {
		var nwManifest = require('./app-options.json');

		// Create the manifest file that NW.js requires.

		nwManifest.main = filename(projectSettings.name) + '.html';
		nwManifest.name = projectSettings.name;

		grunt.file.write('dist/web/package.json', JSON.stringify(nwManifest));

		// Set up options for nw-builder.

		var builderOptions = {
			files: 'dist/web/**/**',
			platforms: ['linux', 'osx64', 'win32', 'win64'],
			version: '0.12.3',
			buildDir: 'dist/app/',
			cacheDir: 'nwjs-cache'
		};

		// If app.ico or app.icns exist at the top level of this project, use
		// them as icons.

		if (grunt.file.exists('app.ico')) {
			builderOptions.winIco = 'app.ico';
		}

		if (grunt.file.exists('app.icns')) {
			builderOptions.macIcns = 'app.icns';
		}

		var nw = new NwBuilder(builderOptions);

		nw.on('log', console.log);
		nw.build().then(this.async());
	});

	grunt.registerTask('build', ['copy', 'entwine']);
	grunt.registerTask('app', ['build', 'nwjs']);

	// Configuration-related tasks.

	function saveSettings() {
		grunt.file.write(
			'entwine-project-settings.json',
			jsonFormat(projectSettings)
		);
		say("Updated entwine-project-settings.json.");
	}

	grunt.registerTask('edit-format', function() {
		say(
			"\nThis will set the the format of your constructed " +
			"story to one of Twine 2's built-in formats. If you'd like to " +
			"use a custom one instead, copy its format.js file to the top " +
			"level of the project folder, at the same level as the file " +
			"named Gruntfile.js.\n\nIf you aren't sure which to choose, " +
			"you probably want to use Harlowe. It's the default format in " +
			"Twine 2.\n\nMake sure you have an active Internet connection " +
			"before continuing.\n"
		);

		inquirer.prompt([{
			name: 'format',
			type: 'list',
			message: 'What format would you like to use?',
			choices: [
				'Harlowe',
				'SugarCube',
				'Snowman',
				'(Never mind -- I don\'t want to change this.)'
			]
		}])
		.then(function(answers) {
			if (answers.format !==
				'(Never mind -- I don\'t want to change this.)') {
				return new Promise(function(resolve, reject) {
					var url = 
						'http://twinery.org/2/story-formats/' + answers.format +
						'/format.js';

					say('Downloading ' + url + '... ');
					loadingSpinner.start();

					downloadFile(
						url,
						{ directory: process.cwd() },
						function(err) {
							if (err) {
								grunt.fail.warn(err);
								loadingSpinner.stop();
								reject(err);
							}
							else {
								loadingSpinner.stop();
								resolve();
							}
						}
					);
				});
			}

			say("No changes made.");
		})
		.then(this.async())
		.catch(function(err) {
			grunt.fail.warn(err);		
		});
	});

	grunt.registerTask('edit-name', function() {
		say("\nThis name will be used as the name of your constructed " +
			"story. It can contain spaces, numbers, or even punctuation.\n");

		inquirer.prompt([{
			name: 'name',
			type: 'input',
			message: 'What should your story be named?',
			default: projectSettings.name || 'My Story'
		}])
		.then(function(answers) {
			projectSettings.name = answers.name;
			say('');
			saveSettings();
		})
		.then(this.async())
		.catch(function(err) {
			grunt.fail.warn(err);	
		});
	});

	grunt.registerTask('edit-start', function() {
		say("\nThis will set the name of the starting passage in your " +
			"constructed story. It's important that you enter this name " +
			"exactly right, including capitalization and spaces or " +
			"punctuation.\n");

		inquirer.prompt([{
			name: 'startPassage',
			type: 'input',
			message:
				'What is the name of the starting passage in your ' +
				'constructed story?',
			default: projectSettings.startPassage || 'Start'
		}])
		.then(function(answers) {
			projectSettings.startPassage = answers.startPassage;
			say('');
			saveSettings();
		})
		.then(this.async())
		.catch(function(err) {
			grunt.fail.warn(err);	
		});
	});

	grunt.registerTask('edit-stories', function() {
		var stories =
			grunt.file.expand(twinePath + '/*.html').map(function(file) {
				return {
					name: path.basename(file, '.html'),
					value: file,
					checked: projectSettings.twineStories.indexOf(file) !== -1
				};
			});

		inquirer.prompt([{
			name: 'storyFiles',
			type: 'checkbox',
			message: 'What stories would you like to merge into your constructed story?',
			choices: stories
		}])
		.then(function(answers) {
			projectSettings.twineStories = answers.storyFiles;
			say('');
			saveSettings();
		})
		.then(this.async())
		.catch(function(err) {
			grunt.fail.warn(err);	
		});
	});

	grunt.registerTask('add-path', function() {
		say(
			"\nThis will add a Twine story, JavaScript, or CSS source file " +
			"to this project so that its passages or source code will be " +
			"added to your constructed story.\n\nYou do not need to " +
			"manually add anything that's already in the src/ folder -- " +
			"they will already be added for you.\n\nYou can enter a glob " +
			"expression here if you like. See " +
			"https://github.com/isaacs/node-glob for details on that " +
			"syntax.\n"
		);

		var newPath;

		inquirer.prompt([{
			name: 'newPath',
			type: 'input',
			message: 'What path would you like to add?'
		}])
		.then(function(answers) {
			newPath = answers.newPath;

			var expansions = grunt.file.expand(newPath);

			say("\nCurrently " + expansions.length + " file(s) match " +
				"that path. This may change as you move add or remove " +
				"files, of course.\n");
		})
		.then(function() {
			return inquirer.prompt([{
				name: 'reallyAdd',
				type: 'confirm',
				message: 'Are you sure you want to add "' + newPath + '"?',
				default: true
			}]);
		})
		.then(function(answers) {
			if (answers.reallyAdd) {
				projectSettings.extraPaths.push(newPath);
				say('');
				saveSettings();
			}
			else {
				say('\nNo changes saved.');
			}
		})
		.then(this.async())
		.catch(function(err) {
			grunt.fail.warn(err);	
		});
	});

	grunt.registerTask('edit-paths', function() {
		if (projectSettings.extraPaths.length === 0) {
			say(
				"\nYou don't have any paths added to your project. Enter " +
				"\"grunt add-path\" to add one."
			);

			return;
		}

		say(
			"\nUnselect any path below to remove it. The numbers in " +
			"parentheses indicate how many files currently match each " +
			"path.\n\nTo add a new path, enter \"grunt add-path\" at the " +
			"terminal prompt."
		);

		inquirer.prompt([{
			name: 'paths',
			type: 'checkbox',
			message: 'Select which paths to keep:',
			choices: projectSettings.extraPaths.map(function(thisPath) {
				return {
					name: thisPath + '(' +
						grunt.file.expand(thisPath).length + ')',
					value: thisPath,
					checked: true
				};
			})
		}])
		.then(function(answers) {
			projectSettings.extraPaths = answers.paths;
			say(''); // Add a newline.
			saveSettings();
		})
		.then(this.async())
		.catch(function(err) {
			grunt.fail.warn(err);
		});
	});

	grunt.registerTask('setup', ['edit-name', 'edit-format', 'edit-stories', 'edit-start']);

	// Finally, include any custom Grunt tasks.

	require('./custom-tasks')(grunt);
};
