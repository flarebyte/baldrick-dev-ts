import { execa } from 'execa';
import { RunnerContext } from './model';

type VersionsObj = { [Key in string]?: string };

const isVersion = (version?: string): boolean =>
  typeof version === 'string' && version.split('.').length === 2;

export const getYarnVersions = async (): Promise<VersionsObj> => {
  try {
    const { stdout } = await execa('yarn', ['versions', '--json']);
    const content: VersionsObj = JSON.parse(stdout);
    return content;
  } catch (error) {
    throw new Error(`yarn versions did fail with ${error}`);
  }
};

interface YarnInfo {
  name: string;
  description: string;
  version: string;
}

export const getYarnInfo = async (ctx: RunnerContext): Promise<YarnInfo> => {
  try {
    const { stdout, stderr } = await execa('yarn', ['info', '--json']);
    const content: YarnInfo = JSON.parse(stdout);
    const valid = isVersion(content.version);
    if (!valid) {
      ctx.errTermFormatter({
        title: 'yarn info',
        detail: stderr ? `${stderr} ${stdout}` : stdout,
      });
      throw new Error(`yarn info failed to retrieve the version`);
    }
    return content;
  } catch (error) {
    throw new Error(`yarn info did fail with ${error}`);
  }
};

export const npmPublish = async (ctx: RunnerContext): Promise<void> => {
  try {
    const { stdout, stderr } = await execa('npm', ['publish']);
    ctx.termFormatter({
      title: 'npm publish',
      detail: stderr ? `${stderr} ${stdout}` : stdout,
      kind: 'info',
      format: 'default',
    });
  } catch (error) {
    throw new Error(`npm publish did fail with ${error}`);
  }
};

export const ghRelease = async (
  ctx: RunnerContext,
  version: string
): Promise<void> => {
  try {
    // gh release create v0.6.0 --generate-notes
    const { stdout, stderr } = await execa('gh', [
      'release',
      'create',
      `v${version}`,
      '--generate-notes',
    ]);
    ctx.termFormatter({
      title: 'gh release',
      detail: stderr ? `${stderr} ${stdout}` : stdout,
      kind: 'info',
      format: 'default',
    });
  } catch (error) {
    throw new Error(`npm publish did fail with ${error}`);
  }
};
