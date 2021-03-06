let texture_ids = [
	"create_texture",
	"white_texture",
	"white_texture",
	"wood_texture"
];

let textures = [];

function make_texture(gl, id)
{
	let texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(
		gl.TEXTURE_2D,
		gl.TEXTURE_WRAP_S,
		gl.CLAMP_TO_EDGE
	);
	gl.texParameteri(
		gl.TEXTURE_2D,
		gl.TEXTURE_WRAP_T,
		gl.CLAMP_TO_EDGE
	);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.RGBA,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		document.getElementById(id)
	);
	gl.bindTexture(gl.TEXTURE_2D, null);

	return texture;
}