export let RAPIER = null

import('@dimforge/rapier3d').then(rap => {
    RAPIER = rap
    document.dispatchEvent(new CustomEvent(`engine-started`, {bubbles: true}))
})