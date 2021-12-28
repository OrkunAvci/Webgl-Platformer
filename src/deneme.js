let vertexShaderText = `
attribute vec3 vertexPosition;                  
attribute vec3 vertexColor;                     
uniform float angle;                            
varying vec3 varyingColor;                      
void main(void) {                               
  float c = cos(angle);                         
  float s = sin(angle);                         
  mat3 rotation = mat3(c,  0,  s,               
					   0,  1,  0,               
					   -s, 0,  c);              
  vec3 transformedPos = rotation * vertexPosition; 
  gl_Position = vec4(transformedPos, 1.0);      
  varyingColor = vertexColor;                   
}
`;

let fragmentShaderText = `
precision mediump float;                   
varying vec3 varyingColor;                 
void main(void) {                          
  gl_FragColor = vec4(varyingColor, 1.0);  
}
`;

let posOffsetVec = new Float32Array(3);
function keyPress(event) {
	if (event.key == "w") {
		console.log("W");
		posOffsetVec[2] += 1.0;
	} else if (event.key == "s") {
		console.log("S");
		posOffsetVec[2] -= 1.0;
	} else if (event.key == "d") {
		console.log("D");
		posOffsetVec[0] -= 1.0;
	} else if (event.key == "a") {
		console.log("A");
		posOffsetVec[0] += 1.0;
	} else if (event.key == "e") {
		console.log("E");
		posOffsetVec[1] += 1.0;
	} else if (event.key == "f") {
		console.log("F");
		posOffsetVec[1] -= 1.0;
	}
}


var angleUniformLoc;

var Init = function () {
	let canvas = document.getElementById("game-surface");
	let gl = canvas.getContext("webgl");

	if (!gl) {
		console.log("WebGL not supported, falling back on experimental-webgl");
		gl = canvas.getContext("experimental-webgl");
	}

	if (!gl) {
		alert("Your browser does not support WebGL");
	}

	gl.clearColor(0.12, 0.12, 0.12, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	//
	// Create shaders
	//
	let vertexShader = gl.createShader(gl.VERTEX_SHADER);
	let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error(
			"ERROR compiling vertex shader!",
			gl.getShaderInfoLog(vertexShader)
		);
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error(
			"ERROR compiling fragment shader!",
			gl.getShaderInfoLog(fragmentShader)
		);
		return;
	}

	let program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("ERROR linking program!", gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error(
			"ERROR validating program!",
			gl.getProgramInfoLog(program)
		);
		return;
	}

	var vertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
	var vertices = [
		0.0, 1.0, -0.5, -1.0, -0.5, -0.5, 1.0, -0.5, -0.5, 0.0, 0.0, 1.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vertexPositionAttrLoc, 3, gl.FLOAT, false, 0, 0);

	var indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	var indices = [0, 1, 2, 0, 2, 3, 0, 3, 1, 2, 1, 3];
	gl.bufferData(
		gl.ELEMENT_ARRAY_BUFFER,
		new Uint8Array(indices),
		gl.STATIC_DRAW
	);

	var vertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
	var colors = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vertexColorAttrLoc, 3, gl.FLOAT, false, 0, 0);

	var vertexPositionAttrLoc = gl.getAttribLocation(program, "vertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttrLoc);
	var vertexColorAttrLoc = gl.getAttribLocation(program, "vertexColor");
	gl.enableVertexAttribArray(vertexColorAttrLoc);

	gl.vertexAttribPointer(
		vertexPositionAttrLoc, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		vertexColorAttrLoc, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(vertexPositionAttrLoc);
	gl.enableVertexAttribArray(vertexColorAttrLoc);

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);

	let matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
	let matViewUniformLocation = gl.getUniformLocation(program, "mView");
	let matProjUniformLocation = gl.getUniformLocation(program, "mProj");
	let objPositionOffsetLocation = gl.getUniformLocation(program, "posOffset");

	document.addEventListener("keyup", keyPress, false);

	let worldMatrix = new Float32Array(16);
	let viewMatrix = new Float32Array(16);
	let projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [-10, 15, -15], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(
		projMatrix,
		glMatrix.toRadian(45),
		canvas.clientWidth / canvas.clientHeight,
		0.1,
		1000.0
	);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
	gl.uniform3fv(objPositionOffsetLocation, posOffsetVec);

	//
	// Main render loop
	//
	let xRotationMatrix = new Float32Array(16);
	let yRotationMatrix = new Float32Array(16);
	let identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	let angle = 0;
	let render = function () {
		angle = (performance.now() / 1000 / 6) * 2 * Math.PI;
		mat4.rotate(yRotationMatrix, identityMatrix, 0, [0, 1, 0]);
		mat4.rotate(xRotationMatrix, identityMatrix, 0, [1, 0, 0]);
		mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
		gl.uniform3fv(objPositionOffsetLocation, posOffsetVec);

		gl.clearColor(0.12, 0.12, 0.12, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

		requestAnimationFrame(render);
	};
	requestAnimationFrame(render);
};
