class Particle extends THREE.Mesh{
	constructor (){
		let geometry = new THREE.BoxGeometry(2, 2, 2);
		let material = new THREE.MeshLambertMaterial({color: 0xffffff});
		
		super(geometry, material);
		
		// this.castShadow = true;
		this.receiveShadow  = true;
		
		this.rotation.y = Math.random() * Math.PI*2
	}

}

module.exports = Particle;