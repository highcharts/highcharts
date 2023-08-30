import { parentPort } from 'node:worker_threads';

parentPort.on('message', async value =>{
    if(value.testFile && value.size){
        const { default: test } = await import(value.testFile);

        try {
            if (typeof test === 'function') {
                const result = await test(value.size);

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
