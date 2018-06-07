# Oan

> Another Web Components Framework.



Demos
---

Template:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Dili Web Components</title>
  <script src="./others/libs/webcomponents/custom-elements.min.js"></script>
  <script src="./others/libs/webcomponents/shadydom.min.js"></script>
  <script src="../dist/oan.umd.js"></script>
  <link rel="stylesheet" href="css/styles.css">

  <link rel="import" href="components/di-li.html">
</head>
<body>
<di-li (click)="world()" [draggable]="true" [text3]="'import'">
</di-li>
</body>
</html>
```

Component:

```html
<template>
  <style>
    :host {
      color: #dd4633;
      font: 18px Arial, sans-serif;
    }
    p {
      color: #23B7F3;
    }
  </style>

  <p> {{text}} </p>
  <br/>
  {{text2}}
  <br/>
  {{text3}}
  <input type="text" [model]="text2" (change)="onTextChange($event)">
</template>

<script>
  (function (window, document, undefined) {
    oan.Component({
      is: "di-li",
      data: {
        text: "Hello, ",
        text2: "World"
      },
      methods: {
        world: function ($event) {
          console.log("world", $event);
        },
        onTextChange: function ($event) {
          console.log("onTextChange");
        }
      },
      ready: function () {
        console.log('di li ready');
      },
      connected: function () {
        this.text = 'Hello...';

        console.log('di-li connected')
      },
    });
  })(window, document);
</script>
```

License
---

[![Phodal's Idea](http://brand.phodal.com/shields/idea-small.svg)](http://ideas.phodal.com/)

© 2018 A [Phodal Huang](https://www.phodal.com)'s [Idea](http://github.com/phodal/ideas).  This code is distributed under the MIT license. See `LICENSE` in this directory.
