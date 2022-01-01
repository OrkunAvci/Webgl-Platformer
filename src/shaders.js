let vertexShaderMove = `
	precision mediump float;
	
	attribute vec3 vertPosition;
	attribute vec2 vertTexCoord;
	varying vec2 fragTexCoord;
	uniform mat4 mWorld;
	uniform mat4 mView;
	uniform mat4 mProj;
	uniform vec3 posOffset;
	varying vec3 positionWithOffset;
	
	void main()
	{
		fragTexCoord = vertTexCoord;
		positionWithOffset = vertPosition + posOffset;
		gl_Position = mProj * mView * mWorld * vec4(positionWithOffset, 1.0);
		
	}
`

let fragmentShaderMove = `
	precision mediump float;
	
	varying vec2 fragTexCoord;
	uniform sampler2D create;
	uniform sampler2D wall;
	
	void main()
	{
		vec4 create_c = texture2D(create, fragTexCoord);
		vec4 wall_c = texture2D(wall, fragTexCoord);
		gl_FragColor = create_c * wall_c;
	}
`

let vertexShader;
let fragmentShader;

let setup_shaders = function(gl)
{
	vertexShader = gl.createShader(gl.VERTEX_SHADER);
	fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(vertexShader, vertexShaderMove);
	gl.shaderSource(fragmentShader, fragmentShaderMove);
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
}