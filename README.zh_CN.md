# unity-webgl

[![version](https://img.shields.io/npm/v/unity-webgl?style=flat-square)](https://www.npmjs.com/package/unity-webgl)
[![codecov](https://codecov.io/gh/Marinerer/unity-webgl/graph/badge.svg?token=7J0R98DRUB)](https://codecov.io/gh/Marinerer/unity-webgl)
[![release](https://img.shields.io/github/actions/workflow/status/Marinerer/unity-webgl/release.yml?style=flat-square)](https://github.com/Marinerer/unity-webgl/releases)
[![downloads](https://img.shields.io/npm/dm/unity-webgl?style=flat-square)](https://www.npmjs.com/package/unity-webgl)
[![size](https://img.shields.io/bundlephobia/minzip/unity-webgl?style=flat-square)](https://bundlephobia.com/package/unity-webgl)
[![license](https://img.shields.io/npm/l/unity-webgl?style=flat-square)](https://github.com/Marinerer/unity-webgl)

[ [English](./README.md) | 中文 ]

`unity-webgl` 提供了一个简单的解决方案，用于将 `Unity WebGL` 构建嵌入到 Web 应用程序中，同时为 Unity 和 WebApp 应用之间的双向通信和交互提供 API。

> 🚨 提醒
>
> `v4.x` 版本进行了较大更新，API 不兼容 `v3.x`及之前版本。升级请参考 [变更信息](https://github.com/Marinerer/unity-webgl/wiki/Major-changes-in-v4)

Based on [react-unity-webgl](https://github.com/jeffreylanters/react-unity-webgl)

## Features

- 📦 集成简单，无框架限制
- 📩 支持 `WebApp` 与 `Unity` 双向通信和交互
- ⏰ 全面的事件处理机制
- 🧲 内置 `vue` 组件 (`vue2/3`)

## Installation

**npm**

```
npm install unity-webgl
```

**browser**

```
https://cdn.jsdelivr.net/npm/unity-webgl/dist/index.min.js
```

## Quick Start

- [Live Demo](https://stackblitz.com/edit/unity-webgl-v4-demo)
- [vue3 Demo](https://stackblitz.com/edit/unity-webgl-v4-vue3-demo)

> [!IMPORTANT]
>
> 仅在 `UnityInstance` 渲染完成后（触发 `mounted` 事件时）才能进行 Web 应用程序的通信和交互。
> 建议在页面打开时添加加载进度条。

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
		// ⚠️ UnityInstance 已创建，可与unity侧进行通信
		unityContext.sendMessage('GameObject', 'ReceiveRole', 'Tanya')
	})

// 供unity 端调用
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

- `canvas` : 渲染Unity的画布元素或选择器。
- `config` : 初始化 Unity 应用程序的配置项。

#### config

初始化 Unity 应用程序的配置项。

| Property                     | Type              | Description                                                                             | Required |
| ---------------------------- | ----------------- | --------------------------------------------------------------------------------------- | -------- |
| `loaderUrl`                  | string            | Unity 资源加载器文件                                                                    | ✅       |
| `dataUrl`                    | string            | 包含资源数据和场景的文件                                                                | ✅       |
| `frameworkUrl`               | string            | 包含运行时和插件代码的文件                                                              | ✅       |
| `codeUrl`                    | string            | 包含原生代码的 WebAssembly 二进制文件                                                   | ✅       |
| `streamingAssetsUrl`         | string            | 流媒体资源的 URL                                                                        | 可选     |
| `memoryUrl`                  | string            | Unity生成的框架文件的 URL                                                               | 可选     |
| `symbolsUrl`                 | string            | Unity生成的代码文件 URL                                                                 | 可选     |
| `workerUrl`                  | string            | Unity生成的web worker文件URL                                                            | 可选     |
| `companyName`                | string            | 元数据                                                                                  | 可选     |
| `productName`                | string            | 元数据                                                                                  | 可选     |
| `productVersion`             | string            | 元数据                                                                                  | 可选     |
| `webglContextAttributes`     | object            | WebGL 渲染上下文选项. @see[WebGLRenderingContext][webglContextAttributes-url]           | 可选     |
| `devicePixelRatio`           | number            | canvas设备像素比率. @see[devicePixelRatio][devicePixelRatio-url]                        | 可选     |
| `matchWebGLToCanvasSize`     | boolean           | 禁用 WebGL canvas大小自动同步. @see[matchWebGLToCanvasSize][matchWebGLToCanvasSize-url] | 可选     |
| `autoSyncPersistentDataPath` | boolean           | 启用/禁用持久数据自动同步                                                               | 可选     |
| `disabledCanvasEvents`       | string[]          | 禁用一些默认canvas事件                                                                  | 可选     |
| `cacheControl`               | `(url) => string` | 缓存控制 API                                                                            | 可选     |

[devicePixelRatio-url]: https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
[matchWebGLToCanvasSize-url]: https://issuetracker.unity3d.com/issues/webgl-builds-dont-allow-separate-control-on-canvas-render-buffer-size
[webglContextAttributes-url]: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getContextAttributes

### Methods

**Instance methods :**

#### ⭐️ `render(canvas: HTMLCanvasElement | string): void;`

在指定canvas上渲染 Unity WebGL 实例资源。

- `canvas` : canvas元素

```javascript
await unityContext.render('#canvas')
```

#### ⭐️ `unload(): Promise<void>;`

卸载 Unity WebGL 实例。

```javascript
await unityContext.unload()
```

#### ⭐️ `sendMessage(objectName: string, methodName: string, value?: any): this;`

向 `Unity` 场景中发送消息以调用公共方法。

- `objectName`: Unity场景中对象名称
- `methodName`: Unity脚本中方法名称
- `value`: 传递的值

```javascript
unityContext.sendMessage('GameObject', 'gameStart', { role: 'Tanya' })
```

#### `requestPointerLock(): void;`

请求锁定 Unity canvas的指针。

#### `takeScreenshot(dataType?: string, quality?: any): string | undefined;`

对 Unity canvas进行屏幕截图并返回包含图像数据的数据 URL。

- `dataType`: 图像数据的类型
- `quality`: 图像的质量

```javascript
const screenshot = unityContext.takeScreenshot('image/jpeg', 0.92)
```

#### `setFullscreen(enabled: boolean): void;`

切换全屏模式。

```javascript
unityContext.setFullscreen(true)
```

**Event methods :**

#### `on(name: string, listener: EventListener, options?: { once?: boolean }): this;`

监听事件。

```javascript
unityContext.on('progress', (progress) => {
	console.log('Progress:', progress)
})
```

#### `off(name: string, listener?: EventListener): this;`

移除事件监听器。

```javascript
unityContext.off('progress', listener)
```

**Unity Communication methods :**

#### ⭐️ `addUnityListener(name: string, listener: EventListener, options?: { once?: boolean }): this;`

注册监听器供 Unity 端调用。

```javascript
unityContext.addUnityListener('GameStarted', (level) => {
	console.log('Game started at level:', level)
})

// then call it in Unity
window.dispatchUnityEvent('GameStarted', 3)
```

#### `removeUnityListener(name: string, listener?: EventListener): this;`

移除供Unity端注册的监听器。

```javascript
unityContext.removeUnityListener('GameStarted', listener)
```

### ⭐️ `window.dispatchUnityEvent(name: string, ...args: any[])`

在 Unity 端触发注册的监听器的方式。（在 unity 中调用 JS 的方法）

```javascript
window.dispatchUnityEvent('GameStarted', 3)
```

### Events

Unity 实例从创建到销毁过程中触发的事件。

| event name                    | description             |
| ----------------------------- | ----------------------- |
| `beforeMount(unityContext)`   | 渲染 Unity 实例资源之前 |
| `mounted(unityContext)`       | 渲染 Unity 实例资源之后 |
| `beforeUnmount(unityContext)` | 卸载 Unity 实例资源之前 |
| `unmounted()`                 | 卸载 Unity 实例资源之后 |
| `progress(val: number)`       | unity 资源加载进度更新  |
| `error(err: Event\|string)`   | 发生错误                |
| `debug(msg: string)`          | 来自 Unity 的调试消息   |

## Unity-JavaScript Communication

- [Unity官方文档：与浏览器脚本交互](https://docs.unity3d.com/Manual/webgl-interactingwithbrowserscripting.html)

### 1. Call Unity script functions from JavaScript

```javascript
const unityContext = new UnityWebgl()

/**
 * @param {string} objectName name of an object in your scene.
 * @param {string} methodName public method name.
 * @param {any} value send value.
 */
unityContext.sendMessage('GameObject', 'StartGame', { role: 'Tanya' })
```

### 2. Call JavaScript functions from Unity scripts

1. 首先在 web 端通过 `addUnityListener` 注册供 Unity 调用的监听器。

```javascript
unityContext.addUnityListener('gameStart', (level) => {
	console.log('Game started at level:', level)
})
```

2. 在Unity项目中，将注册的 `gameStart` 方法添加到项目中。

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

3. 在 `C#` 脚本中调用这些函数：

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

- [键盘输入和焦点处理](https://docs.unity3d.com/cn/2023.2/Manual/webgl-input.html)
- [调试 WebGL 构建并排除故障](https://docs.unity3d.com/cn/2023.2/Manual/webgl-debugging.html)
- [WebGL 性能考虑因素](https://docs.unity3d.com/cn/2023.2/Manual/webgl-performance.html)

## License

Apache-2.0 License

## Contributing

Contributions are welcome! Please feel free to submit a [Pull Request](https://github.com/Marinerer/unity-webgl/pulls).

## Support

For issues or questions, please file an issue on the [GitHub repository](https://github.com/Marinerer/unity-webgl).
