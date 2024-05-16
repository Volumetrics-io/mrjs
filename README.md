![The MRjs logo, an indigo and purple bowtie.](https://docs.mrjs.io/static/mrjs-logo.svg)

An extensible library of Web Components for the spatial web.

[![npm run build](https://github.com/Volumetrics-io/mrjs/actions/workflows/build.yml/badge.svg)](https://github.com/Volumetrics-io/mrjs/actions/workflows/build.yml) [![npm run test](https://github.com/Volumetrics-io/mrjs/actions/workflows/test.yml/badge.svg)](https://github.com/Volumetrics-io/mrjs/actions/workflows/test.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Volumetrics-io/mrjs/blob/main/LICENSE)

[![docs](https://img.shields.io/badge/documentation-8A2BE2)](https://docs.mrjs.io) [![dev-examples](https://img.shields.io/badge/examples-ee99ff?color=white)](https://examples.mrjs.io)

## Overview
 
MRjs is a mixed-reality-first, WebXR user interface library meant to bootstrap spatial web development. It implements much of the foundational work so that developers can spend less time on the basics and more time on their app.

Designed to be extensible, MRjs provides a familiar interface via [THREE.js](https://github.com/mrdoob/three.js), the [Custom Elements API](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), [Rapier.js](https://github.com/dimforge/rapier), and our own built-in ECS (Entity Component System) setup.

[[ECS - what is it?](https://docs.mrjs.io/ecs/what-is-it/)] - [[ECS - how we use it](https://docs.mrjs.io/ecs/how-we-use-it/)] - [[creating custom entities, components, systems](https://docs.mrjs.io/ecs/how-we-use-it/#defining-custom-components--systems-in-mrjs)]

## Getting started

### Via HTML Script Tag:

For the latest stable version:

```html
<head>
    …
    <script src="https://cdn.jsdelivr.net/npm/mrjs@latest/dist/mr.js"></script>
    …
</head>
```

For the daily build. No guarantee of stability:

```html
<head>
    …
    <script src="https://cdn.jsdelivr.net/gh/volumetrics-io/mrjs/dist/mr.js"></script>
    …
</head>
```

### Via NPM:

```sh
npm i mrjs
```

### Via Github Source:

1)

[Clone this repository](https://github.com/Volumetrics-io/mrjs) ([github's how-to-clone](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories))

```sh
git clone the.cloning.url
```

> If you are planning to contribute to this repo instead of just using is as a source you will need its submodules for proper samples and testing:
> ```sh
> git clone --recurse-submodules the.cloning.url
> ```
> 
> If you've already cloned the repo the normal way (`git clone the.cloning.url`) you can update for the submodule as follows:
> ```sh
> git submodule update --init --recursive
> ```

2)

Next, setup your node environment ([make sure node is setup properly](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)):

```sh
npm install
```

3)

and now build:

```sh
npm run build
```

## Running the samples and tests

<i>Note for in-headset testing: [https requirement](#https-requirement)</i>

### Samples

This only works if you're setting this up [via github source](#via-github-source); otherwise, go to [examples.mrjs.io](https://examples.mrjs.io) to try out the samples there.

You are able to try the samples locally and in headset by running the following:

```sh
npm run server
```

> We serve some of our examples and testing files from submodules, if you are planning to contribute, there will be times when the submodule for your work might be out of date. Since we run scripts along with our submodule update. Run the following to stay up to date:
> ```sh
> npm run update-submodules
> ```

### Tests

```sh
npm run test
```

### Updating Documentation:

Check [docs.mrjs.io](https://docs.mrjs.io) or our [repository](https://github.com/Volumetrics-io/documentation) for the full documentation.

For local documentation or to check the local output when writing your own PR to see how it will update, run the below command.

`Note:` the order of creation of docs depends on your operating system, so if when you run this and the order looks different, do not worry - in the repository itself our action will handle that for you and default to use the right version for these automatically generated docs.

```sh
npm run docs
```

### HTTPS Requirement

To test in headset, WebXR requires that your project be served using an HTTPS server. If you're using Webpack, you can achieve this by utilizing the [Dev Server webpack plugin](https://webpack.js.org/configuration/dev-server/) with `https: true`. 

Here are some additional solutions:

- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code
- [via Python](https://anvileight.com/blog/posts/simple-python-http-server/)

Both options require you generate an SSL certificate and a key via OpenSSL:

```sh
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
```
