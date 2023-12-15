# mrjs
 
[![npm run build](https://github.com/Volumetrics-io/mrjs/actions/workflows/build.yml/badge.svg)](https://github.com/Volumetrics-io/mrjs/actions/workflows/build.yml) [![npm run test](https://github.com/Volumetrics-io/mrjs/actions/workflows/test.yml/badge.svg)](https://github.com/Volumetrics-io/mrjs/actions/workflows/test.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Volumetrics-io/mrjs/blob/main/LICENSE)

An extendable WebComponents library for the Spatial Web

## Overview

mrjs is a Mixed Reality first, webXR UI library meant to bootstrap spatail web app development. It implements much of the foundational work so that developers can spend less time on the basics and more time on their app.
 
## Getting started
 
CDN:

`<script src="https://cdn.jsdelivr.net/npm/mrjs@latest/dist/mrjs"></script>`

NPM:

`npm i mrjs`

from source:

clone this repo and run:

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

## Built-in Physics Engine

Rapier.js is fully integrated out of the box. We use it to power collision based hand-interactions, but ot also support other common features such as:

- Gravity
- Rag doll physics
- Joint constraints
- Vehicles
- Complex collision shapes
- Kinematics

## Extendable

Designed to be extendable, mrjs provides a familiar interface via THREE.js & the Custom Elements API, and leveled up with a built in ECS.

### ECS

mrjs is designed from the ground up using the Entity-Component-System Architecture. This is a common architecture implemented by Game Engines such as Unity, Unreal, and Apple's RealityKit.

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
            let component = entity.components.get('orbit')
            component.radius
            component.target
            ...
            entity.component.set('orbit', { speed : 1 })
        }
    }

    // Called when an orbit component is attached
    attachedComponent(entity) {
        ...
    }


    // do something when an orbit component is updated
    updatedComponent(entity, oldData) {
        ...
    }

    // do something when an orbit component is detatched
    detachedComponent(entity) {
        ...
    }
}
```

When you define custom system, it listens for events triggered when the Systems corresponding component is attached, updated, or detatched. in the above case, `data-comp-orbit`.

#### Components

Components are attached to entities and used to store data. in mrjs they are implemented using data attributes beginning with the prefix `data-comp-`.

Example:

```html
<mr-spacecraft data-comp-orbit="radius: 0.5; target: #user;"></mr-spacecraft>
```

Note: the mapping between components and systems is 1-to-1, and the naming convention (`data-comp-<name>` and `<Name>System`) is strictly enforced.
