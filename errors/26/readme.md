# WebGL not supported, and no fallback module included

This happens when your browser does not support WebGL, **and** the canvas
fallback module (`boost-canvas.js`) has not been included OR if the fallback
module was included **after** the boost module.

Make sure you include `boost-canvas.js`, and that it's included before
`boost.js`.
