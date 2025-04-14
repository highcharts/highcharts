import { parentPort } from 'node:worker_threads';
import { resolve, dirname } from 'node:path';
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { register } from 'tsx/esm/api'

import { BenchmarkFunction } from './benchmark';


export type BeforeFunction = (sampleSize: number)=> BeforeReturnType;

export type BeforeReturnType = {
    fileName: string;
    func: () => string;
}

// register tsx to be able to import() ts files
const unregister = register();

const __dirname = import.meta?.dirname ?? dirname(fileURLToPath(import.meta.url))

parentPort.on('close', unregister);

parentPort.on('message', async value =>{
    function getTestData(before: BeforeFunction, size: number){
        const { fileName, func } = before(size);
        const file = resolve(
            __dirname,
            'test-data',
            fileName
        );

        try {
            const content = readFileSync(file);
            if (fileName.endsWith('.json')) {
                return JSON.parse(content);
            }

            return content;
        } catch {
            console.log(`Generating data for sample size: ${size}`);
            let data = func();

            writeFileSync(
                file,
                fileName.endsWith('.json') ?
                    JSON.stringify(data) :
                    data
            );

            return data;
        }
    }

    if(value.testFile && value.size) {
        const { default: mod } = await import(value.testFile);

        const { before, default: test } = mod;

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
