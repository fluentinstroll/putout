'use strict';

const {types, operate} = require('putout');

const {
    isStringLiteral,
    isTemplateLiteral,
} = types;

const {isModuleExports} = operate;

module.exports.report = () => '"lint" should check "madrun.js"';

module.exports.fix = ({line}) => {
    if (isStringLiteral(line)) {
        const result = addMadrun(line.value);
        
        line.value = result;
        line.raw = result;
        return;
    }
    
    const result = addMadrun(line.value.raw);
    
    line.value.raw = result;
    line.value.cooked = result;
};

module.exports.traverse = ({push}) => {
    return {
        MemberExpression(path) {
            if (!isModuleExports(path))
                return;
            
            const {parentPath} = path;
            
            if (!parentPath.isAssignmentExpression())
                return;
            
            const rightPath = parentPath.get('right');
            
            if (!rightPath.isObjectExpression())
                return;
            
            const lint = findKey('lint', rightPath);
            
            if (!lint)
                return;
            
            const value = lint.parentPath.get('value');
            
            if (!value.isFunction())
                return;
            
            const {body} = value.node;
            
            if (isStringLiteral(body) && !/madrun/.test(body.value))
                return push({
                    path: rightPath,
                    lint,
                    line: body,
                });
            
            if (!isTemplateLiteral(body))
                return;
            
            if (body.expressions.length)
                return;
            
            const [line] = body.quasis;
            
            if (line.value.raw.includes('madrun'))
                return;
            
            push({
                path: rightPath,
                lint,
                line,
            });
        },
    };
};

function findKey(name, path) {
    const properties = path.get('properties');
    
    for (const property of properties) {
        const key = property.get('key');
        const is = isKey(name, key);
        
        if (is)
            return key;
    }
    
    return null;
}

function isKey(name, key) {
    const isId = key.isIdentifier({name});
    const isStr = key.isStringLiteral({
        value: name,
    });
    
    return isStr || isId;
}

function addMadrun(a) {
    if (a.includes('test'))
        return a.replace('test', 'test madrun.js');
    
    return `${a} madrun.js`;
}

