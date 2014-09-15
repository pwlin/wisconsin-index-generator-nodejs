var fs = require('fs');
var path = require('path');
var utils = require('./lib/utils');

var apkStoragePath = path.resolve(process.argv[2] || __dirname);

if (!fs.existsSync(apkStoragePath)) {
  console.error('Directory does not exist. Exiting...');
  process.exit(0);
}

var files = utils.dirWalk(apkStoragePath);
var aaptData = '';
var raccoonData = {};

var apkId = '';
var apkName = '';
var apkVersionName = '';
var apkVersionCode = '';
var apkIconPath = '';
var apkIconBase64 = '';

utils.forEach(files, function(k, v) {
  console.log('Processing ', v);
  aaptData = utils.aapt(v);
  apkId = aaptData.match(/package\: name='(.*?)'/)[1];
  apkName = aaptData.match(/application\: label='(.*?)'/);
  if (apkName && apkName[1] && apkName[1] !== '') {
    apkName = apkName[1];
  } else {
    apkName = aaptData.match(/launchable-activity\: name='(.*?)'  label='(.*?)' icon/);
    if (apkName) {
      apkName = apkName[2];
    } else {
      console.log('========================');
      console.warn('[' + apkId + '] Skipping this apk because it has no name.');
      console.log('========================');
      return true;
    }
  }
  apkVersionName = aaptData.match(/versionName='(.*?)'/)[1];
  apkVersionCode = aaptData.match(/versionCode='(.*?)'/)[1];
  
  if (raccoonData[apkId]) {
    raccoonData[apkId].versions.push({
      version: apkVersionName,
      versioncode: apkVersionCode,
      apkName: v.replace(apkStoragePath, '').replace(/\\/ig, '/').replace(/^\//, '')
    });
  } else {
    apkIconPath = aaptData.match(/application\: label='(.*?)' icon='(.*?)'/);
    //apkIconPath = aaptData.match(/application-icon-240:'(.*?)'/);
    if (apkIconPath && apkIconPath[2] && apkIconPath[2] !== '') {
      apkIconPath = apkIconPath[2];
    }
    apkIconBase64 = utils.getApkIconBase64(v, apkIconPath);
    raccoonData[apkId] = {
      id: apkId,
      name: apkName,
      icon: apkIconBase64,
      versions : [
        {
          version: apkVersionName,
          versioncode: apkVersionCode,
          apkName: v.replace(apkStoragePath, '').replace(/\\/ig, '/').replace(/^\//, '')
        }
      ]
    };
  }
});

utils.writeRaccoonData(path.join(apkStoragePath, 'index.xml'), raccoonData);
console.log('Finished processing all apk files.');

