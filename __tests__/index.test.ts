/**
 * @jest-environment jsdom
 */
//@ts-nocheck

import UnityWebgl from '../lib/core/src/index'
import 'jest-canvas-mock'

// mock UnityInstance methods
const mockLoaderResult = jest.fn()
const mockSendMessage = jest.fn()
const mockSetFullscreen = jest.fn()
const mockQuit = jest.fn()

// mock unity loader
jest.mock('../lib/core/src/loader', () => ({
	unityLoader: (_, { resolve }) => {
		resolve()
		return mockLoaderResult
	},
}))

describe('UnityWebgl', () => {
	let canvasEl
	let mockUnityInstance

	const validConfig = {
		loaderUrl: 'loader.js',
		dataUrl: 'data.json',
		frameworkUrl: 'framework.js',
		codeUrl: 'code.js',
	}

	beforeEach(() => {
		jest.restoreAllMocks()
		jest.clearAllMocks()

		canvasEl = document.createElement('canvas')
		canvasEl.requestPointerLock = jest.fn()
		canvasEl.toDataURL = jest.fn().mockReturnValue('base64-image-data')

		// Mock the UnityInstance
		mockUnityInstance = {
			SendMessage: mockSendMessage,
			SetFullscreen: mockSetFullscreen,
			Quit: mockQuit.mockResolvedValue(true),
			Module: { canvas: canvasEl },
		}

		// Setup mock global objects
		global.window.document.querySelector = (el) => {
			if (el === '#canvas') return canvasEl
		}
		global.window.createUnityInstance = async () => mockUnityInstance
	})

	afterEach(() => {
		canvasEl = null
		mockUnityInstance = null
		delete global.window.document.querySelector
		delete global.window.createUnityInstance
	})

	describe('Constructor', () => {
		it('should create an instance with a canvas selector', () => {
			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			expect(unityWebgl).toBeInstanceOf(UnityWebgl)
		})

		it('should create an instance with a canvas element', async () => {
			const unityWebgl = new UnityWebgl(canvasEl, validConfig)
			await Promise.resolve()

			expect(unityWebgl).toBeInstanceOf(UnityWebgl)
			expect(unityWebgl._canvas).toBe(canvasEl)
			expect(unityWebgl._loader).toBe(mockLoaderResult)
			expect(unityWebgl._unity).toBe(mockUnityInstance)
			expect(unityWebgl._config).toEqual(validConfig)
		})

		it('should throw error with invalid config', () => {
			expect(() => new UnityWebgl('#canvas', {})).toThrow(TypeError)
			expect(() => new UnityWebgl('#canvas', { loaderUrl: 'test' })).toThrow(TypeError)
		})
	})

	describe('create method', () => {
		it('should create unity instance successfully', async () => {
			const unityWebgl = new UnityWebgl(validConfig)
			const eventSpy = jest.spyOn(unityWebgl, 'emit')

			await unityWebgl.create(canvasEl)

			expect(eventSpy).toHaveBeenCalledWith('beforeMount', unityWebgl)
			expect(eventSpy).toHaveBeenCalledWith('mounted', expect.anything(), mockUnityInstance)

			eventSpy.mockRestore()
		})

		it('should handle canvas not found', async () => {
			const unityWebgl = new UnityWebgl(validConfig)
			const eventSpy = jest.spyOn(unityWebgl, 'emit')

			try {
				await unityWebgl.create('#element-not-found')
			} catch (err) {}

			expect(eventSpy).toHaveBeenCalledWith('error', expect.any(Error))
			eventSpy.mockRestore()
		})
	})

	describe('sendMessage method', () => {
		it('should send message to unity instance', async () => {
			const unityWebgl = new UnityWebgl(canvasEl, validConfig)
			await Promise.resolve()

			unityWebgl.sendMessage('ObjectName', 'MethodName', { data: 'test' })

			expect(mockSendMessage).toHaveBeenCalledWith(
				'ObjectName',
				'MethodName',
				JSON.stringify({ data: 'test' })
			)
		})

		it('should warn if unity not instantiated', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			await Promise.resolve()

			unityWebgl['_unity'] = null
			unityWebgl.sendMessage('ObjectName', 'MethodName')

			expect(consoleSpy).toHaveBeenCalledWith(
				'Unable to Send Message while Unity is not Instantiated.'
			)

			consoleSpy.mockRestore()
		})
	})

	describe('requestPointerLock method', () => {
		it('should request pointer lock', async () => {
			const unityWebgl = new UnityWebgl(canvasEl, validConfig)
			await Promise.resolve()

			unityWebgl.requestPointerLock()

			expect(canvasEl.requestPointerLock).toHaveBeenCalled()
		})

		it('should warn if unity not instantiated', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			await Promise.resolve()

			unityWebgl['_unity'] = null
			unityWebgl.requestPointerLock()

			expect(consoleSpy).toHaveBeenCalledWith(
				'Unable to requestPointerLock while Unity is not Instantiated.'
			)

			consoleSpy.mockRestore()
		})
	})

	describe('takeScreenshot method', () => {
		it('should take screenshot', async () => {
			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			await Promise.resolve()

			const screenshot = unityWebgl.takeScreenshot('image/jpeg', 0.92)

			expect(canvasEl.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.92)
			expect(screenshot).toBe('base64-image-data')
		})

		it('should warn if unity not instantiated', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			await Promise.resolve()

			unityWebgl['_unity'] = null
			unityWebgl.takeScreenshot()

			expect(consoleSpy).toHaveBeenCalledWith(
				'Unable to take Screenshot while Unity is not Instantiated.'
			)
			consoleSpy.mockRestore()
		})
	})

	describe('setFullscreen method', () => {
		it('should set fullscreen', async () => {
			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			await Promise.resolve()

			unityWebgl.setFullscreen(true)
			expect(mockSetFullscreen).toHaveBeenCalledWith(1)

			unityWebgl.setFullscreen(false)
			expect(mockSetFullscreen).toHaveBeenCalledWith(0)
		})

		it('should warn if unity not instantiated', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			await Promise.resolve()

			unityWebgl['_unity'] = null
			unityWebgl.setFullscreen(true)

			expect(consoleSpy).toHaveBeenCalledWith(
				'Unable to set Fullscreen while Unity is not Instantiated.'
			)

			consoleSpy.mockRestore()
		})
	})

	describe('unload method', () => {
		it('should unload unity instance', async () => {
			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			await Promise.resolve()

			const eventSpy = jest.spyOn(unityWebgl, 'emit')

			await unityWebgl.unload()
			expect(mockLoaderResult).toHaveBeenCalled()
			expect(mockQuit).toHaveBeenCalled()
			expect(unityWebgl['_unity']).toBeNull()
			expect(unityWebgl['_canvas']).toBeNull()
			expect(eventSpy).toHaveBeenCalledWith('beforeUnmount', unityWebgl)
			expect(eventSpy).toHaveBeenCalledWith('unmounted')

			eventSpy.mockRestore()
		})

		it('should warn if unity not instantiated', async () => {
			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			await Promise.resolve()
			unityWebgl['_unity'] = null
			await expect(unityWebgl.unload()).rejects.toBeUndefined()
		})
	})

	describe('unsafe_unload method', () => {
		it('should unload unity instance via the unsafe_unload', async () => {
			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			const eventSpy = jest.spyOn(unityWebgl, 'emit')
			await Promise.resolve()

			unityWebgl.unsafe_unload()

			expect(global.window.document.querySelector('#canvas')).not.toBeNull()

			await Promise.resolve()
			expect(mockLoaderResult).toHaveBeenCalled()
			expect(mockQuit).toHaveBeenCalled()
			expect(unityWebgl['_unity']).toBeNull()
			expect(unityWebgl['_canvas']).toBeNull()
			expect(eventSpy).toHaveBeenCalledWith('beforeUnmount', unityWebgl)
			expect(eventSpy).toHaveBeenCalledWith('unmounted')
			eventSpy.mockRestore()
		})
	})

	describe('Event', () => {
		it('should register and emit events', () => {
			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			const mockListener = jest.fn()
			const mockOnceListener = jest.fn()

			unityWebgl.on('test:event', mockListener)
			unityWebgl.emit('test:event', 'arg1', 'arg2')
			unityWebgl.emit('test:event', 'arg1', 'arg2')

			unityWebgl.on('test:once:event', mockOnceListener, { once: true })
			unityWebgl.emit('test:once:event')
			unityWebgl.emit('test:once:event')

			expect(mockListener).toHaveBeenCalledWith('arg1', 'arg2')
			expect(mockListener).toHaveBeenCalledTimes(2)
			expect(mockOnceListener).toHaveBeenCalledTimes(1)
		})

		it('should remove event listeners', () => {
			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			const mockListener = jest.fn()

			unityWebgl.on('test:event', mockListener)
			unityWebgl.off('test:event', mockListener)
			unityWebgl.emit('test:event', 'arg1', 'arg2')

			expect(mockListener).not.toHaveBeenCalled()
		})

		it('should emit unity created cycle event', async () => {
			const unityWebgl = new UnityWebgl(validConfig)
			const eventSpy = jest.spyOn(unityWebgl, 'emit')
			unityWebgl.create('#canvas')
			await Promise.resolve()
			await unityWebgl.unload()

			expect(eventSpy).toHaveBeenCalledWith('beforeMount', unityWebgl)
			expect(eventSpy).toHaveBeenCalledWith('mounted', unityWebgl, mockUnityInstance)
			expect(eventSpy).toHaveBeenCalledWith('beforeUnmount', unityWebgl)
			expect(eventSpy).toHaveBeenCalledWith('unmounted')

			eventSpy.mockRestore()
		})
	})

	describe('unity Event', () => {
		it('Should correctly handle event listeners with unity', async () => {
			const mockHello = jest.fn()
			const mockHi = jest.fn()

			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			await Promise.resolve()

			unityWebgl.addUnityListener('hello', mockHello)
			unityWebgl.addUnityListener('unity:hi', mockHi)

			unityWebgl.emit('hello', 'world')
			unityWebgl.emit('unity:hi', 'world')
			expect(mockHello).not.toHaveBeenCalledWith('world')
			expect(mockHi).toHaveBeenCalledWith('world')

			window.dispatchUnityEvent('hello', 'world')
			window.dispatchUnityEvent('hi', 'unity')
			expect(mockHello).toHaveBeenCalledWith('world')
			expect(mockHi).toHaveBeenCalledWith('unity')
		})

		it('Should correctly remove event listeners with unity', async () => {
			const mockHello = jest.fn()

			const unityWebgl = new UnityWebgl('#canvas', validConfig)
			await Promise.resolve()

			unityWebgl.addUnityListener('hello', mockHello)
			unityWebgl.removeUnityListener('hello', mockHello)

			window.dispatchUnityEvent('hello', 'world')

			expect(mockHello).not.toHaveBeenCalled()
		})
	})
})
