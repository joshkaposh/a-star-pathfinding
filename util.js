function removeFromArray(arr, el) {
	for (let i = arr.length - 1; i >= 0; i--) {
		if (arr[i].id === el.id) {
			arr.splice(i, 1);
		}
	}
}

function distance(a, b) {
	let x = a.x - b.x;
	let y = a.y - b.y;
	return Math.sqrt(x * x + y * y);
}

const randIntFromRange = (min, max) => Math.floor(Math.random() * (max - min) + min);
const heuristic = (a, b) => distance(a, b);

class Vect2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

export default {
	Vect2,
	removeFromArray,
	randIntFromRange,
	distance,
	heuristic,
};
