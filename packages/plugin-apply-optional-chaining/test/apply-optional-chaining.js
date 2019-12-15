'use strict';

const test = require('@putout/test')(__dirname, {
    'apply-optional-chaining': require('..'),
});

test('plugin-apply-optional-chaining: transform: report', (t) => {
    t.report('chain', 'Optional chaining should be used');
    t.end();
});

test('plugin-apply-optional-chaining: transform', (t) => {
    t.transform('chain');
    t.end();
});

test('plugin-apply-optional-chaining: transform: simple', (t) => {
    t.transform('simple');
    t.end();
});
