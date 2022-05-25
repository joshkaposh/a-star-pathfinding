import util from "./util.js";
import A_Star from "./A_Star.js";

export default class AI extends A_Star {
	constructor(playerId, start, end, heuristic, width, height) {
		super(playerId, start, end, heuristic);
		this.pos = new util.Vect2(start.x, start.y);
		this.pathIndex = 0;
		this.width = width;
		this.height = height;
	}

	traversePath(path, delta) {
		if (this.pathIndex < path.length) {
			let gridNode = path[this.pathIndex];
			this.pos.x = gridNode.pos.x;
			this.pos.y = gridNode.pos.y;
			this.pathIndex++;
		} else {
			this.pathIndex = path.length - 1;
		}
	}

	draw(c) {
		c.beginPath();
		c.fillStyle = "purple";
		c.rect(this.pos.x, this.pos.y, this.width, this.height);
		c.stroke();
		c.fill();
	}
}
