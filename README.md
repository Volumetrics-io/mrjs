![The MRjs logo, an indigo and purple bowtie.](https://docs.mrjs.io/static/mrjs-logo.svg)

An extensible library of Web Components for the spatial web.

[![npm run build](https://github.com/Volumetrics-io/mrjs/actions/workflows/build.yml/badge.svg)](https://github.com/Volumetrics-io/mrjs/actions/workflows/build.yml) [![npm run test](https://github.com/Volumetrics-io/mrjs/actions/workflows/test.yml/badge.svg)](https://github.com/Volumetrics-io/mrjs/actions/workflows/test.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Volumetrics-io/mrjs/blob/main/LICENSE) [![examples](https://img.shields.io/badge/examples-ee99ff)](https://examples.mrjs.io)) [![docs](https://img.shields.io/badge/documentation-8A2BE2)](https://docs.mrjs.io)

## Overview
 
MRjs is a mixed-reality-first, WebXR user interface library meant to bootstrap spatial web development. It implements much of the foundational work so that developers can spend less time on the basics and more time on their app.

Designed to be extensible, MRjs provides a familiar interface via [THREE.js](https://github.com/mrdoob/three.js), the [Custom Elements API](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), [Rapier.js](https://github.com/dimforge/rapier), and our own built-in ECS (Entity Component System) setup.

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

### Samples

> This only works if you're setting this up [via github source](#via-github-source); otherwise, go to [mrjs.io](https://mrjs.io) to try out the samples there.

> We serve some of our examples and testing files from submodules, if you are planning to contribute, there will be times when the submodule for your work might be out of date. Since we run scripts along with our submodule update, make sure to run the following in that case (note, we wont have to do this that often, so you probably wont need to do this unless the test fails and tells you to do so): `npm run update-submodules`

You are able to try the samples locally and in headset by running the following:

 <sub><i>(note for in headset testing: [https requirement](https://github.com/Volumetrics-io/mrjs#https-requirement))</i></sub>

```sh
npm run server
```

### Tests

 <sub><i>(this follows the need for the same `update-submodules` note as the 'running the samples' section)</i></sub>

```sh
npm run test
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

## Documentation:

Check [docs.mrjs.io](https://docs.mrjs.io) or our [repository](https://github.com/Volumetrics-io/documentation) for the full documentation.

For local documentation or to check the local output when writing your own PR to see how it will update, run the below command. As a heads-up, the order of creation of docs depends on your operating system, so if when you run this and the order looks different, no worries - in the repository itself our action will handle that for you and default to use the right version for these automatically generated docs.

```sh
npm run docs
```

# Features

## Familiar 2D UI API

Create 2D UI using CSS and `mr-panel`

```html
<style>
.layout {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 10px;
    grid-auto-rows: minmax(100px, auto);
}
.title {
    margin: 0 auto;
    font-size: 5vw;
    line-height: 100%;
    color: rgba(24, 24, 24, 0.75);
    grid-column: 2;
}

mr-img {
    object-fit: cover;
    grid-row: 3 / 6;
    grid-column: 1 / -1;
}

#logo {
    grid-column : 2;
    scale: 0.001; /* set 3D content size */
    z-index: 100; /* set position on Z-axis */
}
</style>
<mr-app>
    <!-- The 2D UI Panel -->
    <mr-panel class="layout">
        <mr-text class="title">
            This is a quick example of an image gallery with explainer text.
        </mr-text>
        <mr-img src="..."></mr-img>
        <!--wrap non-UI components in mr-div to anchor to UI-->
        <mr-div id="logo">
            <mr-model src="./assets/models/logo.glb"></mr-model> 
        </mr-div>
    </mr-panel>
</mr-app>
```

## Entity Component System

MRjs is designed from the ground up using the Entity-Component-System Architecture. This is a common architecture implemented by Game Engines such as Unity, Unreal, and RealityKit.

### Entity

An Entity is an object. It stores only the most fundamental data, such as a unique identifier, a THREE.js Object3D, a physics body, and dimension data such as width and scale.

Any `mr-*` tag within the `mr-app` is an Entity. `mr-entity` is the spatial equivalent of a `div`.

Creating a custom Entity is as simple as creating a Custom Element via the Web Components API.

Example:

```js
class Spacecraft extends MREntity {
    constructor(){
        this.object3D = this.generateSpacecraft()
    }

    // function to procedurally generate a 3D spacecraft
    generateSpacecraft(){
        ...
    }
}

customElements.get('mr-spacecraft') || customElements.define('mr-spacecraft', Spacecraft)
```

### Systems

A System contains logic that is applied to all entities that have a corresponding Component, using the data stored by the component. Unlike Entities & Components, Systems have no HTML representation and are implemented entirely in JavaScript.

When a component is attached to or detached from an entity, it is added or removed from its System's registry of entities.

Example:

```js
class OrbitSystem extends MRSystem{
    constructor(){
        super()
    }

    // called every frame
    update(deltaTime, frame) {
        for(const entity in this.registry) {
            // Update entity position
            let component = entity.components.get('orbit')
            component.radius
            component.target
            //...
            entity.component.set('orbit', { speed : 1 })
        }
    }

    // Called when an orbit component is attached
    attachedComponent(entity) {
        //...
    }


    // do something when an orbit component is updated
    updatedComponent(entity, oldData) {
        //...
    }

    // do something when an orbit component is detached
    detachedComponent(entity) {
        //...
    }
}
```

When you define a custom system, it listens for events triggered when the System's corresponding component is attached, updated, or detached. In the above case, `data-comp-orbit`.

#### Components

Components are attached to entities and used to store data. In MRjs they are implemented using data attributes beginning with the prefix `data-comp-`.

Example:

```html
<mr-spacecraft data-comp-orbit="radius: 0.5; target: #user;"></mr-spacecraft>
```

Note: the mapping between components and systems is 1-to-1, and the naming convention (`data-comp-<name>` and `<Name>System`) is strictly enforced.
