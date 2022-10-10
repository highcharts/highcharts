/**
 * This was a once-off job to get rid of inline style attributes in demo.html.
 * Keeping the file here in case we need to deal with more similar cases.
 *
 * Usage: From root, run
 *
 * node tools/remove-style.js
 */


const fs = require('fs').promises;
const glob = require('glob');

glob('samples/**/demo.html', async (err, matches) => {
    if (err) {
        console.error(err); // eslint-disable-line
        return;
    }

    // let i = 0;
    for (const file of matches) {
        const html = await (await fs.readFile(file)).toString();
        const match = html.match(/id="container"( style="([a-z0-9\-:; ]+)")/u);

        if (match) {
            const attr = match[1],
                cssFile = file.replace(/\.html$/u, '.css');

            let style = match[2];
            style = style
                .split(';')
                .filter(Boolean)
                .map(s => s.trim())
                .join(';\n    ') + ';';

            let css;
            try {
                css = await (
                    await fs.readFile(cssFile)
                ).toString();

            } catch {
                css = '';
            }

            if (css.indexOf('#container {') !== -1) {
                css = css.replace(
                    '#container {',
                    '#container {\n    ' + style
                );
            } else if (css.indexOf('@import') === 0) {
                const lines = css.split('\n');

                lines.splice(1, 0, `\n#container {\n    ${style}\n}`);
                css = lines.join('\n');

            } else {
                css = `#container {\n    ${style}\n}\n${css}`;
            }


            //*
            await fs.writeFile(file, html.replace(attr, ''), 'utf-8');
            await fs.writeFile(cssFile, css, 'utf-8');
            // */
        }

        /*
        if (i > 10) {
            break;
        }
        */

    }
});
