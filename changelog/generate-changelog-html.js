/**
 * Usage: node generate-changelog-html.js [name-of-output-file]
 *
 * This script is used to assemble the content for all markdown files
 * in each sub-directory of this directory into a new html output file.
 */

var marked = require('marked');
var fs = require('fs');
var pretty = require('pretty');
var semverSort = require('semver-sort');

var products = [
    {header: 'HIGHCHARTS BASIC', name: 'highcharts', changelogId: 'hc-changelog'},
    {header: 'HIGHMAPS', name: 'highmaps', changelogId: 'hm-changelog'},
    {header: 'HIGHSTOCK', name: 'highstock', changelogId: 'hs-changelog'}
];

var changelog = {
    header: {
        productName: "",
        version: "",
        date: ""
    },
    features: [],
    upgradeNotes: [],
    bugFixes: []
};

var htmlContent = '';


var sortMarkdownFileContent = mdContent => {
    let write = 'New features';

    changelog.features = marked.lexer('');
    changelog.upgradeNotes = marked.lexer('');
    changelog.bugFixes = marked.lexer('');

    marked.lexer(mdContent).forEach((token, index) => {
        if (index === 0) {
            changelog.header.date = token['text'].split('*').join('');
            return;
        }
        if (token['type'] === 'heading' && (token['text'] === 'Upgrade notes' || token['text'] === 'Bug fixes')) {
            write = token['text']
            return;
        }
        switch (write) {
            case  'New features':
                return changelog.features.push(token);
            case 'Upgrade notes':
                return changelog.upgradeNotes.push(token);
            case 'Bug fixes':
                return changelog.bugFixes.push(token);
            default:
                return null
        }
    });
};

var upgradeAndBugContainer = () => {
    if (changelog.upgradeNotes.length > 0 || changelog.bugFixes.length > 0) {
        return (
            '<div id="accordion" class="panel-group">' +
            '<div class="panel panel-default">' +
            upgradeNotesHTMLStructure() +
            bugFixesHTMLStructure() +
            '</div>' +
            '</div>')
    } else {
        return '';
    }
};

var productHeaderHTMLStructure = (product) => {
    return (
        '<div id="' + product.changelogId + '">' +
        '<div class="changelog-header">' +
        '<h2 id="' + product.name + '">' + product.header + '</h2>' +
        '</div>' +
        '<div class="changelog-container">')
};

var featureHTMLStructure = () => {
    if (changelog.features) {
        return (
            '::before ' +
            '<p>' +
            '::before ' +
            '"' + changelog.header.productName + ' ' + changelog.header.version + ' ' + changelog.header.date + '"' +
            '</p>' +
            marked.parser(changelog.features))
    } else {
        return '';
    }
};

var upgradeNotesHTMLStructure = () => {
    if (changelog.upgradeNotes.length > 0) {
        return (
            '<div id="heading-' + changelog.header.version + '-upgrade-notes" class="panel-heading">' +
            '<h4 class="panel-title">' +
            '<a href="#' + changelog.header.version + '-upgrade-notes" data-toggle="collapse" data-parent="#accordion"> Upgrade notes ' + '</a>' +
            '</h4>' +
            '</div>' +
            '<div id="' + changelog.header.version + '-upgrade-notes" class="panel-collapse collapse">' +
            '<div class="panel-body">' +
            marked.parser(changelog.upgradeNotes) +
            '</div>' +
            '</div>')
    } else {
        return '';
    }
};

var bugFixesHTMLStructure = () => {
    if (changelog.bugFixes.length > 0) {
        return (
            '<div id="heading-' + changelog.header.version + '-bug-fixes" class="panel-heading">' +
            '<h4 class="panel-title">' +
            '<a href="#' + changelog.header.version + '-bug-fixes" data-toggle="collapse" data-parent="#accordion"> Bug fixes </a>' +
            '</h4>' +
            '</div>' +
            '<div id="' + changelog.header.version + '-bug-fixes" class="panel-collapse collapse">' +
            '<div class="panel-body">' +
            marked.parser(changelog.bugFixes) +
            '</div>' +
            '</div>')
    } else {
        return '';
    }
};

var endProductHTMLStructure = () => {
    return ("</div> </div>")
};


var formatVersionNumber = (versionNumber) => {
    return versionNumber.split('.').join('-').slice(0, -3);
};

var capitalizeFirstLetter = (string) => {
    return string[0].toUpperCase() + string.slice(1);
};

var writeContentToNewHTMLFile = () => {
    var outputFile = './' + process.argv[2] + '.html';
    fs.writeFile(outputFile, pretty(htmlContent), function (err) {
        if (err) throw err;
        console.log(outputFile + ' was successfully created!');
    });
};

var getSortedDirFiles = (files) => {
    return semverSort.asc(files).reverse();
};
/**
 * Goes synchronous through each markdown file in each directory and captures it's content
 */
products.forEach(product => {
    changelog.header.productName = capitalizeFirstLetter(product.name);
    htmlContent = htmlContent + productHeaderHTMLStructure(product);
    var sortedDir = getSortedDirFiles(fs.readdirSync('./' + product.name));
    sortedDir.forEach(file => {
        var content = fs.readFileSync('./' + product.name + '/' + file, 'utf8');
        sortMarkdownFileContent(content);
        changelog.header.version = formatVersionNumber(file);
        htmlContent = htmlContent + featureHTMLStructure();
        htmlContent = htmlContent + upgradeAndBugContainer();
    });
    htmlContent = htmlContent + endProductHTMLStructure();
});

writeContentToNewHTMLFile();






