var fs = require('fs');

const packageJsonPath = './package.json';
const nodeModulesPath = './node_modules';
const defaultMainFile = 'index.js';

function getMainNodeFiles() {
    const packageJson = _getPackageJson(packageJsonPath);

    return packageJson.dependencies
        .map(dep => _getMainPackageFile(`${nodeModulesPath}/${dep}`));
}

function _getMainPackageFile(modulePath) {
    var packageJson = _getPackageJson(modulePath + '/package.json');
    return modulePath + "/" + (packageJson.main || defaultMainFile);
}

function _getPackageJson(path) {
    const file = fs.readFileSync(path);
    return JSON.parse(file.toString());
}

module.exports = getMainNodeFiles;
