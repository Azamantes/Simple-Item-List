Array.prototype.forEach = function(callback = null) {
	const length = this.length;
	let i = -1;
	
	while (++i < length) {
		callback(this[i], i, this);
	}
};
Array.prototype.map = function(callback = null) {
	let i = this.length;
	const array = new Array(i);
	
	while (--i + 1) {
		array[i] = callback(this[i]);
	}

	return array;
};

Array.prototype.find = function(compare) {
	let i = this.length;
	
	while (i--) {
		if (compare(this[i])) {
			return this[i];
		}
	}

	return undefined;
};
Array.prototype.reduce = function(callback, value) {
	const length = this.length;
	let i = -1;
	
	while (++i < length) {
		value = callback(value, this[i]);
	}

	return value;
};
Object.pure = function(config) {
	return Object.assign(Object.create(null), config);
};
Object.prototype[Symbol.iterator] = function*() {
	yield* Object.entries(this);
};
Function.prototype.memoize = function() {
	const cache = Object.create(null);
	return (x) => (x in cache) ? cache[x] : (cache[x] = this(x));
};