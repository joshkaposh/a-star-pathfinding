import Grid, { COLORS } from "./Grid.js";
import AI from "./AI.js";
import util from "./util.js";
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
const resetBtn = document.getElementById("reset");
const status = document.getElementById("status");

resetBtn.addEventListener("click", reset);

canvas.width = 500;
canvas.height = 500;
const columns = 40;
const rows = 40;
let tilesize = Math.floor(canvas.width / columns);

const movers = [];

let grid;
let anId;
c.strokeStyle = "black";

class Mover extends AI {
	constructor(start, end, heuristic, color) {
		super(start, end, heuristic);
		this.color = color;
		this.statusEl = document.getElementById(this.id);
	}

	drawMover() {
		c.beginPath();
		c.fillStyle = this.color;
		c.rect(this.pos.x, this.pos.y, this.width, this.height);
		c.fill();
		c.closePath();
	}
}

const drawNodes = () => {
	grid.render(c);

	for (const mover of movers) {
		grid.drawPath(c, mover.closedSet, mover.openSet.copy());
		drawPath(mover, mover.path.path);
	}
};

const drawPath = (mover) => {
	let path = mover.path.rebuiltPath;
	for (let i = 0; i < path.length; i++) {
		path[i].draw(c, COLORS.FINAL_PATH);
	}

	mover.start.draw(c, COLORS.START_OF_PATH);
	mover.end.draw(c, COLORS.END_OF_PATH);
};

function reset() {
	init();
}

function spawnMovers() {
	let start = grid.getNode(util.randIntFromRange(0, columns - 1), 0);
	let end = grid.getNode(columns - 1, rows - 1);

	start.walkable = true;
	end.walkable = true;
	movers.length = 0;

	movers.push(new Mover(start, end, util.distance, "blue"));

	for (const mover of movers) {
		mover.find_path(start, end);
	}
}

function animate() {
	c.clearRect(0, 0, window.innerWidth, window.innerHeight);

	drawNodes();

	for (const mover of movers) {
		mover.drawMover();
		if (mover.finished) {
			drawPath(mover);
		}
		nextAnimationFrame(mover);
	}

	function nextAnimationFrame(ai) {
		if (ai.failure) {
			status.innerText = "Failed!";
			anId = cancelAnimationFrame(anId);
		} else if (ai.finished) {
			status.innerText = "Success!";
			drawPath(ai);
			anId = cancelAnimationFrame(anId);
		} else {
			status.innerText = "Finding Path";
			anId = requestAnimationFrame(animate);
		}

		if (status.innerText !== "Finding Path") return; // console.log(ai.path);
	}
}

function init() {
	grid = new Grid(columns, rows, tilesize);
	if (anId) cancelAnimationFrame(anId);

	spawnMovers();

	animate();
}

init();
