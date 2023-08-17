import process from 'node:process';
import {join} from 'node:path';
import yargs from 'yargs';

const { argv, cwd } = process;

const args = yargs(argv).argv;


const outPutColums = {
    reference: {},
    proposed: {}
}

const compareMetrics = [
    "categories.performance",
    "first-contentful-paint",
    "first-meaningful-paint",
    "dom-size"
];

const valueTypes = [
    "score",
    "numericValue",
    "numericUnit"
];

async function loadJSON(path){
    const { default: jsonData } = await import(
        join(cwd(), path),
        { assert: { type: 'json' }}
    ).catch(()=> ({default : null}))

    return jsonData;
}

for (const [argName, argValue] of Object.entries(args)){
    if( outPutColums[argName] ){
        const reportData = await loadJSON(argValue);

        if( reportData ) {
            compareMetrics.forEach(metric => {
                if(metric.startsWith('categories.')){
                    const category = metric.replace('categories.', '');
                    const categoryData = reportData.categories[category];
                    if (categoryData) {
                            if(!outPutColums[argName][category]){
                                outPutColums[argName][category] = {}
                            }

                            outPutColums[argName][category].score = categoryData.score
                    }
                    return;
                }

                if (reportData.audits[metric]) {
                    Object.keys(reportData.audits[metric])
                        .filter(key => valueTypes.includes(key))
                        .forEach(key => {
                            if(!outPutColums[argName][metric]){
                                outPutColums[argName][metric] = {}
                            }

                            outPutColums[argName][metric][key] = reportData.audits[metric][key]

                        })
                }
            });
        }
    }
}

const tableHeader = '|   | Reference | Proposed | Diff |' + '\n| :---- | ------ | ----- | ----- |\n';

const lineFmt = ({
    audit,
    measure,
    valueReference,
    valueProposed
}) =>
    measure ? `| ${audit} – ${measure} | ${valueReference} | ${valueProposed} | ${typeof valueReference === 'number' && typeof valueProposed === 'number' ? (valueProposed - valueReference).toFixed(2) : ''} |`: '';

function printTableLines(audit){
    let lines = [];

    const reference = outPutColums.reference[audit];
    const proposed  = outPutColums.proposed[audit];

    lines.push(lineFmt({
        audit,
        measure: 'score',
        valueReference: reference ? reference.score: '',
        valueProposed: proposed.score
    }));


    if (proposed.numericUnit) {
        lines.push(lineFmt({
            audit,
            measure: proposed.numericUnit + 's',
            valueReference: reference ? parseFloat(reference.numericValue?.toFixed(2)): '',
            valueProposed: parseFloat(outPutColums.proposed[audit].numericValue?.toFixed(2))
        }));
    }

    return lines.join('\n')
}

const table = tableHeader +
    Object.keys(outPutColums.proposed).map(printTableLines).join('\n');

console.log(table)

