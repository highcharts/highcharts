import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

function fixture(t) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hc-skill-sync-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));

    function write(name, content) {
        const file = path.join(root, name);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, content);
    }

    write('.agents/skills/code-review/SKILL.md', 'canonical review');
    write('.agents/skills/other/SKILL.md', 'canonical other skill');
    write('tools/sync-agent-skills.js', fs.readFileSync(
        new URL('./sync-agent-skills.js', import.meta.url)
    ));

    return {
        root,
        write,
        read: name => fs.readFileSync(path.join(root, name), 'utf8'),
        exists: name => fs.existsSync(path.join(root, name)),
        run: (...args) => spawnSync(process.execPath, [
            path.join(root, 'tools/sync-agent-skills.js'), ...args
        ], { encoding: 'utf8', input: '' })
    };
}

test('syncs review mirrors and preserves unrelated GitHub skills', t => {
    const f = fixture(t);
    f.write('.claude/skills/obsolete-review/SKILL.md', 'obsolete review');
    f.write('.github/skills/code-review/SKILL.md', 'old review');
    f.write('.github/skills/unrelated/SKILL.md', 'keep this skill');

    const result = f.run('--yes');
    assert.equal(result.status, 0, result.stderr);
    assert.equal(f.read('.claude/skills/code-review/SKILL.md'),
        'canonical review');
    assert.equal(f.read('.github/skills/code-review/SKILL.md'),
        'canonical review');
    assert.equal(f.read('.claude/skills/other/SKILL.md'),
        'canonical other skill');
    assert.equal(f.exists('.claude/skills/obsolete-review'), false);
    assert.equal(f.exists('.github/skills/other'), false);
    assert.equal(f.read('.github/skills/unrelated/SKILL.md'),
        'keep this skill');
});

test('refuses both replacements when only the GitHub mirror exists', t => {
    const f = fixture(t);
    f.write('.github/skills/code-review/SKILL.md', 'keep this review');

    const result = f.run();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /without confirmation/);
    assert.equal(f.exists('.claude/skills'), false);
    assert.equal(f.read('.github/skills/code-review/SKILL.md'),
        'keep this review');
});

test('checks all sources before replacing either mirror', t => {
    const f = fixture(t);
    fs.rmSync(path.join(f.root, '.agents/skills/code-review'), {
        recursive: true
    });
    f.write('.claude/skills/code-review/SKILL.md', 'keep Claude review');
    f.write('.github/skills/code-review/SKILL.md', 'keep GitHub review');

    const result = f.run('--yes');
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Missing source directory/);
    assert.equal(f.read('.claude/skills/code-review/SKILL.md'),
        'keep Claude review');
    assert.equal(f.read('.github/skills/code-review/SKILL.md'),
        'keep GitHub review');
});
