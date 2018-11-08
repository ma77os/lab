class Tree extends THREE.Object3D {
  constructor(size){
    super()
    // var trunkGeo = new THREE.CylinderGeometry(.5, .5, 5);
    // var trunkMat = new THREE.MeshPhongMaterial({color: 0x895737, shininess:0, flatShading:true});
    // this.trunk = new THREE.Mesh(trunkGeo, trunkMat)
    // this.trunk.position.set(0, 2.5, 0)

    // var leavesGeo = new THREE.IcosahedronGeometry(4, 0);
    // var leavesMat = new THREE.MeshPhongMaterial({color: 0x00BE00,shininess:0, flatShading:true})
    // this.leaves = new THREE.Mesh(leavesGeo, leavesMat);
    // this.leaves.position.set(0, 8, 0)
    

    // this.mesh = this.mergeMeshes([this.trunk, this.leaves], true);
    // this.mesh.castShadow = true;
    // this.add(this.mesh)
    // this.add(this.trunk, this.leaves)
    this.forest(8, 20)

  }

  forest(cols, rows){
    var trunkGeo = new THREE.CylinderGeometry(.5, .5, 5);
    var leavesGeo = new THREE.IcosahedronGeometry(4, 0);
    var trunkMat = new THREE.MeshPhongMaterial({color: 0x895737, shininess:0, flatShading:true});
    var leavesMat = new THREE.MeshPhongMaterial({color: 0x00BE00,shininess:0, flatShading:true})

    var space = 12;

    var meshes = []

    for(var c = 0; c < cols; c++){
      for(var r = 0; r < rows; r++){
        var x = -40 + c * space;
        var z = -250 + r * space;
        var trunk = new THREE.Mesh(trunkGeo, leavesMat)
        trunk.position.set(x, 2.5, z)
        // trunk.castShadow = true;
        
        var leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.set(x, 8, z)
        // leaves.castShadow = true;
        
        // this.add(trunk, leaves)

        meshes.push(trunk, leaves)
        
      }
    }

    
    var mesh = this.mergeMeshes(meshes, true);
    mesh.castShadow = true;
    this.add(mesh)
  }

  mergeMeshes(meshes, toBufferGeometry) {

    var finalGeometry,
      materials = [],
      mergedGeometry = new THREE.Geometry(),
      mergedMesh;

    meshes.forEach(function(mesh, index) {
      mesh.updateMatrix();
      mesh.geometry.faces.forEach(function(face) {face.materialIndex = 0;});
      mergedGeometry.merge(mesh.geometry, mesh.matrix, index);
      materials.push(mesh.material);
    });

    mergedGeometry.groupsNeedUpdate = true;

    if (toBufferGeometry) {
      finalGeometry = new THREE.BufferGeometry().fromGeometry(mergedGeometry);
    } else {
      finalGeometry = mergedGeometry;
    }

    mergedMesh = new THREE.Mesh(finalGeometry, materials);
    mergedMesh.geometry.computeFaceNormals();
    mergedMesh.geometry.computeVertexNormals();

    return mergedMesh;

  }
}