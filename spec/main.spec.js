describe("Main node files", function() {
  const getMainNodeFiles = require('../');

  it('should not throw with missed dependencies section', () => {
    expect(getMainNodeFiles).not.toThrow();
  });

  it('should return empty array with missed dependencies section', () => {
    const files = getMainNodeFiles();

    expect(files).toEqual([]);
  });

  it('should return default main file for empty "main" section', () => {
    const options = {
      packageJsonPath: './spec/no-main.package.json',
      nodeModulesPath: './spec/test_node_modules'
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual(['./spec/test_node_modules/test-module-1/index.js']);
  });

  it('should return default main file from specified "main" section', () => {
    const options = {
      packageJsonPath: './spec/with-main.package.json',
      nodeModulesPath: './spec/test_node_modules'
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual(['./spec/test_node_modules/test-module-2/main.js']);
  });

  it('should return overriden main file', () => {
    const options = {
      packageJsonPath: './spec/with-main.package.json',
      nodeModulesPath: './spec/test_node_modules',
      overrides: {
        'test-module-2': 'index.js'
      }
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual(['./spec/test_node_modules/test-module-2/index.js']);
  });

  it('should support array in overrides', () => {
    const options = {
      packageJsonPath: './spec/with-main.package.json',
      nodeModulesPath: './spec/test_node_modules',
      overrides: {
        'test-module-2': ['main.js', 'index.js']
      }
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/test-module-2/main.js',
      './spec/test_node_modules/test-module-2/index.js'
      ]);
  });

});