export class greaterThanPriorityQueue {
	#list = [];
	#capacity;

	constructor(capacity) {
		this.#capacity = Math.max(Number(capacity), 0) || null;
	}

	get size() {
		return this.#list.length;
	}

	get isFull() {
		return this.#capacity !== null && this.size === this.#capacity;
	}

	get isEmpty() {
		return this.size === 0;
	}

	#addPriorityGreater(element) {
		// add element to end if priority is lower than last element
		if (this.isEmpty || element.priority <= this.#list[this.size - 1].priority) {
			this.#list.push(element);
		} else {
			for (let index in this.#list) {
				// add element in first spot where priority is higher
				if (element.priority > this.#list[index].priority) {
					this.#list.splice(index, 0, element);
					break;
				}
			}
		}
	}

	add(item, priority = 0) {
		priority = Math.max(Number(priority), 0);
		const element = { item, priority };

		this.#addPriorityGreater(element);

		return this.size;
	}

	remove() {
		return this.isEmpty ? null : this.#list.shift().item;
	}

	contains(item) {
		for (let key in this.#list) {
			if (key === item) {
				return true;
			}
		}
		return false;
	}

	get(item) {
		for (let key in this.#list) {
			if (key === item) {
				return item;
			}
		}
		return null;
	}

	peek() {
		return this.#list[0].item;
	}

	copy() {
		let temp = [];
		for (let index in this.#list) {
			temp[index] = this.#list[index];
		}

		return temp;
	}

	toString() {
		return this.#list.map((el) => el.item).toString();
	}
}

export class lessThanPriorityQueue {
	#list = [];
	#capacity;

	constructor(capacity) {
		this.#capacity = Math.max(Number(capacity), 0) || null;
	}

	get size() {
		return this.#list.length;
	}

	get isFull() {
		return this.#capacity !== null && this.size === this.#capacity;
	}

	get isEmpty() {
		return this.size === 0;
	}

	#addToList(element) {
		// add element to end if priority is greater than last element
		if (this.isEmpty || element.priority >= this.#list[this.size - 1].priority) {
			this.#list.push(element);
		} else {
			for (let index in this.#list) {
				// add element in first spot where priority is higher
				if (element.priority < this.#list[index].priority) {
					this.#list.splice(index, 0, element);
					break;
				}
			}
		}
	}

	add(item, priority = 0) {
		priority = Math.max(Number(priority), 0);
		const element = { item, priority };

		this.#addToList(element);
	}
	remove() {
		return this.isEmpty ? null : this.#list.shift().item;
	}

	peek() {
		return this.#list[0].item;
	}

	contains(item) {
		for (let index in this.#list) {
			// console.log(this.#list[index].item, item);
			if (this.#list[index].item === item) {
				return true;
			}
		}
		return false;
	}

	clear() {
		this.#list.length = 0;
	}

	clone() {
		const queue = new lessThanPriorityQueue(this.#capacity);
		let temp = this.copy();
		for (let i = 0; i < temp.length; i++) {
			queue.add(temp[i].item, temp[i].priority);
		}
		return queue;
	}

	copy() {
		let temp = [];
		for (let index in this.#list) {
			temp[index] = this.#list[index];
		}

		return temp;
	}

	toString() {
		return this.#list.map((el) => el.item).toString();
	}
}

export default {
	lessThanPriorityQueue,
	greaterThanPriorityQueue,
};
