'use strict';

const removeDebugger = require('..');
const test = require('@putout/test')(__dirname, {
    'remove-duplicate-interface-keys': removeDebugger,
});

test('remove duplicate-interface-keys: report', (t) => {
    t.report('duplicate', 'Duplicate interface keys should be avoided');
    t.end();
});

test('remove duplicate-interface-keys: transform: duplicate', (t) => {
    t.transform('duplicate-literal');
    t.end();
});

test('remove duplicate-interface-keys: transform: break code with additional ";"', (t) => {
    t.transform('additional-semicolon');
    t.end();
});

test('remove duplicate-interface-keys: no transform: index signature', (t) => {
    t.noTransform('index-signature');
    t.end();
});

