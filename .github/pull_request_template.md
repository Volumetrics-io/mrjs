## Linking

Options:

- *From: Link to whatever issue comment started this*
- *Fixes #issue*
- *Related to #issue*

## Problem

*Description of the problem including potential code and/or screenshots as an example*

## Solution

*Quick explanation of change to be done*

### Breaking Change

*If this is a breaking change describe the before and after and why the change was necessary*

## Notes

*Notes and any associated research or links*

------------

## Required to Merge

- [ ] **PASS** - all necessary actions must pass (excluding the auto-skipped ones)
- [ ] **TEST IN HEADSET** - [main dev-testing-example](https://github.com/Volumetrics-io/mrjs/tree/main/samples/index.html) and any of the other [examples](https://github.com/Volumetrics-io/mrjs/tree/main/samples/examples) still work as expected
- [ ] **VIDEO** - if this pr changes something visually - post a video here of it in headset-MR and/or on desktop (depending on what it affects) for the reviewer to reference.
- [ ] **TITLE** - make sure the pr's title is updated appropriately as it will be used to name the commit on merge
- [ ] **BREAKING CHANGE**
  - **DOCUMENTATION**: This includes any changes to html tags and their components
    - make a pr in the [documentation repo](https://github.com/Volumetrics-io/documentation) that updates the manual docs to match the breaking change
    - link the pr of the documentation repo here: *#pr*
    - that pr must be approved by `@lobau`
  - **SAMPLES/INDEX.HTML**: This includes any changes (html tags or otherwise) that must be done to our landing page submodule as an effect of this pr's updates
    - make a pr in the [mrjs landing page repo](https://github.com/Volumetrics-io/mrjs-landing) that updates the landing page to match the breaking change
    - link the pr of the landing page repo here: *#pr*
    - that pr must be approved by `@hanbollar`
