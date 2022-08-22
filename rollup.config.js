import path from 'path';
import ts from 'rollup-plugin-typescript';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const packageFormats= process.env.FORMATS && process.env.FORMATS.split(',');
const sourcemap = process.env.SOURCEMAP;
const target = process.env.TARGET;

const packagesDir = path.resolve(__dirname, 'packages'); // packages目录路径
const packageDir = path.resolve(packagesDir, target); // 具体target的路径
const packageName = path.basename(packageDir); // target目录名称-包名称
const resolve = p => path.resolve(packageDir, p);

const pkg = require(resolve('package.json'));

const outputConfig = {
  'esm-bundler': {
    file: resolve(`dist/${packageName}.esm.bundler.js`),
    format: 'es',
  },
  'cjs': {
    file: resolve(`dist/${packageName}.cjs.js`),
    format: 'cjs',
  },
  'global': {
    file: resolve(`dist/${packageName}.global.js`),
    format: 'iife',
  },
}

const packageConfigs = packageFormats || pkg.buildOption.formats;

const createConfig = (format, output) => {
  output.sourcemap = sourcemap;
  output.exports = 'named';
  let external = [];
  if (format === 'global') {
    output.name = pkg.buildOption.name;
  } else {
    output.external = [...Object.keys(pkg.dependenies)]
  }
  return {
    input: resolve('src/index.ts'),
    output,
    external,
    plugins: [
      ts(),
      commonjs(),
      json(),
      nodeResolve(),
    ]
  }
}

export default packageConfigs.map(format => createConfig(format, outputConfig[format]));