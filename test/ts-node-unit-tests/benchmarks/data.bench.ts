const { describe } = require('../test-utils')
const { performance } = require('perf_hooks');

const ITERATIONS = 5;

function getStandardDeviation (array: number[]) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function generateCSV(rows:number, columns: number){
    let csv = 'id';
    for (let column = 0; column < columns; column++) {
        csv += `,col${column}`;
    }
    csv += '\n';

    for (let row = 0; row < rows; row++) {
        csv += `${row}`;
        for (let j = 0; j < columns; j++) {
            csv += `,${Math.random()}`;
        }
        csv += '\n';
    }

    return csv;
}

export function benchCSVConnector() {
    describe('Data benchmark v1');

    const hc = require('../../../code/highcharts.js')();
    require('../../../code/modules/data-tools.js')(hc);

    const { DataPool } = hc;

    const sizes = [10, 100, 10_000, 1_000_000, 5_000_000];


    for (const size of sizes) {
        let i = 0;
        const csv = generateCSV(size, 5);

        const details = {
            size,
            min : Number.MAX_SAFE_INTEGER,
            max : 0,
            results : [],
            avg: 0,
            stdDev: 0,
        }

        while(i < ITERATIONS){
            i++;
            const start = performance.mark('Start');
            new DataPool([
                {
                    id: size,
                    type: 'CSV',
                    options: {
                        csv
                    }
                }
            ]);

            const measure = performance.measure('Start to Now', start)

            if(measure.duration < details.min){
                details.min = measure.duration;
            }

            if(measure.duration > details.max){
                details.max = measure.duration;
            }

            details.results.push(measure.duration)
        }

        details.avg = details.results.reduce((a, b) => a + b, 0) / details.results.length;
        details.stdDev = getStandardDeviation(details.results)

        console.table(details)
    }



}
