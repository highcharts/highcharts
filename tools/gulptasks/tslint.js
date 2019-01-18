/*
 * Copyright (C) Highsoft AS
 */

const Glob = require('glob');
const Path = require('path');
const ProcessLib = require('./lib/process');

/**
 * Lint test of TypeScript code.
 *
 * @return {Promise}
 *         Promise to keep.
 */
function tslint() {
    return Promise.all(
        Glob.sync(Path.join('ts', 'masters', 'tsconfig-*.json'))
            .map(file => ProcessLib.commandLine(
                'npx tslint --project ' + file
            ))
    );
}

module.exports = tslint;
