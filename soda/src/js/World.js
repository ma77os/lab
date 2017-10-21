const Particle = require('./Particle');

class World{
	
	constructor(){
		this.TOTAL_PARTICLES = 50;

		this.setup();
		this.createElements();
		this.render();
	}

	setup(){
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.z = 50;

		this.renderer = new THREE.WebGLRenderer({ antialias:true } );
		this.renderer.setPixelRatio(window.devicePixelRatio);
		// this.renderer.shadowMapEnabled = true;
		// this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		
		
		// let spotLight = new THREE.SpotLight(0xffffff, 0.5);
		// spotLight.position.set(0, 0, 20);
		// spotLight.castShadow = true;
		// spotLight.shadowDarkness  = 0.7;
		// spotLight.shadowMapWidth = 1024;
		// spotLight.shadowMapHeight = 1024;
		// this.scene.add(spotLight);

		window.addEventListener( 'resize', this.resize.bind(this), false );

		document.body.appendChild(this.renderer.domElement);
	}

	createElements(){
		
		this.container = new THREE.Mesh();
		this.scene.add( this.container );
		
		this.particles = [];
		
		for (let i = 0; i < this.TOTAL_PARTICLES; i++){
			this.particle = new Particle();
			this.particle.position.x = Math.random()*20 - 10;
			this.particle.position.y = Math.random()*20 - 10;
			this.particle.position.z = Math.random()*20 - 10;
			
			this.container.add( this.particle );
		}
	}

	render(){
		requestAnimationFrame(this.render.bind(this));

		this.container.rotation.y+=.01;
		// this.container.rotation.x+=.01;

		this.renderer.render(this.scene, this.camera);
	}

	resize(){
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}
}

module.exports = World;