# React + Webpack Starter

[![Build Status](https://github.com/Create-Node-App/create-react-webpack-app/workflows/Build/badge.svg)](https://github.com/Create-Node-App/create-react-webpack-app/commits/master)
[![npm](https://img.shields.io/npm/v/create-react-webpack-project.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/create-react-webpack-project)
[![npm](https://img.shields.io/npm/dm/create-react-webpack-project.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/create-react-webpack-project)

This starter kit is designed to get you up and running with a bunch of awesome front-end technologies.

The primary goal of this project is to provide a stable foundation upon which to build modern web appliications. Its purpose is not to dictate your project structure or to demonstrate a complete real-world application, but to provide a set of tools intended to make front-end development robust and easy.

## Quickstart

```sh
$ npx create-react-webpack-project my-app # or specify flag `-i` to use interactive menu
$ cd my-app
$ npm start
```

the generated project will vary in the presence of the following flags:

| Flag                    | What is it for?                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `-i, --interactive`     | use interactive mode to bootstrap your app                                          |
| `--verbose`             | print additional logs.                                                              |
| `--info`                | print environment debug info.                                                       |
| `--nodeps`              | will no install dependencies on the generated project.                              |
| `--use-npm`             | will use npm as command.                                                            |
| `--template <template>` | specify template to use for initial setup                                           |
| `--cra [template]`      | use `create-react-app` for initial setup with optional example                      |
| `--gatsby <template>`   | use `gatsby` using an existing boilerplate for initial setup                        |
| `--next <example>`      | use `create-next-app` for initial setup using a nextjs example                      |
| `--inplace`             | apply setup to an existing project.                                                 |
| `-a <alias>`            | will setup webpack alias. `app` by default.                                         |
| `--src-dir <src-dir>`   | dir name to put content under `[src]/`. `src` by default.                           |
| `--typescript`          | add TypeScript support.                                                             |
| `--i18n`                | add i18n setup using react-i18n and async backend with locale and timezone support. |
| `--redux`               | add redux support and setup using redux thunk middleware by default.                |
| `--redux --saga`        | add redux support and setup using redux saga middleware.                            |
| `--recoil`              | add recoil.js support and setup the state management library for React.             |
| `--ant-design`          | add ant-design setup with ant-design icons package.                                 |
| `--bootstrap`           | add bootstrap and bootstrap-react setup with theme config.                          |
| `--material-ui`         | add material ui setup with SVG icons.                                               |
| `--semantic-ui`         | add semantic ui and semantic ui react setup with theme config.                      |
| `--ionic`               | generate cross platform setup using ionic react and capacitor.                      |
| `--docker`              | generate dockerfiles for development and production environments.                   |
| `--android-tools`       | generate dockerfiles to perform android emulation, testing and apk generation.      |

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))_

## Creating an app

**You’ll need to have Node 12.14.0 or later on your local development machine** (but it’s not required on the server). You can use [fnm](https://github.com/Schniz/fnm) to easily switch Node versions between different projects.

To create a new app, you may choose one of the following methods:

### npx

```sh
$ npx create-react-webpack-project my-app
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))_

### npm

```sh
$ npm init react-webpack-project my-app
```

_`npm init <initializer>` is available in npm 6+_

### yarn

```sh
$ yarn create react-webpack-project my-app
```

_`yarn create` is available in Yarn 0.25+_

It will create a directory called `my-app` inside the current folder.<br>
Inside that directory, it will generate the initial project structure and install the transitive dependencies.

## Contributors

<a href="https://github.com/Create-Node-App/create-node-app/contributors">
  <img src="https://contrib.rocks/image?repo=Create-Node-App/create-node-app"/>
</a>

Made with [contributors-img](https://contrib.rocks).
