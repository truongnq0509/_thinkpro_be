export function resnameKeyToObject(obj, newKey, oldKey) {
	Object.assign(obj, { [newKey]: obj[oldKey] });
	delete obj[oldKey];
	return obj;
}
