/**
 * This was a once-off job to convert GeoJSON-samples to TopoJSON
 * Keeping the file here in case we need to deal with more similar cases.
 *
 * Usage: From root, run
 *
 * node tools/go-topojson
 */

require('colors');
const fs = require('fs').promises;
const glob = require('glob');

glob('samples/maps/**/demo.html', async (err, matches) => {
    if (err) {
        console.error(err); // eslint-disable-line
        return;
    }

    let i = 0;
    for (const file of matches) {
        const html = await (await fs.readFile(file)).toString();
        let match = html.match(
            /<script src="https:\/\/code\.highcharts\.com\/mapdata\/([a-z\/\.\-]+)\.js"><\/script>/u
        );

        if (file.indexOf('transform') !== -1) {
            // eslint-disable-next-line no-console
            console.log(`Skipping ${file}`.red);
            match = void 0;
        }

        if (match) {
            const jsFile = file.replace(/\.html$/u, '.js'),
                map = match[1];

            const jsLines = await (await fs.readFile(jsFile)).toString()
                .split('\n')
                .map(line => (line.length ? `    ${line}` : ''));

            jsLines.unshift(
                '(async () => {',
                '',
                '    const topology = await fetch(',
                `        'https://code.highcharts.com/mapdata/${map}.topo.json'`,
                '    ).then(response => response.json());',
                ''
            );
            jsLines.push('})();');

            const newJS = jsLines.join('\n')
                .replace(`map: '${map}'`, 'map: topology')
                .replace(
                    `mapData: Highcharts.maps['${map}']`,
                    'mapData: topology'
                );

            const newHTML = html.replace(`\n${match[0]}`, '');

            if (newJS.indexOf('Highcharts.maps') !== -1) {
                // eslint-disable-next-line no-console
                console.log(`Highcharts.maps found: ${jsFile}`.red);
            }

            //*
            await fs.writeFile(file, newHTML, 'utf-8');
            await fs.writeFile(jsFile, newJS, 'utf-8');
            // */
        }

        //*
        i++;
        if (i > Infinity) {
            break;
        }
        // */

    }
});
