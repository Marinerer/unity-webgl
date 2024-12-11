# unity-webgl

[![version](https://img.shields.io/npm/v/unity-webgl?style=flat-square)](https://www.npmjs.com/package/unity-webgl)
[![downloads](https://img.shields.io/npm/dm/unity-webgl?style=flat-square)](https://www.npmjs.com/package/unity-webgl)
[![size](https://img.shields.io/bundlephobia/minzip/unity-webgl?style=flat-square)](https://bundlephobia.com/package/unity-webgl)
[![languages](https://img.shields.io/github/languages/top/meqn/UnityWebGL.js?style=flat-square)](https://github.com/Meqn/UnityWebGL.js)
[![license](https://img.shields.io/npm/l/unity-webgl?style=flat-square)](https://github.com/Meqn/UnityWebGL.js)

[ [English](https://github.com/Meqn/UnityWebGL.js/blob/main/README.md) | [中文](https://github.com/Meqn/UnityWebGL.js/blob/main/README.zh_CN.md) ]



UnityWebgl.js 提供了一种简单的解决方案，用于将 `Unity WebGL` 构建嵌入到 Web 应用程序中，同时为 `Unity` 和 `WebApp` 应用之间的双向通信和交互提供 API。

> 无框架限制，可用于任何web项目。  
> 目前仅内置vue组件，支持`vue2.x`和`vue3.x`。

based on [react-unity-webgl](https://github.com/jeffreylanters/react-unity-webgl)

## Features
- 📦 无框架限制，支持任何web项目；
- 📬 支持在`WebApp` 和 `Unity` 之间双向通信和交互；
- 💌 使用事件监听机制，调用简单灵活；
- 🧲 按需引入vue组件，兼容[Vue@2.x](https://stackblitz.com/edit/unity-webgl-vue2-demo?file=src%2FApp.vue) 和 [Vue@3.x](https://stackblitz.com/edit/unity-webgl-vue3-demo?file=src%2FApp.vue)。



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

> 🚨 提醒：  
> 只有当`Unity`实例创建成功之后（即触发 `mounted` 事件）才能和web应用程序进行通信和交互。  
> 建议在打开页面时添加一个 loading，等待Unity资源加载完毕后关闭即可。

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
  	// ⚠️ 资源加载完成，可与unity进行通信
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
或
```typescript
// 1. 初始化 UnityWebgl
unityContext = new UnityWebgl(
  config: IUnityConfig,
  bridge?: string
)

// 2. 创建unity实例，并在canvas上渲染
unityContext.create(canvas: HTMLCanvasElement | string)
```

> 备注：  
> `unityContext` : 表示 `UnityWebgl`实例；  
> `unityInstance` : 表示 Unity应用程序实例。

### canvas
渲染Unity的画布元素
- type : `string | HTMLCanvasElement`

### bridge
与Unity通信的桥接名称。它挂载window上，用于收集已注册的方法供Unity调用。
- type : `string`
- default : `__UnityLib__`

### config
初始化 Unity 应用程序的配置项。  
> 配置项必须包含最基本的四个属性`loaderUrl`, `dataUrl`, `frameworkUrl`, `codeUrl` ，这四个属性都是初始化 Unity 应用程序所需的资源文件。

| Property               | Type | Description |
| ---------------------- | ---- | ----------- |
| `loaderUrl` ⭐️          | string | Unity资源加载器文件 |
| `dataUrl` ⭐️               | string | 包含资源数据和场景的文件 |
| `frameworkUrl` ⭐️        | string | 包含运行时和插件代码的文件 |
| `codeUrl` ⭐️             | string | 包含本机代码的 Web Assembly 二进制文件 |
| `streamingAssetsUrl`     | string | 可以找到流媒体资源的网址 |
| `memoryUrl`              | string | 生成的框架文件的网址 |
| `symbolsUrl`             | string | 生成的unity代码文件的网址 |
| `companyName`            | string | 元数据: 公司名称 |
| `productName`            | string | 元数据: 产品名称 |
| `productVersion`         | string | 元数据: 产品版本 |
| `devicePixelRatio`       | number | 设置画布的设备像素比率. @详见[MDN@devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) |
| `matchWebGLToCanvasSize` | boolean | 禁用WebGL画布的渲染尺寸自动同步标识。@详见[unity3d@matchWebGLToCanvasSize](https://issuetracker.unity3d.com/issues/webgl-builds-dont-allow-separate-control-on-canvas-render-buffer-size) |
| `webglContextAttributes` | object | 配置 WebGLRenderingContext 创建选项。@详见[MDN@WebGLRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getContextAttributes) |



### Methods
UnityWebgl 实例方法

#### `create(canvasElement: HTMLCanvasElement | string): void`  
创建Unity实例并在画布上渲染。
- `canvasElement` : canvas画布元素

#### `unload(): Promise<void>`  
退出Unity实例并将其从内存中清除，以便从DOM中Unmount。此时也会删除所有已注册的方法。  
> 操作完成之后会触发 `unmounted` 事件

#### `send(objectName: string, methodName: string, params?: any)`  
⭐️ 向Unity实例对象发送消息，调用一个公共方法。
- `objectName`: Unity场景中对象的名称
- `methodName`: Unity脚本中方法的名称
- `params`: 传递的参数

#### `on(eventName: string, eventListener: Function)`  
⭐️ 注册一个事件或方法，用于监听触发事件或供Unity脚本调用。

#### `setFullscreen(enabled: boolean): void`  
启用或禁用 Unity 画布的全屏模式。

#### `requestPointerLock(): void`
允许您异步地请求将鼠标指针锁定在Unity应用的Canvas元素上。

#### `takeScreenshot(dataType: 'image/png' | 'image/jpeg' | 'image/webp', quality?: number)`
获取画布的屏幕截图并返回包含图像数据的数据 URL。
- `dataType`: 图像数据的类型
- `quality`: 图像的质量

#### `once(eventName: string, eventListener: Function)`  
注册事件仅执行一次

#### `off(eventName: string)`  
取消监听事件

#### `emit(eventName: string)`  
触发监听事件


### Events
Unity 实例从创建到销毁过程中触发的事件。

#### beforeMount  
Unity 资源开始加载之前。(此时Unity实例还未创建)
```js
unityContext.on('beforeMount', (unityContext) => {})
```

#### progress  
Unity 资源加载中。(显示加载进度)
```js
unityContext.on('progress', (number) => {})
```

#### mounted  
Unity 实例创建成功，并完成渲染。(此时webApp与Unity可以相互通信)
```js
unityContext.on('mounted', (unityContext) => {})
```

#### beforeUnmount
Unity 实例退出之前。
```js
unityContext.on('beforeUnmount', (unityContext) => {})
```

#### unmounted
Unity实例已退出并将其从内存中清除。
```js
unityContext.on('unmounted', () => {})
```

#### error
Unity实例在创建过程中捕获的错误信息
```js
unityContext.on('error', (error) => {})
```



## Vue component
Vue组件，兼容 `vue2.x` 和 `vue3.x`

### props
- `unity` : UnityWebgl实例
- `width` : canvas元素宽度, default: `100%`
- `height` : canvas元素高度, default: `100%`
- `tabindex` : 设置Canvas元素tabindex



## Communication

* [Unity3d官方文档：**WebGL：与浏览器脚本交互**](https://docs.unity3d.com/cn/2020.3/Manual/webgl-interactingwithbrowserscripting.html)

### 从 Unity 脚本调用 JavaScript 函数

1. 先在前端项目中通过 `Unity.on()` 注册 `showDialog` 方法，该方法会默认绑定在 `window['__UnityLib__']`对象上。

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

2. 在Unity项目中，将注册的`showDialog`方法添加到项目中。  
  注意📢 ：请使用 `.jslib` 扩展名将包含 JavaScript 代码的文件放置在 Assets 文件夹中的“Plugins”子文件夹下。插件文件需要有如下所示的语法：

```js
// javascript_extend.jslib

mergeInto(LibraryManager.library, {
  // this is you code
  showDialog: function (str) {
    // var data = Pointer_stringify(str);
    var data = UTF8ToString(str);
    // '__UnityLib__' is a global function collection.
    __UnityLib__.showDialog(data);
  },
  
  Hello: function () {
    window.alert("Hello, world!");
  }
});
```

然后你可以像这样从C#脚本中调用这些函数：

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

### 使用 JavaScript 调用 Unity 脚本函数

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
- feat: 新增 `reload` 方法和事件
- perf: 优化 `create` 和 `unload` 方法

### v3.4.0
#### 🚀 Features
- feat: 增加全局对象`bridge`的配置和更改
- feat: 统一化Unity应用程序从创建到销毁的事件
  - 增加 `beforeMount`, `mounted`, `beforeUnmount`, `unmounted` 事件
  - 移除 `created`, `destroyed` 事件
- perf: 简化内置事件监听器
- perf: 优化内置vue组件
- perf: 更新typescript types
- perf: 统一错误信息提示
- docs: 优化使用文档

#### 🐞 Bug Fixes
- fix: 修复单页应用unload报错


### v3.0.0
#### 🚀 Features
- feat: 使用Typescript重写
- feat: Vue组件兼容vue2.x和vue3.x
- perf: 按需引入vue component

#### 🐞 Bug Fixes
- fix: 修复createUnityInstance执行多次
- fix: 修复vue组件width/height尺寸问题

### v2.x
- [v2.x文档](https://github.com/Meqn/UnityWebGL.js/blob/v2.x/README.md)

### v1.x
- [v1.x文档](https://github.com/Meqn/UnityWebGL.js/blob/v1.x/README.md)


