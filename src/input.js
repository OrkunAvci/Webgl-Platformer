let offset = objects[0].offset_vector;

function move(event) {
	if (event.key == "w") {
		console.log("W");
		offset[2] += 1.0;
	} else if (event.key == "s") {
		console.log("S");
		offset[2] -= 1.0;
	} else if (event.key == "d") {
		console.log("D");
		offset[0] -= 1.0;
	} else if (event.key == "a") {
		console.log("A");
		offset[0] += 1.0;
	} else if (event.key == "e") {
		console.log("E");
		offset[1] += 1.0;
	} else if (event.key == "f") {
		console.log("F");
		offset[1] -= 1.0;
	}
}