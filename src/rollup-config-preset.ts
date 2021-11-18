import { RollupOptions } from 'rollup';
import { PresetRollupOptions } from './model';

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
      esModule: false, //should be true
      name: opts.name,
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      {
        name: 'node-resolve',
      },
      {
        name: 'commonjs',
      },
      {
        name: 'json',
      },
      {
        name: 'rpt2',
      },
      {
        name: 'sourcemaps',
      },
    ],
  };
};
