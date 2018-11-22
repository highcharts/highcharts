# WebGL not supported, and no fallback module included

This happens when the browser doesn't support WebGL, **and** the canvas
fallback module (`boost-canvas.js`) hasn't been included OR if the fallback
module was included **after** the boost module.

If a fallback is required, make sure to include `boost-canvas.js`, and that
it's included before `boost.js`.

Please note that the fallback module is not intended as a fully-featured one.
Rather, it's a minimal implementation of the WebGL counterpart.
