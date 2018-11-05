class Tree extends THREE.Object3D {
  constructor(size){
    super()
    
    this.trunk = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(.5, .5, 5), 
      new THREE.MeshPhongMaterial({color: 0x895737, shininess:0, flatShading:true})
    )
    this.trunk.position.set(0, 2.5, 0)

    this.leaves = new THREE.Mesh(
      new THREE.IcosahedronBufferGeometry(4, 0), 
      new THREE.MeshPhongMaterial({color: 0x00BE00,shininess:0, flatShading:true})
    )
    this.leaves.position.set(0, 8, 0)
    this.leaves.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI)

    this.add(this.trunk)
    this.add(this.leaves)

    this.trunk.castShadow = this.leaves.castShadow = true;

  }
}