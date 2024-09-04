import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('S3 utils', async ()=> {
    const S3 =  await import('../gulptasks/lib/uploadS3.js')
    const { toS3Path } = S3;

    await it('toS3Path', async ()=>{
        assert.deepEqual(
            toS3Path(
                'samples/graphics/cyber-monday/core.svg',
                'samples/',
                'demos'
            ), {
                from: 'samples/graphics/cyber-monday/core.svg',
                to: 'demos/graphics/cyber-monday/core.svg'
            }
        );

        assert.deepEqual(
            toS3Path(
                'samples/graphics/cyber-monday/core.svg',
                'samples/graphics',
                'demos'
            ), {
                from: 'samples/graphics/cyber-monday/core.svg',
                to: 'demos/cyber-monday/core.svg'
            }
        );

        assert.deepEqual(
            toS3Path(
                'samples/graphics/cyber-monday/core.svg',
                undefined,
                'demos'
            ),
            {
                from: 'samples/graphics/cyber-monday/core.svg',
                to: 'demos/samples/graphics/cyber-monday/core.svg'
            }
        )
    });
});
