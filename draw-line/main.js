function main() {
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

    if (!gl) {
        throw new Error('WebGL not supported');
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

    canvas.addEventListener("mousedown", mouseClick, false);

    let clickCount = 0;
    let startX, startY, endX, endY;
    function mouseClick(event) {
        if (clickCount === 0) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            startX = event.offsetX;
            startY = event.offsetY;
            clickCount = 1;
        } else {
            endX = event.offsetX;
            endY = event.offsetY;
            bresenham(startX, startY, endX, endY);
            clickCount = 0;
        }
    }

    function bresenham(x1, y1, x2, y2) {
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
    
        let incX = x2 > x1 ? 1 : -1;
        let incY = y2 > y1 ? 1 : -1;
    
        // Desenha o pixel inicial
        writePixel(x1, y1);
    
        // Copia o ponto inicial para o ponto que será usado para desenhar a linha
        let x = x1;
        let y = y1;
    
        // Caso especial: linha vertical
        if (dx === 0) {
            while (y !== y2) {
                y += incY;
                writePixel(x, y);
            }
            return;
        }
    
        // Caso especial: linha horizontal
        if (dy === 0) {
            while (x !== x2) {
                x += incX;
                writePixel(x, y);
            }
            return;
        }
    
        // Caso geral
        let controle;
        if (dx >= dy) {
            // Linha com inclinação menor ou igual a 45 graus
            controle = dx / 2;
            while (x !== x2) {
                x += incX;
                controle -= dy;
                if (controle < 0) {
                    y += incY;
                    controle += dx;
                }
                writePixel(x, y);
            }
        } else {
            // Linha com inclinação maior que 45 graus
            controle = dy / 2;
            while (y !== y2) {
                y += incY;
                controle -= dx;
                if (controle < 0) {
                    x += incX;
                    controle += dy;
                }
                writePixel(x, y);
            }
        }
    }
    
    function writePixel(x, y) {
        const webGLX = (2 / canvas.width * x) - 1;
        const webGLY = (-2 / canvas.height * y) + 1;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([webGLX, webGLY]), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorVector), gl.STATIC_DRAW);

        gl.drawArrays(gl.POINTS, 0, 1); // Desenha o ponto
    }

    const bodyElement = document.querySelector("body");
    bodyElement.addEventListener("keydown", keyDown, false);

    let colorVector = [0.0, 0.0, 0.0];
    function keyDown(event) {
        switch (event.key) {
            case "0": colorVector = [0.0, 0.0, 0.0]; break;
            case "1": colorVector = [1.0, 0.0, 0.0]; break;
            case "2": colorVector = [0.0, 1.0, 0.0]; break;
            case "3": colorVector = [0.0, 0.0, 1.0]; break;
            case "4": colorVector = [1.0, 1.0, 0.0]; break;
            case "5": colorVector = [0.0, 1.0, 1.0]; break;
            case "6": colorVector = [1.0, 0.0, 1.0]; break;
            case "7": colorVector = [1.0, 0.5, 0.5]; break;
            case "8": colorVector = [0.5, 1.0, 0.5]; break;
            case "9": colorVector = [0.5, 0.5, 1.0]; break;
        }
    }

    gl.clear(gl.COLOR_BUFFER_BIT);

    // linha inicial entre os pontos (0,0) e (0,0) azul
    colorVector = [0,0,1]
    bresenham(0,0,0,0)
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

main();
