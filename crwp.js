const prompts = require('prompts');
prompts.override(require('yargs').argv);

const getAddons = require('./addons');
const { Options } = require('./docs');
const backendTemplates = require('./templates');

/**
 * Addons options to bootstrap the React app
 */
const addonsOptions = [
  {
    flag: '--i18n',
    value: 'i18n',
    description: 'Add i18n using `react-i18n` and async backend with locale and timezone support',
  },
  {
    flag: '--redux',
    value: 'redux',
    description: 'Add `redux` setup using `redux-thunk` middleware',
  },
  {
    flag: '--redux-saga',
    value: 'reduxSaga',
    description: 'Add `redux` setup using `redux-saga` middleware',
  },
  {
    flag: '--recoil',
    value: 'recoil',
    description: 'Add recoil.js support and setup the state management library for React',
  },
  {
    flag: '--ant-design',
    value: 'andDesign',
    description: 'Add ant-design setup with ant-design icons package',
  },
  {
    flag: '--bootstrap',
    value: 'bootstrap',
    description: 'Add bootstrap and bootstrap-react setup with theme config',
  },
  {
    flag: '--material-ui',
    value: 'materialUi',
    description: 'Add material ui setup with SVG icons',
  },
  {
    flag: '--semantic-ui',
    value: 'semanticUi',
    description: 'Add semantic ui and semantic ui react setup with theme config',
  },
  {
    flag: '--docker',
    value: 'docker',
    description: 'Generate dockerfiles for web development and deployment',
  },
  {
    flag: '--android-tools',
    value: 'androidTools',
    description:
      'Generate dockerfiles with android tools to perform android emulation, testing and apk generation',
  },
  {
    flag: '--ionic',
    value: 'ionic',
    description: 'Generates cross-platform setup using ionic react and capacitor',
  },
];

/**
 * preprocess user options after bootstrapping the app
 * @param {Options} options - Options to bootstrap application
 * @returns {Options}
 */
const getCrwpOptions = async (options) => {
  let appOptions = options;

  if (appOptions.interactive) {
    const baseInput = await prompts([
      {
        type: 'text',
        name: 'projectName',
        message: `What's your project name?`,
        initial: appOptions.projectName,
      },
      {
        type: 'toggle',
        name: 'useNpm',
        message: 'Use `npm` mandatorily?',
        initial: appOptions.useNpm,
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
        initial: appOptions.typescript,
        active: 'yes',
        inactive: 'no',
      },
    ]);

    baseInput[baseInput.backend] = true;
    let defaultTemplate = '';
    if (baseInput.gatsby) {
      defaultTemplate = 'gatsby-starter-default';
    }

    const templateAutocomplete = [
      {
        type: 'toggle',
        name: 'templateChoice',
        message: `Select existing template for ${baseInput.backend}?`,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: (prev) => (prev === true ? 'autocomplete' : 'text'),
        name: 'template',
        message: 'Template to use to bootstrap application',
        initial: defaultTemplate,
        choices: backendTemplates[baseInput.backend],
        validate: (value = '') => {
          if (baseInput.next || baseInput.gatsby) {
            if (value.trim() === '') {
              return 'You must specify a template when using `Create NextJS app` or `Create Gatsby app`';
            }
          }
          return true;
        },
      },
    ];

    const templateInput = [
      {
        type: 'text',
        name: 'template',
        message: 'Template to use to bootstrap application',
        initial: defaultTemplate,
        validate: (value = '') => {
          if (baseInput.next || baseInput.gatsby) {
            if (value.trim() === '') {
              return 'You must specify a template when using `Create NextJS app` or `Create Gatsby app`';
            }
          }
          return true;
        },
      },
    ];

    const { template } = await prompts(
      backendTemplates[baseInput.backend] ? templateAutocomplete : templateInput
    );

    baseInput.template = template;
    baseInput[baseInput.backend] = !template ? true : template;

    const defaultSrcDir = baseInput.cra === true ? 'src' : appOptions.srcDir;

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
        initial: appOptions.alias,
      },
      {
        type: 'multiselect',
        name: 'addons',
        message: 'Select extensions',
        hint: '- Space to select. Return to submit',
        choices: addonsOptions.map((option) => ({
          title: option.description,
          value: option.value,
        })),
      },
    ]);

    const extendAutocomplete = [
      {
        type: 'toggle',
        name: 'templateChoice',
        message: `Select existing extensions for ${baseInput.backend}?`,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: (prev) => (prev === true ? 'multiselect' : 'text'),
        name: 'extend',
        message: 'Select extensions',
        initial: '',
        separator: (prev) => (prev === true ? undefined : ','),
        choices: backendTemplates[baseInput.backend],
      },
    ];

    const extendInput = [
      {
        type: 'list',
        name: 'extend',
        message: 'Enter custom extensions',
        initial: '',
        separator: ',',
      },
    ];

    const { extend } = await prompts(
      backendTemplates[baseInput.backend] ? extendAutocomplete : extendInput
    );

    let { addons: selectedAddons, ...nextAppOptions } = {
      ...options,
      ...baseInput,
      ...backendConfig,
      extend,
    };

    selectedAddons.forEach((addon) => {
      nextAppOptions[addon] = true;
    });

    appOptions = nextAppOptions;
  }

  const addons = getAddons(appOptions);

  if (appOptions.verbose) {
    console.log({ ...appOptions, addons });
  }

  return { ...appOptions, addons };
};

module.exports = {
  getCrwpOptions,
  addonsOptions,
};
