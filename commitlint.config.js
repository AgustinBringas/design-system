/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'tokens',
        'theme',
        'components',
        'hooks',
        'utils',
        'storybook',
        'build',
        'ci',
        'deps',
        'release',
        'a11y',
      ],
    ],
    'body-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 72],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'revert'],
    ],
  },
};

export default config;
