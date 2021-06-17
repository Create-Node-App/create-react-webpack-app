const { toCamelCase } = require('cna-cli/lib/helpers');
const { Options } = require('.');

const REACT_EXTENSIONS = 'https://github.com/Create-Node-App/react-extensions';
const DOCKER_EXTENSIONS = 'https://github.com/Create-Node-App/docker-extensions';
const ANDROID_TOOLS_EXTENSIONS = 'https://github.com/Create-Node-App/android-tools';
const CRA_TEMPLATE = `${REACT_EXTENSIONS}?branch=main&subdir=addons/create-react-app/es`;
const CRA_TS_TEMPLATE = `${REACT_EXTENSIONS}?branch=main&subdir=addons/create-react-app/ts`;
const NEXTJS_EXAMPLES =
  'https://github.com/Create-Node-App/nextjs-extensions?branch=main&templatedir=&subdir=examples';
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

/**
 * getExtensionUrl returns the extension URL based on selected backend
 *
 * @param {Options} options - User options to build setup
 * @param {(string | undefined)} template - Template url or name specified for the user
 * @returns {string} - extension url
 */
const getExtensionUrl = (options, template) => {
  if (options.cra && typeof options.cra === 'string') {
    return getCraTemplateUrl(template || options.cra);
  }
  if (options.next) {
    return getNextJsExampleUrl(template || options.next);
  }
  if (options.gatsby) {
    return getGatsbyTemplateUrl(template || options.gatsby);
  }
  return template;
};

/**
 * get addons from user options
 * @param {Options} options - Options specified by the user to create addons
 * @returns {{ addon: string, ignorePackage?: boolean }[]}
 */
module.exports = (options) => {
  const lang = options.typescript ? 'ts' : 'es';
  const langAddons = [
    'i18n',
    'redux',
    'redux-saga',
    'recoil',
    'ant-design',
    'bootstrap',
    'material-ui',
    'semantic-ui',
  ];

  // initialized with base template
  let addons = [
    {
      addon: `${REACT_EXTENSIONS}?branch=main&subdir=addons/webpack-base/common`,
    },
    {
      addon: `${REACT_EXTENSIONS}?branch=main&subdir=addons/webpack-base/${lang}`,
    },
  ];

  if (options.cra) {
    addons = [
      {
        addon: options.typescript ? CRA_TS_TEMPLATE : CRA_TEMPLATE,
      },
    ];
  }

  const baseTemplate = getExtensionUrl(options, options.template);

  if (baseTemplate) {
    addons = options.cra ? [...addons, { addon: baseTemplate }] : [{ addon: baseTemplate }];
  }

  langAddons.forEach((addon) => {
    if (options[toCamelCase(addon)]) {
      addons.push({ addon: `${REACT_EXTENSIONS}?branch=main&subdir=addons/${addon}/common` });
      addons.push({ addon: `${REACT_EXTENSIONS}?branch=main&subdir=addons/${addon}/${lang}` });
    }
  });

  if (options.ionic) {
    addons.push({ addon: `${REACT_EXTENSIONS}?branch=main&subdir=addons/ionic` });
  }
  if (options.androidTools) {
    addons.push({ addon: `${ANDROID_TOOLS_EXTENSIONS}?branch=addon/docker/android` });
  }
  if (options.docker) {
    addons.push({ addon: `${DOCKER_EXTENSIONS}?branch=addon/docker/web` });
  }

  if (options.extend) {
    addons.push(
      ...options.extend.filter(Boolean).map((addon) => ({ addon: getExtensionUrl(options, addon) }))
    );
  }

  return addons;
};
