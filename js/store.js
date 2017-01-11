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

const store = (function() {
	let $ID = 0;

	return {
		set(property, value) {
			localStorage.setItem(property, JSON.stringify(value));
			fs.writeFile(`${PATH}/baza.dat`, JSON.stringify({
				types, list, config
			}));
			return value;
		},
		get(property) {
			return JSON.parse(localStorage.getItem(property));
		},
	};
}());