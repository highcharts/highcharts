#!/usr/bin/env node
/* *
 *
 *  Finds interface members that redeclare an inherited member without
 *  changing anything: same type, same optionality, and a doclet that only
 *  repeats what the parent member already says.
 *
 *  (c) Highsoft AS
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


/* *
 *
 *  Constants
 *
 * */


const ANSI = {
    green: '\u001b[32m',
    red: '\u001b[31m',
    reset: '\u001b[39m',
    yellow: '\u001b[33m'
};

const HELP = [
    'node tools/find-redundant-members.mjs [OPTIONS] <path...>',
    '',
    'Reports interface members that redeclare an inherited member with the',
    'same type and optionality, and whose doclet adds nothing to the parent',
    'doclet (no own description, every tag repeated with the same value).',
    '',
    'PATHS:',
    '  File(s) or directory(ies) under ts/. Directories are searched',
    '  recursively for *.ts files.',
    '',
    'OPTIONS:',
    '  --doclets             Report only members that have a doclet, skip',
    '                        plain undocumented redeclarations.',
    '  --help, -h            This help.',
    '  --interface, -i NAME  Check only interfaces with this name.',
    '                        Can be repeated.',
    '  --tags                Also report repeated tags on members that are',
    '                        not fully redundant (e.g. a changed type).',
    '',
    'Output lines use "file:line:col" so they are clickable in the terminal',
    'and usable in a VS Code problem matcher. Exit code is 1 if anything',
    'was found.'
].join('\n');


/* *
 *
 *  Functions
 *
 * */


function colorize(color, text) {
    if (!process.stdout.isTTY) {
        return text;
    }

    return `${ANSI[color]}${text}${ANSI.reset}`;
}


function parseArgs(argv) {
    const args = {
        doclets: false,
        help: false,
        interfaces: [],
        paths: [],
        tags: false
    };

    for (let i = 0; i < argv.length; ++i) {
        const arg = argv[i];

        if (arg === '--doclets') {
            args.doclets = true;
        } else if (arg === '--help' || arg === '-h') {
            args.help = true;
        } else if (arg === '--interface' || arg === '-i') {
            args.interfaces.push(argv[++i]);
        } else if (arg === '--tags') {
            args.tags = true;
        } else {
            args.paths.push(arg);
        }
    }

    return args;
}


function collectFiles(paths) {
    const files = [];

    for (const path of paths) {
        const absolute = Path.resolve(path);
        const stat = FS.statSync(absolute);

        if (stat.isDirectory()) {
            for (const entry of FS.readdirSync(absolute, {
                recursive: true,
                withFileTypes: true
            })) {
                if (entry.isFile() && /\.ts$/u.test(entry.name)) {
                    files.push(Path.join(entry.parentPath, entry.name));
                }
            }
        } else {
            files.push(absolute);
        }
    }

    return files.map(file => Path.normalize(file));
}


function normalize(text) {
    return (text || '').replace(/\s+/gu, ' ').trim();
}


function tagKey(name, text) {
    return `@${name} ${normalize(text)}`;
}


/**
 * Own doclet of a member, without anything inherited.
 *
 * @param {TS.PropertySignature} member
 * Member to read the doclet from.
 *
 * @return {{description: string, hasDoclet: boolean, tags: Array<string>}}
 * Normalized description and tags.
 */
function getOwnDoclet(member) {
    const docs = TS.getJSDocCommentsAndTags(member).filter(TS.isJSDoc);
    const description = docs
        .map(doc => TS.getTextOfJSDocComment(doc.comment))
        .join(' ');
    const tags = docs.flatMap(doc => (doc.tags || []).map(tag => tagKey(
        tag.tagName.text,
        TS.getTextOfJSDocComment(tag.comment)
    )));

    return { description: normalize(description), hasDoclet: !!docs.length, tags };
}


/**
 * Doclet of the inherited member, as the language service resolves it.
 *
 * @param {TS.Symbol} symbol
 * Symbol of the inherited member.
 *
 * @param {TS.TypeChecker} checker
 * Type checker of the program.
 *
 * @return {{description: string, tags: Array<string>}}
 * Normalized description and tags.
 */
function getBaseDoclet(symbol, checker) {
    return {
        description: normalize(
            TS.displayPartsToString(symbol.getDocumentationComment(checker))
        ),
        tags: symbol.getJsDocTags(checker).map(tag => tagKey(
            tag.name,
            TS.displayPartsToString(tag.text)
        ))
    };
}


/**
 * Strict identity: the checker interns primitives, literals and unions, so
 * `Parent['prop']` resolves to the very same type object as the parent's
 * type. Mutual assignability would be too loose, as any two all-optional
 * option interfaces are assignable to each other.
 *
 * @param {TS.Type} a
 * Type of the own member.
 *
 * @param {TS.Type} b
 * Type of the inherited member.
 *
 * @return {boolean}
 * True if both are the same type.
 */
function isSameType(a, b) {
    return a === b;
}


/**
 * Whether a member declaration has the `readonly` modifier.
 *
 * @param {TS.Declaration} declaration
 * Member declaration to check.
 *
 * @return {boolean}
 * True if the member is readonly.
 */
function isReadonly(declaration) {
    return !!(
        TS.getCombinedModifierFlags(declaration) & TS.ModifierFlags.Readonly
    );
}


function checkInterface(node, checker, args, report) {
    const type = checker.getDeclaredTypeOfSymbol(
        checker.getSymbolAtLocation(node.name)
    );
    const baseTypes = checker.getBaseTypes(type);

    if (!baseTypes.length) {
        return;
    }

    for (const member of node.members) {
        if (!TS.isPropertySignature(member) || !member.name) {
            continue;
        }

        const ownSymbol = checker.getSymbolAtLocation(member.name);

        if (!ownSymbol) {
            continue;
        }

        // Symbol name, without the quotes of a quoted member name.
        const name = ownSymbol.getName();
        const inherited = baseTypes
            .map(baseType => ({
                baseSymbol: checker.getPropertyOfType(baseType, name),
                baseType
            }))
            .filter(base => base.baseSymbol);

        if (!inherited.length) {
            continue;
        }

        const { baseSymbol, baseType } = inherited[0];

        // With several bases, the redeclaration may resolve a conflict
        // between them (TS2320), so all of them have to match.
        const sameInAllBases = inherited.every(base => isSameType(
            checker.getTypeOfSymbol(ownSymbol),
            checker.getTypeOfSymbol(base.baseSymbol)
        ));

        // An inherited `prop?: Own['prop']` would become circular.
        const circular = inherited.some(base => (
            base.baseSymbol.declarations || []
        ).some(declaration => (
            declaration.type &&
            TS.isIndexedAccessTypeNode(declaration.type) &&
            checker.getTypeFromTypeNode(declaration.type.objectType)
                .getSymbol() === type.getSymbol()
        )));

        if (circular) {
            continue;
        }

        const sameOptional = inherited.every(base => (
            !!member.questionToken ===
            !!(base.baseSymbol.flags & TS.SymbolFlags.Optional)
        ));
        // Removing the member would change whether it can be written to.
        const sameReadonly = inherited.every(base => (
            isReadonly(member) ===
            (base.baseSymbol.declarations || []).some(isReadonly)
        ));
        const sameType = sameInAllBases;
        const own = getOwnDoclet(member);
        const base = getBaseDoclet(baseSymbol, checker);
        const baseTags = new Set(base.tags);
        const repeatedTags = own.tags.filter(tag => baseTags.has(tag));
        const docletAddsNothing = (
            (!own.description || own.description === base.description) &&
            repeatedTags.length === own.tags.length
        );
        const where = `${checker.typeToString(baseType)}.${name}`;

        if (args.doclets && !own.hasDoclet) {
            continue;
        }

        if (sameOptional && sameReadonly && sameType && docletAddsNothing) {
            report(member, `${node.name.text}.${name} is redundant, ` + (
                own.hasDoclet ?
                    `doclet repeats ${where}: ` + ([
                        ...(own.description ? ['description'] : []),
                        ...own.tags
                    ].join(', ') || '(empty doclet)') :
                    `same as ${where}`
            ));
        } else if (args.tags && repeatedTags.length) {
            report(
                member,
                `${node.name.text}.${name} repeats tags of ${where}: ` +
                repeatedTags.join(', ')
            );
        }
    }
}


function visitSourceFile(sourceFile, checker, args, report) {
    TS.forEachChild(sourceFile, function visit(node) {
        if (
            TS.isInterfaceDeclaration(node) &&
            (
                !args.interfaces.length ||
                args.interfaces.includes(node.name.text)
            )
        ) {
            checkInterface(node, checker, args, report);
        }
        TS.forEachChild(node, visit);
    });
}


function main() {
    const args = parseArgs(process.argv.slice(2));

    if (args.help || !args.paths.length) {
        console.info(HELP);
        process.exitCode = args.help ? 0 : 2;
        return;
    }

    const missing = args.paths.filter(path => !FS.existsSync(path));

    if (missing.length) {
        console.info(colorize('red', `Path not found: ${missing.join(', ')}`));
        process.exitCode = 2;
        return;
    }

    const files = collectFiles(args.paths);
    const configPath = Path.resolve('ts/tsconfig.json');
    const config = TS.getParsedCommandLineOfConfigFile(
        configPath,
        {},
        { ...TS.sys, onUnRecoverableConfigFileDiagnostic: () => void 0 }
    );
    const program = TS.createProgram(files, {
        ...config.options,
        composite: false,
        noEmit: true
    });
    const checker = program.getTypeChecker();
    const cwd = process.cwd();
    const findings = [];

    for (const file of files) {
        const sourceFile = program.getSourceFile(file);

        if (sourceFile) {
            visitSourceFile(sourceFile, checker, args, (node, message) => {
                const { line, character } = sourceFile
                    .getLineAndCharacterOfPosition(node.getStart());
                const location = (
                    `${Path.relative(cwd, file).replace(/\\/gu, '/')}:` +
                    `${line + 1}:${character + 1}`
                );

                findings.push(`${colorize('yellow', location)} - ${message}`);
                console.info(findings[findings.length - 1]);
            });
        }
    }

    console.info(colorize(
        findings.length ? 'red' : 'green',
        `${findings.length} finding(s) in ${files.length} file(s).`
    ));
    process.exitCode = findings.length ? 1 : 0;
}


main();
