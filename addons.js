const { toCamelCase } = require('cna-cli/src/helpers');

const BASE_URL = 'Create-Node-App/react-webpack-extensions';
const DOCKER_BASE_URL = 'Create-Node-App/docker-extensions';
const ANDROID_TOOLS_BASE_URL = 'Create-Node-App/android-tools';

module.exports = (options) => {
  const lang = options.typescript ? 'ts' : 'es';
  const langAddons = [
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
      addon: `${BASE_URL}@addon/base#type=common`,
      git: true,
    },
    {
      addon: `${BASE_URL}@addon/base#type=${lang}`,
      git: true,
    },
  ];

  langAddons.forEach((addon) => {
    if (options[toCamelCase(addon)]) {
      addons.push({ addon: `${BASE_URL}@addon/${addon}#type=common`, git: true });
      addons.push({ addon: `${BASE_URL}@addon/${addon}#type=${lang}`, git: true });
    }
  });

  if (options.ionic) {
    addons.push({ addon: `${BASE_URL}@addon/ionic`, git: true });
  }
  if (options.androidTools) {
    addons.push({ addon: `${ANDROID_TOOLS_BASE_URL}@addon/docker/android`, git: true });
  }
  if (options.docker) {
    addons.push({ addon: `${DOCKER_BASE_URL}@addon/docker/web`, git: true });
  }

  if (options.extend) {
    addons.push(...options.extend.map((addon) => ({ addon, git: true })));
  }

  return addons;
};
