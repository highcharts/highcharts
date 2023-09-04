import { parentPort } from 'node:worker_threads';

import {resolve } from 'node:path';

export type BeforeFunction = (sampleSize: number)=> BeforeReturnType;

export type BeforeReturnType = {
    fileName: string;
    func: () => string;
}

function getTestData(before: BeforeFunction, size: number){
    const { fileName, func } = before(size);
    const file = resolve(
        __dirname,
        'test-data',
        fileName
    );

    try {
        const content = require('fs').readFileSync(file);
        if(fileName.endsWith('.json')){
            return JSON.parse(content);
        }

        return content;
    } catch {
        console.log(`Generating ${size} rows of data`);
        let data = func();

        require('fs').writeFileSync(file, fileName.endsWith('.json') ? JSON.stringify(data) : data);
        return data;
    }
}

parentPort.on('message', async value =>{
    if(value.testFile && value.size){
        const { default: test, before } = await import(value.testFile);
        try {
            if (typeof test === 'function') {

                const data = getTestData(before, value.size);

                const result = await test(
                    value.size,
                    value.CODE_PATH,
                    data
                );

                parentPort.postMessage({
                    result
                });
            }
        } catch (error) {
            parentPort.postMessage({
                error
            });
        }
    }
});
