var downloadFile = require('download-file');
var inquirer = require('inquirer');
var loadingSpinner = require('loading-spinner');
var jsonFormat = require('json-format');
var path = require('path');
var twinePath = require('twine-utils/path').storyDirectorySync();
var wrap = require('wordwrap')(80);

function say(text) {
	console.log(wrap(text));
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
		name: ''
	};
}

module.exports = function(grunt) {
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

	grunt.registerTask('setup', ['edit-name', 'edit-format', 'edit-stories']);
};
