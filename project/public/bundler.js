const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const babel = require("@babel/core");

let ID = 0;

function createAsset(filepath) {
  // Read the content of the js file
  const content = fs.readFileSync(filepath, 'utf-8');
  // Turn it into Abstract Syntax Tree
  const ast = babylon.parse(content, {
    sourceType: 'module',
  });
  // Collect dependencies in the dependencies array
  const dependencies = [];
  // Explore AST with Babylon
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      // Extract the dependencies which are just relative path of the imported js-module
      dependencies.push(node.source.value+'.js');
    },
  });
  let id = ID++;

  const { code } = babel.transformFromAst(ast, undefined, {
    'presets': [
      '@babel/preset-env',
    ],
  });

  // Return dependency object
  return {
    id,
    filepath,
    dependencies,
    code,
  }
}

function createGraph(entry) {
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];
  
  for (const asset of queue) {
    const dirname = path.dirname(asset.filepath);
    asset.mapping = {};
    asset.dependencies.forEach((relPath) => {
      const absPath = path.join(dirname, relPath);
      const child = createAsset(absPath);
      asset.mapping[relPath] = child.id;
      queue.push(child);
    });
  }
  return queue;
}

function bundle(graph) {
  let modules = '';
  graph.forEach((module) => {
    modules += `${module.id}: [
      function(require, module, exports) {
        ${module.code}
      },
      ${JSON.stringify(module.mapping)},
    ],`;
  });
  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];
        console.log(modules[id]);
        function localRequire(name) {
          return require(mapping[name]);
        }
        const module = { exports : {} };
        fn(localRequire, module, module.exports);
        return module.exports;
      }
      require(0);
    })({${modules}})
  `;
  return result;
}

const graph = createGraph('../src/entry.js');
const result = bundle(graph);


console.log(result);

fs.writeFileSync('./test.js', result);