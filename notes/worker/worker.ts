export const useHashWorker = (): {
	getHash: (textToHash: string) => Promise<string>
	getBase64Content: (text: string) => Promise<string>
} => {
	const worker = new Worker(
		new URL('../workers/hashWorker.js', import.meta.url)
	)
	const callbacks = new Map<
		string,
		{ resolve: (result: any) => void; reject: (error: Error) => void }
	>()

	worker.onmessage = ({ data: { id, type, ...result } }) => {
		const callback = callbacks.get(id)
		if (callback) {
			if (type === 'hashResult' || type === 'base64Result') {
				callback.resolve(result)
			} else {
				callback.reject(new Error('未知消息类型'))
			}
			callbacks.delete(id)
		}
	}

	const generateId = (): string => Math.random().toString(36).substring(2, 15)

	const getHash = (textToHash: string): Promise<string> => {
		return new Promise<string>((resolve, reject) => {
			const id = generateId()
			callbacks.set(id, { resolve, reject })
			worker.postMessage({ id, type: 'hash', data: textToHash })
		})
	}

	const getBase64Content = (text: string): Promise<string> => {
		return new Promise<string>((resolve, reject) => {
			const id = generateId()
			callbacks.set(id, { resolve, reject })
			worker.postMessage({ id, type: 'toBase64', data: text })
		})
	}

	return { getHash, getBase64Content }
}
