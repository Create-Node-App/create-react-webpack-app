#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const { cna } = require('cna-cli');
const { getCrwpOptions, addonsOptions } = require('./crwp');
const packageJS = require('./package.json');

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
  .option('--template <template>', 'specify template to use for initial setup')
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

/**
 * Main procress to bootstrap the Node app using user options
 * @param {Options} options - Options to bootstrap application
 * @param {(options: Options) => Promise<Options>} transformOptions - Transform options with customization
 */
const crwp = (options, transformOptions = getCrwpOptions) => cna(options, transformOptions);

if (require.main === module) {
  crwp({ ...program.opts(), projectName });
}

module.exports = {
  crwp,
};
