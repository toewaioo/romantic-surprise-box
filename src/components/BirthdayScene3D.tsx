import { useEffect, useRef } from "react";
import * as THREE from "three";

interface BirthdayScene3DProps {
  photos: string[];
}

export const BirthdayScene3D = ({ photos }: BirthdayScene3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfff5f5);
    
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 15, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xffb6c1, 1.5, 20);
    pointLight1.position.set(-5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffd700, 1.2, 20);
    pointLight2.position.set(5, 5, -5);
    scene.add(pointLight2);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf5e6e8,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Table
    const tableTopGeometry = new THREE.BoxGeometry(8, 0.3, 8);
    const tableMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8b4513,
      roughness: 0.6,
      metalness: 0.1
    });
    const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial);
    tableTop.position.y = 0;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    scene.add(tableTop);

    // Table legs
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);
    const legPositions = [
      [-3, -1, -3],
      [3, -1, -3],
      [-3, -1, 3],
      [3, -1, 3]
    ];
    
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeometry, tableMaterial);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      scene.add(leg);
    });

    // Cake base (round)
    const cakeBaseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const cakeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffe4e1,
      roughness: 0.5,
      metalness: 0.1
    });
    const cakeBase = new THREE.Mesh(cakeBaseGeometry, cakeMaterial);
    cakeBase.position.set(0, 0.65, 0);
    cakeBase.castShadow = true;
    scene.add(cakeBase);

    // Cake frosting layer
    const frostingGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.15, 32);
    const frostingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffc0cb,
      roughness: 0.3,
      metalness: 0.2
    });
    const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial);
    frosting.position.set(0, 1.23, 0);
    frosting.castShadow = true;
    scene.add(frosting);

    // Second cake layer
    const cakeLayer2Geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
    const cakeLayer2 = new THREE.Mesh(cakeLayer2Geometry, cakeMaterial);
    cakeLayer2.position.set(0, 1.7, 0);
    cakeLayer2.castShadow = true;
    scene.add(cakeLayer2);

    // Top frosting
    const topFrostingGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 32);
    const topFrosting = new THREE.Mesh(topFrostingGeometry, frostingMaterial);
    topFrosting.position.set(0, 2.15, 0);
    topFrosting.castShadow = true;
    scene.add(topFrosting);

    // Candles and flames
    const candles: THREE.Mesh[] = [];
    const flames: THREE.Mesh[] = [];
    const candlePositions = [
      [0, 2.2, 0],
      [-0.5, 2.2, 0],
      [0.5, 2.2, 0],
      [0, 2.2, -0.5],
      [0, 2.2, 0.5]
    ];

    candlePositions.forEach(([x, y, z]) => {
      // Candle
      const candleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16);
      const candleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.4
      });
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      candle.position.set(x, y + 0.3, z);
      candle.castShadow = true;
      scene.add(candle);
      candles.push(candle);

      // Flame
      const flameGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const flameMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff6600,
        transparent: true,
        opacity: 0.9
      });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.scale.set(0.8, 1.2, 0.8);
      flame.position.set(x, y + 0.7, z);
      scene.add(flame);
      flames.push(flame);

      // Flame glow
      const flameGlowGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const flameGlowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffaa00,
        transparent: true,
        opacity: 0.4
      });
      const flameGlow = new THREE.Mesh(flameGlowGeometry, flameGlowMaterial);
      flameGlow.position.set(x, y + 0.7, z);
      scene.add(flameGlow);
      flames.push(flameGlow);

      // Point light for each candle
      const candleLight = new THREE.PointLight(0xff6600, 0.8, 3);
      candleLight.position.set(x, y + 0.7, z);
      scene.add(candleLight);
    });

    // Photo frames on table
    const photoFrames: THREE.Group[] = [];
    if (photos.length > 0) {
      const numPhotos = Math.min(photos.length, 4);
      const angleStep = (Math.PI * 2) / numPhotos;
      const radius = 3.2;

      for (let i = 0; i < numPhotos; i++) {
        const angle = i * angleStep;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const frameGroup = new THREE.Group();
        
        // Frame border
        const frameBorderGeometry = new THREE.BoxGeometry(1.2, 1.6, 0.1);
        const frameBorderMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x8b7355,
          roughness: 0.7
        });
        const frameBorder = new THREE.Mesh(frameBorderGeometry, frameBorderMaterial);
        frameBorder.castShadow = true;
        frameGroup.add(frameBorder);

        // Photo
        const loader = new THREE.TextureLoader();
        loader.load(photos[i], (texture) => {
          const photoGeometry = new THREE.PlaneGeometry(1, 1.4);
          const photoMaterial = new THREE.MeshStandardMaterial({ 
            map: texture,
            roughness: 0.5
          });
          const photo = new THREE.Mesh(photoGeometry, photoMaterial);
          photo.position.z = 0.06;
          frameGroup.add(photo);
        });

        // Stand
        const standGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
        const stand = new THREE.Mesh(standGeometry, frameBorderMaterial);
        stand.position.set(0, -0.8, -0.3);
        stand.rotation.x = Math.PI / 6;
        frameGroup.add(stand);

        frameGroup.position.set(x, 0.5, z);
        frameGroup.rotation.y = -angle + Math.PI / 2;
        scene.add(frameGroup);
        photoFrames.push(frameGroup);
      }
    }

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffb6c1,
      transparent: true,
      opacity: 0.6,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationY = 0;
    let rotationX = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        rotationY += deltaX * 0.005;
        rotationX += deltaY * 0.005;
        rotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, rotationX));

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      camera.position.z += e.deltaY * zoomSpeed * 0.01;
      camera.position.z = Math.max(6, Math.min(20, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate entire scene based on mouse
      scene.rotation.y = rotationY;
      scene.rotation.x = rotationX;

      // Animate flames
      flames.forEach((flame, index) => {
        const time = Date.now() * 0.003;
        flame.scale.y = 1.2 + Math.sin(time + index) * 0.2;
        flame.position.y += Math.sin(time * 2 + index) * 0.002;
      });

      // Gentle table rotation
      if (!isDragging) {
        scene.rotation.y += 0.002;
      }

      // Animate particles
      particlesMesh.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      mountRef.current?.removeChild(renderer.domElement);
      scene.clear();
      renderer.dispose();
    };
  }, [photos]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-screen cursor-grab active:cursor-grabbing"
    />
  );
};