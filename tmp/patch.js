/* Patch a file */

const args = process.argv;
const fs = require('fs');

const patch = JSON.parse(fs.readFileSync(__dirname + '/patch.json', 'utf8'));

Object.keys(patch).forEach(function (filename) {
    fs.readFile(filename, function (err, data) {
        if (err) return err;

        data = data.toString().split('\n');

        console.log('doing file', filename + ',', patch[filename].length, 'patches...');

        patch[filename].forEach(function (p) {
          // console.log('patching code:', filename + ':' + p.line);
           data.splice(p.line, 0, p.doclet);
        });

        fs.writeFile(filename, data.join('\n'), function (err) {
            if (err) return console.log(err);
        });
    });
});
