grunt-entwine-quickstart
========================

This is a skeleton project folder that can help you get started with using
[Grunt](http://gruntjs.com) and
[Entwine](https://github.com/klembot/twine-utils) to build Twine stories
outside of Twine. This doesn't replace Twine, but contains automated tasks that
can help you build complex stories with it.

With this, you can:

  * Build a large story by combining several individual stories, similar to the
    StoryIncludes feature of Twine 1
  * Write some or all of a story using Twee source code
  * Keep your JavaScript and CSS in separate files outside Twine
  * Easily manage multimedia assets like images, audio, and video
  * Use source control to keep track of the revision history of your story
  * Publish a desktop app version of your story

This requires that you use a command prompt, but this document will guide you
through what's needed.


One-Time Setup
--------------

If you already have installed Node and Grunt on this computer, you can skip
this section. Otherwise, you'll need to follow these steps to do so.

First, download Node. It's the platform that the tasks in this project run on.

  1. Visit https://nodejs.org/ in your web browser.
  2. Choose to download the LTS version.
  3. Open the file you downloaded to install Node.

Then, you need to install Grunt, which is an automated task runner. Once it's
set up, it will allow you to run tasks that involve multiple steps -- like
copying files from one place to another and then publishing your story to an
app -- with a single command. It's also able to do this for you automatically
as you change files, without having to type a command each time.

Node has a program called npm, short for _Node Package Manager_, that will do
the work of downloading and installing Grunt for you. To use npm, you'll need
to use a command prompt. The way to do this varies by the operating system you
are using.

  * On Windows, open the Start menu, then choose All Programs. In the folder
    named Node.js, there's an item named "Node.js command prompt." Choose this.

  * On OS X, open the Terminal application that's in the Utilities folder of
    your Applications folder.

  * On Linux, how you open a terminal window depends on what distribution
    you're using. On Ubuntu, open the Applications menu. In the Accessories
    folder, there's an item named "Terminal."

Once you have a command prompt open, type ``npm install -g grunt`` and press
the Enter key. (In the rest of this document, we'll shorten this to just 'run a
command,' or 'run'.) npm will think for a moment, then print out text as it installs
Grunt for you. When the prompt reappears, it's done.

Don't close this terminal window-- you'll need it in the next section.


Project Setup
-------------

If you haven't already, [download a fresh copy of the project
folder](https://github.com/klembot/grunt-entwine-quickstart/archive/master.zip) and
unzip it by opening the resulting file. You'll end up with a folder named
`grunt-entwine-quickstart`. Rename it to match the name of your project. You
can put this folder anywhere you like on your computer.

In order to complete setup, you'll need to navigate to your project folder from
a command prompt. Follow the directions above if you need a terminal window. To
navigate to your project folder, first type `cd` (short for _change
directory_), then a space.

  * On Windows, the easiest thing to do is to copy the address of your folder
    from the address bar of an Explorer window, and place quotation marks
    around it. The resulting command should look something like `cd
    "C:\Users\You\Documents\my-project"`.

  * On OS X, try typing cd with a space after it, then drag your project folder
    onto your terminal window. The resulting command should look like `cd
    /Users/You/Documents/my-project`.

  * On Linux, the easiest way to get there varies by your distribution. On
	Ubuntu, try following [these
	directions](http://www.howtogeek.com/192865/how-to-open-terminal-to-a-specific-folder-in-ubuntus-file-browser/).

Once you do that, run the command `npm install`. Similar to installing Grunt in
the previous section, this sets up everything behind the scenes for your
project. It's normal for npm to not print anything out at first while it does
this. You may also see warnings appear during this process. So long as npm's
output doesn't end with these warnings, things should be fine.

After npm completes and you see the command prompt again, run `grunt setup`.
This will ask you some basic questions about what should go into the story you
will build in your project. If you change your mind about your answers later,
you can enter `grunt setup` again at any point to change them.

_Important:_ when you're selecting what stories to use, make sure to use the
space bar to select them, then press Enter when you're ready to move on to the
next question. Watch the dots on the left side of the screen -- they will fill
in when you have selected a story.

Once you've gone through `grunt setup`, try running `grunt build`. Grunt will
print text as it builds your story. If it concludes by printing "Done." in
green, look for a file under a new folder that Grunt created for you called
"dist" (short for "distribution" -- where versions of your story ready to be
published will appear). If it appeared, hooray! You have a working project.


Adding More Content To Your Story
---------------------------------

To add another story you've created in Twine, run the command `grunt setup`
again and select the story you'd like to add with the space bar. The stories you
have previously added will already be selected for you.

To add Twee source files to your project, copy them into the `src` folder. You
can use any arrangement you like inside the `src` folder, and nest them into
subfolders in whatever way makes sense to you.

Likewise, you can place JavaScript and CSS files into the `src` folder and
they'll be merged into your constructed story with `grunt build`.


Build Commands
--------------

To use these, you must first have a command prompt open in your project's
top-level folder. If you're not sure how to get there, follow the directions in
the Project Setup section above.

You can always run `grunt help` to see a full list of possible commands and a
short summary of what they do.

### `grunt build`

This constructs a story and saves it to the folder path `dist` -> `web`. The
story will be constructed by following these steps:

  1. Any stories you have added from Twine with `grunt setup` will be first
	 copied to the folder named `twine-stories` at the top level of your
	 project folder.

  2. A new story will be created by merging:
     - All stories in the `twine-stories` folder.
	 - Any Twine stories or Twee source code placed anywhere in the `src`
	   folder of your project. (They must have the file suffix `.html`, `.txt`,
	   `.twee`, or `.tw`.)
	 - Any files with the suffix `.css` (for CSS rules) or `.js` (for
	   JavaScript source) anywhere in the `src` folder of your project.
  
  3. Any image, audio, or video assets in the `src` folder of your project will
  be copied to the same folder that your new story is in.
     
Keep in mind that you can organize files as you like inside the `src` folder,
including adding subfolders. When your story is built, all your assets will be
copied to the same level as the story file, regardless of what subfolder they
are located in in the `src` folder.
    
### `grunt watch`

This does the exact same thing as `grunt build`, but instead of it running
once, it constantly watches your Twine stories and contents of the `src`
project folder for changes. As soon as something changes, the build process
will begin. You'll notice that this will occur even as you edit stories in
Twine, because it saves your work as you go.

To stop this process, go to your terminal window, hold the Control key down,
and press C. If you use Windows, it'll ask you if you're sure you want to stop
the task first.

This will not run `grunt build` immediately, so if you'd like to build your
story and then watch for changes, run `grunt build watch` instead.

### `grunt app`

This builds desktop application versions of your story for Windows, OS X, and
Linux. The resulting files will be placed in a folder named `app` in the
project's `dist` folder.

You must run this on an OS X computer in order to create an OS X app, but
otherwise it doesn't matter what platform you are using.

The first time you run this command, you must be connected to the Internet, as
it will download NW.js, the engine that runs your stories. This can take a
minute or more. After the first time, this command will finish much faster.

If you'd like to customize the icon of your app, place files named `app.ico`
and `app.icns` at the top level of your project folder. They'll be used the
next time you run `grunt app`.

To change the dimensions of the app window or start the app in fullscreen mode,
edit `app-options.json` with a text editor and change the values there.

### `grunt setup`

This runs the setup process, asking you:

  1. What the name of your constructed story, e.g. the one created by `grunt
     build`, should be.
  2. What story format you'd like to use for the constructed story.
  3. What stories, if any, in Twine you'd like to incorporate. Use the space
     bar here to select or deselect stories, and the Enter key to save your
     changes.
  4. What the name of your starting passage is. This is needed, since you may
	 be incorporating multiple stories, each with a starting passage. It's
     important that you enter this name correctly. If your constructed story shows
     an error message when you first open it, double-check this.

  
The Anatomy of This Project Folder
----------------------------------

Here's an explanation of what each folder and file does.

| File Name | Purpose |
|-----------|---------|
|`app-options.json`| This is a configuration file for app versions of your story. Read the [NW.js documentation](https://github.com/nwjs/nw.js/wiki/Manifest-format) for detailed explanations of the settings here. 
|`dist/`    | Your constructed story and supporting assets will appear here. |
|`src/`     | Place any Twine stories, Twee source code, CSS files, JavaScript files, or multimedia assets here to be incorporated into your constructed story. You can arrange things into subfolders as much as you like. Twine stories, CSS files, JavaScript files, and Twee stories will be automatically be incorporated into the story, wherever they are. All assets will be copied to the `dist/` folder, and the structure you've established in `src/` will be collapsed to a single level. |
| `twine-stories` | Twine stories you requested to be incorporated into your stories with `grunt setup` will be copied here from your library folder. This ensures that if you give this folder to someone else, they'll have everything needed to run `grunt build` too. You never need to copy things here manually; use `grunt setup` to have them copied for you, instead. |
| `custom-tasks.js` | If you're familiar with Grunt, you can add tasks of your own here without having to change `Gruntfile.js`. |
| `entwine-project-settings.json` | The options you choose in `grunt setup` are saved here. If you'd like, you can change this file yourself. |
| `format.js` | The story format you would like the constructed story to use. Use `grunt setup` to use a built-in one like Harlowe, SugarCube, or Snowman. You can also replace this with a custom one. |
| `Gruntfile.js` | Where all Grunt tasks are defined. You shouldn't need to change this. |
| `nwjs-cache` | A folder where the NW.js engine is stored after the first time you run `grunt app`, so that subsequent builds are faster. This folder can be deleted -- the next time you run `grunt app`, the engine will be downloaded again. |
| `package.json` | General information about your project. You shouldn't need to change this. |
| `README.md` | This file! |


Troubleshooting
---------------

If Grunt runs into problems building your story, it will say:

  Warning: Task "help" failed. Use --force to continue.

Sadly, this advice usually won't help. Some things to check if Grunt is not building your story:

  * Did you select at least one story from Twine with `grunt setup`, or put
	story files into the `src/` folder? Keep in mind that you need to select
	stories with the space bar, then press Enter to continue.

  * Did you enter the right starting passage name, with matching capitalization
    and spaces? This has to be exact, unfortunately.
