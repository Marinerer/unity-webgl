import UnityWebgl from 'unity-webgl'

const unityContext = new UnityWebgl('#canvas', {
	loaderUrl:
		'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/uploads/17343457791501843/demo.loader.js',
	dataUrl:
		'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/uploads/17343457791501843/demo.data',
	frameworkUrl:
		'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/uploads/17343457791501843/demo.framework.js',
	codeUrl:
		'https://static-huariot-com.oss-cn-hangzhou.aliyuncs.com/uploads/17343457791501843/demo.wasm',
})

unityContext
	.on('progress', (p) => console.log('loading :', p))
	.on('mounted', () => console.log('unity mounted ...'))
	.on('debug', (msg) => console.log('unity debug', msg))

unityContext.addUnityListener('gameStart', (msg) => {
	alert(msg)
	console.log('gameStart : ', msg)
})

window.sendMessage = function sendMessage() {
	unityContext.sendMessage('GameUI', 'ReceiveRole', 'Tanya')
}

window.onFullscreen = function () {
	unityContext.setFullscreen(true)
}
