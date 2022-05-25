function distance(a, b) {
	let x = a.x - b.x;
	let y = a.y - b.y;
	return Math.sqrt(x * x + y * y);
}
class PriorityQueue {
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
		const queue = new PriorityQueue(this.#capacity);
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

class Path {
	#path = new Map();
	#rebuilt_path = [];

	get rebuiltPath() {
		return this.#rebuilt_path;
	}

	get path() {
		return this.#path;
	}

	add(parent, node) {
		this.#path.set(node, parent);
	}

	rebuild(currentNode) {
		this.#rebuilt_path.length = 0;
		this.#rebuilt_path.push(currentNode);

		while (this.#path.has(currentNode)) {
			currentNode = this.#path.get(currentNode);
			this.#rebuilt_path.push(currentNode);
		}
		return this.#rebuilt_path;
	}
}

export default class A_Star {
	constructor(start, end, heuristic) {
		this.start = start;
		this.end = end;
		this.heuristic = heuristic;
		this.openSet = new PriorityQueue(Infinity);
		this.closedSet = new Map();
		this.path = new Path();
		this.costs = {
			g: new Map(),
			f: new Map(),
		};

		this.finished = false;
		this.failure = false;
	}

	start_new_path(start, end) {
		this.openSet.clear();
		this.closedSet.clear();
		this.path = new Path();
		this.costs.f.clear();
		this.costs.g.clear();

		this.costs.g.set(start, 0);
		this.costs.f.set(start, this.heuristic(start, end));
		this.openSet.add(start, this.costs.f.get(start));
	}

	find_path(start, goal) {
		this.start_new_path(start, goal);

		let current = 0;
		const { g, f } = this.costs;
		//! begin pathfinding
		while (!this.openSet.isEmpty) {
			//! keep going
			current = this.openSet.peek();
			//! get node from openSet with lowest fCost
			if (current.equals(goal)) {
				//! reached the goal
				// console.log("FINISHED!!");
				this.finished = true;
				return this.path.rebuild(current);
			}

			this.openSet.remove();
			this.closedSet.set(current, current);

			let neighbours = current.neighbours;

			for (let i = 0; i < neighbours.length; i++) {
				let neighbour = neighbours[i];

				if (!this.closedSet.has(neighbour)) {
					//! ignore if neighbour was already evaluated
					let tempG = g.get(current) + distance(current, neighbour);

					if (!g.has(neighbour) || tempG < g.get(neighbour)) {
						//! best recorded gCost so far;
						g.set(neighbour, tempG);
						f.set(neighbour, this.heuristic(neighbour, this.end) + g.get(neighbour));
						this.path.add(current, neighbour);
					}
					if (!this.openSet.contains(neighbour)) {
						this.openSet.add(neighbour, f.get(neighbour));
					}
				}
			}
		}
		//! no solution
		return false;
	}
}
