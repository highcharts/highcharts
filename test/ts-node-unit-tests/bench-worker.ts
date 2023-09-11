import { parentPort } from 'node:worker_threads';

import { resolve } from 'node:path';
import { BenchmarkFunction } from './benchmark';

export type BeforeFunction = (sampleSize: number)=> BeforeReturnType;

export type BeforeReturnType = {
    fileName: string;
    func: () => string;
}


parentPort.on('message', async value =>{
    function getTestData(before: BeforeFunction, size: number){
        const { fileName, func } = before(size);
        const file = resolve(
            __dirname,
            'test-data',
            fileName
        );

        try {
            const content = require('fs').readFileSync(file);
            if (fileName.endsWith('.json')) {
                return JSON.parse(content);
            }

            return content;
        } catch {
            console.log(`Generating data for sample size: ${size}`);
            let data = func();

            require('fs').writeFileSync(
                file,
                fileName.endsWith('.json') ?
                    JSON.stringify(data) :
                    data
            );

            return data;
        }
    }

    if(value.testFile && value.size){
        const { default: test, before } = await import(value.testFile);

        try {
            if (typeof test === 'function') {
                const data = before ?
                    getTestData(before, value.size) :
                    undefined;

                const result = await (test as BenchmarkFunction)({
                    size: value.size,
                    CODE_PATH: value.CODE_PATH,
                    data
                });

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
