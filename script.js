var rule_num_elem;
var canvas;
var ctx;

var rule = num_to_bits(22);

var cell_num;
var rows;

function bits_to_num(bits) {
	return bits.reduce((num, bit) => num * 2 + bit, 0);
}

function num_to_bits(num) {
	return (num
		.toString(2).padStart(8, "0").split("")
		.map(bit => bit == "1"));
}

function toggle_bit(elem, bit) {
	rule[bit] = !rule[bit];
	
	if(rule[bit]) {
		elem.classList.add("on");
		elem.classList.remove("off");
	} else {
		elem.classList.add("off");
		elem.classList.remove("on");
	}
	
	update_rule_num();
	run_elementary();
	render();
}

function init_canvas() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	render();
}

function update_rule_num() {
	if(!rule_num_elem)
		rule_num_elem = document.querySelector("#rule-number span");
	
	rule_num_elem.innerText = bits_to_num(rule);
}

function render() {
	canvas.width = document.body.offsetWidth;
	ctx.fillStyle = "black";
	
	let new_cell_num = cells_for_width(canvas.width);
	if(new_cell_num != cell_num) {
		cell_num = new_cell_num;
		run_elementary();
	}
	
	let mid_cell_i = Math.floor(cell_num / 2);
	let mid_canvas = Math.round(canvas.width / 2);
	
	for(let y = 0; y < rows.length; y++) {
		let cells = rows[y];
		for(let x = 0; x < cells.length; x++) {
			if(cells[x])
				ctx.fillRect((x - mid_cell_i) * 20 + mid_canvas - 10, y * 20, 20, 20);
		}
	}
}

function run_elementary() {
	let cells = Array(cell_num).fill(false);
	cells[Math.floor(cell_num / 2)] = true;
	
	rows = [cells];
	
	for(let _ of Array(60)) {
		cells = cells.map((mid_cell, i) => {
			let left_cell = i > 0 ? cells[i - 1] : false;
			let right_cell = i < cell_num - 1 ? cells[i + 1] : false;
			return rule[7 - bits_to_num([left_cell, mid_cell, right_cell])];
		});
		rows.push(cells);
	}
}

function cells_for_width(width) {
	return Math.ceil(width / 20) + 120 | 1;
}

window.addEventListener("resize", render, true);

requestAnimationFrame(init_canvas);