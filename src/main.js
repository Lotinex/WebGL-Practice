document.getElementById('c').width = window.innerWidth;
document.getElementById('c').height = window.innerHeight;
var positionAttributeLocation;
var resolutionUniformLocation;
var colorUniformLocation;
var canvas = document.querySelector("#c");
var WebGL = canvas.getContext("webgl");
var program;

var positionBuffer;
var fragmentShaderSource;
var vertexShader;
var fragmentShader;
var vertexShaderSource;

const state = {
    xMoveSpeed: 3,
    yMoveSpeed: 3,
    keyPress: {}
};

function createShader(WebGL, type, source) {
  var shader = WebGL.createShader(type);
  WebGL.shaderSource(shader, source);
  WebGL.compileShader(shader);
  var success = WebGL.getShaderParameter(shader, WebGL.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(WebGL.getShaderInfoLog(shader));
  WebGL.deleteShader(shader);
}
let Triangle1Position = [
    300, 300,
    600, 300,
    300, 600,
];
let Triangle2Position = [
    600, 300,
    600, 600,
    300, 600
];
function createProgram(WebGL, vertexShader, fragmentShader) {
  var program = WebGL.createProgram();
  WebGL.attachShader(program, vertexShader);
  WebGL.attachShader(program, fragmentShader);
  WebGL.linkProgram(program);
  var success = WebGL.getProgramParameter(program, WebGL.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(WebGL.getProgramInfoLog(program));
  WebGL.deleteProgram(program);
} 
function init(){
    /**@type {WebGL2RenderingContext} */
    if (!WebGL) {
        return;
    }
    vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
    vertexShader = createShader(WebGL, WebGL.VERTEX_SHADER, vertexShaderSource);
    fragmentShader = createShader(WebGL, WebGL.FRAGMENT_SHADER, fragmentShaderSource);
    program = createProgram(WebGL, vertexShader, fragmentShader);
    positionAttributeLocation = WebGL.getAttribLocation(program, "a_position");
    resolutionUniformLocation = WebGL.getUniformLocation(program, "u_resolution");
    colorUniformLocation = WebGL.getUniformLocation(program, "u_color");
    positionBuffer = WebGL.createBuffer();
    WebGL.bindBuffer(WebGL.ARRAY_BUFFER, positionBuffer);

    document.addEventListener('keydown', e => {
        state.keyPress[e.key] = true;
    })
    document.addEventListener('keyup', e => {
        delete state.keyPress[e.key];
    })
}
function main() {
  WebGL.viewport(0, 0, WebGL.canvas.width, WebGL.canvas.height);
  WebGL.clearColor(0, 0, 0, 0);
  WebGL.clear(WebGL.COLOR_BUFFER_BIT);
  WebGL.useProgram(program);
  WebGL.enableVertexAttribArray(positionAttributeLocation);
  WebGL.uniform2f(resolutionUniformLocation, WebGL.canvas.width, WebGL.canvas.height);
  WebGL.bindBuffer(WebGL.ARRAY_BUFFER, positionBuffer);
  var size = 2;          
  var type = WebGL.FLOAT;   
  var normalize = false; 
  var stride = 0;        
  var offset = 0;        
  WebGL.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  var primitiveType = WebGL.TRIANGLES;
  var offset = 0;
  var count = 6;
  WebGL.uniform4f(
    colorUniformLocation,
    0.4,
    0.5,
    0.7,
    1
  );
  WebGL.drawArrays(primitiveType, offset, count);
}

function updateX(arr, ...xAddValues){
    arr.forEach((e, i) => !U.hasRemainder(i, 2) ? U.editArrayIndexElement(arr, i, e + xAddValues[i]) : null)
}
function updateY(arr, ...yAddValues){
    arr.forEach((e, i) => U.hasRemainder(i, 2) ? U.editArrayIndexElement(arr, i, e + yAddValues[i]) : null)
}
function update(){
    /*
    U.multipleArrayForeach([Triangle1Position, Triangle2Position], (arr, coord, index) => {
        if(!U.hasRemainder(index, 2)) U.editArrayIndexElement(arr, index, ++coord)
    })
    */
    if(state.keyPress.w){
        U.multipleArrayForeach([Triangle1Position, Triangle2Position], (arr, coord, i) => {
            updateY(arr, ...U.repeatValue(-state.yMoveSpeed, 6))
        })
    }
    if(state.keyPress.a){
        U.multipleArrayForeach([Triangle1Position, Triangle2Position], (arr, coord, i) => {
            updateX(arr, ...U.repeatValue(-state.xMoveSpeed, 6))
        })
    }
    if(state.keyPress.s){
        U.multipleArrayForeach([Triangle1Position, Triangle2Position], (arr, coord, i) => {
            updateY(arr, ...U.repeatValue(state.yMoveSpeed, 6))
        })
    }
    if(state.keyPress.d){
        U.multipleArrayForeach([Triangle1Position, Triangle2Position], (arr, coord, i) => {
            updateX(arr, ...U.repeatValue(state.xMoveSpeed, 6))
        })
    }
    //console.log([...Triangle1Position, ...Triangle2Position])
    WebGL.bufferData(WebGL.ARRAY_BUFFER, new Float32Array([...Triangle1Position, ...Triangle2Position]), WebGL.STATIC_DRAW);
    document.getElementById('directionValue').innerText = Object.keys(state.keyPress);
    document.getElementById('speedValue').innerText = `x:${state.xMoveSpeed} y:${state.yMoveSpeed}`
}
function loop(){
    update()
    main()
    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

init()
