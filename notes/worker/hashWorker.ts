/**
 * 通过 Web Worker 计算文本内容的 SHA-256 哈希
 */

self.onmessage = async (
	event: MessageEvent<{ id: string; type: string; data: string }>
) => {
	const { id, type, data } = event.data

	if (type === 'hash') {
		console.log('data :>> ', data)
		// 使用 SubtleCrypto 计算文本内容的 SHA-256 哈希
		const encoder = new TextEncoder()
		const textArray = encoder.encode(data) // 将文本内容编码为 ArrayBuffer
		const hashBuffer = await crypto.subtle.digest('SHA-256', textArray) // 计算 SHA-256 哈希

		// 将 hashBuffer 转换为十六进制字符串
		const hashArray = Array.from(new Uint8Array(hashBuffer))
		const hashHex = hashArray
			.map((byte) => byte.toString(16).padStart(2, '0'))
			.join('')
		self.postMessage({ id, type: 'hashResult', hash: hashHex })
	}

	if (type === 'toBase64') {
		console.log('data :>> ', data)
		const encoder = new TextEncoder() // 创建 TextEncoder 实例
		const uint8Array = encoder.encode(data) // 编码为 UTF-8
		let binaryString = ''
		uint8Array.forEach((byte) => {
			binaryString += String.fromCharCode(byte) // 转换为二进制字符串
		})
		const base64String = btoa(binaryString) // 使用 btoa 编码成 Base64
		self.postMessage({ id, type: 'base64Result', base64String })
	}
}
