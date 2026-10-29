'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { validateArtifact, syncArtifact } = require('./publish-doc-skills');

const revision = 'a'.repeat(40);

function fixture(t) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'highcharts-skills-publish-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    const artifact = path.join(root, 'artifact');
    const destination = path.join(root, 'destination');
    const docs = path.join(artifact, 'highcharts-test', 'references', 'docs');
    fs.mkdirSync(docs, { recursive: true });
    fs.mkdirSync(destination);
    fs.writeFileSync(path.join(artifact, 'source.json'), JSON.stringify({
        repository: 'highcharts/highcharts', revision, skills: ['highcharts-test']
    }));
    fs.writeFileSync(path.join(artifact, 'highcharts-test', 'SKILL.md'),
        '---\nname: highcharts-test\ndescription: Example skill\n---\nRead `references/docs/index.md`.\n');
    fs.writeFileSync(path.join(docs, 'index.md'), '# Index\n\n- [Guide](guide.md)\n');
    fs.writeFileSync(path.join(docs, 'guide.md'), '# Guide\n');
    return { root, artifact, destination, docs };
}

test('validates the expected source revision and complete artifact inventory', t => {
    const { artifact } = fixture(t);
    assert.deepEqual(validateArtifact(artifact, revision).skills, ['highcharts-test']);
    assert.throws(() => validateArtifact(artifact, 'b'.repeat(40)), /revision/u);
    fs.mkdirSync(path.join(artifact, 'unexpected'));
    assert.throws(() => validateArtifact(artifact, revision), /contents/u);
});

test('rejects missing instructions and broken index or skill references', t => {
    const { artifact, docs } = fixture(t);
    const skill = path.join(artifact, 'highcharts-test', 'SKILL.md');
    const markdown = fs.readFileSync(skill);
    fs.unlinkSync(skill);
    assert.throws(() => validateArtifact(artifact, revision), /SKILL.md/u);
    fs.writeFileSync(skill, markdown);
    fs.writeFileSync(path.join(docs, 'index.md'), '- [Missing](missing.md)\n');
    assert.throws(() => validateArtifact(artifact, revision), /reference/u);
    fs.writeFileSync(path.join(docs, 'index.md'), '- [Guide](guide.md)\n');
    fs.appendFileSync(skill, '\nRead [missing](references/missing.md).\n');
    assert.throws(() => validateArtifact(artifact, revision), /reference/u);
});

test('rejects symlinks, Git metadata, and references outside a skill', t => {
    const { root, artifact, docs } = fixture(t);
    const outside = path.join(root, 'outside');
    fs.mkdirSync(outside);
    const link = path.join(docs, 'linked');
    fs.symlinkSync(outside, link, process.platform === 'win32' ? 'junction' : 'dir');
    assert.throws(() => validateArtifact(artifact, revision), /special file/u);
    fs.unlinkSync(link);
    const git = path.join(docs, '.git');
    fs.mkdirSync(git);
    assert.throws(() => validateArtifact(artifact, revision), /Git metadata/u);
    fs.rmdirSync(git);
    fs.writeFileSync(path.join(docs, 'index.md'), '- [Outside](../../../../source.json)\n');
    assert.throws(() => validateArtifact(artifact, revision), /unsafe reference/u);
});

test('requires confirmation and preserves files outside the managed output', t => {
    const { artifact, destination } = fixture(t);
    for (const name of ['.git', '.github']) {
        fs.mkdirSync(path.join(destination, name));
        fs.writeFileSync(path.join(destination, name, 'keep'), name);
    }
    for (const name of ['README.md', 'LICENSE']) {
        fs.writeFileSync(path.join(destination, name), name);
    }
    assert.throws(() => syncArtifact(artifact, destination, revision, false), /--yes/u);
    assert.equal(fs.existsSync(path.join(destination, 'skills')), false);
    assert.equal(syncArtifact(artifact, destination, revision, true), true);
    for (const name of ['.git', '.github']) {
        assert.equal(fs.readFileSync(path.join(destination, name, 'keep'), 'utf8'), name);
    }
    for (const name of ['README.md', 'LICENSE']) {
        assert.equal(fs.readFileSync(path.join(destination, name), 'utf8'), name);
    }
    assert.equal(fs.readFileSync(path.join(destination, 'source.json'), 'utf8'),
        fs.readFileSync(path.join(artifact, 'source.json'), 'utf8'));
});

test('unchanged bundles do not rewrite content or source provenance', t => {
    const { artifact, destination } = fixture(t);
    syncArtifact(artifact, destination, revision, true);
    const metadata = path.join(destination, 'source.json');
    const original = fs.readFileSync(metadata, 'utf8');
    const next = 'b'.repeat(40);
    fs.writeFileSync(path.join(artifact, 'source.json'), original.replace(revision, next));
    assert.equal(syncArtifact(artifact, destination, next, true), false);
    assert.equal(fs.readFileSync(metadata, 'utf8'), original);
});

test('repairs invalid provenance even when the skill contents are unchanged', t => {
    const { artifact, destination } = fixture(t);
    syncArtifact(artifact, destination, revision, true);
    const metadata = path.join(destination, 'source.json');
    const expected = fs.readFileSync(path.join(artifact, 'source.json'), 'utf8');
    const original = JSON.parse(expected);
    for (const invalid of [
        '{',
        JSON.stringify({ ...original, repository: 'other/repo' }),
        JSON.stringify({ ...original, skills: ['removed-skill'] }),
        JSON.stringify({ ...original, revision: 'invalid' })
    ]) {
        fs.writeFileSync(metadata, invalid);
        assert.equal(syncArtifact(artifact, destination, revision, true), true);
        assert.equal(fs.readFileSync(metadata, 'utf8'), expected);
        assert.equal(syncArtifact(artifact, destination, revision, true), false);
    }
});

test('validates encoded local references to authored resources', t => {
    const { artifact } = fixture(t);
    const root = path.join(artifact, 'highcharts-test');
    fs.writeFileSync(path.join(root, 'references', 'custom guide.md'), '# Guide\n');
    fs.appendFileSync(path.join(root, 'SKILL.md'), '\nRead [custom](references/custom%20guide.md).\n');
    assert.deepEqual(validateArtifact(artifact, revision).skills, ['highcharts-test']);
});

test('replaces changed content and removes obsolete skills and references', t => {
    const { artifact, destination, docs } = fixture(t);
    syncArtifact(artifact, destination, revision, true);
    const managed = path.join(destination, 'skills');
    fs.mkdirSync(path.join(managed, 'removed-skill'));
    fs.writeFileSync(path.join(managed, 'highcharts-test', 'old.md'), 'Obsolete');
    fs.writeFileSync(path.join(docs, 'guide.md'), '# Updated\n');
    assert.equal(syncArtifact(artifact, destination, revision, true), true);
    assert.deepEqual(fs.readdirSync(managed), ['highcharts-test']);
    assert.equal(fs.existsSync(path.join(managed, 'highcharts-test', 'old.md')), false);
    assert.equal(fs.readFileSync(path.join(managed, 'highcharts-test', 'references', 'docs', 'guide.md'), 'utf8'),
        '# Updated\n');
});

test('invalid input leaves the existing distribution intact', t => {
    const { artifact, destination, docs } = fixture(t);
    syncArtifact(artifact, destination, revision, true);
    fs.unlinkSync(path.join(docs, 'guide.md'));
    assert.throws(() => syncArtifact(artifact, destination, revision, true), /reference/u);
    assert.equal(fs.readFileSync(path.join(destination, 'skills', 'highcharts-test', 'references', 'docs', 'guide.md'), 'utf8'),
        '# Guide\n');
    fs.writeFileSync(path.join(docs, 'guide.md'), '# Guide\n');
    assert.throws(() => syncArtifact(artifact, path.dirname(artifact), revision, true), /separate directories/u);
});

test('rejects overlap through symlinked parents without changing the artifact', t => {
    for (const [input, output] of [
        ['destination/skills', 'alias/destination'],
        ['alias/destination/skills', 'destination'],
        ['destination/skills', 'alias/destination/skills'],
        ['destination/skills', 'alias/destination/skills/highcharts-test']
    ]) {
        const { root, artifact, destination } = fixture(t);
        const nested = path.join(destination, 'skills');
        fs.renameSync(artifact, nested);
        fs.symlinkSync(root, path.join(root, 'alias'), process.platform === 'win32' ? 'junction' : 'dir');
        assert.throws(() => syncArtifact(path.join(root, input), path.join(root, output), revision, true),
            /separate directories/u, `${input} -> ${output}`);
        assert.deepEqual(validateArtifact(nested, revision).skills, ['highcharts-test']);
        assert.equal(fs.readFileSync(path.join(nested, 'highcharts-test', 'references', 'docs', 'guide.md'), 'utf8'),
            '# Guide\n');
    }
});

test('synchronizes separate directories through symlinked parents', t => {
    const { root, artifact, destination } = fixture(t);
    const alias = path.join(root, 'alias');
    fs.symlinkSync(root, alias, process.platform === 'win32' ? 'junction' : 'dir');
    assert.equal(syncArtifact(path.join(alias, 'artifact'), path.join(alias, 'destination'), revision, true), true);
    assert.deepEqual(validateArtifact(artifact, revision).skills, ['highcharts-test']);
    assert.equal(fs.readFileSync(path.join(destination, 'skills', 'highcharts-test', 'references', 'docs', 'guide.md'), 'utf8'),
        '# Guide\n');
    assert.equal(syncArtifact(artifact, destination, revision, true), false);
});

test('rejects destination directory and metadata symlinks', t => {
    const { root, artifact, destination } = fixture(t);
    const alias = path.join(root, 'alias');
    fs.symlinkSync(destination, alias, process.platform === 'win32' ? 'junction' : 'dir');
    assert.throws(() => syncArtifact(artifact, alias, revision, true), /directory/u);
    const outside = path.join(root, 'outside');
    fs.mkdirSync(outside);
    const managed = path.join(destination, 'skills');
    fs.symlinkSync(outside, managed, process.platform === 'win32' ? 'junction' : 'dir');
    assert.throws(() => syncArtifact(artifact, destination, revision, true), /directory/u);
    assert.deepEqual(fs.readdirSync(outside), []);
    fs.unlinkSync(managed);
    if (process.platform !== 'win32') {
        fs.symlinkSync(path.join(outside, 'missing.json'), path.join(destination, 'source.json'));
        assert.throws(() => syncArtifact(artifact, destination, revision, true), /regular source.json/u);
        assert.deepEqual(fs.readdirSync(outside), []);
    }
});
