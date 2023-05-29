# React source click

Right-click to inspect the elements in a React application, including information from leaf nodes to root nodes and source code information for each node. Clicking will take you directly to the code editor.

## ShowCase

![showcase](./static/test.gif)

## Features

- short cut [ **ctrl + ;** ] can toggle right-click feature if you want to use the original function of right-click on the webpage.
- source nodes area draggable
- function component also can log info in devtool **Console** tab

## Dependencies

- framework like Next.js, create React App, Vite which use babel to compile code and use [@babel/plugin-transform-react-jsx-source](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source) by default
- you can use [react-source-click/babel-plugin-source-trace](https://github.com/alobe/react-source-click/blob/master/babel-plugin-source-trace/index.js) in your .babelrc.json or babel.config.json if project you work on didn't use @babel/plugin-transform-react-jsx-source plugin

## Installation

```shell
  // npm
  npm i react-source-click

  // yarn
  yarn add react-source-click

  // pnpm
  pnpm add react-source-click
```

## Usage

- GUI Element interaction

```typescript
  // import
  +import { Analysis } from "react-source-click";
  // import
  import React from "react";
  import ReactDOM from "react-dom/client";
  import App from "./App";
  import "./index.css";

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
      // insert
      +<Analysis />
      // insert
    </React.StrictMode>
  );
```

- chrome devtool **Element** Tab source info inject

```json
  // babel.config.json or .babelrc.json
  {
    ...,
    "plugins": [
      ...,
      "react-source-click/babel-plugin-source-trace"
    ]
  }
```

## Inspiration

- [ericclemmons/click-to-component](https://github.com/ericclemmons/click-to-component)
