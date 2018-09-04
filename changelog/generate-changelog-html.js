/* eslint-env node, es6 */
/* eslint valid-jsdoc: 0, no-console: 0, require-jsdoc: 0 */

/**
 * Usage: node generate-changelog-html.js [name-of-output-file]
 *
 * This node script is used to assemble the content for all markdown files
 * in each sub-directory of this directory into a new html output file.
 */
var replaceString = require('replace-string');

(function () {
    var marked = require('marked'),
        fs = require('fs'),
        pretty = require('pretty'),
        semverSort = require('semver-sort');

    var products = [
        { header: 'Highcharts Basic', name: 'highcharts', changelogId: 'hc-changelog', offset: '' },
        { header: 'Highstock', name: 'highstock', changelogId: 'hs-changelog', offset: 'hs-' },
        { header: 'Highmaps', name: 'highmaps', changelogId: 'hm-changelog', offset: 'hm-' }
    ];

    var changelog = {
        header: {
            productName: '',
            version: '',
            date: '',
            offset: ''
        },
        features: [],
        upgradeNotes: [],
        bugFixes: []
    };

    var htmlContent = '';

    function addLinkToIssues(textToken) {
        if (typeof textToken !== 'undefined') {
            var issues = textToken.match(/#[0-9]+/g);
            if (issues !== null) {
                issues.forEach((issue) => {
                    var issued = issue.substring(1),
                        issueLink = 'https://github.com/highcharts/highcharts/issues/' + issued,
                        formatIssue = '[' + issue + '](' + issueLink + ')';
                    textToken = replaceString(textToken, issue, formatIssue);
                });
            }
        }
        return textToken;
    }


    function sortMarkdownFileContent(mdContent) {
        let write = 'New features';
        let changelogTitle;

        changelog.features = marked.lexer('');
        changelog.upgradeNotes = marked.lexer('');
        changelog.bugFixes = marked.lexer('');

        marked.lexer(mdContent).forEach((token, index) => {
            if (index === 0) {
                changelogTitle = token.text.split(' ');

                let date = changelogTitle[changelogTitle.length - 1];
                if (date !== '()') {
                    changelog.header.date = date;
                }
                return;
            }
            if (
                token.type === 'heading' &&
                (
                    token.text === 'Upgrade notes' ||
                    token.text === 'Bug fixes'
                )
            ) {
                write = token.text;
                return;
            }
            switch (write) {
                case 'New features':
                    token.text = addLinkToIssues(token.text);
                    changelog.features.push(token);
                    break;
                case 'Upgrade notes':
                    token.text = addLinkToIssues(token.text);
                    changelog.upgradeNotes.push(token);
                    break;
                case 'Bug fixes':
                    token.text = addLinkToIssues(token.text);
                    changelog.bugFixes.push(token);
                    break;
                default:
                    break;
            }
        });
    }

    function topHTMLContent() {
        return (
            `<div id="changelog">
            <div class="content-container container">
            <div class="row">
            <div class="col-md-1 hidden-sm"> </div>
            <div class="col-md-10 col-sm-12">
            <p style="text-align: center;">View changelog for <a href="#highcharts">Highcharts</a>, <a href="#highstock">Highstock</a>, <a href="#highmaps">Highmaps</a>. Go to the <a href="download">Download</a> page to get the latest version.</p>`
        );
    }
    function productHeaderHTMLStructure(product) {
        return (
            `<div id="${product.changelogId}">
            <div class="changelog-header">
            <h2 id="${product.name}">${product.header}</h2>
            </div>
            <div class="changelog-container">`);
    }

    function featureHTMLStructure() {
        if (changelog.features) {
            return (
                `<p>${changelog.header.productName} ${changelog.header.version.split('-').join('.')} ${changelog.header.date}</p>
                ${marked.parser(changelog.features)}`
            );
        }
        return '';
    }
    function upgradeNotesHTMLStructure() {
        if (changelog.upgradeNotes.length > 0) {
            return (
                `<div id="${changelog.header.offset}heading-${changelog.header.version}-upgrade-notes" class="panel-heading">
                <h4 class="panel-title">
                <a href="#${changelog.header.offset}${changelog.header.version}-upgrade-notes" data-toggle="collapse" data-parent="#accordion"> Upgrade notes</a>
                </h4>
                </div>
                <div id="${changelog.header.offset}${changelog.header.version}-upgrade-notes" class="panel-collapse collapse">
                <div class="panel-body">
                ${marked.parser(changelog.upgradeNotes)}
                </div>
             
                </div>`);
        }
        return '';
    }
    function bugFixesHTMLStructure() {
        if (changelog.bugFixes.length > 0) {
            return (
                `<div
                    id="${changelog.header.offset}heading-${changelog.header.version}-bug-fixes"
                    class="panel-heading">
                <h4 class="panel-title">
                <a href="#${changelog.header.offset}${changelog.header.version}-bug-fixes" data-toggle="collapse" data-parent="#accordion"> Bug fixes </a>
                </h4>
                </div>
                <div id="${changelog.header.offset}${changelog.header.version}-bug-fixes" class="panel-collapse collapse">
                <div class="panel-body">
                ${marked.parser(changelog.bugFixes)}
                </div>
               
                </div>`);
        }
        return '';
    }
    function upgradeAndBugContainer() {
        if (changelog.upgradeNotes.length > 0 ||
            changelog.bugFixes.length > 0) {
            return (
                `<div id="accordion" class="panel-group">
                <div class="panel panel-default">
                ${upgradeNotesHTMLStructure()}
                ${bugFixesHTMLStructure()}
                </div>
                </div>`);
        }
        return '';
    }
    function bottomHTMLContent() {
        return (`
            </div>
            </div>
            </div>
            <div class="col-md-1 hidden-sm"></div>
            </div>`);
    }
    function endProductHTMLStructure() {
        return ('</div> </div>');
    }

    function formatVersionNumber(versionNumber) {
        return versionNumber.split('.').join('-').slice(0, -3);
    }

    function capitalizeFirstLetter(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    function writeContentToNewHTMLFile() {
        var outputFile = './' + process.argv[2] + '.html';
        fs.writeFile(outputFile, pretty(htmlContent), function (err) {
            if (err) {
                throw err;
            }
            console.log(outputFile + ' was successfully created!');
        });
    }

    function getSortedDirFiles(files) {
        return semverSort.asc(files).reverse();
    }

    htmlContent += topHTMLContent();
    /**
     * Goes synchronous through each markdown file in each directory and captures it's content
     */
    products.forEach(product => {
        changelog.header.productName = capitalizeFirstLetter(product.name);
        changelog.header.offset = product.offset;
        htmlContent += productHeaderHTMLStructure(product);
        var sortedDir = getSortedDirFiles(fs.readdirSync('./' + product.name));
        sortedDir.forEach((file) => {
            var content = fs.readFileSync('./' + product.name + '/' + file, 'utf8');
            sortMarkdownFileContent(content);
            changelog.header.version = formatVersionNumber(file);
            htmlContent += featureHTMLStructure();
            htmlContent += upgradeAndBugContainer();
        });
        htmlContent += endProductHTMLStructure();
    });
    htmlContent += bottomHTMLContent();
    writeContentToNewHTMLFile();
}());






