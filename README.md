Wisconsin Index Generator
=========================
This script will generate an `index.xml` file for a [Raccoon](https://github.com/onyxbits/Raccoon) archive folder. It will contain a list of all your apks with their basic metadata (id, version, icon) in this folder.

Before You Begin
==============
1. Make sure you have **[NodeJS](http://nodejs.org/)** already installed.
2. Make sure you have [Android SDK](http://developer.android.com/sdk/installing/index.html) installed and that `aapt` utility is in your PATH. `aapt` utility is located at `[your-android-installation]/build-tools/[version-number]/`. Add this to your path.

Install
========
    npm install -g wisconsin-index-generator

Usage
=========================
1. run `wisconsin-index-generator /path/to/apk_storage`
2. There will be an `index.xml` file in `/path/to/apk_storage` directory.

Example Output
=========================
To know the format of expected output, there is an `index.example.xml` file inside this repository.  
