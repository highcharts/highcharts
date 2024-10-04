const timezone = 'Europe/Oslo',
    start = Date.UTC(1970, 0, 1),
    end = Date.now();

const time = new Highcharts.Time({ timezone }),
    output = document.getElementById('output');


output.innerText = `# DST changes in ${timezone} as seen in browser.
Date, Offset before (h), Offset after (h);
`;

let previousOffset;
for (let ts = start; ts < end; ts += 36e5) {
    const offset = time.getTimezoneOffset(ts);
    if (offset !== previousOffset && previousOffset !== undefined) {
        const date = new Date(ts).toISOString()
            .replace('T', ' ').replace(/\.\d+Z/, '');
        output.innerText +=
            `${date}, ${previousOffset / 36e5}, ${offset / 36e5};\n`;
    }
    previousOffset = offset;
}