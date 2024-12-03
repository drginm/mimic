import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/mimic-assist.js',
    format: 'iife',
    name: 'MimicAssist',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
  ],
};
