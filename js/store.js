'use strict';

// const store = new Proxy(localStorage, {
// 	set(object, property, value) {
// 		console.log(object, property, value);
// 		localStorage.setItem(property, JSON.stringify(value));
// 	},
// 	get(object, property) {
// 		return JSON.parse(localStorage.getItem(property));
// 	},
// });

const store = {
	set(property, value) {
		localStorage.setItem(property, JSON.stringify(value));
		return value;
	},
	get(property) {
		return JSON.parse(localStorage.getItem(property));
	},
};