import util from "./util.js";

export const COLORS = {
	WALKABLE: "white",
	WALL: "black",
	CLOSED_PATH: "purple",
	OPEN_PATH: "lightgreen",
	FINAL_PATH: "#eb14ac",
	START_OF_PATH: "darkgreen",
	END_OF_PATH: "red",
};

function drawRect(c, node) {
	c.beginPath();
	c.rect(node.x, node.y, node.tilesize, node.tilesize);
	c.fill();
	c.stroke();
	c.closePath();
}

class GridNode {
	constructor(x, y, i, col, row, tilesize) {
		this.x = x;
		this.y = y;
		this.id = i;
		this.col = col;
		this.row = row;
		this.tilesize = tilesize;
		// this.gCost = 0; // distance travelled
		// this.hCost = 0; // distance to target
		// this.fCost = 0; // gCost + hCost
		this.previous = null;
		this.walkable = true;
		this.neighbours = [];

		// Math.random() < 0.35 ? (this.walkable = false) : (this.walkable = true);
		this.color = "white";
	}

	equals(otherNode) {
		// console.log(this.pos.x === otherNode.pos.x && this.pos.y === otherNode.pos.y);
		if (this.x === otherNode.x && this.y === otherNode.y) return true;
		return false;
	}

	addNeighbours(maxCols, maxRows, getNode) {
		// !
		if (this.col + 1 < maxCols) this.neighbours.push(getNode(this.col + 1, this.row));
		if (this.col - 1 >= 0) this.neighbours.push(getNode(this.col - 1, this.row));
		if (this.row + 1 < maxRows) this.neighbours.push(getNode(this.col, this.row + 1));
		if (this.row - 1 >= 0) this.neighbours.push(getNode(this.col, this.row - 1));

		if (this.row - 1 >= 0 && this.col - 1 >= 0) this.neighbours.push(getNode(this.col - 1, this.row - 1));
		if (this.row - 1 >= 0 && this.col + 1 < maxCols) this.neighbours.push(getNode(this.col + 1, this.row - 1));
		if (this.row + 1 < maxRows && this.col + 1 < maxCols) this.neighbours.push(getNode(this.col + 1, this.row + 1));
		if (this.row + 1 < maxRows && this.col - 1 >= 0) this.neighbours.push(getNode(this.col - 1, this.row + 1));
	}

	draw(c, color) {
		c.fillStyle = color || this.color;
		drawRect(c, this);
	}
}

export default class Grid {
	constructor(cols, rows, tilesize) {
		this.nodes = [];
		this.cols = cols;
		this.rows = rows;
		this.width = cols * tilesize;
		this.height = rows * tilesize;
		this.tilesize = tilesize;

		this.#generateGrid();
	}

	drawRect(c, node) {
		c.beginPath();
		c.rect(node.pos.x, node.pos.y, node.tilesize, node.tilesize);
		c.fill();
		c.stroke();
		c.closePath();
	}

	drawNodes(c) {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const node = this.getNode(col, row);
				node.walkable ? (c.fillStyle = COLORS.WALKABLE) : (c.fillStyle = COLORS.WALL);
				node.draw(c, node);
			}
		}
	}

	drawPath(c, closedPath, openPath) {
		// console.log(closedPath);
		for (const node of closedPath) {
			// console.log("closed", node);
			node[0].draw(c, COLORS.CLOSED_PATH);
		}

		for (const node of openPath) {
			// console.log("open", node);

			node.item.draw(c, COLORS.OPEN_PATH);
		}
	}

	render(c) {
		this.drawNodes(c);
	}

	getNode(x, y) {
		return this.nodes[y * this.cols + x];
	}

	#addNeighboursToNodes() {
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				this.getNode(x, y).addNeighbours(this.cols, this.rows, this.getNode.bind(this));
			}
		}
	}

	#generateGrid() {
		if (this.nodes.length !== 0) this.nodes.length = 0;

		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const index = row * this.cols + col;
				// x, y, i, col, row, tilesize
				this.nodes.push(new GridNode(col * this.tilesize, row * this.tilesize, index, col, row, this.tilesize));
			}
		}

		this.#addNeighboursToNodes();
	}
}
