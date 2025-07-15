/* global window */
/* eslint quotes: 0, quote-props: 0 */
/* eslint-disable no-loss-of-precision */
/**
 * This file contains local representations of JSON data used in the samples,
 * making it possible to run the tests offline. The `window.KarmaFetch` object
 * is later extended in karma-conf.js with the contents of local data files,
 * and used from karma-setup.js.
 */
window.JSONSources = {
    ...window.JSONSources,
    '/data/sine-data.csv': function () {
        const csv = [[ 'X', 'sin(n)', 'sin(-n)' ]];

        for (let i = 0, iEnd = 10, x; i < iEnd; ++i) {
            x = 3184606 + Math.random();
            csv.push([x, Math.sin(x), Math.sin(-x)]);
        }

        return csv.map(line => line.join(',')).join('\n');
    }
    // add more fetch results with `[key]: result`
};
