grunt-entwine-quickstart
========================

This is a project folder that can help you get started with using
[Grunt](grunt) and [Entwine](entwine) to build Twine stories. This isn't meant
to replace Twine, but contains automated tasks that can help you build complex
stories with it.

With this, you can:

  * Build a story from several individual stories
  * Keep your JavaScript and CSS in separate files, outside Twine
  * Easily manage multimedia assets like images, audio, and video
  * Publish a desktop app version of your story

This requires that you use a command prompt, but this document will guide you
through what's needed.

[grunt]: http://gruntjs.com
[entwine]: https://bitbucket.org/klembot/twine-utils


One-Time Setup
--------------

If you already have installed Node and Grunt on this computer, you can skip
this section. Otherwise, you'll need to follow these steps to do so.

First, download Node. It's the platform that the tasks in this project run on.

  1. Visit https://nodejs.org/ in your web browser.
  2. Choose to download the LTS version.
  3. Open the file you downloaded to install Node.

Then, you need to install Grunt, which is an automated task runner. Once it's set
up, it will allow you to run tasks that involve multiple steps -- like copying files
from one place to another and then publishing your story to an app -- with a single
command. It's also able to do this for you automatically as you change files, without
having to type a command each time.

Node has a program called _npm_, short for _Node Package Manager_, that will do the
work of downloading and installing Grunt for you. To use _npm_, you'll need to use
a command prompt. The way to do this varies by the operating system you are using.

  * On Windows, open the Start menu, then choose All Programs. In the folder
	named Node.js, there's an item named "Node.js command prompt." Choose this.

  * On OS X, open the Terminal application that's in the Utilities folder of
    your Applications folder.

  * On Linux, how you open a terminal window depends on what distribution
	you're using. On Ubuntu, open the Applications menu. In the Accessories
	folder, there's an item named "Terminal."

Once you have a command prompt open, type ``npm install -g grunt`` and press
the Enter key. _npm_ will think for a moment, then print out text as it
installs Grunt for you. When the prompt reappears, it's done.

Don't close this terminal window-- you'll need it in the next section.


Project Setup
-------------

If you haven't already, [download a fresh copy of this repository](download)
and unzip it by opening the resulting file. You'll end up with a folder named
grunt-entwine-quickstart. Rename it to match the name of your project. You can
put this folder anywhere you like on your computer.

[download]: https://bitbucket.org/klembot/grunt-entwine-quickstart/get/tip.zip

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

  * On Linux, the easiest way to get there varies by your distribution.

Once you do that, type `npm install` and press the Enter key. Similar to
installing Grunt in the previous section, this sets up everything behind the
scenes for your project. It's normal for _npm_ to not print anything out at
first while it does this. You may also see warnings appear during this process.
So long as _npm_'s output doesn't end with these warnings, things should be
fine.

After _npm_ completes and you see the command prompt again, type `grunt setup`
and press Enter. This will ask you some basic questions about what should go
into the story you will build in your project. If you change your mind about
your answers later, you can enter `grunt setup` again at any point to change
them.

Once you've gone through `grunt setup`, try typing `grunt build` and press
Enter. You should see a new file under a new folder that Grunt created for you
called "dist" (short for "distribution" -- where versions of your story ready
to be published will appear). If so, hooray! You have a working project.


Build Commands
--------------

To use these, you must first have a command prompt open in your project's
top-level folder. If you're not sure how to get there, follow the directions
in the Project Setup section above.

You can always type `grunt help` to see a full list of possible commands
and a short summary of what they do.

`grunt build`

This constructs a story and saves it to the folder path `dist` -> `web`.
The story will be constructed by following these steps:

  1. Any stories you have added from Twine will be first copied to the
     folder named `twine-stories` at the top level of your project folder.

  2. A new story will be created by merging:
     - All stories in the `twine-stories` folder.
     - Any Twine stories or Twee source code placed anywhere in the `src`
       folder of your project.
     - Any files with the suffix `.css` (for CSS rules) or `.js`
       (for JavaScript source) anywhere in the `src` folder of your project.
  
  3. Any image, audio, or video assets in the `src` folder of your project
     will be copied to the same folder that your new story is in.
     
Keep in mind that you can organize files as you like inside the `src` folder,
including adding subfolders. When your story is built, all your assets will
be copied to the same level as the story file, regardless of what subfolder
they are located in in the `src` folder.
    