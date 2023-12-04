# MR.js

[![npm run build](https://github.com/Volumetrics-io/MR.js/actions/workflows/build.yml/badge.svg)](https://github.com/Volumetrics-io/MR.js/actions/workflows/build.yml) [![npm run test](https://github.com/Volumetrics-io/MR.js/actions/workflows/test.yml/badge.svg)](https://github.com/Volumetrics-io/MR.js/actions/workflows/test.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Volumetrics-io/MR.js/blob/main/LICENSE)

An extendable WebComponents library for the Spatial Web

## Overview

MR.js is a Mixed Reality first, webXR UI library meant to bootstrap spatail web app development. It implements much of the foundational work so that developers can spend less time on the basics and more time on their app.
 
## Getting started
 
CDN:

`<script src="https://cdn.jsdelivr.net/gh/volumetrics-io/mrjs@latest/dist/mr.js"></script>
`

NPM:

`npm install volumetrics-io/mr.js`

from source:

`npm install && npm run build`

in headset testing:

`npm run server`

## HTTPS Requirement

In order to test on headset, WebXR requires that your project be served using an HTTPS server. If you're using WebPack you can achieve this by utilizing the [DevServer webpack plugin](https://webpack.js.org/configuration/dev-server/) with `https: true`. 

Here are some additional solutions:

- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code
- [via python](https://anvileight.com/blog/posts/simple-python-http-server/)

Both options require you generate an ssl certificate & key via openssl:

`openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365`

# Features

## General Starting CSS

*For now there is some needed initial css for readability of the following feature examples*
*Play around with the options as you get more used to the 2D/3D html setup*

```css
* {
    padding: 0;
    margin: 0;
    border: none;
    border-collapse: collapse;
}

html {
    overflow: hidden;
    overscroll-behavior: none;
}

body {
    position: fixed;
}

mr-container {
    height: 100vh;
    width: 100%;
}

mr-app * {
    display: block;
}

mr-text {
    color: red;
    font-size: 100px;
}

mr-model {
    scale: 0.001;
    z-index: 100;
}

```

## 2D UI & Layout Components

```html
<mr-app>
    <!-- The 3D Area -->
    <mr-surface>
        <!-- The 3D UI Container -->
        <mr-container>
            <mr-row>
                <mr-text>
                    This is a quick example of an image gallery with explainer text.
                </mr-text>
                <mr-column>
                    <mr-img src="..."></mr-img>
                    <mr-row height="0.02">
                        <mr-button onClick="Prev()"> <- </mr-button>
                        <mr-button onClick="Next()"> -> </mr-button>
                    </mr-row>
                </mr-column>
            </mr-row>
        </mr-container>
    </mr-surface>
</mr-app>
```

## 3D Layout && Content

```html
<mr-app>
    <!-- The 3D Area -->
    <mr-surface>
        <!-- The 3D UI Container -->
        <mr-container>
            <mr-row>
                <mr-column>
                    <mr-text>Loading some 3D Content with Lighting</mr-text>
                    <mr-model src="./assets/models/logo.glb"></mr-model>
                </mr-column>
            </mr-row>
        </mr-container>
    </mr-surface>
    <!-- Let's add some 3D lighting -->
    <mr-entity data-position="0 0 2">
        <mr-light layer="2" color="hsl(30, 100%, 50%)" intensity="1" data-position="0 1 0"></mr-light>
        <mr-light layer="2" color="hsl(208, 100%, 50%)" intensity="2" data-position="1 -1 0"></mr-light>
        <mr-light layer="2" color="hsl(340, 100%, 50%)" intensity="3" data-position="-1 -1 0"></mr-light>
    </mr-entity>
</mr-app>
```
## Built-in Physics Engine

Rapier.js is fully integrated out of the box. We use it to power collision based hand-interactions, but ot also support other common features such as:

- Gravity
- Rag doll physics
- Joint constraints
- Vehicles
- Complex collision shapes
- Kinematics

## Extendable

Built on top of THREE.js & WebComponents, and a built in ECS, MR.js provides a familiar interface to create custom Elements that can be reused through out your app.

### ECS

MR.js is designed from the ground up using the Entity-Component-System Architecture. This is a common architecture implemented by Game Engines such as Unity, Unreal, and Apple's RealityKit.

#### Entity

an Entity is an object. It stores only the most fundamental data, such as a unique identifier, a THREE.js Object3D, a physics body, and dimension data such as width and scale.

Any `mr-*` tag within the `mr-app` is an Entity. `mr-entity` is the spatail equivalent of a `div`.

Creating a custom Entity is as simple as creating a Custom Element via the WebComponents API.

Example:

```js
class Spacecraft extends Entity {
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

#### Components

Components are attached to entities and used to store data. in MR.js they are implemented using attributes beginning with the prefix `comp-`.

Example:

```html
<mr-spacecraft comp-orbit="radius: 0.5; target: #user;"></mr-spacecraft>
```

#### Systems

A System contains logic that is applied all entities that have a corresponding Component, using the data stored by the component. unlike Entities & Components, Systems have no HTML representation and are implemented entirely in JS.

When a component is attached or detatched from an entity, it is added or removed from it's System's registry of entities

Example:

```js
class OrbitSystem extends System{
    constructor(){
        super()
    }

    // called every frame
    update(deltaTime, frame) {
        for(const entity in this.registry) {
            // Update entitiy position
        }
    }

    // Called when an orbit component is attached
    attachedComponent(entity, data) {
        ...
    }


    // do something when an orbit component is updated
    updatedComponent(entity, data) {
        ...
    }

    // do something when an orbit component is detatched
    detachedComponent(entity) {
        ...
    }
}
```

Note: the mapping between components and systems is 1-to-1, and the naming convention (`comp-<name>` and `<Name>System`) is strictly enforced. components can only be modified by their matching system. You can also implement a System to do per frame logic without using components, but it's not recommended.
