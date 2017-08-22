/* eslint-env node, es6 */

const request = require("request");
const cheerio = require("cheerio");
require('colors');

const data = {};

const fromYear = 1924;
const toYear = 2016;

const hadOG = {
    1920: true,
    1940: true, // Fill in zeroes
    1944: true
};

let done = 0;

const print = (data) => {
    let series = [];
    Object.keys(data).forEach((key) => {
        // Fill in blank years
        Object.keys(hadOG).forEach((year) => {
            if (!data[key].values[year]) {
                data[key].values[year] = 0;
            }
        });

        Object.keys(data[key].values).forEach((year) => {
            data[key].data.push([parseInt(year, 10), data[key].values[year]]);
        });
        delete data[key].values;
        data[key].data.sort((a, b) => {
            return a[0] - b[0];
        });

        series.push(data[key]);
    });
    console.log(JSON.stringify(series));
};

for (let year = fromYear; year <= toYear; year += 2) {
    let url = `https://www.sports-reference.com/olympics/winter/${year}/`;
    request(url, (err, res, body) => { // eslint-disable-line no-loop-func
        if (err) {
            throw err;
        }

        if (body.indexOf('File Not Found') > -1) {
            console.log('File Not Found'.red, year);
        } else {
            console.log('Parsing'.green, year);
            hadOG[year] = true;
            let $ = cheerio.load(body);

            let trs = $('table#countries tbody tr');
            let row = 0;
            while (trs[row]) {
                let country = trs[row].children[3].children[0].children[0].data.trim();

                let medals = parseInt(trs[row].children[11].children[0].data, 10);

                if (!data[country]) {
                    data[country] = {
                        name: country,
                        values: {

                        },
                        data: []
                    };
                }
                data[country].values[year] = medals;
                row++;
            }
        }

        done++;
        if (done === ((toYear - fromYear) / 2) + 1) {
            print(data);
        }
    });
}