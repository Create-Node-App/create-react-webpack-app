const { toCamelCase } = require('cna-cli/src/helpers');

const REACT_EXTENSIONS = 'https://github.com/Create-Node-App/react-webpack-extensions';
const DOCKER_EXTENSIONS = 'https://github.com/Create-Node-App/docker-extensions';
const ANDROID_TOOLS_EXTENSIONS = 'https://github.com/Create-Node-App/android-tools';
const CRA_TEMPLATE = `${REACT_EXTENSIONS}?branch=addon/cra&subdir=es`;
const CRA_TS_TEMPLATE = `${REACT_EXTENSIONS}?branch=addon/cra&subdir=ts`;
const NEXTJS_EXAMPLES =
  'https://github.com/vercel/next.js?branch=canary&templatedir=&subdir=examples';
const GATSBY_ORG_URL = 'https://github.com/gatsbyjs';

const getCraTemplateUrl = (template) => {
  try {
    return new URL(template).toString();
  } catch (error) {
    return template;
  }
};

const getGatsbyTemplateUrl = (template) => {
  try {
    return new URL(template).toString();
  } catch (error) {
    return `${GATSBY_ORG_URL}/${template}?branch=master&templatedir=`;
  }
};

const getNextJsExampleUrl = (template) => {
  try {
    return new URL(template).toString();
  } catch (error) {
    return `${NEXTJS_EXAMPLES}/${template}`;
  }
};

module.exports = (options) => {
  const lang = options.typescript ? 'ts' : 'es';
  const langAddons = [
    'i18n',
    'redux',
    'saga',
    'recoil',
    'ant-design',
    'bootstrap',
    'material-ui',
    'semantic-ui',
  ];

  // initialized with base template
  let addons = [
    {
      addon: `${REACT_EXTENSIONS}?branch=addon/base&subdir=common`,
    },
    {
      addon: `${REACT_EXTENSIONS}?branch=addon/base&subdir=${lang}`,
    },
  ];

  if (options.template) {
    addons = [{ addon: options.template }];
  }

  if (options.cra) {
    addons = [
      {
        addon: options.typescript ? CRA_TS_TEMPLATE : CRA_TEMPLATE,
      },
    ];

    if (typeof options.cra === 'string') {
      addons.push({ addon: getCraTemplateUrl(options.cra) });
    }
  }

  if (options.gatsby) {
    addons = [
      {
        addon: getGatsbyTemplateUrl(options.gatsby),
      },
    ];
  }

  if (options.next) {
    addons = [
      {
        addon: getNextJsExampleUrl(options.next),
      },
    ];
  }

  langAddons.forEach((addon) => {
    if (options[toCamelCase(addon)]) {
      addons.push({ addon: `${REACT_EXTENSIONS}?branch=addon/${addon}&subdir=common` });
      addons.push({ addon: `${REACT_EXTENSIONS}?branch=addon/${addon}&subdir=${lang}` });
    }
  });

  if (options.ionic) {
    addons.push({ addon: `${REACT_EXTENSIONS}?branch=addon/ionic` });
  }
  if (options.androidTools) {
    addons.push({ addon: `${ANDROID_TOOLS_EXTENSIONS}?branch=addon/docker/android` });
  }
  if (options.docker) {
    addons.push({ addon: `${DOCKER_EXTENSIONS}?branch=addon/docker/web` });
  }

  if (options.extend) {
    addons.push(...options.extend.filter(Boolean).map((addon) => ({ addon })));
  }

  return addons;
};
