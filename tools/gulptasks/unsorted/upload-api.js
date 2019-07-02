/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const uploadAPIDocs = () => {
    const {
        getFilesInFolder
    } = require('highcharts-assembler/src/build.js');
    const colors = require('colors');
    const isString = x => typeof x === 'string';
    const ProgressBar = require('../../progress-bar.js');
    const {
        join,
        relative,
        sep
    } = require('path');
    const {
        asyncForeach,
        uploadFiles
    } = require('../../upload.js');
    const argv = require('yargs').argv;
    const sourceFolder = './build/api/';
    const bucket = argv.bucket || process.env.HIGHCHARTS_APIDOCS_BUCKET;
    const batchSize = 30000;
    const files = (
        isString(argv.files) ?
            argv.files.split(',') :
            getFilesInFolder(sourceFolder, true, '')
    );
    if (!bucket) {
        throw new Error('No --bucket argument specified or env. variable HIGHCHARTS_APIDOCS_BUCKET is empty or unset.');
    }

    const tags = isString(argv.tags) ? argv.tags.split(',') : ['current'];
    const getUploadConfig = tag => {
        const errors = [];
        const bar = new ProgressBar({
            error: '',
            total: files.length,
            message: !argv.silent ? `\n[:bar] - Uploading ${tag}. Completed :count of :total.:error` : ''
        });
        const doTick = () => {
            bar.tick();
        };
        const onError = err => {
            errors.push(`${err.message}. ${err.from} -> ${err.to}`);
            bar.tick({
                error: `\n${errors.length} file(s) errored:\n${errors.join('\n')}`
            });
        };
        const params = {
            batchSize,
            bucket,
            callback: argv.silent ? false : doTick,
            onError
        };
        const getMapOfFromTo = fileName => {
            let to = argv.noextensions ? fileName.split('.').slice(0, -1).join('.') : fileName;
            if (tag !== 'current') {
                const parts = to.split('/');
                parts.splice(1, 0, tag);
                to = parts.join('/');
            }
            return {
                from: join(sourceFolder, fileName),
                to
            };
        };
        params.files = files.map(getMapOfFromTo);
        return params;
    };
    console.log(`Started upload of ${files.length} files to ${bucket} under tags [${tags.join(', ')}].`);
    const commands = [];
    return asyncForeach(tags, tag => Promise
        .resolve(getUploadConfig(tag))
        .then(uploadFiles)
        .then(result => {
            const { errors } = result;
            if (errors.length) {
                const erroredFiles = errors
                    .map(e => relative(sourceFolder, e.from)
                        // Make path command line friendly.
                        .split(sep)
                        .join('/'));
                commands.push(`gulp upload-api --tags ${tag} --files ${erroredFiles.join(',')}`);
            }
        }))
        .then(() => {
            if (commands.length) {
                console.log([
                    '',
                    colors.red('Some of the uploads failed, please run the following command to retry:'),
                    commands.join(' && ')
                ].join('\n'));
            }
        });
};
gulp.task('upload-api', uploadAPIDocs);
