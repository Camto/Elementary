var bit_elems;
var rule_num_elem;
var num_input_elem;
var toggle_button_elem;
var content_elem;
var canvas;
var ctx;

const safety_cells = 120;

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
}

function init() {
	rule_num_elem = document.getElementById("rule-num");
	num_input_elem = document.getElementById("num-input");
	bit_elems = Array.from(document.querySelectorAll(".cell-table .clicky"));
	toggle_button_elem = document.getElementById("show-canvas-button");
	content_elem = document.getElementById("content");
	
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	render();
}

function update_rule_num() {
	let num = bits_to_num(rule);
	rule_num_elem.innerText = num;
	num_input_elem.value = num;
	
	run_elementary();
	render();
}

function show_num_input() {
	rule_num_elem.classList.add("no-display");
	num_input_elem.classList.remove("no-display");
	num_input_elem.select();
}

function update_num_input() {
	num_input_elem.classList.add("no-display");
	rule_num_elem.classList.remove("no-display");
	
	if(/^\d*$/.test(num_input_elem.value)) {
		rule = num_to_bits(Math.min(+num_input_elem.value, 255));
		update_rule_num();
		update_rule_bits();
	} else {
		num_input_elem.value = bits_to_num(rule);
	}
}

function update_rule_bits() {
	for(let i = 0; i < rule.length; i++) {
		let bit_elem = bit_elems[i];
		if(rule[i]) {
			bit_elem.classList.add("on");
			bit_elem.classList.remove("off");
		} else {
			bit_elem.classList.add("off");
			bit_elem.classList.remove("on");
		}
	}
}

function toggle_lower() {
	if(!content_elem.classList.contains("lower")) {
		content_elem.classList.add("lower");
		toggle_button_elem.innerText = "Show less";
	} else {
		content_elem.classList.remove("lower");
		toggle_button_elem.innerText = "Show more";
	}
}

function update_rule_to(num) {
	rule = num_to_bits(num);
	update_rule_num();
	update_rule_bits();
	
	if(!content_elem.classList.contains("lower"))
		toggle_lower();
	
	let body_rect = document.body.getBoundingClientRect();
	let rule_num_rect = rule_num_elem.getBoundingClientRect();
	window.scrollTo({
		top: rule_num_rect.top - body_rect.top + 30,
		behavior: "smooth"
	});
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
		for(let x = safety_cells; x < cells.length - safety_cells; x++) {
			if(cells[x])
				ctx.fillRect((x - mid_cell_i) * 20 + mid_canvas - 10, y * 20, 20, 20);
		}
	}
}

function run_elementary() {
	let cells = Array(cell_num).fill(false);
	cells[Math.floor(cell_num / 2)] = true;
	
	rows = [cells];
	
	for(let _ of Array(120)) {
		cells = cells.map((mid_cell, i) => {
			let left_cell = i > 0 ? cells[i - 1] : false;
			let right_cell = i < cell_num - 1 ? cells[i + 1] : false;
			return rule[7 - bits_to_num([left_cell, mid_cell, right_cell])];
		});
		rows.push(cells);
	}
}

function cells_for_width(width) {
	return Math.ceil(width / 20) + safety_cells * 2 | 1;
}

window.addEventListener("resize", render, true);
window.addEventListener("load", init, true);