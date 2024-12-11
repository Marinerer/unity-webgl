# unity-webgl

[![version](https://img.shields.io/npm/v/unity-webgl?style=flat-square)](https://www.npmjs.com/package/unity-webgl)
[![downloads](https://img.shields.io/npm/dm/unity-webgl?style=flat-square)](https://www.npmjs.com/package/unity-webgl)
[![size](https://img.shields.io/bundlephobia/minzip/unity-webgl?style=flat-square)](https://bundlephobia.com/package/unity-webgl)
[![languages](https://img.shields.io/github/languages/top/meqn/UnityWebGL.js?style=flat-square)](https://github.com/Meqn/UnityWebGL.js)
[![license](https://img.shields.io/npm/l/unity-webgl?style=flat-square)](https://github.com/Meqn/UnityWebGL.js)

[ [English](https://github.com/Meqn/UnityWebGL.js/blob/main/README.md) | [中文](https://github.com/Meqn/UnityWebGL.js/blob/main/README.zh_CN.md) ]



UnityWebGL.js provides an easy solution for embedding `Unity WebGL` builds in your `webApp` or `Vue.js` project, with two-way communication and interaction between your webApp and Unity application with advanced API's.


based on [react-unity-webgl](https://github.com/jeffreylanters/react-unity-webgl)

## Features
- 📦 No framework restrictions, support any web project.
- 📬 two-way communication and interaction (`webApp` & `Unity`).
- 💌 Built-in event-listening mechanism.
- 🧲 On-demand import vue component. (Supports [Vue@2.x](https://stackblitz.com/edit/unity-webgl-vue2-demo?file=src%2FApp.vue) & [Vue@3.x](https://stackblitz.com/edit/unity-webgl-vue3-demo?file=src%2FApp.vue))

## Install

### npm

```bash
npm install unity-webgl
```

### browser
```bash
https://cdn.jsdelivr.net/npm/unity-webgl/dist/index.global.js

# vue component
https://cdn.jsdelivr.net/npm/unity-webgl/vue/index.global.js
```

## Usage

> 🚨 Reminder:  
> You can only communicate and interact with the web application once the `Unity` instance has been successfully created (i.e. the `mounted` event is triggered).  
> It is recommended to add a loading when opening a page, wait for Unity resources to finish loading and close it.

### html
<details>
<summary>html demo</summary>

```html
<canvas id="canvas" style="width: 100%; height: 100%"></canvas>

<button onclick="postMessage()">postMessage</button>
<button onclick="onFullscreen()">Fullscreen</button>
<button onclick="onUnload()">Unload</button>

<script>
var unityContext = new UnityWebgl('#canvas', {
  loaderUrl: '/Build/unity.loader.js',
  dataUrl: "/Build/unity.data",
  frameworkUrl: "/Build/unity.framework.js",
  codeUrl: "/Build/unity.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "DefaultCompany",
  productName: "Unity",
  productVersion: "0.1",
})

unityContext
  .on('progress', (progress) => console.log('Loaded: ', progress))
  .on('mounted', () => {
  	// ⚠️ Resources are loaded and ready to communicate with unity
  	unityContext.send('mainScene', 'init', {})
    console.log('Unity Instance created.')
  })
  .on('unmounted', () => console.log('Unity Instance unmounted.'))

function postMessage() {
  unityContext.send('objectName', 'methodName', {
    id: 'B0001',
    name: 'Building#1',
    location: [150, 75]
  })
}

function onUnload() {
  unityContext.unload()
}

function onFullscreen() {
  unityContext.setFullscreen(true)
}
</script>
```

You can also:

```js
var unityContext = new UnityWebgl({
  loaderUrl: '/Build/unity.loader.js',
  dataUrl: "/Build/unity.data",
  frameworkUrl: "/Build/unity.framework.js",
  codeUrl: "/Build/unity.wasm"
})

unityContext.create(document.querySelector('#canvas'))
```
</details>

### Vue
- [Vue@2.x Live](https://stackblitz.com/edit/unity-webgl-vue2-demo?file=src%2FApp.vue)
- [Vue@3.x Live](https://stackblitz.com/edit/unity-webgl-vue3-demo?file=src/App.vue)

<details>
<summary>Vue demo</summary>

```html
<script setup>
import UnityWebgl from 'unity-webgl';
import VueUnity from 'unity-webgl/vue'

const unityContext = new UnityWebgl({
  loaderUrl: '/Build/OUT_BIM.loader.js',
  dataUrl: "/Build/OUT_BIM.data",
  frameworkUrl: "/Build/OUT_BIM.framework.js",
  codeUrl: "/Build/OUT_BIM.wasm",
})

unityContext.on('device', () => alert('click device ...'))
</script>

<template>
  <VueUnity :unity="unityContext" width="800" height="600" />
</template>
```
</details>



## API

```typescript
unityContext = new UnityWebgl(
  canvas: HTMLCanvasElement | string,
  config: IUnityConfig,
  bridge?: string
)
```
Or
```typescript
// 1. Initialize UnityWebgl
unityContext = new UnityWebgl(
  config: IUnityConfig,
  bridge?: string
)

// 2. Create unity instance and render on canvas
unityContext.create(canvas: HTMLCanvasElement | string)
```

### canvas
Rendering Unity's canvas elements
- type : `string | HTMLCanvasElement`

### bridge
The name of the bridge to communicate with Unity. It mounts on window and is used to collect registered methods for Unity to call.
- type : `string`
- default : `__UnityLib__`

### config
Initializes the configuration of the Unity application.  
> The configuration must contain the four most basic properties `loaderUrl`, `dataUrl`, `frameworkUrl`, `codeUrl`, which are the resource files needed to initialize the Unity application.

| Property               | Type | Description |
| ---------------------- | ---- | ----------- |
| `loaderUrl` ⭐️          | string | The url to the build json file generated by Unity |
| `dataUrl` ⭐️               | string | The url to the build data file generated by Unity |
| `frameworkUrl` ⭐️        | string | The url to the framework file generated by Unity |
| `codeUrl` ⭐️             | string | The url to the unity code file generated by Unity |
| `streamingAssetsUrl`     | string | The url where the streaming assets can be found |
| `memoryUrl`              | string | External memory file |
| `symbolsUrl`             | string | Providing debugging symbols |
| `companyName`            | string | The applications company name |
| `productName`            | string | The applications product name |
| `productVersion`         | string | The applications product version |
| `devicePixelRatio`       | number | Uncomment this to override low DPI rendering on high DPI displays. see [MDN@devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) |
| `matchWebGLToCanvasSize` | boolean | Uncomment this to separately control WebGL canvas render size and DOM element size. see [unity3d@matchWebGLToCanvasSize](https://issuetracker.unity3d.com/issues/webgl-builds-dont-allow-separate-control-on-canvas-render-buffer-size) |
| `webglContextAttributes` | object | This object allow you to configure WebGLRenderingContext creation options. see [MDN@WebGLRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getContextAttributes) |



### Methods
UnityWebgl Instance Methods

#### `create(canvasElement: HTMLCanvasElement | string): void`  
Create Unity instances and render them on the canvas.
- `canvasElement` : canvas canvas elements

#### `unload(): Promise<void>`  
Quits the Unity instance and clears it from memory so that Unmount from the DOM.  
> The `unmounted` event will be triggered after the operation is completed.

#### `send(objectName: string, methodName: string, params?: any)`  
⭐️ Sends a message to the UnityInstance to invoke a public method.
- `objectName`: Where objectName is the name of an object in your scene.
- `methodName`: methodName is the name of a C-Sharp method in the script, currently attached to that object.
- `params`: Parameters can be any type of value or not defined at all.

#### `on(eventName: string, eventListener: Function)`  
⭐️ Register an event or method to listen for the trigger event or for the Unity script to call.

#### `setFullscreen(enabled: boolean): void`  
Enables or disabled the fullscreen mode of the UnityInstance.

#### `requestPointerLock(): void`
Allows you to asynchronously request that the mouse pointer be locked to the Canvas element of your Unity application.

#### `takeScreenshot(dataType: 'image/png' | 'image/jpeg' | 'image/webp', quality?: number)`
Takes a screenshot of the canvas and returns a data URL containing image data.
- `dataType`: the type of the image data
- `quality`: the quality of the image

#### `once(eventName: string, eventListener: Function)`  
The registration event is executed only once

#### `off(eventName: string)`  
Cancel listening event

#### `emit(eventName: string)`  
Trigger listening event


### Events
Events triggered by a Unity instance from creation to destruction.

#### beforeMount  
Before Unity resources start loading. (The Unity instance has not been created yet.)
```js
unityContext.on('beforeMount', (unityContext) => {})
```

#### progress  
Unity resource loading. (Show loading progress)
```js
unityContext.on('progress', (number) => {})
```

#### mounted  
The Unity instance is successfully created and rendered. (At this point the webApp and Unity can communicate with each other)
```js
unityContext.on('mounted', (unityContext) => {})
```

#### beforeUnmount
Before the Unity instance exits.
```js
unityContext.on('beforeUnmount', (unityContext) => {})
```

#### unmounted
The Unity instance has been exited and cleared from memory.
```js
unityContext.on('unmounted', () => {})
```

#### error
Error messages caught by Unity instances during creation.
```js
unityContext.on('error', (error) => {})
```



## Vue component
Vue components, compatible with `vue2.x` and `vue3.x`.

### props
- `unity` : UnityWebgl instance.
- `width` : canvas element width, default: `100%`
- `height` : canvas element height, default: `100%`
- `tabindex` : Set the Canvas element tabindex.



## Communication

* [**WebGL: Interacting with browser scripting**@Unity3d.Docs](https://docs.unity3d.com/Manual/webgl-interactingwithbrowserscripting.html)

### Calling JavaScript functions from Unity scripts

1, First, you should register a `showDialog` method, which be bind to the `__UnityLib__` global object by default.  

```js
// # in webApp

const unityContext = new UnityWebgl()
// Register functions
unityContext.on('showDialog', (data) => {
  console.log(data)
  $('#dialog').show()
})

// you also can call function.
unityContext.emit('showDialog', data)
```

2, In the Unity project, add the registered `showDialog` method to the project, and then call those functions directly from your script code. To do so, place files with JavaScript code using the `.jslib` extension under a “Plugins” subfolder in your Assets folder. The plugin file needs to have a syntax like this:  

```js
// javascript_extend.jslib

mergeInto(LibraryManager.library, {
  // this is you code
  showDialog: function (str) {
    // var data = Pointer_stringify(str);
    var data = UTF8ToString(str);  // In Unity 2021.2 onwards
    // '__UnityLib__' is a global function collection.
    __UnityLib__.showDialog(data);
  },
  
  Hello: function () {
    window.alert("Hello, world!");
  }
});
```

Then you can call these functions from your C# scripts like this:

```c#
using UnityEngine;
using System.Runtime.InteropServices;

public class NewBehaviourScript : MonoBehaviour {

  [DllImport("__Internal")]
  private static extern void Hello();

  [DllImport("__Internal")]
  private static extern void showDialog(string str);

  void Start() {
    Hello();
    
    showDialog("This is a string.");
  }
}
```

### Calling Unity scripts functions from JavaScript

```js
const Unity = new UnityWebgl()

/**
 * Sends a message to the UnityInstance to invoke a public method.
 * @param {string} objectName Unity scene name.
 * @param {string} methodName public method name.
 * @param {any} params an optional method parameter.
 */
Unity.send(objectName, methodName, params)

// e.g. Initialize Building#001 data
Unity.send('mainScene', 'init', {
  id: 'b001',
  name: 'building#001',
  length: 95,
  width: 27,
  height: 120
})
```



## ChangeLog

### v3.5.0
#### 🚀 Features
- feat: Add `reload` method and event.
- perf: Optimize the `create` and `unload` methods.


### v3.4.0
#### 🚀 Features
- feat: Add configuration and changes to the global object `bridge`.
- feat: Unify events from creation to destruction of Unity applications.
  - Adds `beforeMount`, `mounted`, `beforeUnmount`, `unmounted` events;
  - Remove `created`, `destroyed` events.
- perf: Simplify the built-in event listener.
- perf: Optimize built-in vue components.
- perf: update typescript types.
- perf: Unified error message alert.
- docs: Optimize the use of documentation.

#### 🐞 Bug Fixes
- fix: Repair SPA unload error


### v3.0.0
#### 🚀 Features
- feat: Rewrite in Typescript
- feat: Vue components are compatible with vue2.x and vue3.x
- perf: Introducing vue components on demand

#### 🐞 Bug Fixes
- fix: Fix createUnityInstance multiple times
- fix: Fix vue component width/height size problem

### v2.x
- [v2.x Docs](https://github.com/Meqn/UnityWebGL.js/blob/v2.x/README.md)

### v1.x
- [v1.x Docs](https://github.com/Meqn/UnityWebGL.js/blob/v1.x/README.md)


