class Particle extends THREE.Mesh
	constructor:->
		geometry = new THREE.BoxGeometry 2, 2, 2
		material = new THREE.MeshLambertMaterial {color: 0xffffff}
		
		@castShadow = true
		@receiveShadow  = true
		
		super(geometry, material)
		
		@rotation.y = Math.random() * Math.PI*2