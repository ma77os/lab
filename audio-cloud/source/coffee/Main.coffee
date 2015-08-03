AUDIO_URL = "music/paradise_circus.mp3"

modes = ["cubic", "conic"]
themes = {
  pinkBlue:[0xFF0032, 0xFF5C00, 0x00FFB8, 0x53FF00]
  yellowGreen:[0xF7F6AF, 0x9BD6A3, 0x4E8264, 0x1C2124, 0xD62822]
  yellowRed:[0xECD078, 0xD95B43, 0xC02942, 0x542437, 0x53777A]
  blueGray:[0x343838, 0x005F6B, 0x008C9E, 0x00B4CC, 0x00DFFC]
  blackWhite:[0xFFFFFF, 0x000000, 0xFFFFFF, 0x000000, 0xFFFFFF]
}

themesNames = []
for k, v of themes
  themesNames.push k

# PARAMETERS
params = {
  # public
  mode: modes[0]
  theme:themesNames[0]
  radius: 3
  distance: 600
  size: .5

  # private
  numParticles: 5000
  sizeW: 1
  sizeH: 1
  radiusParticle: 60
  themeArr:themes[this.theme]
}


TOTAL_BANDS = 256
cp = new PIXI.Point()
mouseX = 0
mouseY = 0
mousePt = new PIXI.Point()
windowW = 0
windowH = 0

stage = null
renderer = null
texCircle = null
circlesContainer = null
arrCircles = []
hammertime = null
# audio
audio = null
analyser = null
analyserDataArray = null
# gui
gui = null

init = ->
  
  initGestures()
  initAudio()

  resize()
  build()
  resize()

  mousePt.x = cp.x
  mousePt.y = cp.y

  $(window).resize(resize)

  startAnimation()
  initGUI()

initGUI = ->
  gui = new dat.GUI()
  modeController = gui.add params, 'mode', modes
  modeController.onChange (value) ->
    changeMode value
    

  themeController = gui.add(params, 'theme', themesNames)
  themeController.onChange (value) ->
    changeTheme params.theme

  gui.add params, 'radius', 1, 8
  gui.add params, 'distance', 100, 1000
  sizeController = gui.add params, 'size', 0, 1
  sizeController.onChange (value) ->
    resize value

initAudio = ->
  context = new (AudioContext || webkitAudioContext)()
  analyser = context.createAnalyser()
  # analyser.smoothingTimeConstant = 0.5

  source = null

  audio = new Audio()

  audio.src = AUDIO_URL
  audio.controls = true
  audio.addEventListener 'canplay', ->
    console.log 'audio canplay'

    source = context.createMediaElementSource audio
    source.connect analyser
    source.connect context.destination

    analyser.fftSize = TOTAL_BANDS * 2
    bufferLength = analyser.frequencyBinCount
    console.log 'bufferLength', bufferLength
    analyserDataArray = new Uint8Array bufferLength

  audio.play()
  

startAnimation = ->
  requestAnimFrame(update)
  

initGestures = ->
  # TODO: detect mobile first
  isMobile = false

  if isMobile
    hammertime = new Hammer(document.body)
    hammertime.on "pan", (e)->
      # console.log(e)
      mouseX = e.center.x
      mouseY = e.center.y

  else
    $(window).on 'mousemove', (e) ->
      mouseX = e.clientX
      mouseY = e.clientY



build = ->
  stage = new PIXI.Stage 0x000000
  renderer = PIXI.autoDetectRenderer $(window).width(),$(window).height()

  $(document.body).append renderer.view

  texCircle = createCircleTex()

  buildCircles()

buildCircles = ->
  circlesContainer = new PIXI.DisplayObjectContainer()
  stage.addChild(circlesContainer)

  for i in [0..params.numParticles-1]
    circle = new PIXI.Sprite texCircle
    circle.anchor.x = 0.5
    circle.anchor.y = 0.5
    
    circle.position.x = circle.xInit = cp.x
    circle.position.y = circle.yInit = cp.y
    circle.mouseRad = Math.random()
    
    circle.scale = new PIXI.Point(0, 0)
    
    circlesContainer.addChild(circle)
    arrCircles.push(circle)


  changeTheme params.theme
  

createCircleTex = ->
  gCircle = new PIXI.Graphics()
  gCircle.beginFill(0xFFFFFF)
  gCircle.drawCircle(0, 0, params.radiusParticle)
  gCircle.endFill()

  gCircle.generateTexture()

resize = ->
  windowW = $(window).width()
  windowH = $(window).height()
  cp.x = windowW * .5
  cp.y = windowH * .5

  params.sizeW = windowH * params.size
  params.sizeH = windowH * params.size

  changeMode(params.mode)

  if renderer
    renderer.resize(windowW, windowH)

changeTheme = (name)->
  params.themeArr = themes[name]
  indexColor = 0
  padColor = Math.ceil params.numParticles / params.themeArr.length
  for i in [0..params.numParticles-1]
    circle = arrCircles[i]
    group = indexColor * padColor / params.numParticles
    circle.blendMode = if params.theme == "blackWhite" then PIXI.blendModes.NORMAL else PIXI.blendModes.ADD
    circle.indexBand = Math.round(group * (TOTAL_BANDS-56))-1
    circle.s = (Math.random() + (params.themeArr.length-indexColor)*0.2)*0.1
    if i % padColor == 0
      indexColor++

    circle.tint = params.themeArr[indexColor - 1]


changeMode = (value)->
  return if !arrCircles || arrCircles.length == 0

  # randomize mode if not specified
  if !value
    value = modes[Math.floor(Math.random()*modes.length)]

  params.mode = value

  for i in [0..params.numParticles-1]
    circle = arrCircles[i]
    
    switch params.mode
      # cubic
      when modes[0]
        circle.xInit = cp.x + (Math.random() * params.sizeW - params.sizeW/2)
        circle.yInit = cp.y + (Math.random() * params.sizeH - params.sizeH/2)

      # circular
      when modes[1]
        angle = Math.random() * (Math.PI * 2)
        circle.xInit = cp.x + (Math.cos(angle)*params.sizeW)
        circle.yInit = cp.y + (Math.sin(angle)*params.sizeH)

update = ->
  requestAnimFrame(update)

  if analyserDataArray
    analyser.getByteFrequencyData analyserDataArray


  if mouseX > 0 && mouseY > 0
    mousePt.x += (mouseX - mousePt.x) * 0.03
    mousePt.y += (mouseY - mousePt.y) * 0.03

  for i in [0..params.numParticles-1]
    circle = arrCircles[i]

    if analyserDataArray
      n = analyserDataArray[circle.indexBand]
      scale = ((n / 256)) * circle.s*2
    else
      scale = circle.s*.1

    scale *= params.radius

    circle.scale.x += (scale - circle.scale.x) * 0.3
    circle.scale.y = circle.scale.x

    dx = mousePt.x - circle.xInit
    dy = mousePt.y - circle.yInit
    dist = Math.sqrt(dx * dx + dy * dy)
    angle = Math.atan2(dy, dx)

    r = circle.mouseRad * params.distance + 30
    xpos = circle.xInit - Math.cos(angle) * r
    ypos = circle.yInit - Math.sin(angle) * r
    circle.position.x += (xpos - circle.position.x) * 0.1
    circle.position.y += (ypos - circle.position.y) * 0.1

  renderer.render(stage)

init()