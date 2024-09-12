


   // Create the scene
   const scene = new THREE.Scene();

   // Create the camera
   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.position.z = 5;

   // Create the renderer
   const renderer = new THREE.WebGLRenderer();
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);

   // Create the asteroid geometry
   const geometry = new THREE.DodecahedronGeometry(1, 0);

   // Create a simple texture for the asteroid
   const textureLoader = new THREE.TextureLoader();
   const asteroidTexture = textureLoader.load('https://cdn.pixabay.com/photo/2016/07/29/21/53/asteroid-1558371_1280.jpg');

   // Create the material and apply the texture
   const material = new THREE.MeshStandardMaterial({ map: asteroidTexture });

   // Create the mesh with geometry and material
   const asteroid = new THREE.Mesh(geometry, material);
   scene.add(asteroid);

   // Add lighting
   const light = new THREE.DirectionalLight(0xffffff, 1);
   light.position.set(5, 5, 5).normalize();
   scene.add(light);

   // Animation loop
   function animate() {
       requestAnimationFrame(animate);

       // Rotate the asteroid
       asteroid.rotation.x += 0.01;
       asteroid.rotation.y += 0.01;

       renderer.render(scene, camera);
   }

   animate();

   // Handle window resize
   window.addEventListener('resize', () => {
       renderer.setSize(window.innerWidth, window.innerHeight);
       camera.aspect = window.innerWidth / window.innerHeight;
       camera.updateProjectionMatrix();
   });