let posOffsetVec = Float32Array.from([0.0, 0.0, -20.0]);

let canvas;
let gl;

var Init = function () {
	//	Mandatory
	let canvas = document.getElementById("game-surface");
	let gl = canvas.getContext("webgl");
	if (!gl) {
		console.log("WebGL not supported, falling back on experimental-webgl");
		gl = canvas.getContext("experimental-webgl");
	}
	if (!gl) {
		alert("Your browser does not support WebGL");
	}

	//	Setup shaders
	setup_shaders(gl);

	//	Setup program
	refresh_program(gl, vertexShader, fragmentShader);

	//	Clean ups and configuration
	gl.clearColor(0.92, 0.92, 0.92, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	gl.useProgram(program);

	for (i=0; i<objects.length; i++)
	{
		draw(gl, objects[i]);
		gl.useProgram(program);
		textures[i] = make_texture(gl, texture_ids[i]);
	}

	//	Set texture uniforms
	let createLoc = gl.getUniformLocation(program, "create");
	let whiteLoc = gl.getUniformLocation(program, "white");
	let woodLoc = gl.getUniformLocation(program, "wood");
	let wallLoc = gl.getUniformLocation(program, "wall");
	
	gl.uniform1i(createLoc, 0);
	gl.uniform1i(whiteLoc, 1);
	gl.uniform1i(woodLoc, 2);
	gl.uniform1i(wallLoc, 3);
	
	//	Define actions
	document.addEventListener("keyup", move, false);

	// Main render loop
	let render = function () {
		gl.useProgram(program);

		//	Reset background
		gl.clearColor(0.32, 0.32, 0.32, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		for (i=0; i<objects.length; i++)
		{
			obj = objects[i];
			gl.useProgram(program);
			gl.activeTexture(gl.TEXTURE0);
			//gl.bindTexture(gl.TEXTURE_2D, null);
			gl.bindTexture(gl.TEXTURE_2D, textures[i]);
			draw(gl, obj);
			gl.drawElements(gl.TRIANGLES, obj.indices.length, gl.UNSIGNED_SHORT, 0);
		}

		//	Recursive
		requestAnimationFrame(render);
	};
	requestAnimationFrame(render);
};
