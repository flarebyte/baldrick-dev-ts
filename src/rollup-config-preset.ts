import { RollupOptions } from 'rollup';
import { PresetRollupOptions } from './model';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import sourceMaps from 'rollup-plugin-sourcemaps';
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

  return {
    input: opts.input,
    treeshake: {
      propertyReadSideEffects: false,
    },
    output: {
      file: outputName,
      format: opts.format,
      freeze: false,
      esModule: true,
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
      }),
      sourceMaps(),
    ],
  };
};
