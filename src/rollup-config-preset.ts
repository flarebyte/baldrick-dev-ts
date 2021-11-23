import { RollupOptions } from 'rollup';
import { PresetRollupOptions } from './model';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import ts from 'typescript';

export const esmRollupPreset = (opts: PresetRollupOptions): RollupOptions => {
  const outputName = [
    `${opts.buildFolder}/${opts.name}`,
    opts.format,
    opts.strategy,
    'js',
  ]
    .filter(Boolean)
    .join('.');

  const shouldMinify = false;

  return {
    input: opts.input,
    treeshake: {
      propertyReadSideEffects: false,
    },
    output: {
      file: outputName,
      format: opts.format,
      freeze: false,
      esModule: false, //should be true
      name: opts.name,
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      resolve(),
      json(),
      typescript({
        typescript: ts,
        tsconfigDefaults: {
          exclude: [
            '**/*.spec.ts',
            '**/*.test.ts',
            'node_modules',
            opts.buildFolder,
          ],
          compilerOptions: {
            sourceMap: true,
            declaration: true,
          },
        },
        tsconfigOverride: {
          compilerOptions: {
            target: 'esnext',
          },
        },
      }),
      sourceMaps(),
      shouldMinify &&
        terser({
          output: { comments: false },
          compress: {
            keep_infinity: true,
            pure_getters: true,
            passes: 10,
          },
          ecma: 2018,
          toplevel: false,
        }),
    ],
  };
};
