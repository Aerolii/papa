/**
 * base64 字符串转字符串
 * 增加中文编码解析，防止中文乱码
 * 1. **`atob` 解码**: 首先使用 `atob` 将 Base64 编码的字符串解码为二进制字符串。
 * 2. **字符串转字节数组**: 将二进制字符串转换为字节数组。
 * 3. **字节数组转字符串**: 使用 `TextDecoder` 将字节数组解码为 UTF-8 字符串。
 */

/**
 * @param {string} base64String - Base64 编码的字符串
 * @throws {Error} 当解码失败时抛出错误
 * @returns {Promise<string>} 解码后的 UTF-8 字符串
 */
export function base64ToString(base64String: string): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			const binaryString = atob(base64String)
			const bytes = new Uint8Array(binaryString.length)
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i)
			}
			const decoder = new TextDecoder('utf-8')
			resolve(decoder.decode(bytes))
		} catch (error) {
			reject(error)
		}
	})
}

/**
 * 转换为 Base64 编码， 支持非拉丁文字符
 * @param {string} str - 要编码的字符串
 * @returns {string} - 返回 Base64 编码后的字符串
 */
export function toBase64(str: string): string {
	const encoder = new TextEncoder() // 创建 TextEncoder 实例
	const uint8Array: Uint8Array = encoder.encode(str) // 编码为 UTF-8
	let binaryString: string = ''
	uint8Array.forEach((byte: number): void => {
		binaryString += String.fromCharCode(byte) // 转换为二进制字符串
	})
	return btoa(binaryString) // 使用 btoa 编码成 Base64
}
