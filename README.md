Wisconsin Index Generator
=========================
This script will generate an `index.xml` file for a [Raccoon](https://github.com/onyxbits/Raccoon) archive folder. It will contain a list of all your apks with their basic metadata (id, version, icon) in this folder.

Before You Begin
==============
1. Make sure you have **[nodejs](http://nodejs.org/)** already installed.
2. make sure that you have [Android SDK](http://developer.android.com/sdk/installing/index.html) installed and that `aapt` utility is in your PATH. `aapt` utility is located at `[your-android-installation]/build-tools/[version-number]/`. Add this to your path.

How To Use
=========================
1. `git clone` this repository 
2. `cd` to the cloned directory and install the dependencies with `npm install`
2. run `node index.js /path/to/apk_storage`

Example Output
=========================
To know what you would expect, there is an `index.example.xml` file inside this repository.  
