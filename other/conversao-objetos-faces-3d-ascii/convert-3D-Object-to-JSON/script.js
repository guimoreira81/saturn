import * as THREE from "hthree";

//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//const renderer = new THREE.WebGLRenderer()
//renderer.setSize(window.innerWidth, window.innerHeight)

// Load your 3D model (e.g., using GLTFLoader)
const loader = new THREE.GLTFLoader();
//cube.glft gltf
loader.load('cube.gltf', (gltf) => {
  const model = gltf.scene;

  // Traverse through all child meshes in the model
  model.traverse((child) => {
    if (child.isMesh) {
      const geometry = child.geometry;

      // Ensure the geometry is in BufferGeometry format
      if (geometry.isBufferGeometry) {
        const positionAttribute = geometry.attributes.position;

        // Extract polygons (triangles) from the position attribute
        const polygons = [];
        for (let i = 0; i < positionAttribute.count; i += 3) {
          const v1 = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
          const v2 = new THREE.Vector3().fromBufferAttribute(positionAttribute, i + 1);
          const v3 = new THREE.Vector3().fromBufferAttribute(positionAttribute, i + 2);

          polygons.push([v1, v2, v3]); // Each polygon is a triangle
        }

        console.log('Polygons:', polygons);
      }
    }
  });
});
