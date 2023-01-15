# Webpack as a JS bundler

## What is a bundler?

Bundlers lets us write modules that work in the browser.

> Dependency graph

### Bundle implementation

1. Parse a single file and extract its dependencies
2. Recursively build a dependency graph
3. Package everything into a single file

### This project schema:

- entry.js
- message.js
- name.js
