import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function loadJSON(path) {
    const data = await import(path, {
        assert: { type: 'json' },
    });

    return data.default;
}

const langFiles = (await readdir(__dirname, {
    withFileTypes: true,
}))
    .filter((dirent) => dirent.isFile() && /lang-.*.json/.test(dirent.name))
    .map((dirent) => dirent.name);

const langBase = await loadJSON('./lang.json');

const baseKeys = Object.keys(langBase);

function getNestedKeys(obj, path = '') {
    return Object.entries(obj)
        .flatMap(([key, value]) => {
            if (typeof value === 'object') {
                return getNestedKeys(value, `${path}${key}.`);
            }

            return `${path}${key}`;
        });
}

for (const langFile of langFiles) {
    const langJSON = await loadJSON(`./${langFile}`);

    assert.equal(
        baseKeys.length,
        Object.keys(langJSON).length,
    );

    const langBaseKeys = getNestedKeys(langBase);
    langBaseKeys.sort();

    const langKeys = getNestedKeys(langJSON);
    langKeys.sort();

    assert.deepEqual(
        langBaseKeys,
        langKeys,
        `Keys in ${langFile} do not match keys in lang.json`,
    );
}
