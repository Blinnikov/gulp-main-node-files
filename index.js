const fs = require('fs');
const firstBy = require('thenby');
const pathJoin = require('path.join');

const defaultConfig = Object.freeze({
    packageJsonPath: './package.json',
    nodeModulesPath: './node_modules',
    skip: {},
});

const maxOrder = Number.MAX_SAFE_INTEGER;
const defaultMainFile = "";

function getMainNodeFiles(options) {
    const config = Object.assign({}, defaultConfig, options);
    const packageJson = _getPackageJson(config.packageJsonPath);
    if (!packageJson.dependencies) {
        return [];
    }

    var packages = Object.keys(packageJson.dependencies)
        .filter(key => !config.skip[key])
        .map(key => {
            const package = _getDefaultPackageDescription(config, key);
            if (config.overrides && config.overrides[key]) {
                package.main = _getOverridenPaths(config, key);
            }

            if (config.order && Number.isInteger(config.order[key])) {
                package.order = config.order[key];
            }

        return package
});

    const shouldSort = config.order && Object.keys(config.order).length > 0;
    return _getOrderedPaths(packages, shouldSort);
}

function _getDefaultPackageDescription(config, key) {
    return {
        key,
        main: _getMainPackageFile(config, `${config.nodeModulesPath}/${key}`),
        order: maxOrder
    }
}

function _getMainPackageFile(config, modulePath) {
    let packageJson = _getPackageJson(`${modulePath}/package.json`);
    let mainFile = packageJson.main;
    let extension = _getFileExtension(mainFile);
    if (extension === config.filter) {
        return `${modulePath}/${packageJson.main || defaultMainFile}`;
    } else {
        return defaultMainFile
    }
}

function _getFileExtension(file) {
    if (file) {
        return extension = file.substr(file.lastIndexOf(".") + 1);
    }
}

function _getPackageJson(path) {
    const file = fs.readFileSync(path);
    if (!file) {
        throw new Error('package.json not found');
    }

    return JSON.parse(file.toString());
}

function _getOverridenPaths(config, key) {
    const mainOverrides = config.overrides[key];
    if (Array.isArray(mainOverrides)) {
        return mainOverrides.map(p => `./${pathJoin(config.nodeModulesPath, key, p)}`);
    } else {
        return [`${config.nodeModulesPath}/${key}/${mainOverrides}`];
    }
}

function _getOrderedPaths(packages, shouldSort) {
    const result = [];
    var sortedPackages = shouldSort ? packages.sort(firstBy("order").thenBy("key")) : packages;
    sortedPackages
        .forEach(pckg => {
            if (Array.isArray(pckg.main)) {
            result.push.apply(result, pckg.main);
            } else {
                result.push(pckg.main);
            }
        });
    return result;
}

module.exports = getMainNodeFiles;