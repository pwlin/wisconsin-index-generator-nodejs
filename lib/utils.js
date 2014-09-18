var fs = require('fs');
var path = require('path');
var spawnSync = require('child_process').spawnSync || require('spawn-sync');
var AdmZip = require('adm-zip');
var xmlBuilder = require('xmlbuilder');
var pd = require('pretty-data').pd;

function forEach(obj, cb) {
  if (/String|Array/.test(Object.prototype.toString.call(obj))) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (cb) {
        cb(i, obj[i]);
      }
    }
  } else {
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        if (cb) {
          cb(k, obj[k]);
        }
      }
    }
  }
}

function dirWalk(dir, _files) {
  _files = _files || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    if (files.hasOwnProperty(i)) {
      var name = path.join(dir, files[i]);
      if (fs.statSync(name).isDirectory()) {
        dirWalk(name, _files);
      } else {
        if (path.extname(name) === '.apk') {
          _files.push(name);
        }
      }
    }
  }
  return _files;
}

function aapt(apkPath) {
  var result = spawnSync('aapt', ['dump', 'badging', apkPath]);
  var ret;
  if (result.status !== 0) {
    //process.stderr.write(result.stderr);
    //process.exit(result.status);
    ret = '';
  } else {
    //process.stdout.write(result.stdout);
    //process.stderr.write(result.stderr);
    ret = '' + result.stdout;
  }
  result = null;
  return ret;
}

function getApkIconBase64(apkPath, iconFilePath) {
  var pngIconBase64 = '';
  var zip = new AdmZip(apkPath);
  var zipEntries = zip.getEntries();
  zipEntries.forEach(function(zipEntry) {
      if (zipEntry.entryName === iconFilePath) {
          pngIconBase64 = zip.readFile(zipEntry.entryName).toString('base64');
          return true;
      }
  });
  if (pngIconBase64 !== '') {
    pngIconBase64 = 'data:image/png;base64,' + pngIconBase64;
  }
  return pngIconBase64;
}

function writeRaccoonData(path, obj) {
  var tmpObj = {};
  var root = xmlBuilder.create('Raccoon', {version: '1.0', encoding: 'UTF-8', standalone: true});
  forEach(obj, function(k, v) {
    tmpObj = {
      application : {
        id: v.id,
        name: v.name,
        icon: v.icon,
        '#list': []
      }
    };
    forEach(v.versions, function(m, n) {
      tmpObj.application['#list'].push({
        package : {
          version : n.version,
          versioncode : n.versioncode,
          apkname : n.apkName,
          permissions : n.permissions
        }
      });
    });
    root.ele(tmpObj);
  });
  
  //fs.writeFile(path, JSON.stringify(obj, null, 4));
  fs.writeFile(path, pd.xml('' + root));
}


// === exports === //
exports.forEach = forEach;
exports.dirWalk = dirWalk;
exports.aapt = aapt;
exports.getApkIconBase64 = getApkIconBase64;
exports.writeRaccoonData = writeRaccoonData;