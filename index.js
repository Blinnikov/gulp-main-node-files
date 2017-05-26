var fs = require('fs');

const defaultConfig = {
	packageJsonPath: './package.json',
	nodeModulesPath: './node_modules'
};

const defaultMainFile = 'index.js';

function getMainNodeFiles(options) {
	const config = Object.assign(defaultConfig, options);
	const packageJson = _getPackageJson(config.packageJsonPath);
	
	var result = [];
	
	if(!packageJson.dependencies) {
		return result;
	}
	
	Object
		.keys(packageJson.dependencies)
		.forEach(key => {
			if(config.overrides && config.overrides[key]) {
				const overridenPaths = _getOverridenPaths(config, key);
				result.push.apply(result, overridenPaths);
			} else {
				var defaultMainPackageFile = _getMainPackageFile(`${config.nodeModulesPath}/${key}`);
				result.push(defaultMainPackageFile);
			}
	});
	
	return result;
}

function _getMainPackageFile(modulePath) {
	var packageJson = _getPackageJson(`${modulePath}/package.json`);
	return `${modulePath}/${packageJson.main || defaultMainFile}`;
}

function _getPackageJson(path) {
	const file = fs.readFileSync(path);
	if(!file) {
		throw new Error('package.json not found');
	}
	
	return JSON.parse(file.toString());
}

function _getOverridenPaths(config, key) {
	const mainOverrides = config.overrides[key];
	if(Array.isArray(mainOverrides)) {
		return mainOverrides.map(path => `${config.nodeModulesPath}/${key}/${path}`);
	} else {
		return [`${config.nodeModulesPath}/${key}/${mainOverrides}`];
	}
}

module.exports = getMainNodeFiles;
