class World
	constructor: ->
		@setup()
		@createElements()
		@render()

	setup: ->
		@scene = new THREE.Scene
		@camera = new THREE.PerspectiveCamera 75, window.innerWidth / window.innerHeight, 0.1, 1000
		@renderer = new THREE.WebGLRenderer
		@renderer.setSize window.innerWidth, window.innerHeight

		document.body.appendChild @renderer.domElement

	createElements:->
		geometry = new THREE.BoxGeometry( 1, 1, 1 )
		material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
		@cube = new THREE.Mesh( geometry, material )
		
		@scene.add( @cube )
		@camera.position.z = 5

	render: ->
		requestAnimationFrame(@render.bind(this))

		@cube.rotation.y+=.02

		@renderer.render(@scene, @camera)