describe("Main node files", function () {
  const getMainNodeFiles = require('../');

  it('should not throw with missed dependencies section', () => {
    const func = () => getMainNodeFiles({
      packageJsonPath: './spec/no-deps.package.json'
    });

    expect(func).not.toThrow();
  });

  it('should return empty array with missed dependencies section', () => {
    const files = getMainNodeFiles({
      packageJsonPath: './spec/no-deps.package.json'
    });

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

  it('should return ordered array if order option specified', () => {
    const options = {
      packageJsonPath: './spec/standard.package.json',
      nodeModulesPath: './spec/test_node_modules',
      order: {
        'test-module-4': 1,
        'test-module-3': 2
      }
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/test-module-4/index.js',
      './spec/test_node_modules/test-module-3/index.js'
    ]);
  });

  it('should return alphabetically ordered array for the same specified order option values', () => {
    const options = {
      packageJsonPath: './spec/standard.package.json',
      nodeModulesPath: './spec/test_node_modules',
      order: {
        'test-module-4': 1,
        'test-module-3': 1
      }
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/test-module-3/index.js',
      './spec/test_node_modules/test-module-4/index.js'
    ]);
  });

  it('should return ordered array with packages without specified order', () => {
    const options = {
      packageJsonPath: './spec/standard.package.json',
      nodeModulesPath: './spec/test_node_modules',
      order: {
        'test-module-4': 1
      }
    };
    const files = getMainNodeFiles(options);

    expect(files.length).toEqual(2);
  });

  it('should return ordered array with packages without specified order at the end', () => {
    const options = {
      packageJsonPath: './spec/standard.package.json',
      nodeModulesPath: './spec/test_node_modules',
      order: {
        'test-module-4': 1
      }
    };
    const files = getMainNodeFiles(options);

    expect(files[0]).toEqual('./spec/test_node_modules/test-module-4/index.js');
    expect(files[1]).toEqual('./spec/test_node_modules/test-module-3/index.js');
  });

  it('should not return packages that specified in order option but are really absent', () => {
    const options = {
      packageJsonPath: './spec/standard.package.json',
      nodeModulesPath: './spec/test_node_modules',
      order: {
        'test-module-5': 1
      }
    };
    const files = getMainNodeFiles(options);

    expect(files).not.toContain('./spec/test_node_modules/test-module-5/index.js');
  });

  it('should support both overrides and order', () => {
    const options = {
      packageJsonPath: './spec/standard.package.json',
      nodeModulesPath: './spec/test_node_modules',
      overrides: {
        'test-module-3': 'main-3.js',
        'test-module-4': 'main-4.js',
      },
      order: {
        'test-module-4': 1,
        'test-module-3': 2
      }
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/test-module-4/main-4.js',
      './spec/test_node_modules/test-module-3/main-3.js'
    ]);
  });

  it('should support both overrides with array and order', () => {
    const options = {
      packageJsonPath: './spec/standard.package.json',
      nodeModulesPath: './spec/test_node_modules',
      overrides: {
        'test-module-4': ['main.js', 'index.js']
      },
      order: {
        'test-module-4': 1,
        'test-module-3': 2
      }
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/test-module-4/main.js',
      './spec/test_node_modules/test-module-4/index.js',
      './spec/test_node_modules/test-module-3/index.js'
    ]);
  });

  it('should not changed order of packages specified in package.json if order option is empty', () => {
    const options = {
      packageJsonPath: './spec/standard-reversed.package.json',
      nodeModulesPath: './spec/test_node_modules',
      order: {}
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/test-module-4/index.js',
      './spec/test_node_modules/test-module-3/index.js'
    ]);
  });

  it('should support scoped packages', () => {
    const options = {
      packageJsonPath: './spec/scoped.package.json',
      nodeModulesPath: './spec/test_node_modules'
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/@scoped/module-1/index.js'
    ]);
  });

  it('should support overrides for scoped packages', () => {
    const options = {
      packageJsonPath: './spec/scoped.package.json',
      nodeModulesPath: './spec/test_node_modules',
      overrides: {
        '@scoped/module-1': 'main.js'
      },
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/@scoped/module-1/main.js'
    ]);
  });

  it('should support array overrides for scoped packages', () => {
    const options = {
      packageJsonPath: './spec/scoped.package.json',
      nodeModulesPath: './spec/test_node_modules',
      overrides: {
        '@scoped/module-1': ['main.js', 'index.js']
      },
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/@scoped/module-1/main.js',
      './spec/test_node_modules/@scoped/module-1/index.js',
    ]);
  });

  it('should support relative paths in overrides for scoped packages', () => {
    const options = {
      packageJsonPath: './spec/scoped.package.json',
      nodeModulesPath: './spec/test_node_modules',
      overrides: {
        '@scoped/module-1': ['../module-2/index.js', 'index.js']
      },
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/@scoped/module-2/index.js',
      './spec/test_node_modules/@scoped/module-1/index.js'
    ]);
  });

  it('should return all packages if skip section is empty in config', () => {
    const options = {
      packageJsonPath: './spec/main.skip.package.json',
      nodeModulesPath: './spec/test_node_modules'
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/test-module-1/index.js',
      './spec/test_node_modules/test-module-2/main.js',
      './spec/test_node_modules/test-module-3/index.js',
      './spec/test_node_modules/test-module-4/index.js',
    ]);
  });

  it('should skip package if there\'s true value for this package in  skip section', () => {
    const options = {
      packageJsonPath: './spec/main.skip.package.json',
      nodeModulesPath: './spec/test_node_modules',
      skip: {
        'test-module-1': true
      }
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/test-module-2/main.js',
      './spec/test_node_modules/test-module-3/index.js',
      './spec/test_node_modules/test-module-4/index.js',
    ]);
  });

  it('should not skip package if there\'s false value for this package in  skip section', () => {
    const options = {
      packageJsonPath: './spec/main.skip.package.json',
      nodeModulesPath: './spec/test_node_modules',
      skip: {
        'test-module-1': false
      }
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/test-module-1/index.js',
      './spec/test_node_modules/test-module-2/main.js',
      './spec/test_node_modules/test-module-3/index.js',
      './spec/test_node_modules/test-module-4/index.js',
    ]);
  });

  it('should support skipping for scoped packages', () => {
    const options = {
      packageJsonPath: './spec/scoped.skip.package.json',
      nodeModulesPath: './spec/test_node_modules',
      skip: {
        '@scoped/module-1': true,
      }
    };
    const files = getMainNodeFiles(options);

    expect(files).toEqual([
      './spec/test_node_modules/@scoped/module-2/index.js',
    ]);
  });

});
