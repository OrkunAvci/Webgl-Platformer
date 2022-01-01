let draw = function(gl, obj)
{
	if (obj.program == null)
	{
		setup_shaders(gl);
		refresh_program(gl, vertexShader, fragmentShader);
		obj.program = program;
	}

	program = obj.program;
	gl.useProgram(obj.program);

	//	Create object
	let vertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(obj.vertices),
		gl.STATIC_DRAW
	);
	let indexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
	gl.bufferData(
		gl.ELEMENT_ARRAY_BUFFER,
		new Uint16Array(obj.indices),
		gl.STATIC_DRAW
	);
	
	let positionAttribLocation = gl.getAttribLocation(obj.program, "vertPosition");
	let texCoordAttribLocation = gl.getAttribLocation(obj.program, "vertTexCoord");
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		texCoordAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(texCoordAttribLocation);
	
	if (obj.offset_vector != undefined)
	{
		obj.offset_location = gl.getUniformLocation(obj.program, "posOffset");
		gl.uniform3fv(obj.offset_location, obj.offset_vector);
	}

	let matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
	let matViewUniformLocation = gl.getUniformLocation(program, "mView");
	let matProjUniformLocation = gl.getUniformLocation(program, "mProj");

	//	Setup camera
	let worldMatrix = new Float32Array(16);
	let viewMatrix = new Float32Array(16);
	let projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [-25, 20, -25], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(
		projMatrix,
		glMatrix.toRadian(45),
		1720 / 900,
		0.1,
		1000.0
	);

	//	Assign computed values to shader variables
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


}