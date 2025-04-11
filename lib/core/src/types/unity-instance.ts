/**
 * Unity Boolean Like Type Declaration.
 */
type UnityBooleanLike =
	/**
	 * Represents the boolean value `false`.
	 */
	| 0
	/**
	 * Represents the boolean value `true`.
	 */
	| 1

type UnityModule = {
	/**
	 * Stringifies a pointer to a string.
	 * @param pointer The pointer to the string.
	 * @param length The length of the string.
	 * @deprecated Deprecated in Unity 2021.2, use UTF8ToString instead.
	 */
	Pointer_stringify(pointer: number, length: number): string

	/**
	 * Converts a pointer to a string.
	 * @param pointer The pointer to the string.
	 */
	UTF8ToString(pointer: number): string

	/**
	 * Enables or disabled the fullscreen mode of the UnityInstance.
	 * @param fullScreen sets the fullscreen mode.
	 */
	SetFullscreen(fullScreen: UnityBooleanLike): void

	/**
	 * A reference to the Unity Instance's Canvas.
	 */
	canvas?: HTMLCanvasElement
}

/**
 * Type declaration for the UnityInstance.
 */
export declare class UnityInstance {
	/**
	 * Creates a new instance of Unity Instance.
	 */
	constructor()

	/**
	 * Sends a message to the UnityInstance to invoke a public method.
	 * @param objectName the name of the game object in your Unity scene.
	 * @param methodName the name of the public method on the game object.
	 * @param parameter an optional parameter to pass along to the method.
	 */
	public SendMessage(
		objectName: string,
		methodName: string,
		parameter?: string | number | boolean
	): void

	/**
	 * Enables or disabled the fullscreen mode of the UnityInstance.
	 * @param fullScreen sets the fullscreen mode.
	 */
	public SetFullscreen(fullScreen: UnityBooleanLike): void

	/**
	 * Quits the Unity WebGL application and removes it from the memory.
	 * @returns a promise which resolves when the application did quit.
	 */
	public Quit(): Promise<void>

	/**
	 * The internal Unity Module.
	 */
	public Module: UnityModule
}
