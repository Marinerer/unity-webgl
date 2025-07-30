<script setup>
import { ref, onMounted } from 'vue'
import UnityWebgl from 'unity-webgl'
import VueUnity from 'unity-webgl/vue'

const unityContext = new UnityWebgl({
  loaderUrl:
    'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/uploads/17343457791501843/demo.loader.js',
  dataUrl:
    'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/uploads/17343457791501843/demo.data',
  frameworkUrl:
    'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/uploads/17343457791501843/demo.framework.js',
  codeUrl:
    'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/uploads/17343457791501843/demo.wasm',
});
/** 
https://bim-static.zaiont.com/test/tj_subway/Build/tj_subway.loader.js
https://bim-static.zaiont.com/test/tj_subway/Build/tj_subway.data.gz
https://bim-static.zaiont.com/test/tj_subway/Build/tj_subway.framework.js.gz
https://bim-static.zaiont.com/test/tj_subway/Build/tj_subway.wasm.gz
*/
unityContext
  .on('progress', (p) => console.log('loading :', p))
  .on('mounted', () => console.log('unity mounted ...'))
  .on('beforeUnmount', () => console.log('unity beforeUnmount ...'))
  .on('unmounted', () => console.log('unity unmounted ...'))
  .on('debug', (msg) => console.log('unity debug', msg));

unityContext.addUnityListener('gameStart', (msg) => {
  alert(msg);
  console.log('gameStart : ', msg);
});

function onSendMessage() {
  unityContext.sendMessage('GameUI', 'ReceiveRole', 'Tanya')
}
function onFullscreen() {
  unityContext.setFullscreen(true)
}
</script>

<template>
  <VueUnity :unity="unityContext" width="800px" height="600px" tabindex="0" />
  <div>
    <button @click="onSendMessage">SendMessage</button>
    <button @click="onFullscreen">Fullscreen</button>
  </div>
</template>
