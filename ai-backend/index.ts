let BACKEND_HOST = "http://127.0.0.1:8000";
export const configureHost = (host: string) => {
	BACKEND_HOST = host;
};

interface ReturnType<T> {
	updated: boolean;
	db: T;
	result: any;
}

const _fetchBackend = async <T>(
	prompt: string,
	info: boolean
): Promise<ReturnType<T>> => {
	const res = await fetch(`${BACKEND_HOST}/q`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			q: prompt,
			info,
		}),
	});
	if (!res.ok) {
		throw new Error("Bad request");
	}

	const payload = (await res.json()) as ReturnType<T>;
	return payload;
};

export const clear = async () => {
	const res = await fetch(`${BACKEND_HOST}/clear`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (!res.ok) {
		throw new Error("Bad request");
	}
};

export const info = <T>(prompt: string): Promise<ReturnType<T>> => {
	return _fetchBackend(prompt, true);
};

export const query = <T>(prompt: string): Promise<ReturnType<T>> => {
	return _fetchBackend<T>(prompt, false);
};

const _schema = (name: string, type: Object) => {
	return _fetchBackend(`A ${name} has format: ${JSON.stringify(type)}`, true);
};

export const schema = async (__schema: Object) => {
	for (const [key, type] of Object.entries(__schema)) {
		await _schema(key, type as Object);
	}
};

export const ask = async (prompt: string) => {
	const res = await fetch(`${BACKEND_HOST}/ask`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			prompt,
		}),
	});

	if (!res.ok) {
		throw new Error("Bad request");
	}

	const payload = (await res.json()) as { message: string };
	return payload.message;
};

export const init = async (name: string) => {
	const res = await fetch(`${BACKEND_HOST}/init`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name,
		}),
	});

	if (!res.ok) {
		throw new Error("Bad request");
	}
};
