var recordW = 1280; 
var recordH = 1280;
var isRecording = false;
var isInteractive = true;
var width = isRecording ? recordW : window.innerWidth; 
var height = isRecording ? recordH : window.innerHeight;

var scene, camera, renderer, light;
var controls;
var terrain;
var cubemapRT, cubeRenderTarget;
var composer;
var message = document.querySelector(".message")
var hammer;

var mouse = {x:0, y:0};
var isMobile = typeof window.orientation !== 'undefined'

var palleteBlack = {
  colors:[
    { c: "#111111", l:5 },
    { c: "#ed254e", l:1 },
    { c: "#f9dc5c", l:1 },
    { c: "#c2eabd", l:1 },
    { c: "#011936", l:1 },
    { c: "#465362", l:1 },
  ],
  topColor:null,
  repeat:10,
  shuffle:true,
  texture:null,
}


var palleteObj = palleteBlack

function init(){
  
  textureLoader = new THREE.TextureLoader();
  
  palleteObj.texture = textureLoader.load(createPalleteImg(palleteObj))
  
  build()
}
var bl = true
function build(){
  
  setup();
  elements();
  // post()

  
  if(isInteractive){
    hammer = new Hammer(document.body)
    hammer.get('pinch').set({ enable: true });
    hammer.on('pinch', function(ev) {
      // console.log(ev);
      c.yd = ev.scale
    });

    message.innerHTML = isMobile ? "DRAG AND PINCH!" : "MOVE!"
    message.style.display = "block"
    window.addEventListener(isMobile ? "touchstart" : "mousemove", function(){
      message.style.display = "none"
      
    })
  }
  
  if(isRecording)
    setupRecord(30, 60)

  render();
  
  
  if(isMobile)
    window.addEventListener("touchmove", mousemove, {passive:false})
  else
    window.addEventListener("mousemove", mousemove)
  
  window.addEventListener("resize", resize)
  resize()

  
}

function setup(){
  scene = new THREE.Scene();
  var fogColor = new THREE.Color( 0xffffff )
  scene.background = fogColor;
  scene.fog = new THREE.Fog(fogColor, 10, 400);

  
  sky()

  camera = new THREE.PerspectiveCamera(60, width / height, .1, 10000);
  camera.position.y = 8;
  camera.position.z = 4;
  
  // controls = new THREE.OrbitControls( camera );
  ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight)
  

  renderer = new THREE.WebGLRenderer( {antialias:true} );
  // renderer.toneMapping = THREE.CineonToneMapping;
  renderer.setPixelRatio = devicePixelRatio;
  renderer.setSize(width, height);
  

  document.body.appendChild(renderer.domElement)
  

}

function post(){
  
  bokehPass = new THREE.BokehPass( scene, camera, {
    focus: 2000,
    aperture:	0.05 * 0.00001,
    width: width,
    height: height
  } );
  bokehPass.renderToScreen = true;
  
  composer = new THREE.EffectComposer( renderer );
  composer.addPass( new THREE.RenderPass( scene, camera ) );
  composer.addPass( bokehPass );

}

function sky(){
  sky = new THREE.Sky();
  sky.scale.setScalar( 450000 );
  sky.material.uniforms.turbidity.value = 20;
  sky.material.uniforms.rayleigh.value = 0;
  sky.material.uniforms.luminance.value = 1;
  sky.material.uniforms.mieCoefficient.value = 0.01;
  sky.material.uniforms.mieDirectionalG.value = 0.8;
  
  scene.add( sky );

  sunSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry( 20000, 16, 8 ),
    new THREE.MeshBasicMaterial( { color: 0xffffff } )
  );
  sunSphere.visible = false;
  scene.add( sunSphere );
  
  var theta = Math.PI * ( -0.02 );
	var phi = 2 * Math.PI * ( -.25 );

  sunSphere.position.x = 400000 * Math.cos( phi );
  sunSphere.position.y = 400000 * Math.sin( phi ) * Math.sin( theta );
  sunSphere.position.z = 400000 * Math.sin( phi ) * Math.cos( theta );
  
  sky.material.uniforms.sunPosition.value.copy( sunSphere.position );
}

function elements(){
  var w= 100
  var h = 400
  var geometry = new THREE.PlaneBufferGeometry(w, h,400, 400);
  
  var colorsBuffer = new Float32Array(geometry.attributes.position.count * 3)
  for ( var i = 0; i < colorsBuffer.length; i++ ) {
    colorsBuffer[ i ] = Math.random()
  }
  geometry.addAttribute( 'vColor', new THREE.BufferAttribute( colorsBuffer, 3 ) );
  
  var displaceBuffer = new Float32Array( geometry.attributes.position.count );
  for ( var i = 0; i < displaceBuffer.length; i++ ) {
    displaceBuffer[ i ] = Math.random()
  }
  geometry.addAttribute( 'vDisplace', new THREE.BufferAttribute( displaceBuffer, 1 ) );
  var material = new MeshCustomMaterial(
    {
      roughness:.7,
      metalness:0.1,
      // roughnessMap:palleteRoughness.texture,
      // metalnessMap:palleteMetalness.texture
    },
    {
      time: { type: "f", value: 0.0 },
      distortCenter: { type: "f", value: 0.1 },
      ticknessOffset: { type: "f", value: 0.0 },
      pallete:{ type: "t", value: null},
      speed: { type: "f", value: 2.0 },
      maxHeight: { type: "f", value: 10.0 },
    },
    document.getElementById("custom-vertex").textContent,
    document.getElementById("custom-fragment").textContent
  );

  
  terrain = new THREE.Mesh(geometry, material);
  terrain.position.y = h/2;
  // terrain.flatShading = true;
  // terrain.rotation.x = -Math.PI;

  
  container = new THREE.Object3D();
  container.add(terrain)
  container.position.y = 0
  container.position.z = 4
  container.rotation.x = -Math.PI / 2
  
  scene.add(container)
}

function createPalleteImg(palleteObj){
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  var pallete = expandPallete(palleteObj)

  var texH = 1024;
  var colorH = texH / pallete.length;

  canvas.width = 2;
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
      var colors = palleteObj.shuffle ? shuffle(palleteObj.colors.slice()) : palleteObj.colors;
      var c = colors[i];
      for(var j=0; j < c.l; j++){
        pallete.push(c.c);
      }
    }
  }
  if(palleteObj.topColor){
    pallete.push(palleteObj.topColor);
  }
  return pallete
}

function shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};


var c = {x:0, y:0, xd:0, yd:0};
function render(){
  requestAnimationFrame(render)
  
  var time = performance.now() * 0.001



  
  terrain.material.uniforms.pallete.value = palleteObj.texture;
  terrain.material.uniforms.time.value = time;
  // terrain.material.uniforms.speed.value = (mouse.y)*10.0;
  // terrain.material.uniforms.maxHeight.value = (mouse.x+1)*10.0 + 2.0;

  if(isInteractive){
    c.xd = (mouse.x)*0.2;
    if(!isMobile)
      c.yd = mouse.y*5;

    if(c.yd < -.5) c.yd = -.5;
    c.x += (c.xd - c.x) * 0.08
    c.y += (c.yd - c.y) * 0.08
    
    terrain.material.uniforms.distortCenter.value = c.x;
    terrain.material.uniforms.ticknessOffset.value = c.y;
  }


  if(Math.sin(time + Math.PI) > 0.99){
    palleteObj.texture = textureLoader.load(createPalleteImg(palleteObj))
  }

  renderer.render(scene, camera)
  // composer.render(0.1)

  
  if(isRecording)
    captureRecord(renderer.domElement)
  
}

function mousemove(e){
  e.preventDefault();
  
  var x, y
  if(e.type == "mousemove"){
    x = e.clientX;
    y = e.clientY;
  }else{
    x = e.changedTouches[0].clientX
    y = e.changedTouches[0].clientY
  }
  
  mouse.x = (x / width) - 0.5
  mouse.y = (y / height) - 0.5
  
}

function resize(){
  width = isRecording ? recordW : window.innerWidth
  height = isRecording ? recordH : window.innerHeight
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize( width, height );
  // composer.setSize( width, height );

}

function MeshCustomMaterial (parameters, uniforms, vertexShader, fragmentShader) {
  THREE.MeshStandardMaterial.call( this );
  this.uniforms = THREE.UniformsUtils.merge([
    THREE.ShaderLib.standard.uniforms,
    uniforms
  ]);
  this.vertexShader = vertexShader;
  this.fragmentShader = fragmentShader;
  this.type = 'MeshCustomMaterial';
  this.setValues(parameters);
}

MeshCustomMaterial.prototype = Object.create( THREE.MeshStandardMaterial.prototype );
MeshCustomMaterial.prototype.constructor = MeshCustomMaterial;
MeshCustomMaterial.prototype.isMeshStandardMaterial = true;

function setupRecord(time, fps){
  console.log("setup record")
  capturer = new CCapture( { 
    display:true,
    format: 'png', 
    quality:99, 
    framerate:fps,
    timeLimit:time,
    autoSaveTime:time/3,
    // motionBlurFrames: 960 / fps
    // motionBlurFrames: 10
  } )
  capturer.start()


}

function captureRecord(canvas){
  capturer.capture(canvas)
}

function stopRecord(){
  console.log("stopped record")
  capturer.stop();
  capturer.save();

}

window.onload = init