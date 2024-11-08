/**
 * This was a once-off job to get rid of Date.UTC in demos. Keeping the file
 * here in case we need to deal with more similar cases.
 *
 * Usage: From root, run
 *
 * node tools/remove-date-utc.js
 */

const colors = require('colors');
const fs = require('fs').promises;
const glob = require('glob');

glob('samples/**/demo.js', async (err, matches) => {
    if (err) {
        console.error(err); // eslint-disable-line
        return;
    }

    let i = 0;
    for (const file of matches) {
        if (file.includes('dashboards') || file.includes('unit-tests')) {
            continue;
        }
        const js = await (await fs.readFile(file)).toString();

        let count = 0;
        const modifiedJs = js.replace(
            // /Date\.UTC\((\d{4}),\s?(\d{1,2}),\s?(\d{1,2})\)/ug,
            /Date\.UTC\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})(?:,\s*(\d{1,2}))?\)/ug,
            (match, year, month, day, hour) => {
                const formattedDate = [
                    year,
                    (Number(month) + 1).toString().padStart(2, '0'),
                    day.padStart(2, '0')
                ];
                count++;

                let s = formattedDate.join('-');
                if (hour) {
                    s += ` ${hour.padStart(2, '0')}:00`;
                }

                return `'${s}'`;
            }
        );

        const remaining = modifiedJs.match(
            /Date\.UTC\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})/ug
        );


        //*
        if (modifiedJs !== js) {
            console.log('Modified', count, file); // eslint-disable-line
            await fs.writeFile(file, modifiedJs, 'utf-8');
        }
        // */

        if (remaining) {
            console.log('  - Remaining'.red, remaining.length, file); // eslint-disable-line
        }

        //*
        if (i > 100) {
            // break;
        }
        i++;
        // */

    }
});
