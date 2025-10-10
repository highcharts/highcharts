/*!*
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import * as ChildProcess from 'node:child_process';
import * as FSP from 'node:fs/promises';
import * as Path from 'node:path';


/* *
 *
 *  Constants
 *
 * */


const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

const DEFAULT_PROMPT = [
    'If possible add missing doclets to public definitions of functions and' +
    ' properties based on doclets from their assignments.',
    'If no doclet can be added, produce a single-line-doclet with @internal' +
    ' tag.',
    'Make sure to have an empty line above each doclet.',
    'Do not remove doclets.',
    'Do not clean up.',
].join(' ');

const LOCAL_PROMPT = [
    'Be the best senior software developer in the universe.',
    'Be precise, to the point and error free.',
    'Share only source code, including your changes.',
    'Follow the style of source code.',
].join(' ');


/* *
 *
 *  Functions
 *
 * */


async function gemini(
    prompt,
    filePath,
    model = DEFAULT_GEMINI_MODEL
) {
    ChildProcess.execFileSync('npm x -y --package=@google/gemini-cli', [
        '--', // End NPM arguments
        '--approval-mode', 'auto_edit',
        '--model', model,
        `"@${filePath.replaceAll('"', '\\"')}" ${prompt}`
    ], {
        cwd: Path.dirname(filePath),
        encoding: 'utf8',
        stdio: 'inherit',
        timeout: 600e3 // ms
    });
}


/**
 * 
 * @param {Array<string>} argv
 */
async function main(argv) {
    const API = await import('yargs');
    const args = await API.default(argv);

    if (args.h || args.help) {
        console.info(```
node migrate [OPTIONS]

OPTIONS:
--help -h        This help.
--model [text]   Gemini model to use. (Default: ${DEFAULT_GEMINI_MODEL})
--prompt [text]  Prompt to use instead of default.
--target [text]  Folder path to work on.
        ```);
        return;
    }

    const prompt = (
        typeof args.prompt === 'string' ?
            args.prompt :
            DEFAULT_PROMPT
    );
    const target = Path.resolve(
        args.target ?
            '' + args.target :
            Path.join('..', 'highcharts', 'ts', 'Core', 'Renderer')
    );

    let filePath;

    console.log('Scanning', target, '...');
    for (const entry of await FSP.readdir(target, {
        encoding: 'utf8',
        recursive: true,
        withFileTypes: true
    })) {

        if (
            !entry.isFile() ||
            !entry.name.match(/^[^.]+\.ts$/su)
        ) {
            continue;
        }

        filePath = Path.join(entry.parentPath, entry.name);

        console.log('Processing', filePath, '...');
        await gemini(prompt, filePath, args.model);

    }

}


/* *
 *
 *  Runtime
 *
 * */


main(process.argv);
