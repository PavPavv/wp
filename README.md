# Webpack as a JS bundler

## What is a bundler?

Bundlers lets us write modules that work in the browser.

Module bundlers compile small pieces of code into something larger and more complex that can run in a web browser. These small pieces are just JavaScript files, and dependencies between them are expressed by a module system [docs](https://webpack.js.org/concepts/modules).

Module bundlers have this concept of an entry file. Instead of adding a few script tags in the browser and letting them run, we let the bundler know which file is the main file of our application. This is the file that should bootstrap our entire application.

Our bundler will start from that entry file, and it will try to understand which files it depends on. Then, it will try to understand which files its dependencies depend on. It will keep doing that until it figures out about every module in our application, and how they depend on one another.
This understanding of a project is called the **dependency graph**.

> Dependency graph

### Bundle implementation

1. Parse a single file and extract its dependencies
2. Recursively build a dependency graph
3. Package everything into a single file

### This project schema

- project
  - node_modules
  - public
    - bundler.js
  - src
    - entry.js
    - message.js
    - name.js
  - package.lock.json
  - package.json
- .gitignore
- README.md

### Project explanation

