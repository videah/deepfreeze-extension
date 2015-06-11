<p align="center">
  <img src="http://i.imgur.com/xsBy9vN.png"/>
</p>

This browser extension is an unofficial extension for [deepfreeze.it](http://deepfreeze.it)

### Current Features
Note: These aren't fully working yet.
 * Manually blocking Outlets, redirecting to their DeepFreeze page when attempting to navigate to them.
 * Scanning pages for Journalist names, with a list allowing you to jump to their DeepFreeze page.

### Supported Browsers
 * Firefox
 * Chrome
 * Safari

### Possible Upcoming Features
 * Highlight Journalist names.

### Building
This extension uses the [Kango Extension Framework](http://kangoextensions.com/), so you'll need Python 2.7 to build.

To build, run:
```kango.py build path/to/repo/folder/here```

### Notes
This extension was made to help learn JavaScript, so the code is ~~probably~~ garbage.

Feel free to make a pull request on any junk code you see.

Also, the extension is currently scraping the data directly from [deepfreeze.it](http://deepfreez.it) right now, as they currently do not have an API. If an API is created, I will implement it here.
