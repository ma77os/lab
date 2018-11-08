// Using this tutorial as start point: https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/
// Inspired on incredible work of @zhestkov - https://www.instagram.com/p/BowwXcsHtbz/

var scene, camera, renderer;
var start;
var mouse = {x:0, y:0};
var isMobile = window.innerWidth < 640;
var palleteObj = {
  colors:[
    { c: "#000000", l:10 },
    { c: "#ed254e", l:1 },
    { c: "#f9dc5c", l:1 },
    { c: "#c2eabd", l:1 },
    { c: "#011936", l:1 },
    { c: "#465362", l:1 },
  ],
  repeat:20,
  shuffle:true
}

var palleteImg;
var palleteTexture;

function init(){
  start = performance.now();
  palleteImg = createPalleteImg(palleteObj);
  palleteTexture = new THREE.TextureLoader().load(palleteImg);
  
  setup()
  elements()  
  render()
  
  document.querySelector(".loading").style.display = "none"
}

function setup(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 60;

  renderer = new THREE.WebGLRenderer( {antialias:true} );
  renderer.setPixelRatio = devicePixelRatio;
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement)

  if(isMobile)
    window.addEventListener("touchmove", mousemove)
  else
    window.addEventListener("mousemove", mousemove)
  
  window.addEventListener("resize", resize)
  resize()
}

function createPalleteImg(palleteObj){
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  var pallete = expandPallete(palleteObj)
  pallete.push("#000000", "#000000", "#000000")

  var texH = 1024;
  var colorH = texH / pallete.length;

  canvas.width = 16;
  canvas.height = texH
  
  for(var i=0; i < pallete.length; i++){
    ctx.fillStyle = pallete[i];
    ctx.fillRect(0, colorH * i, canvas.width, colorH)

  }

  return canvas.toDataURL()

}

function expandPallete(palleteObj){
  var pallete = []
  for(var x=0; x < palleteObj.repeat; x++){
    for(var i=0; i < palleteObj.colors.length; i++){
      var colors = palleteObj.shuffle ? shuffle(palleteObj.colors.slice()) : palleteObj.colors[i];
      var c = colors[i];
      for(var j=0; j < c.l; j++){
        pallete.push(c.c);
      }
    }
  }
  return pallete
}

function shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function elements(){
  var size = isMobile ? 15 : 25;
  var res = isMobile ? 6 : 8;
  geometry = new THREE.IcosahedronBufferGeometry(size, res );
  
  icoMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tExplosion: {
        type: "t",
        value: new THREE.TextureLoader().load(palleteImg)
      },
      time: { 
        type: "f",
        value: 0.0
      }
    },
    vertexShader: document.getElementById("vertex-ico-shader").textContent,
    fragmentShader: document.getElementById("fragment-ico-shader").textContent,
 });


  cube = new THREE.Mesh(geometry, icoMaterial)
  scene.add(cube)
}

function render(){
  requestAnimationFrame(render)

  var rotX = mouse.y * 2;
  var rotY = mouse.x * 2;
  cube.rotation.x += (rotX - cube.rotation.x) * 0.05;
  cube.rotation.y += (rotY - cube.rotation.y) * 0.05;

  icoMaterial.uniforms[ 'time' ].value = .00025 * ( performance.now() - start );

  renderer.render(scene, camera)
  
}

function mousemove(e){
  var x, y
  if(e.type == "mousemove"){
    x = e.clientX;
    y = e.clientY;
  }else{
    x = e.changedTouches[0].clientX
    y = e.changedTouches[0].clientY
  }
  
  mouse.x = (x / window.innerWidth) - 0.5
  mouse.y = (y / window.innerHeight) - 0.5
  
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

window.onload = init