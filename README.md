# unity-webgl

[![version](https://img.shields.io/npm/v/unity-webgl?style=flat-square)](https://www.npmjs.com/package/unity-webgl)
[![codecov](https://codecov.io/gh/Marinerer/unity-webgl/graph/badge.svg?token=7J0R98DRUB)](https://codecov.io/gh/Marinerer/unity-webgl)
[![release](https://img.shields.io/github/actions/workflow/status/Marinerer/unity-webgl/release.yml?style=flat-square)](https://github.com/Marinerer/unity-webgl/releases)
[![downloads](https://img.shields.io/npm/dm/unity-webgl?style=flat-square)](https://www.npmjs.com/package/unity-webgl)
[![size](https://img.shields.io/bundlephobia/minzip/unity-webgl?style=flat-square)](https://bundlephobia.com/package/unity-webgl)
[![license](https://img.shields.io/npm/l/unity-webgl?style=flat-square)](https://github.com/Marinerer/unity-webgl)

[ English | [中文](./README.zh_CN.md) ]

`unity-webgl` provides an easy solution for embedding `Unity WebGL` builds in your web applications, with two-way communication and interaction between your webApp and Unity application with advanced API's.

> 🚨 Reminder
>
> `v4.x` has been updated significantly and the API is not compatible with `v3.x` and earlier versions. For upgrades, please refer to [Changelogs](https://github.com/Marinerer/unity-webgl/wiki/Major-changes-in-v4)

Based on [react-unity-webgl](https://github.com/jeffreylanters/react-unity-webgl)

## Features

- 📦 Easy integration, framework-agnostic
- 📩 Bidirectional communication between WebApp and Unity
- ⏰ Comprehensive event handling mechanism
- 🧲 Built-in Vue components (`vue2/3`)

## Installation

**npm**

```bash
npm install unity-webgl
```

**Browser**

```html
<script src="https://cdn.jsdelivr.net/npm/unity-webgl/dist/index.min.js"></script>
```

## Quick Start

- [Live Demo](https://stackblitz.com/edit/unity-webgl-v4-demo)
- [vue3 Demo](https://stackblitz.com/edit/unity-webgl-v4-vue3-demo)

> [!IMPORTANT]
>
> Communication and interaction with the web application are only possible after the Unity instance is successfully rendered (when the `mounted` event is triggered).  
> Recommended to include a loading progress bar when opening the page.

```javascript
import UnityWebgl from 'unity-webgl'

const unityContext = new UnityWebgl('#canvas', {
	loaderUrl: 'path/to/unity.loader.js',
	dataUrl: 'path/to/unity.data',
	frameworkUrl: 'path/to/unity.framework.js',
	codeUrl: 'path/to/unity.code',
})

unityContext
	.on('progress', (progress) => console.log('Loaded: ', progress))
	.on('mounted', () => {
		// ⚠️ UnityInstance rendered, ready for communication
		unityContext.sendMessage('GameObject', 'ReceiveRole', 'Tanya')
	})

// For Unity to call
unityContext.addUnityListener('gameStart', (msg) => {
	console.log('from Unity : ', msg)
})
// window.dispatchUnityEvent('gameStart', '{score: 0}')
```

<details>
<summary>Vue Demo</summary>

```html
<script setup>
	import UnityWebgl from 'unity-webgl'
	import VueUnity from 'unity-webgl/vue'

	const unityContext = new UnityWebgl({
		loaderUrl: 'path/to/unity.loader.js',
		dataUrl: 'path/to/unity.data',
		frameworkUrl: 'path/to/unity.framework.js',
		codeUrl: 'path/to/unity.code',
	})

	unityContext.addUnityListener('gameStart', (msg) => {
		console.log('from Unity : ', msg)
	})
</script>

<template>
	<VueUnity :unity="unityContext" width="800" height="600" />
</template>
```

</details>

## API

### Constructor

```typescript
new UnityWebgl(canvas: HTMLCanvasElement | string, config?:UnityConfig)

// or

const unityContext = new UnityWebgl(config: UnityConfig)
unityContext.render(canvas: HTMLCanvasElement | string)
```

- `canvas` : Render Unity canvas elements or selectors.
- `config` : Initializes the Unity application's configuration items.

#### config

Initializes the Unity application's configuration items.

| Property                     | Type              | Description                                                                                        | Required |
| ---------------------------- | ----------------- | -------------------------------------------------------------------------------------------------- | -------- |
| `loaderUrl`                  | string            | Unity resource loader file                                                                         | ✅       |
| `dataUrl`                    | string            | File containing resource data and scenes                                                           | ✅       |
| `frameworkUrl`               | string            | File with runtime and plugin code                                                                  | ✅       |
| `codeUrl`                    | string            | WebAssembly binary file with native code                                                           | ✅       |
| `streamingAssetsUrl`         | string            | URL for streaming resources                                                                        | Optional |
| `memoryUrl`                  | string            | URL for generated framework files                                                                  | Optional |
| `symbolsUrl`                 | string            | URL for generated Unity code files                                                                 | Optional |
| `workerUrl`                  | string            | URL for generated Unity web worker files                                                           | Optional |
| `companyName`                | string            | Metadata: Company name                                                                             | Optional |
| `productName`                | string            | Metadata: Product name                                                                             | Optional |
| `productVersion`             | string            | Metadata: Product version                                                                          | Optional |
| `webglContextAttributes`     | object            | WebGL rendering context options. @see[WebGLRenderingContext][webglContextAttributes-url]           | Optional |
| `devicePixelRatio`           | number            | Canvas device pixel ratio. @see[devicePixelRatio][devicePixelRatio-url]                            | Optional |
| `matchWebGLToCanvasSize`     | boolean           | Disable automatic WebGL canvas size sync. @see[matchWebGLToCanvasSize][matchWebGLToCanvasSize-url] | Optional |
| `autoSyncPersistentDataPath` | boolean           | Enables or disables auto synchronization of the persistent data path.                              | Optional |
| `disabledCanvasEvents`       | string[]          | Overwrites the default disabled canvas events.                                                     | Optional |
| `cacheControl`               | `(url) => string` | The Cache Control API                                                                              | Optional |

[devicePixelRatio-url]: https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
[matchWebGLToCanvasSize-url]: https://issuetracker.unity3d.com/issues/webgl-builds-dont-allow-separate-control-on-canvas-render-buffer-size
[webglContextAttributes-url]: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getContextAttributes

### Methods

**Instance methods :**

#### ⭐️ `render(canvas: HTMLCanvasElement | string): void;`

Renders UnityInstance into target html canvas element.

- `canvas` : canvas element

```javascript
await unityContext.render('#canvas')
```

#### ⭐️ `unload(): Promise<void>;`

Unload the Unity WebGL instance.

```javascript
await unityContext.unload()
```

#### ⭐️ `sendMessage(objectName: string, methodName: string, value?: any): this;`

Send a message to invoke a public method in the Unity scene.

- `objectName`: Object Name in Unity Scene
- `methodName`: Unity script method name
- `value`: Passed value

```javascript
unityContext.sendMessage('GameObject', 'gameStart', { role: 'Tanya' })
```

#### `requestPointerLock(): void;`

Request pointer lock on the Unity canvas.

#### `takeScreenshot(dataType?: string, quality?: any): string | undefined;`

Capture a screenshot of the Unity canvas.

- `dataType`: Type of image data
- `quality`: Image quality

```javascript
const screenshot = unityContext.takeScreenshot('image/jpeg', 0.92)
```

#### `setFullscreen(enabled: boolean): void;`

Toggle fullscreen mode.

```javascript
unityContext.setFullscreen(true)
```

**Event methods :**

#### `on(name: string, listener: EventListener, options?: { once?: boolean }): this;`

Register for listening events.

```javascript
unityContext.on('progress', (progress) => {
	console.log('Progress:', progress)
})
```

#### `off(name: string, listener?: EventListener): this;`

Remove event listener.

```javascript
unityContext.off('progress', listener)
```

**Unity Communication methods :**

#### ⭐️ `addUnityListener(name: string, listener: EventListener, options?: { once?: boolean }): this;`

Register a specific listener for Unity to call.

```javascript
unityContext.addUnityListener('GameStarted', (level) => {
	console.log('Game started at level:', level)
})

// then call it in Unity
window.dispatchUnityEvent('GameStarted', 3)
```

#### `removeUnityListener(name: string, listener?: EventListener): this;`

Remove registered listeners.

```javascript
unityContext.removeUnityListener('GameStarted', listener)
```

### ⭐️ `window.dispatchUnityEvent(name: string, ...args: any[])`

The way to dispatch a registered listener on the Unity side. (Calling JS methods in unity)

```javascript
window.dispatchUnityEvent('GameStarted', 3)
```

### Events

| Event Name      | Description                                       |
| --------------- | ------------------------------------------------- |
| `beforeMount`   | Before rendering UnityInstance to Canvas Element. |
| `mounted`       | After rendering UnityInstance to Canvas Element.  |
| `beforeUnmount` | Before UnityInstance unload                       |
| `unmounted`     | After UnityInstance unload                        |
| `progress`      | Unity resource loading progress                   |
| `error`         | Error events                                      |
| `debug`         | Debug messages from Unity                         |

## Unity-JavaScript Communication

- [Unity Docs: Interaction with browser scripting](https://docs.unity3d.com/Manual/webgl-interactingwithbrowserscripting.html)

### 1. Call Unity script functions from JavaScript

```javascript
const unityContext = new UnityWebgl()

/**
 * @param {string} objectName Name of an object in your scene.
 * @param {string} methodName Public method name.
 * @param {any} value Passed value.
 */
unityContext.sendMessage('GameObject', 'StartGame', { role: 'Tanya' })
```

### 2. Call JavaScript functions from Unity scripts

1. First register the listener for Unity to call via `addUnityListener` on the web side.

```javascript
unityContext.addUnityListener('gameStart', (level) => {
	console.log('Game started at level:', level)
})
```

2. Add the registered `gameStart` method to your Unity project.

```javascript
// javascript_extend.jslib
mergeInto(LibraryManager.library, {
	Hello: function () {
		window.alert('Hello, world!')
	},

	GameStart: function (level) {
		//window.alert(UTF8ToString(str));
		window.dispatchUnityEvent('gameStart', UTF8ToString(level))
	},
})
```

3. Call these functions in unity's `C#` scripts:

```csharp
using UnityEngine;
using System.Runtime.InteropServices;

public class WebGLPluginJS : MonoBehaviour
{
    [DllImport("__Internal")]
    public static extern void Hello();

    [DllImport("__Internal")]
    public static extern void GameStart(string level);

    void Start()
    {
        Hello();
        GameStart("2");
    }
}
```

## Issues

- [Keyboard Input and Focus Handling](https://docs.unity3d.com/Manual/webgl-input.html)
- [Debug and troubleshoot Web builds](https://docs.unity3d.com/Manual/webgl-debugging.html)
- [Web performance considerations](https://docs.unity3d.com/Manual/webgl-performance.html)

## Contributing

Contributions are welcome! Please submit a [Pull Request](https://github.com/Marinerer/unity-webgl/pulls).

## License

Apache-2.0 License

## Support

For issues or questions, please file an issue on the [GitHub repository](https://github.com/Marinerer/unity-webgl).
