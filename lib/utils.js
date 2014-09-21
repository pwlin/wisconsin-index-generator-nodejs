/*jslint browser: true, devel: true, node: true, sloppy: true, plusplus: true, nomen: true*/
/*global require */
var fs = require('fs');
var path = require('path');
var spawnSync = require('child_process').spawnSync || require('spawn-sync');
var AdmZip = require('adm-zip');
var xmlBuilder = require('xmlbuilder');
var pd = require('pretty-data').pd;

function forEach(obj, cb) {
    var i,
        l,
        k;
    if (/String|Array/.test(Object.prototype.toString.call(obj))) {
        for (i = 0, l = obj.length; i < l; i++) {
            if (cb) {
                cb(i, obj[i]);
            }
        }
    } else {
        for (k in obj) {
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
    var files = fs.readdirSync(dir),
        i,
        name;
    for (i in files) {
        if (files.hasOwnProperty(i)) {
            name = path.join(dir, files[i]);
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
    var result = spawnSync('aapt', ['dump', 'badging', apkPath]),
        ret;
    if (result.status !== 0) {
        //process.stderr.write(result.stderr);
        //process.exit(result.status);
        ret = '';
    } else {
        //process.stdout.write(result.stdout);
        //process.stderr.write(result.stderr);
        ret = String(result.stdout);
    }
    result = null;
    return ret;
}

function getApkIconBase64(apkPath, iconFilePath) {
    var pngIconBase64 = '',
        zip = new AdmZip(apkPath),
        zipEntries = zip.getEntries();
    zipEntries.forEach(function (zipEntry) {
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
    var tmpObj = {},
        root = xmlBuilder.create('Raccoon', {
            version: '1.0',
            encoding: 'UTF-8',
            standalone: true
        });
    forEach(obj, function (k, v) {
        tmpObj = {
            application: {
                id: v.id,
                name: v.name,
                icon: v.icon,
                '#list': []
            }
        };
        forEach(v.versions, function (m, n) {
            tmpObj.application['#list'].push({
                'package': {
                    version: n.version,
                    versioncode: n.versioncode,
                    apkname: n.apkName,
                    permissions: n.permissions,
                    size: n.size
                }
            });
        });
        root.ele(tmpObj);
    });

    //fs.writeFile(path, JSON.stringify(obj, null, 4));
    fs.writeFile(path, pd.xml(String(root)));
}


// === exports === //
exports.forEach = forEach;
exports.dirWalk = dirWalk;
exports.aapt = aapt;
exports.getApkIconBase64 = getApkIconBase64;
exports.writeRaccoonData = writeRaccoonData;