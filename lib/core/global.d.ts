import { UnityArguments } from './src/types/unity-arguments'
import { UnityInstance } from './src/types/unity-instance'

declare global {
	/**
	 * Dispatches an event that has been registered to all event systems.
	 * @param eventName The name of the event.
	 * @param parameters The parameters to pass to the event.
	 */
	function dispatchUnityEvent(eventName: string, ...parameters: any[]): void

	/**
	 * Creates a new UnityInstance.
	 * @param canvas The target html canvas element.
	 * @param config The config object contains the build configuration.
	 * @param onProgress The on progress event listener.
	 * @returns A promise resolving when instantiated successfully.
	 */
	function createUnityInstance(
		canvas: HTMLCanvasElement,
		config: UnityArguments,
		onProgress?: (progress: number) => void
	): Promise<UnityInstance>

	/**
	 * Due to some developers wanting to use the window object as a global scope
	 * in order to invoke the create Unity Instance and dispatch React Unity Event
	 * functions, we need to declare the window object as a global type.
	 */
	interface Window {
		/**
		 * Creates a new UnityInstance.
		 */
		createUnityInstance: typeof createUnityInstance

		/**
		 * Dispatches an event that has been registered to all event systems.
		 */
		dispatchUnityEvent: typeof dispatchUnityEvent
	}
}
