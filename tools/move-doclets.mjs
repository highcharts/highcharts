#!/usr/bin/env node
/* *
 *
 *  Moving doclets to interfaces.
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
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


import FS from 'node:fs';
import Path from 'node:path';
import TS from 'typescript';
import Yargs from 'yargs';
import FSLib from './gulptasks/lib/fs.js';


/* *
 *
 *  Constants
 *
 * */


const DOCLET = /\/\*\*.*?\*\//gs;


const HELP = [
    './tools/move-doclets.mjs [OPTIONS]',
    '',
    'OPTIONS:',
    '  --help -h        This help.',
    '  --json           Log JSON tree of each source. (move-doclets.json)',
    '  --series [path]  Move doclets for given series path. (recursive)',
    '  --verbose        Log extra debug information.'
].join('\n');


/* *
 *
 *  Variables
 *
 * */


let verbose = false;


/* *
 *
 *  Functions
 *
 * */


/**
 * @param {Array<Record<string,*>>} doclet
 * @param {string} tag
 * @param {string} text
 */
function addTag(
    doclet,
    tag,
    text
) {
    doclet.push({ tag, text });
}


/**
 * @param {TS.Node} node
 */
function debug(
    node,
    includeChildren
) {
    console.info(
        node.kind,
        TS.SyntaxKind[node.kind],
        `[${node.getFullStart()}:${node.getEnd()}]`
    );
    if (includeChildren) {
        TS.forEachChild(
            node,
            child => console.info(
                ' ',
                child.kind,
                TS.SyntaxKind[child.kind],
                `[${child.getFullStart()}:${child.getEnd()}]`
            )
        );
    }
}


/**
 * @param {Record<string,*>} branch
 * @param {TS.Node} node
 * @param {TS.Node} previousNode
 * @param {Array<Record<string,*>>} tree
 */
function decorateDoclet(
    branch,
    node,
    previousNode,
    tree
) {
    const doclets = getDocletsBetween(previousNode, node)

    if (doclets.length) {
        const transfer = (jsdoc, branch) => {
            let doclet = branch.doclet = [];

            for (const item of jsdoc) {
                if (TS.isJSDoc(item)) {
                    if (item.comment) {
                        addTag(doclet, 'description', getComment(item));
                    }
                    if (item.tags) {
                        for (const tag of item.tags) {
                            addTag(doclet, tag.tagName.text, getComment(tag));
                        }
                    }
                } else {
                    addTag(doclet, item.tagName.text, getComment(item));
                }
            }
        };

        /** @type {Record<string,*>} */
        let anonymousBranch = {};

        // Now add the anonymous doclets before the last one
        for (const doclet of doclets) {
            anonymousBranch = {};
            transfer(doclet, anonymousBranch);
            decorateName(anonymousBranch, node);
            decorateType(anonymousBranch, node);
            tree.push(anonymousBranch);
        }

        // Check relation of the last doclet
        if (
            !tree[tree.length - 1]
                .doclet
                .some(part => part.tag === 'apioption')
        ) {
            branch.doclet = tree.pop().doclet;
        }

    }

}


/**
 * @param {Record<string,*>} branch
 * @param {TS.Node} node
 * @param {string} parentName
 */
function decorateName(
    branch,
    node,
    parentName
) {
    let optionName;

    if (branch.doclet) {
        optionName = (
            getTagText(branch.doclet, 'apioption') ||
            getTagText(branch.doclet, 'optionparent')
        );
        if (optionName) {
            branch.name = optionName.split('.').pop();
            branch.fullName = optionName.replace(/^plotOptions\./u, 'series.');
            return;
        }
    }

    if (
        TS.isPropertyAssignment(node) ||
        TS.isVariableDeclaration(node)
    ) {
        optionName = node.name.text;
        if (optionName) {
            branch.name = optionName;
            branch.fullName = (
                parentName ?
                    `${parentName}.${optionName}` :
                    optionName
            ).replace(/^plotOptions\./u, 'series.');
        }
    }

}


/**
 * @param {Record<string,*>} branch
 * @param {TS.Node} node
 */
function decorateType(
    branch,
    node
) {
    const reflection = token => ({
        [TS.SyntaxKind.BigIntKeyword]: 'bigint',
        [TS.SyntaxKind.BigIntLiteral]: 'bigint',
        [TS.SyntaxKind.FalseKeyword]: 'boolean',
        [TS.SyntaxKind.TrueKeyword]: 'boolean',
        [TS.SyntaxKind.ArrowFunction]: 'function',
        [TS.SyntaxKind.FunctionDeclaration]: 'function',
        [TS.SyntaxKind.FunctionExpression]: 'function',
        [TS.SyntaxKind.FunctionKeyword]: 'function',
        [TS.SyntaxKind.NumberKeyword]: 'number',
        [TS.SyntaxKind.NumericLiteral]: 'number',
        [TS.SyntaxKind.ObjectLiteralExpression]: '*',
        [TS.SyntaxKind.StringKeyword]: 'string',
        [TS.SyntaxKind.StringLiteral]: 'string',
    }[token.kind]);

    let optionType;

    if (
        !optionType &&
        branch.doclet
    ) {
        for (const part of branch.doclet) {
            if (part.tag === 'type') {
                optionType = part.text.replace(/[{}]/g, '');
                break;
            }
        }
    }

    if (
        !optionType &&
        TS.isPropertyAssignment(node)
    ) {
        let child = getNodesLastChild(node);

        if (child) {

            if (TS.isBinaryExpression(child)) {
                child = getNodesFirstChild(child);
            }

            optionType = (
                reflection(child) ||
                reflection(getNodesFirstChild(node))
            );

        }

    }

    if (
        !optionType &&
        TS.isVariableDeclaration(node)
    ) {
        if (node.type) {
            optionType = node.type.getText();
        } else {
            optionType = reflection(node.getLastToken());
        }
    }

    branch.type = optionType || '*';

}


/**
 * @param {string} path
 * @return {string|undefined}
 */
function findPairedSource(
    path
) {
    let name = Path.basename(Path.basename(path, '.d.ts'), '.ts');
    /** @type {string|undefined} */
    let pairedPath;

    path = Path.dirname(path);

    if (name.endsWith('Defaults')) {

        pairedPath = Path.join(path, name.replace(/Defaults$/, 'Options.ts'));

        if (FS.existsSync(pairedPath)) {
            return pairedPath;
        }

    }

    if (name.endsWith('Options')) {

        pairedPath = Path.join(path, name.replace(/Options$/, 'Defaults.ts'));

        if (FS.existsSync(pairedPath)) {
            return pairedPath;
        }

        pairedPath = Path.join(path, name.replace(/Options$/, '.ts'));

        if (FS.existsSync(pairedPath)) {
            return pairedPath;
        }

    }

}

/**
 * @param {Record<string,*>} branch
 * @return {string}
 */
function generateDynamicCode(
    branch
) {
    const doclet = branch.doclet;

    if (doclet) {
        if (
            doclet.children?.length ||
            doclet.some(part => part.tag === 'optionparent')
        ) {
            return (
                generateInterfaceComment(branch) +
                'interface ' + getInterfaceName(branch) + '{\n' +
                (branch.children || [])
                    .map(subBranch => generateDynamicCode(subBranch))
                    .join('') +
                '}\n'
            );
        } else {
            return (
                '\n    ' + generatePropertyComment(branch) +
                getPropertyName(branch) + '?: ' + getMemberType(branch) + ';\n'
            );
        }
    }

    return (
        '\n    ' + getPropertyName(branch) + '?: '
        + getMemberType(branch) + ';\n'
    );

}

/**
 * @param {Record<string,*>} branch
 * @return {string}
 */
function generateInterfaceComment(
    branch
) {
    const doclet = branch.doclet;

    let result = '/**';

    if (doclet) {
        /** @type {string} */
        let text;

        for (const part of doclet) {
            text = part.text.split('\n').join('\n * ');
            if (
                result.length === 3 &&
                part.tag === 'description'
            ) {
                result += `\n * ${text}`;
            } else {
                result += `\n *\n * @${part.tag} ${text}`;
            }
        }
    } else {
        result += '\n * @todo write doclet';
    }

    result = result.split(/\n/gu).map(l => {
        l = l.trimEnd();
        if (l.length > 80) {
            const br = l.substring(0, 80).lastIndexOf(' ');
            return l.substring(0, br) + '\n * ' + l.substring(br);
        }
        return l;
    }).join('\n');

    return `${result}\n */\n`;
}


/**
 * @param {Record<string,*>} branch
 * @return {string}
 */
function generatePropertyComment(
    branch
) {
    const doclet = branch.doclet;

    let result = '/**';

    if (doclet) {
        /** @type {string} */
        let text;

        for (const part of doclet) {
            text = part.text.split('\n').join('\n     * ');
            if (
                result.length === 3 &&
                part.tag === 'description'
            ) {
                result += `\n     * ${text}\n     *`;
            } else {
                result += `\n     * @${part.tag} ${text}`;
            }
        }
    } else {
        result += '\n     * @todo write doclet';
    }

    result = result.split(/\n/gu).map(l => {
        l = l.trimEnd();
        if (l.length > 80) {
            const br = l.substring(0, 80).lastIndexOf(' ');
            return l.substring(0, br) + '\n     * ' + l.substring(br);
        }
        return l;
    }).join('\n');

    return `${result}\n     */\n    `;
}


/**
 * @param {TS.JSDoc|TS.JSDocTag} docletPart
 * @return {string}
 */
function getComment(
    docletPart
) {
    /** @param {typeof docletPart.comment} comment */
    const extractComment = comment => (
        typeof comment === 'string' ?
            comment :
            comment?.map(getComment).join('\n\n') || ''
    );

    if (TS.isJSDocAugmentsTag(docletPart)) {
        return docletPart.class.getText() + extractComment(docletPart.comment);
    }

    if (TS.isJSDocTypeTag(docletPart)) {
        return docletPart.typeExpression.getText() + extractComment(docletPart.comment);
    }

    return extractComment(docletPart.comment);
}


/**
 * @param {TS.Node} node1
 * @param {TS.Node} node2
 * @return {Array<ReturnType<TS.getJSDocCommentsAndTags>>}
 */
function getDocletsBetween(
    node1, node2
) {
    /** @type {Array<ReturnType<TS.getJSDocCommentsAndTags>>} */
    const doclets = [];
    const source = node2.getSourceFile();
    const start = node1?.end || node2.getFullStart();
    const end = node2.getStart(source, false);

    /** @type {ReturnType<TS.getJSDocCommentsAndTags>} */
    let parts;

    TS.forEachChild(
        TS.createSourceFile(
            'doclets.ts',
            Array
                .from(
                    source
                        .getFullText()
                        .substring(start, end)
                        .matchAll(DOCLET)
                )
                .map(match => match[0] + '\n\'\';\n')
                .join(''),
            TS.ScriptTarget.Latest,
            true
        ),
        node => {
            parts = TS.getJSDocCommentsAndTags(node);
            if (parts.length) {
                doclets.push(parts);
            }
        }
    );

    return doclets;
}


/**
 * @param {TS.SourceFile} source
 * @return {Record<string,*>}
 */
function getDocletsTree(
    source
) {
    /**
     * @param {TS.Node} node
     * @param {TS.Node} previousNode
     * @param {Array<Record<string,*>>} tree
     */
    const process = (node, previousNode, parentName, tree) => {

        if (
            TS.isObjectLiteralExpression(node) ||
            TS.isVariableDeclaration(node) ||
            TS.isVariableDeclarationList(node)
        ) {
            for (const child of getNodesChildren(node)) {
                process(child, previousNode, parentName, tree);
                previousNode = child;
            }
            return;
        }

        const branch = {};

        if (
            TS.isExpressionStatement(node) ||
            TS.isPropertyAssignment(node) ||
            TS.isVariableStatement(node)
        ) {

            decorateDoclet(branch, node, previousNode, tree);
            decorateName(branch, node, parentName);
            decorateType(branch, node);

            if (verbose) {
                console.info('Found:', TS.SyntaxKind[node.kind], branch.fullName);
            }

            if (!branch.fullName) {
                return;
            }

            tree.push(branch);

            if (
                TS.isExpressionStatement(node) &&
                TS.isStringLiteral(node.getFirstToken())
            ) {
                return;
            }

            /** @type {Array<Record<string,any>>} */
            let children = [];
            /** @type {TS.Node} */
            let previousChild;

            parentName = branch.fullName || parentName;

            for (const child of getNodesChildren(node)) {
                process(child, previousChild, parentName, children);
                previousChild = child;
            }

            if (children.length) {
                branch.children = children;
            }

        } else if (verbose) {
            console.info('Skipping:', TS.SyntaxKind[node.kind]);
        }

    };

    const tree = [];

    /** @type {TS.Node} */
    let previousNode;

    for (const node of getNodesChildren(source)) {
        process(node, previousNode, undefined, tree);
        previousNode = node;
    }

    return {
        fileName: source.fileName,
        children: tree
    };
}


/**
 * @param {Record<string,*>} branch
 * @param {boolean} [ofParent]
 * @return {string}
 */
function getInterfaceName(
    branch,
    ofParent
) {
    const doclet = branch.doclet;

    /** @param {string} name */
    const convertName = (name) => {
        const splittedName = name.split('.');

        if (ofParent) {
            splittedName.pop();
        }

        if (splittedName[0] === 'series') {
            splittedName.shift();
            splittedName.splice(1, 0, 'series');
        } 

        return splittedName
            .map(p => p[0].toUpperCase() + p.substring(1))
            .join('')
            .replace(/Options/g, '')
            .concat('Options');
    };

    if (branch.fullName) {
        return convertName(branch.fullName);
    }

    if (doclet) {
        return convertName(
            getTagText(doclet, 'apioption') ||
            getTagText(doclet, 'optionparent')
        );
    }

}


/**
 * @param {Record<string,*>} branch
 * @return {string}
 */
function getMemberType(
    branch
) {
    const doclet = branch.doclet;

    return (
        branch.type ||
        (doclet && getTagText(doclet, 'type')) ||
        '*'
    )
        .replace(/[{}]/gu, '')
        .replace(/\*/gu, (
            (doclet && getTagText(doclet, 'declare')) ||
            getInterfaceName(branch)
        ));
}


/**
 * @param {TS.Node} node
 * @return {TS.Node|undefined}
 */
function getNodesFirstChild(
    node
) {
    return getNodesChildren(node).shift();
}


/**
 * @param {TS.Node} node
 * @return {TS.Node|undefined}
 */
function getNodesLastChild(
    node
) {
    return getNodesChildren(node).pop();
}


/**
 * @param {TS.Node} node
 * @return {Array<TS.Node>}
 */
function getNodesChildren(
    node
) {
    /** @type {Array<TS.Node>} */
    const children = [];

    TS.forEachChild(node, child => {
        children.push(child)
    });

    return children;
}


/**
 * @param {TS.Node} node
 * @return {boolean}
 */
function hasNodeChildren(
    node
) {
    return !!TS.forEachChild(node, () => true);
}


/**
 * @param {Record<string,*>} branch
 * @return {string}
 */
function getPropertyName(
    branch
) {
    return (
        branch.name ||
        branch.fullName?.split('.').pop() ||
        ''
    );
}


/**
 * @param {Array<Record<string,string>>} doclet
 * @param {string} tag
 */
function getTagText(
    doclet,
    tag
) {
    for (const part of doclet) {
        if (part.tag === tag) {
            return part.text;
        }
    }
}


/**
 * @param {string} path
 * @param {boolean} logJSON
 */
async function moveSeriesDoclets(
    path,
    logJSON
) {
    const files = FSLib.getFilePaths(path, true);

    /** @type {TS.SourceFile} */
    let source;
    /** @type {string} */
    let sourcePath;
    /** @type {TS.SourceFile} */
    let target;
    /** @type {Record<string,*>} */
    let tree;

    for (const file of files) {

        if (!file.endsWith('Options.d.ts')) {
            continue;
        }

        sourcePath = findPairedSource(file);

        if (!sourcePath) {
            continue;
        }

        verbose && console.info('');
        console.info('Reading', sourcePath);

        source = TS.createSourceFile(
            sourcePath,
            await FS.promises.readFile(sourcePath, 'utf8'),
            TS.ScriptTarget.Latest,
            true
        );

        tree = getDocletsTree(source);

        if (!tree) {
            continue;
        }

        if (logJSON) {
            writeJSON(Path.join('tmp', 'move-doclets.json'), tree);
        }

        verbose && console.info('');
        console.info('Writing', file);

        target = TS.createSourceFile(
            file,
            await FS.promises.readFile(file, 'utf8'),
            TS.ScriptTarget.Latest,
            true
        );

        writeDocletsTree(target, tree);

        verbose && console.info('');
        console.info('Updateing', source.fileName);

        removeDoclets(source);
    }

}


async function main() {
    const argv = Yargs(process.argv).argv;

    if (argv.h || argv.help) {
        console.info(HELP);
        return;
    }

    if (argv.verbose) {
        verbose = true;
    }

    if (argv.series) {
        verbose && console.info('Reading series doclets...');
        await moveSeriesDoclets(argv.series, argv.json);
    }

}


/**
 * @param {Record<string,*>} tree
 */
function mergeInterfaceOverwrite(
    tree
) {
    /** @type {Record<string,Record<string,*>>} */
    const visitedBranches = {};
    /** @type {Record<string,*>} */
    const newTree = { children: [] };

    const walk = (branch, newParent) => {
        /** @type {string} */
        const interfaceName = getInterfaceName(branch);
        /** @type {Record<string,*>} */
        const newBranch = visitedBranches[interfaceName] || {};

        if (visitedBranches[interfaceName]) {
            if (branch.doclet) {
                newBranch.doclet = newBranch.doclet || [];
                newBranch.doclet.push(...branch.doclet);
                if (getTagText(newBranch.doclet, 'optionparent')) {
                    addTag(
                        newBranch.doclet,
                        'optionparent',
                        getTagText(newBranch.doclet, 'optionparent')
                    );
                    removeTag(newBranch.doclet, 'apioption');
                    removeTag(newBranch.doclet, 'optionparent');
                }
            }
            newBranch.merged = true;
        } else {
            if (branch.name) {
                newBranch.name = branch.name;
            }
            if (branch.fullName) {
                newBranch.fullName = branch.fullName;
            }
            if (branch.type) {
                newBranch.type = branch.type;
            }
            if (branch.doclet) {
                newBranch.doclet = branch.doclet;
            }
            newParent.children.push(newBranch);
            visitedBranches[interfaceName] = newBranch;
        }

        if (branch.children) {
            newBranch.children = newBranch.children || [];
            for (const child of branch.children) {
                walk(child, newBranch);
            }
        }

        if (!newBranch.children?.length) {
            delete newBranch.children;
        }
    };

    if (tree.children) {
        for (const branch of tree.children) {
            walk(branch, newTree);
        }
        tree.children = newTree.children;
    }
}


/**
 * @param {TS.SourceFile} target
 * @param {Record<string,*>} tree
 */
function writeDocletsTree(
    target,
    tree
) {
    /** @type {Array<[number,number,Record<string,*>]>} */
    const changes = [];

    /**
     * @param {Record<string,*>} branch
     * @param {TS.Node} node
     */
    const isRegistered = (branch, node) => changes.some(change => (
        change[2].fullName === branch.fullName &&
        (
            !node ||
            change[1] === node.kind
        )
    ));

    /**
     * @param {Record<string,*>} branch
     * @param {TS.Node} node
     */
    const connectOptions = (branch, node) => {

        if (!isRegistered(branch, node)) {
            if (
                TS.isInterfaceDeclaration(node) &&
                getInterfaceName(branch) === node.name.text
            ) {
                changes.push([node.getStart(), node.kind, branch]);
            } else if (
                TS.isPropertySignature(node) &&
                getPropertyName(branch) === node.name.text
            ) {
                changes.push([node.getStart(), node.kind, branch]);
            }
        }

        for (const child of getNodesChildren(node)) {
            connectOptions(branch, child);
        }

        if (branch.children) {
            for (const subBranch of branch.children) {
                connectOptions(subBranch, node);
            }
        }

    };

    /**
     * @param {Record<string,*>} branch
     */
    const addOptions = (branch) => {

        if (!isRegistered(branch)) {
            for (const node of getNodesChildren(target)) {
                if (
                    TS.isInterfaceDeclaration(node) &&
                    getInterfaceName(branch, true) === node.name.text
                ) {
                    changes.push([
                        node.getEnd() - 1,
                        TS.SyntaxKind.Unknown,
                        branch
                    ]);

                    if (branch.children) {
                        const children = branch.children;
                        const doclet = (branch.doclet || []).slice();

                        branch.type = getMemberType(branch);
                        delete branch.children;

                        if (getTagText(doclet, 'optionparent')) {
                            removeTag(branch.doclet, 'optionparent');
                        } else {
                            addTag(doclet, 'optionparent', branch.fullName);
                        }

                        changes.push([
                            node.getEnd() + 1,
                            TS.SyntaxKind.Unknown,
                            {
                                name: branch.name,
                                fullName: branch.fullName,
                                type: branch.type,
                                doclet,
                                children
                            }
                        ]);
                    }
                }
            }

            if (!isRegistered(branch)) {
                changes.push([
                    target.getEnd(),
                    TS.SyntaxKind.InterfaceDeclaration,
                    branch
                ]);
            }
        } else if (branch.children) {
            for (const subBranch of branch.children) {
                addOptions(subBranch);
            }
        }

    };

    if (tree.children) {

        // merge nodes with same interface path
        mergeInterfaceOverwrite(tree);

        // connect related options
        for (const branch of tree.children) {
            for (const node of getNodesChildren(target)) {
                connectOptions(branch, node);
            }
        }

        // add unmatched options
        for (const branch of tree.children) {
            addOptions(branch);
        }

    }

    if (changes.length) {

        if (verbose) {
            console.info('');
            console.info('Applying', changes.length, 'change(s)...');
        }

        let targetCode = target.getFullText();

        for (const change of changes.sort((a, b) => b[0] - a[0])) {
            /** @type {string} */
            let targetComment;
            switch (change[1]) {
                case TS.SyntaxKind.InterfaceDeclaration:
                    targetComment = generateInterfaceComment(change[2]);
                    break;
                case TS.SyntaxKind.PropertySignature:
                    targetComment = generatePropertyComment(change[2]);
                    break;
                default:
                    targetComment = generateDynamicCode(change[2]);
                    break;
            }
            targetCode = (
                targetCode.substring(0, change[0]) +
                targetComment +
                targetCode.substring(change[0])
            );
        }

        target = TS.createSourceFile(
            target.fileName,
            targetCode,
            TS.ScriptTarget.Latest,
            true
        );

        FS.writeFileSync(target.fileName, target.getFullText(), 'utf8');

    }

}


/**
 * @param {Array<Record<string,string>>} doclet
 * @param {string} tag
 */
function removeTag(
    doclet,
    tag
) {
    /** @type {Array<number>} */
    const indexes = [];

    for (let i = 0, iEnd = doclet.length; i < iEnd; ++i) {
        if (doclet[i].tag === tag) {
            indexes.push(i);
        }
    }

    for (const index of indexes.reverse()) {
        doclet.splice(index, 1);
    }

}


/**
 * @param {TS.SourceFile} source
 * @return {string}
 */
function removeDoclets(
    source
) {
    FS.writeFileSync(
        source.fileName, 
        source.getFullText().replace(/\n[ \t]*\/\*\*.*?\*\//gsu, ''),
        'utf8'
    );
}


/**
 * @param {string} filePath
 * @param {*} treeJSON
 */
function writeJSON(
    filePath,
    treeJSON
) {
    verbose && console.info('');
    console.info('Writing ' + filePath + '...');

    FS.mkdirSync(Path.dirname(filePath), { recursive: true });
    FS.writeFileSync(
        filePath,
        JSON.stringify(treeJSON, null, '    '),
        'utf8'
    );
}


/* *
 *
 *  CLI
 *
 * */


main();
