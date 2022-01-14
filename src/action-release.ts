import { getYarnInfo, ghRelease, npmPublish } from './execa-helper.js';
import {
  InstructionStatus,
  ReleaseAction,
  ReleaseActionOpts,
  RunnerContext,
} from './model.js';
import { readPackageJson } from './package-json.js';

/**
 * @returns true if first publish or the version has been incremented
 */
const isPublishable = async (
  ctx: RunnerContext
): Promise<[boolean, string]> => {
  const localInfo = await readPackageJson();
  const remoteInfo = await getYarnInfo(ctx);
  return localInfo.version === '0.1.0'
    ? [true, '0.1.0']
    : [localInfo.version !== remoteInfo.data.version, localInfo.version];
};

export const runReleaseAction: ReleaseAction = async (
  ctx: RunnerContext,
  options: ReleaseActionOpts
) => {
  const [shouldPublish, version] = await isPublishable(ctx);
  if (!shouldPublish) {
    throw new Error(`The version ${version} is not publishable`);
  }
  ctx.termFormatter({
    kind: 'info',
    title: `Publishing ${version} ...`,
    detail: options,
    format: 'human',
  });

  if (options.flags.includes('aim:check')) {
    const status = shouldPublish ? 'ok' : 'ko';
    ctx.termFormatter({
      kind: 'info',
      title: `Checking publishing for ${version}: ${status}`,
      detail: options,
      format: 'human',
    });
    return Promise.resolve();
  }
  await npmPublish(ctx);
  await ghRelease(ctx, version);
};

export const runReleaseActionWithCatch = async (
  ctx: RunnerContext,
  options: ReleaseActionOpts
): Promise<InstructionStatus> => {
  try {
    ctx.termFormatter({
      kind: 'intro',
      title: `Starting release ...`,
      detail: options,
      format: 'human',
    });
    const started = new Date().getTime();
    await runReleaseAction(ctx, options);
    const finished = new Date().getTime();
    const delta_seconds = ((finished - started) / 1000).toFixed(1);
    ctx.termFormatter({
      title: 'Release - finished',
      detail: `Took ${delta_seconds} seconds`,
      format: 'default',
      kind: 'info',
    });
  } catch (err) {
    ctx.errTermFormatter({
      title: 'Release - release error',
      detail: err,
    });
    throw err;
  }
  return 'ok';
};
