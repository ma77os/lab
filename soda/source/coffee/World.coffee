class World
	TOTAL_PARTICLES: 50
	
	constructor: ->
		@setup()
		@createElements()
		@render()

	setup: ->
		@scene = new THREE.Scene
		@renderer = new THREE.WebGLRenderer
		@renderer.setPixelRatio window.devicePixelRatio
		@renderer.shadowMapEnabled = true
		@renderer.shadowMapType = THREE.PCFSoftShadowMap
		@renderer.setSize window.innerWidth, window.innerHeight
		
		@camera = new THREE.PerspectiveCamera 45, window.innerWidth / window.innerHeight, 1, 2000
		@camera.position.z = 50
		
		spotLight = new THREE.SpotLight(0xffffff, 1)
		spotLight.position.set 0, 0, 20
		spotLight.castShadow = true
		spotLight.shadowDarkness  = 0.7
		spotLight.shadowMapWidth = 1024
		spotLight.shadowMapHeight = 1024
		@scene.add(spotLight)

		document.body.appendChild @renderer.domElement

	createElements:->
		
		@container = new THREE.Mesh()
		@scene.add( @container )
		
		@particles = []
		
		for i in [0..@TOTAL_PARTICLES]
			@particle = new Particle()
			@particle.position.x = Math.random()*20 - 10
			@particle.position.y = Math.random()*20 - 10
			@particle.position.z = Math.random()*20 - 10
			

			@container.add( @particle )

	render: ->
		requestAnimationFrame(@render.bind(this))

		@container.rotation.y+=.01
		@container.rotation.x+=.01

		@renderer.render(@scene, @camera)