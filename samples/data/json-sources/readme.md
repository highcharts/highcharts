This folder contains local representations of JSON data used in the samples,
making it possible to run the tests offline. Add URL mappings to `index.json`.
The Playwright fixtures use these mappings to rewrite requests to local files.
The test setup also creates `window.JSONSources` for samples that read recorded
responses directly.
