#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const envinfo = require('envinfo');
const prompts = require('prompts');
prompts.override(require('yargs').argv);
const { createApp } = require('cna-cli/src/install');

const packageJS = require('./package.json');
const getAddons = require('./addons');

const addonsOptions = [
  {
    flag: '--i18n',
    value: 'i18n',
    description:
      'add i18n setup using react-i18n and async backend with locale and timezone support',
  },
  {
    flag: '--redux',
    value: 'redux',
    description: 'add redux support and setup using redux thunk middleware by default',
  },
  {
    flag: '--saga',
    value: 'saga',
    description:
      'add redux support and setup using redux saga middleware. --redux flag is required',
  },
  {
    flag: '--recoil',
    value: 'recoil',
    description: 'add recoil.js support and setup the state management library for React',
  },
  {
    flag: '--ant-design',
    value: 'andDesign',
    description: 'add ant-design setup with ant-design icons package',
  },
  {
    flag: '--bootstrap',
    value: 'bootstrap',
    description: 'add bootstrap and bootstrap-react setup with theme config',
  },
  {
    flag: '--material-ui',
    value: 'materialUi',
    description: 'add material ui setup with SVG icons',
  },
  {
    flag: '--semantic-ui',
    value: 'semanticUi',
    description: 'add semantic ui and semantic ui react setup with theme config',
  },
  { flag: '--docker', value: 'docker', description: 'generate dockerfiles' },
  {
    flag: '--android-tools',
    value: 'androidTools',
    description:
      'generate dockerfiles with android tools to perform android emulation, testing and apk generation.',
  },
  {
    flag: '--ionic',
    value: 'ionic',
    description: 'generates cross-platform setup using ionic react and capacitor',
  },
];

let projectName = 'app';

program
  .version(packageJS.version)
  .arguments('[project-directory]')
  .usage(`${chalk.green('[project-directory]')} [options]`)
  .action((name) => {
    projectName = name || projectName;
  })
  .option('--verbose', 'print additional logs')
  .option('--info', 'print environment debug info')
  .option('--use-npm', 'use npm mandatorily')
  .option('-i, --interactive', 'use interactive mode to bootstrap your app')
  .option('--template <template>', 'especify template to use for initial setup')
  .option('--cra [template]', 'use `create-react-app` with optional template for initial setup')
  .option('--gatsby <template>', 'use `gatsby` using an existing boilerplate for initial setup')
  .option('--next <example>', 'use `create-next-app` using a nextjs example for initial setup')
  .option('--typescript', 'add TypeScript support')
  .option('--extend <repos...>', 'git repositories to extend your boilerplate')
  .option('-a, --alias <alias>', 'webpack alias', 'app')
  .option('--src-dir <src-dir>', 'dir name to put content under [src]/', '')
  .option('--nodeps', 'generate package.json file without installing dependencies')
  .option('--inplace', 'apply setup to an existing project');

addonsOptions.forEach((option) => {
  program.option(option.flag, option.description, option.default);
});

program
  .allowUnknownOption()
  .on('--help', () => {
    console.log();
    console.log(`    Only ${chalk.green('[project-directory]')} is required.`);
    console.log();
    console.log(`    If you have any problems, do not hesitate to file an issue:`);
    console.log(`      ${chalk.cyan(`${packageJS.bugs.url}/new`)}`);
  })
  .parse(process.argv);

const options = program.opts();

if (options.info) {
  console.log(chalk.bold('\nEnvironment Info:'));
  envinfo
    .run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'npm', 'Yarn'],
        Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
      },
      {
        clipboard: false,
        duplicates: true,
        showNotFound: true,
      }
    )
    .then((info) => {
      console.log(info);
      process.exit(0);
    });
}

if (typeof projectName === 'undefined') {
  console.error('Please specify the project directory:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('[project-directory]')}`);
  console.log();
  console.log('For example:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`);
  console.log();
  console.log(`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`);
  process.exit(1);
}

if (options.interactive) {
  (async () => {
    const baseInput = await prompts([
      {
        type: 'text',
        name: 'projectName',
        message: `What's your project name?`,
        initial: projectName,
      },
      {
        type: 'toggle',
        name: 'useNpm',
        message: 'Use `npm` mandatorily?',
        initial: options.useNpm,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: 'select',
        name: 'backend',
        message: 'Select tool for initial setup',
        choices: [
          { title: 'Create React Webpack app', value: 'crwp' },
          { title: 'Create React app', value: 'cra' },
          { title: 'Create NextJS app', value: 'next' },
          { title: 'Create Gatsby app', value: 'gatsby' },
        ],
        initial: 0,
      },
      {
        type: 'toggle',
        name: 'typescript',
        message: 'Use typescript?',
        initial: options.typescript,
        active: 'yes',
        inactive: 'no',
      },
    ]);

    baseInput[baseInput.backend] = baseInput;
    let defaultTemplate = '';
    if (baseInput.gatsby) {
      defaultTemplate = 'gatsby-starter-default';
    }

    const { template } = await prompts([
      {
        type: 'text',
        name: 'template',
        message: 'Template to use to bootstrap application',
        initial: defaultTemplate,
        validate: (value) => {
          if (baseInput.next || baseInput.gatsby) {
            if (value.trim() === '') {
              return 'You must specify a template when using `Create NextJS app` or `Create Gatsby app`';
            }
          }
          return true;
        },
      },
    ]);

    baseInput.template = template;
    baseInput[baseInput.backend] = template === '' ? true : template;

    const defaultSrcDir = baseInput.cra === true ? 'src' : options.srcDir;

    const backendConfig = await prompts([
      {
        type: 'text',
        name: 'srcDir',
        message:
          'Sub directory to put all source content (.e.g. `src`, `app`). Will be on root directory by default',
        initial: defaultSrcDir,
      },
      {
        type: 'text',
        name: 'alias',
        message: 'Webpack alias if needed',
        initial: options.alias,
      },
      {
        type: 'multiselect',
        name: 'addons',
        message: 'Select extensions',
        choices: addonsOptions.map((option) => ({
          title: option.description,
          value: option.value,
        })),
      },
      {
        type: 'list',
        name: 'extend',
        message: 'Enter extensions',
        initial: '',
        separator: ',',
      },
    ]);

    let { addons: selectedAddons, ...appOptions } = {
      ...options,
      ...baseInput,
      ...backendConfig,
    };

    selectedAddons.forEach((addon) => {
      appOptions[addon] = true;
    });

    const addons = getAddons(appOptions);

    if (appOptions.verbose) {
      console.log({ ...appOptions, addons });
    }

    await createApp(
      appOptions.projectName,
      appOptions.verbose,
      appOptions.useNpm,
      appOptions.inplace,
      addons,
      appOptions.alias,
      !appOptions.nodeps,
      false,
      appOptions.srcDir
    );
  })();
} else {
  const addons = getAddons(options);

  createApp(
    projectName,
    options.verbose,
    options.useNpm,
    options.inplace,
    addons,
    options.alias,
    !options.nodeps,
    false,
    options.srcDir
  );
}
