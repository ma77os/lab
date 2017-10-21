class Particle extends THREE.Mesh{
	constructor (){
		super();

		this.add(this.cross());
		
		// this.rotation.y = Math.random() * Math.PI*2
	}

	triangle(){
		let shape = new THREE.Shape();
		shape.moveTo(0, 5);
		shape.lineTo(-5, -5);
		shape.lineTo(5, -5);
		shape.lineTo(0, 5);

		let geometry = new THREE.ShapeGeometry(shape);
		let material = new THREE.MeshBasicMaterial({color:0xffffff});

		return new THREE.Mesh(geometry, material);
	}

	square(){
		let shape = new THREE.Shape();
		shape.moveTo(-5, -5);
		shape.lineTo(5, -5);
		shape.lineTo(5, 5);
		shape.lineTo(0, 5);
		shape.lineTo(-5, 5);

		let geometry = new THREE.ShapeGeometry(shape);
		let material = new THREE.MeshBasicMaterial({color:0xffffff});

		return new THREE.Mesh(geometry, material);
	}

	cross(size = 10, thickness = 2){
		let sHalf = size / 2;
		let tHalf = thickness / 2;

		let shape = new THREE.Shape();
		shape.moveTo(-tHalf, -sHalf);
		shape.lineTo(tHalf, -sHalf);
		shape.lineTo(tHalf, -tHalf);
		shape.lineTo(sHalf, -tHalf);
		shape.lineTo(sHalf, tHalf);
		shape.lineTo(tHalf, tHalf);
		shape.lineTo(tHalf, sHalf);
		shape.lineTo(-tHalf, sHalf);
		shape.lineTo(-tHalf, tHalf);
		shape.lineTo(-sHalf, tHalf);
		shape.lineTo(-sHalf, -tHalf);
		shape.lineTo(-tHalf, -tHalf);
		shape.moveTo(-tHalf, -sHalf);

		let geometry = new THREE.ShapeGeometry(shape);
		let material = new THREE.MeshBasicMaterial({color:0xffffff});

		return new THREE.Mesh(geometry, material);
	}

	circle(){
		let geometry = new THREE.CircleGeometry(5, 32);
		let material = new THREE.MeshBasicMaterial({color:0xffffff});
		return new THREE.Mesh(geometry, material);
	}

	line(){

		let geometry = new THREE.Geometry();
		let material = new THREE.LineBasicMaterial({color: 0xffffff});

		geometry.vertices.push(new THREE.Vector3(-5, 0, 0));
		geometry.vertices.push(new THREE.Vector3(5, 0, 0));

		return new THREE.Line(geometry, material)
	}

}

module.exports = Particle;