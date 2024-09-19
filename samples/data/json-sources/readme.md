This folder contains local representations of JSON data used in the samples,
making it possible to run the tests offline. URL-mapping should be added to
`index.json`. The `window.JSONSources` object is later extended in
`karma-conf.js` with the contents of local data files, and used from
`karma-setup.js`.