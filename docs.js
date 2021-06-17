const { Options: CnaOptions } = require('cna-cli');

/**
 * Backend to boostrap the React application
 * @typedef {('crwp'|'cra'|'next'|'gatsby')} Backend
 */

/**
 * Options to bootstrap the React application
 * @typedef {CnaOptions} Options
 * @property {(Backend|undefined)} backend - Specify what backend to use
 * @property {boolean} typescript - Setup using typescript if possible
 * @property {(boolean|undefined)} crwp - Specifies if 'crwp' was selected as backend
 * @property {(string|boolean|undefined)} cra - Specifies if 'cra' was selected as backend
 * @property {(string|undefined)} next - Specifies the template to use when `create-next-app` was selected as backend
 * @property {(string|undefined)} gatsby - Specifies the template to use when `gatsby` was selected as backend
 */
