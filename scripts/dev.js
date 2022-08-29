const minimist = require('minimist');
const execa = require('execa')

const args = minimist(process.argv.slice(2));
const target = args._.length ? args._[0] : 'reactivity';
const formats = args.f || 'global'; // esm cjs global
const sourceMap = args.s || false;

execa('rollup', [
  '-wc', // --watch --config
  '--environment',
  [
    `TARGET:${target}`,
    `FORMATS:${formats}`,
    sourceMap ? 'SOURCEMAP:true': "",
    `SOURCEMAP:${sourceMap ? true : false}`
  ].filter(Boolean).join(','),
], {
  stdio: 'inherit'
})