import assert from 'node:assert/strict';

export function readPackResult(stdout, packageName) {
    const result = JSON.parse(stdout);
    // npm 11 returns an array. npm 12 keys the results by package name.
    const packages = Array.isArray(result) ? result : Object.values(result ?? {});
    assert.equal(packages.length, 1, 'Expected one npm pack result');
    const [packed] = packages;
    assert.equal(packed?.name, packageName, 'npm packed an unexpected package');
    assert(typeof packed.filename === 'string' && /^[^/\\]+\.tgz$/u.test(packed.filename),
        'npm pack did not report a tarball filename');
    assert(typeof packed.integrity === 'string' && packed.integrity,
        'npm pack did not report tarball integrity');
    return packed;
}
