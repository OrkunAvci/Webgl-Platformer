let offset = objects[0].offset_vector;
let border = [10, 15, 14];

function control()
{
	return ((-1 * border[0]) < offset[0] && offset[0] < border[0] && -1 < offset[1] && offset[1] < border[1] && (-1 * border[2]) < offset[2] && offset[2] < border[2]);
}

function move(event) {
	if (event.key == "w") {
		offset[2] += 1.0;
		if (!control())	{offset[2] -= 1.0;}
	} else if (event.key == "s") {
		offset[2] -= 1.0;
		if (!control())	{offset[2] += 1.0;}
	} else if (event.key == "d") {
		offset[0] -= 1.0;
		if (!control())	{offset[0] += 1.0;}
	} else if (event.key == "a") {
		offset[0] += 1.0;
		if (!control())	{offset[0] -= 1.0;}
	} else if (event.key == "e") {
		offset[1] += 1.0;
		if (!control())	{offset[1] -= 1.0;}
	} else if (event.key == "f") {
		offset[1] -= 1.0;
		if (!control())	{offset[1] += 1.0;}
	}
	console.log(offset)
}