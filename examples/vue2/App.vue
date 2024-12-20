<script>
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

unityContext
  .on('progress', (p) => console.log('loading :', p))
  .on('mounted', () => console.log('unity mounted ...'))
  .on('debug', (msg) => console.log('unity debug', msg));

unityContext.addUnityListener('gameStart', (msg) => {
  alert(msg);
  console.log('gameStart : ', msg);
});

export default {
  name: 'App',
  components: {
    VueUnity
  },
  data() {
    return {
      unityContext
    }
  },
  methods: {
    onSendMessage() {
      unityContext.sendMessage('GameUI', 'ReceiveRole', 'Tanya')
    },
    onFullscreen() {
      unityContext.setFullscreen(true)
    }
  }
}
</script>

<template>
  <div>
    <VueUnity :unity="unityContext" width="800px" height="600px" tabindex="0" />
    <div>
      <button @click="onSendMessage">SendMessage</button>
      <button @click="onFullscreen">Fullscreen</button>
    </div>
  </div>
</template>
