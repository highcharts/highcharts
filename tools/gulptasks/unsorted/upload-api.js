/* eslint-disable callback-return */
/* eslint-disable func-style */
/* eslint-disable no-console */
/* eslint-disable quotes */
/* eslint-disable require-jsdoc */

/* *
 *
 *  Imports
 *
 * */

const gulp = require('gulp'),
    Path = require('path');

/* *
 *
 *  Constants
 *
 * */

const HTML_HEAD_STATIC = [
    [
        '',
        '<script',
        'id="Cookiebot"',
        'src="https://consent.cookiebot.com/uc.js"',
        'data-cbid="8be0770c-8b7f-4e2d-aeb5-2cfded81e177"',
        'data-blockingmode="auto"',
        'type="text/javascript"',
        '></script>'
    ].join('\n        '),
    [
        '',
        '<!-- Google Tag Manager -->',
        `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':`,
        `new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],`,
        `j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=`,
        `'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);`,
        `})(window,document,'script','dataLayer','GTM-5WLVCCK');</script>`,
        `<!-- End Google Tag Manager -->`
    ].join('\n        ')
].join('\n');

/* *
 *
 *  Functions
 *
 * */

function updateFileContent(filePath, fileContent) {
    switch (Path.extname(filePath)) {
        case '.htm':
        case '.html':
            fileContent = Buffer.from(
                fileContent
                    .toString()
                    .replace(/^(.*<\/head>.*)$/mu, HTML_HEAD_STATIC + '\n$1')
            );
            break;
        default:
    }
    return fileContent;
}

function uploadFilesTest(params) {
    const fs = require('fs');

    return new Promise(resolve => {
        const callback = params.callback,
            contentCallback = params.contentCallback,
            errors = [];

        let from,
            to,
            content;

        params.files.forEach(file => {
            try {
                from = file.from;
                to = Path.join('./build/upload-api/', file.to);
                content = fs.readFileSync(from, '');
                if (contentCallback) {
                    content = contentCallback(from, content);
                }
                fs.mkdirSync(Path.dirname(to), { recursive: true });
                fs.writeFileSync(to, content);
                if (callback) {
                    // eslint-disable-next-line node/callback-return
                    callback();
                }
            } catch (error) {
                console.error(error);
                errors.push(error);
            }
        });

        resolve({ errors: [] });
    });
}

function uploadAPIDocs() {
    const {
        getFilesInFolder
    } = require('@highcharts/highcharts-assembler/src/build.js');
    const colors = require('colors');
    const isString = x => typeof x === 'string';
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

    if (!bucket && !argv.test) {
        throw new Error('No --bucket argument specified or env. variable HIGHCHARTS_APIDOCS_BUCKET is empty or unset.');
    }

    const tags = isString(argv.tags) ? argv.tags.split(',') : ['current'];
    const getUploadConfig = tag => {
        const doTick = () => {
            process.stdout.write('.');
        };
        const onError = err => {
            process.stdout.write(`\n${err.message}. ${err.from} -> ${err.to}\n`);
        };

        const params = {
            batchSize,
            bucket,
            profile: argv.profile,
            callback: argv.silent ? false : doTick,
            contentCallback: updateFileContent,
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
                from: Path.join(sourceFolder, fileName),
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
        .then(argv.test ? uploadFilesTest : uploadFiles)
        .then(result => {
            const { errors } = result;
            if (errors.length) {
                const erroredFiles = errors
                    .map(e => Path.relative(sourceFolder, e.from)
                        // Make path command line friendly.
                        .split(Path.sep)
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
}

uploadAPIDocs.description = 'Uploads API docs to the designated bucket';
uploadAPIDocs.flags = {
    '--bucket': 'The S3 bucket to upload to.',
    '--files': 'Upload selected files relative to current working directory. (optional)',
    '--profile': 'AWS profile to load from AWS credentials file. If no profile is provided the default profile or ' +
                    'standard AWS environment variables for credentials will be used. (optional)',
    '--tags': 'Subfolders to upload under (optional)',
    '--noextensions': 'Remove file extensions for uploaded files (destination). Useful for testing/serving directly from S3 bucket (optional)',
    '--silent': 'Don\'t produce progress output. (optional)',
    '--test': 'Will save processed files for S3 bucket in a local directory instead of uploading. (optional)'
};


gulp.task('upload-api', uploadAPIDocs);
