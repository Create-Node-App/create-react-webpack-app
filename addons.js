const { toCamelCase } = require('cna-cli/src/helpers');

const REACT_EXTENSIONS = 'Create-Node-App/react-webpack-extensions';
const DOCKER_EXTENSIONS = 'Create-Node-App/docker-extensions';
const ANDROID_TOOLS_EXTENSIONS = 'Create-Node-App/android-tools';
const CRA_TEMPLATE = `${REACT_EXTENSIONS}@addon/cra#path=es`;
const CRA_TS_TEMPLATE = `${REACT_EXTENSIONS}@addon/cra#path=ts`;

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
      addon: `${REACT_EXTENSIONS}@addon/base#path=common`,
      git: true,
    },
    {
      addon: `${REACT_EXTENSIONS}@addon/base#path=${lang}`,
      git: true,
    },
  ];

  if (options.cra) {
    addons = [
      {
        addon: options.typescript ? CRA_TS_TEMPLATE : CRA_TEMPLATE,
        git: true,
      },
    ];
  }

  langAddons.forEach((addon) => {
    if (options[toCamelCase(addon)]) {
      addons.push({ addon: `${REACT_EXTENSIONS}@addon/${addon}#path=common`, git: true });
      addons.push({ addon: `${REACT_EXTENSIONS}@addon/${addon}#path=${lang}`, git: true });
    }
  });

  if (options.ionic) {
    addons.push({ addon: `${REACT_EXTENSIONS}@addon/ionic`, git: true });
  }
  if (options.androidTools) {
    addons.push({ addon: `${ANDROID_TOOLS_EXTENSIONS}@addon/docker/android`, git: true });
  }
  if (options.docker) {
    addons.push({ addon: `${DOCKER_EXTENSIONS}@addon/docker/web`, git: true });
  }

  if (options.extend) {
    addons.push(...options.extend.map((addon) => ({ addon, git: true })));
  }

  return addons;
};
