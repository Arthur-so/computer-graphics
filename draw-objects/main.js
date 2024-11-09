function main(){
    const canvas = document.querySelector("#c");
  const gl = canvas.getContext('webgl');

  if (!gl) {
      throw new Error('WebGL not supported');
  }

  canvas.addEventListener("mousedown",mouseDown,false);

  function mouseDown(event){
    console.log(event.screenX);
    console.log(event.screenY);
  }

  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
  
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  var program = createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();
  
  const positionLocation = gl.getAttribLocation(program, `position`);
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const colorLocation = gl.getAttribLocation(program, `color`);
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawFlower();
  drawCar();
  drawClown();

  function drawCar() {
    // rodas
    drawCircle(0.1, -0.7, -0.7, [0,0,0], 30);
    drawCircle(0.1, -0.2, -0.7, [0,0,0], 30);

    //carcaca
    drawRectangle(-0.9, -0.65, 1, 0.2, [0,0,1])
    drawRectangle(-0.62, -0.45, 0.4, 0.2, [0,0,1])

  }

  function drawFlower() {
    //caule
    drawRectangle(0.5, 0, 0.1, 0.5, [0, 1, 0]); 
    // petalas
    drawCircle(0.1, 0.55, 0.5, [1,0,0], 30);
    drawCircle(0.1, 0.55, 0.7, [1,0,0], 30);
    drawCircle(0.1, 0.45, 0.6, [1,0,0], 30);
    drawCircle(0.1, 0.65, 0.6, [1,0,0], 30);
    //meio
    drawCircle(0.1, 0.55, 0.6, [1,1,0], 30);
  }

  function drawClown() {
    //rosto
    drawCircle(0.35, -0.45, 0.35, [1,0.9,0.7], 30);
    //olhos
    drawCircle(0.07, -0.55, 0.45, [1,1,1], 30);
    drawCircle(0.03, -0.55, 0.45, [0,0,0], 30);
    drawCircle(0.07, -0.35, 0.45, [1,1,1], 30);
    drawCircle(0.03, -0.35, 0.45, [0,0,0], 30);
    //cabelo
    drawCircle(0.08, -0.85, 0.45, [0,0,1], 30);
    drawCircle(0.08, -0.8, 0.55, [0,0,1], 30);
    drawCircle(0.08, -0.72, 0.65, [0,0,1], 30);
    drawCircle(0.08, -0.6, 0.73, [0,0,1], 30);
    drawCircle(0.08, -0.45, 0.74, [0,0,1], 30);
    drawCircle(0.08, -0.08, 0.45, [0,0,1], 30);
    drawCircle(0.08, -0.12, 0.55, [0,0,1], 30);
    drawCircle(0.08, -0.22, 0.65, [0,0,1], 30);
    drawCircle(0.08, -0.32, 0.73, [0,0,1], 30);
    //chapeu
    drawRectangle(-0.72, 0.68, 0.55, 0.15, [0.3,1,0.2])
    drawRectangle(-0.64, 0.68, 0.4, 0.3, [0.3,1,0.2])
    //nariz
    drawCircle(0.07, -0.45, 0.3, [1,0,0], 30);
    //boca
    drawRectangle(-0.6, 0.08, 0.3, 0.08, [1,0.2,0.2])
  }

  function drawCircle(r, x, y, color, segments) {
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl, segments, r, x, y);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,segments, color);
    gl.drawArrays(gl.TRIANGLES, 0, 3*segments);
  }

  function drawRectangle(x, y, w, h, color) {
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setRectangleVertices(gl, x, y, w, h);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl,color); //Green
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}



function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
  
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  
  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
  
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

function setRectangleVertices(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       x1, y1,
       x2, y1,
       x1, y2,
       x1, y2,
       x2, y1,
       x2, y2,
    ]), gl.STATIC_DRAW);
  }
  
  function setRectangleColor(gl,color) {
    colorData = [];
    for (let triangle = 0; triangle < 2; triangle++) {
      for(let vertex=0; vertex<3; vertex++)
        colorData.push(...color);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
  }

  function setCircleVertices(gl, n, radius, offsetX, offsetY){
    let center = [offsetX, offsetY];
    let vertexData = [];
    for(let i=0;i<n;i++){
      vertexData.push(...center);
      vertexData.push(...[offsetX+(radius*Math.cos(i*(2*Math.PI)/n)),offsetY+(radius*Math.sin(i*(2*Math.PI)/n))]);
      vertexData.push(...[offsetX+(radius*Math.cos((i+1)*(2*Math.PI)/n)),offsetY+(radius*Math.sin((i+1)*(2*Math.PI)/n))]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
  }
  
  function setCircleColor(gl,n,color){
    colorData = [];
    for (let triangle = 0; triangle < n; triangle++) {
      for(let vertex=0; vertex<3; vertex++)
        colorData.push(...color);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
  }

  main();