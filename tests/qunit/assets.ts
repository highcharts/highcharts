import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const qunitScript = require.resolve('qunit');
export const qunitStyles = require.resolve('qunit/qunit/qunit.css');

const { version } = JSON.parse(
    readFileSync(join(dirname(qunitScript), '..', 'package.json'), 'utf8')
) as { version: string };

export const qunitVersion = version;
export const qunitAssetUrl = `https://code.jquery.com/qunit/qunit-${version}`;
