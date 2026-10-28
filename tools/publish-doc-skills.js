#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

function directory(root) {
    if (!fs.lstatSync(root).isDirectory()) {
        throw new Error(`Expected a directory: ${root}`);
    }
}

function regularFiles(root) {
    directory(root);
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        const file = path.join(root, entry.name);
        if (entry.name.toLowerCase() === '.git' ||
            (!entry.isDirectory() && !entry.isFile())) {
            throw new Error(`Git metadata or special file in artifact: ${file}`);
        }
        if (entry.isDirectory()) {
            regularFiles(file);
        }
    }
}

function reference(root, file, target) {
    const resolved = path.resolve(path.dirname(file), decodeURIComponent(target.split('#')[0]));
    if (!resolved.startsWith(root + path.sep) || !fs.existsSync(resolved) ||
        !fs.lstatSync(resolved).isFile()) {
        throw new Error(`Missing or unsafe reference in ${file}: ${target}`);
    }
}

function validateArtifact(artifact, revision) {
    const root = path.resolve(artifact);
    regularFiles(root);
    const source = JSON.parse(fs.readFileSync(path.join(root, 'source.json'), 'utf8'));
    if (!/^[a-f0-9]{40}$/u.test(revision || '') || source.revision !== revision ||
        source.repository !== 'highcharts/highcharts' || !Array.isArray(source.skills) ||
        !source.skills.length || source.skills.some(name => (
        typeof name !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(name)
    )) || new Set(source.skills).size !== source.skills.length) {
        throw new Error('Invalid source.json or unexpected Highcharts revision.');
    }
    const expected = ['source.json', ...source.skills].sort();
    if (JSON.stringify(fs.readdirSync(root).sort()) !== JSON.stringify(expected)) {
        throw new Error('Artifact contents do not match source.json skills.');
    }
    for (const name of source.skills) {
        const skillRoot = path.join(root, name);
        directory(skillRoot);
        const skill = path.join(skillRoot, 'SKILL.md');
        const markdown = fs.readFileSync(skill, 'utf8');
        if (!markdown.trim()) {
            throw new Error(`Empty skill: ${skill}`);
        }
        for (const match of markdown.matchAll(/`(references\/[^`]+)`/gu)) {
            reference(skillRoot, skill, match[1]);
        }
        for (const match of markdown.matchAll(/\]\((references\/[^)]+)\)/gu)) {
            reference(skillRoot, skill, match[1]);
        }
        const index = path.join(skillRoot, 'references', 'docs', 'index.md');
        const entries = [...fs.readFileSync(index, 'utf8').matchAll(/^- \[[^\n]+\]\(([^)]+)\)$/gmu)];
        if (!entries.length) {
            throw new Error(`Empty documentation index: ${index}`);
        }
        for (const match of entries) {
            reference(skillRoot, index, match[1]);
        }
    }
    return source;
}

function sameDirectory(expected, actual) {
    if (!fs.existsSync(actual) || !fs.lstatSync(actual).isDirectory()) {
        return false;
    }
    const entries = fs.readdirSync(expected, { withFileTypes: true });
    return entries.length === fs.readdirSync(actual).length && entries.every(entry => {
        const source = path.join(expected, entry.name);
        const destination = path.join(actual, entry.name);
        return entry.isDirectory() ? sameDirectory(source, destination) :
            fs.existsSync(destination) && fs.lstatSync(destination).isFile() &&
            fs.readFileSync(source).equals(fs.readFileSync(destination));
    });
}

function sameSource(metadata, source) {
    try {
        const previous = JSON.parse(fs.readFileSync(metadata, 'utf8'));
        return /^[a-f0-9]{40}$/u.test(previous.revision || '') &&
            JSON.stringify(Object.keys(previous).sort()) === JSON.stringify(Object.keys(source).sort()) &&
            Object.keys(source).every(key => key === 'revision' ||
                JSON.stringify(previous[key]) === JSON.stringify(source[key]));
    } catch {
        return false;
    }
}

function syncArtifact(artifact, destination, revision, yes) {
    const source = validateArtifact(artifact, revision);
    const root = path.resolve(destination);
    const input = path.resolve(artifact);
    if (root === input || root.startsWith(input + path.sep) || input.startsWith(root + path.sep)) {
        throw new Error('Artifact and destination must be separate directories.');
    }
    directory(root);
    const skills = path.join(root, 'skills');
    if (fs.lstatSync(skills, { throwIfNoEntry: false })) {
        directory(skills);
    }
    const metadata = path.join(root, 'source.json');
    const metadataStat = fs.lstatSync(metadata, { throwIfNoEntry: false });
    if (metadataStat && !metadataStat.isFile()) {
        throw new Error(`Expected a regular source.json file: ${metadata}`);
    }
    const current = fs.existsSync(skills) ? fs.readdirSync(skills).sort() : [];
    if (metadataStat && sameSource(metadata, source) &&
        JSON.stringify(current) === JSON.stringify([...source.skills].sort()) &&
        source.skills.every(name => sameDirectory(path.join(input, name), path.join(skills, name)))) {
        return false;
    }
    if (!yes) {
        throw new Error('Pass --yes to replace the managed skills directory.');
    }
    fs.rmSync(skills, { recursive: true, force: true });
    fs.mkdirSync(skills);
    for (const name of source.skills) {
        fs.cpSync(path.join(input, name), path.join(skills, name), { recursive: true });
    }
    fs.copyFileSync(path.join(input, 'source.json'), metadata);
    return true;
}

function main() {
    const args = {};
    for (const arg of process.argv.slice(2)) {
        if (arg === '--yes') {
            args.yes = true;
        } else if (arg === '--help') {
            process.stdout.write([
                'Validate or copy a complete Highcharts skills artifact.',
                '  --artifact=<path>      Required built bundle directory',
                '  --revision=<sha>       Required expected Highcharts commit',
                '  --destination=<path>   Optional distribution repository checkout',
                '  --yes                  Confirm replacement of destination skills/',
                'Without --destination, validation never writes files.'
            ].join('\n') + '\n');
            return;
        } else {
            const match = arg.match(/^--(artifact|revision|destination)=(.+)$/u);
            if (!match) {
                throw new Error(`Unknown option: ${arg}`);
            }
            args[match[1]] = match[2];
        }
    }
    if (!args.artifact || !args.revision) {
        throw new Error('--artifact and --revision are required.');
    }
    if (args.destination) {
        process.stdout.write(syncArtifact(args.artifact, args.destination, args.revision, args.yes) ?
            'Updated managed skills and source.json.\n' : 'Skill contents are already current.\n');
    } else {
        validateArtifact(args.artifact, args.revision);
        process.stdout.write('Skill artifact is valid.\n');
    }
}

module.exports = { validateArtifact, syncArtifact };

if (require.main === module) {
    try {
        main();
    } catch (error) {
        process.stderr.write(`${error.message}\n`);
        process.exitCode = 1;
    }
}
