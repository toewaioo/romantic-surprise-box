import { useEffect, useRef } from "react";
import * as THREE from "three";

interface BirthdayScene3DProps {
  photos: string[];
  birthdayName?: string;
}

export const BirthdayScene3D = ({ photos, birthdayName = "Happy Birthday" }: BirthdayScene3DProps) => {
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

    // Bottom cake layer (largest)
    const cakeBaseGeometry = new THREE.CylinderGeometry(1.8, 1.8, 1.2, 64);
    const cakeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xfff8dc,
      roughness: 0.6,
      metalness: 0.05
    });
    const cakeBase = new THREE.Mesh(cakeBaseGeometry, cakeMaterial);
    cakeBase.position.set(0, 0.75, 0);
    cakeBase.castShadow = true;
    scene.add(cakeBase);

    // Decorative cream waves on bottom layer
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const waveGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const waveMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffb6c1,
        roughness: 0.3,
        metalness: 0.2
      });
      const wave = new THREE.Mesh(waveGeometry, waveMaterial);
      wave.position.set(
        Math.cos(angle) * 1.8,
        1.35,
        Math.sin(angle) * 1.8
      );
      wave.scale.set(1, 0.7, 0.8);
      wave.castShadow = true;
      scene.add(wave);
    }

    // Bottom frosting layer
    const frostingGeometry = new THREE.CylinderGeometry(1.82, 1.82, 0.2, 64);
    const frostingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffb6c1,
      roughness: 0.2,
      metalness: 0.3
    });
    const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial);
    frosting.position.set(0, 1.45, 0);
    frosting.castShadow = true;
    scene.add(frosting);

    // Middle cake layer
    const cakeLayer2Geometry = new THREE.CylinderGeometry(1.4, 1.4, 1, 64);
    const cakeLayer2 = new THREE.Mesh(cakeLayer2Geometry, cakeMaterial);
    cakeLayer2.position.set(0, 2.05, 0);
    cakeLayer2.castShadow = true;
    scene.add(cakeLayer2);

    // Middle decorative cream waves
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const waveGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const wave = new THREE.Mesh(waveGeometry, new THREE.MeshStandardMaterial({ 
        color: 0xffb6c1,
        roughness: 0.3,
        metalness: 0.2
      }));
      wave.position.set(
        Math.cos(angle) * 1.4,
        2.55,
        Math.sin(angle) * 1.4
      );
      wave.scale.set(1, 0.7, 0.8);
      wave.castShadow = true;
      scene.add(wave);
    }

    // Middle frosting
    const middleFrostingGeometry = new THREE.CylinderGeometry(1.42, 1.42, 0.18, 64);
    const middleFrosting = new THREE.Mesh(middleFrostingGeometry, frostingMaterial);
    middleFrosting.position.set(0, 2.64, 0);
    middleFrosting.castShadow = true;
    scene.add(middleFrosting);

    // Top cake layer
    const cakeLayer3Geometry = new THREE.CylinderGeometry(1, 1, 0.8, 64);
    const cakeLayer3 = new THREE.Mesh(cakeLayer3Geometry, cakeMaterial);
    cakeLayer3.position.set(0, 3.14, 0);
    cakeLayer3.castShadow = true;
    scene.add(cakeLayer3);

    // Top decorative cream
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const waveGeometry = new THREE.SphereGeometry(0.08, 16, 16);
      const wave = new THREE.Mesh(waveGeometry, new THREE.MeshStandardMaterial({ 
        color: 0xffb6c1,
        roughness: 0.3,
        metalness: 0.2
      }));
      wave.position.set(
        Math.cos(angle) * 1,
        3.54,
        Math.sin(angle) * 1
      );
      wave.scale.set(1, 0.7, 0.8);
      wave.castShadow = true;
      scene.add(wave);
    }

    // Top frosting
    const topFrostingGeometry = new THREE.CylinderGeometry(1.02, 1.02, 0.15, 64);
    const topFrosting = new THREE.Mesh(topFrostingGeometry, frostingMaterial);
    topFrosting.position.set(0, 3.62, 0);
    topFrosting.castShadow = true;
    scene.add(topFrosting);

    // Birthday name text on cake
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = 1024;
      canvas.height = 256;
      context.fillStyle = '#ffb6c1';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = 'bold 80px Arial';
      context.fillStyle = '#8b0000';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(birthdayName, canvas.width / 2, canvas.height / 2);
      
      const texture = new THREE.CanvasTexture(canvas);
      const textGeometry = new THREE.PlaneGeometry(2.4, 0.6);
      const textMaterial = new THREE.MeshStandardMaterial({ 
        map: texture,
        transparent: true,
        roughness: 0.4
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(0, 2.05, 1.41);
      textMesh.castShadow = true;
      scene.add(textMesh);
    }

    // Decorative strawberries on top
    const strawberryPositions = [
      [0.5, 3.7, 0.3],
      [-0.4, 3.7, -0.5],
      [0.6, 3.7, -0.2],
      [-0.5, 3.7, 0.4]
    ];
    
    strawberryPositions.forEach(([x, y, z]) => {
      const strawberryGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const strawberryMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        roughness: 0.6
      });
      const strawberry = new THREE.Mesh(strawberryGeometry, strawberryMaterial);
      strawberry.scale.set(1, 1.2, 1);
      strawberry.position.set(x, y, z);
      strawberry.castShadow = true;
      scene.add(strawberry);
      
      // Strawberry leaf
      const leafGeometry = new THREE.ConeGeometry(0.08, 0.06, 8);
      const leafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228b22,
        roughness: 0.7
      });
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.set(x, y + 0.14, z);
      leaf.rotation.x = Math.PI;
      leaf.castShadow = true;
      scene.add(leaf);
    });

    // Candles and flames
    const candles: THREE.Mesh[] = [];
    const flames: THREE.Mesh[] = [];
    const candlePositions = [
      [0, 3.7, 0],
      [-0.3, 3.7, 0],
      [0.3, 3.7, 0],
      [0, 3.7, -0.3],
      [0, 3.7, 0.3]
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

    // Photo frames on table (random positions)
    const photoFrames: THREE.Group[] = [];
    if (photos.length > 0) {
      const numPhotos = Math.min(photos.length, 6);

      for (let i = 0; i < numPhotos; i++) {
        // Random position on table
        const x = (Math.random() - 0.5) * 6;
        const z = (Math.random() - 0.5) * 6;
        
        // Make sure not too close to center (cake area)
        const distFromCenter = Math.sqrt(x * x + z * z);
        if (distFromCenter < 2.5) {
          continue;
        }

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
        // Random rotation for italic/tilted look
        frameGroup.rotation.y = Math.random() * Math.PI * 2;
        frameGroup.rotation.z = (Math.random() - 0.5) * 0.3; // Slight tilt
        scene.add(frameGroup);
        photoFrames.push(frameGroup);
      }
    }

    // Wish Envelope on table
    const envelopeGroup = new THREE.Group();
    
    // Envelope body
    const envelopeGeometry = new THREE.BoxGeometry(1, 0.02, 0.7);
    const envelopeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffe4e1,
      roughness: 0.5
    });
    const envelope = new THREE.Mesh(envelopeGeometry, envelopeMaterial);
    envelope.castShadow = true;
    envelopeGroup.add(envelope);

    // Envelope flap
    const flapGeometry = new THREE.BufferGeometry();
    const flapVertices = new Float32Array([
      -0.5, 0.01, -0.35,
      0.5, 0.01, -0.35,
      0, 0.01, 0.35,
    ]);
    flapGeometry.setAttribute('position', new THREE.BufferAttribute(flapVertices, 3));
    flapGeometry.computeVertexNormals();
    const flapMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffc0cb,
      side: THREE.DoubleSide,
      roughness: 0.5
    });
    const flap = new THREE.Mesh(flapGeometry, flapMaterial);
    flap.castShadow = true;
    envelopeGroup.add(flap);

    // Heart seal on envelope
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.1, -0.15, -0.1, -0.15, 0);
    heartShape.bezierCurveTo(-0.15, 0.05, -0.1, 0.1, 0, 0.15);
    heartShape.bezierCurveTo(0.1, 0.1, 0.15, 0.05, 0.15, 0);
    heartShape.bezierCurveTo(0.15, -0.1, 0, -0.1, 0, 0);
    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.03,
      bevelEnabled: false
    });
    const heartMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff1493,
      roughness: 0.3,
      metalness: 0.4
    });
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.position.set(0, 0.03, 0);
    heart.rotation.x = -Math.PI / 2;
    heart.castShadow = true;
    envelopeGroup.add(heart);

    envelopeGroup.position.set(-2.5, 0.2, 2);
    envelopeGroup.rotation.y = Math.PI / 6;
    scene.add(envelopeGroup);

    // Balloons on wall
    const balloonPositions = [
      [-8, 4, -8, 0xff69b4], // Pink
      [-6, 5, -8, 0xffd700], // Gold
      [-4, 4.5, -8, 0x87ceeb], // Sky blue
      [4, 5, -8, 0xff1493], // Deep pink
      [6, 4, -8, 0xffa500], // Orange
      [8, 4.5, -8, 0x9370db], // Purple
    ];

    balloonPositions.forEach(([x, y, z, color]) => {
      // Balloon
      const balloonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      balloonGeometry.scale(1, 1.2, 1);
      const balloonMaterial = new THREE.MeshStandardMaterial({ 
        color: color as number,
        roughness: 0.3,
        metalness: 0.6
      });
      const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
      balloon.position.set(x, y, z);
      balloon.castShadow = true;
      scene.add(balloon);

      // String
      const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 2, 8);
      const stringMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.7
      });
      const string = new THREE.Mesh(stringGeometry, stringMaterial);
      string.position.set(x, y - 1.5, z);
      scene.add(string);
    });

    // "Happy Birthday" text on wall
    const textCanvas = document.createElement('canvas');
    const textContext = textCanvas.getContext('2d');
    if (textContext) {
      textCanvas.width = 2048;
      textCanvas.height = 512;
      textContext.fillStyle = 'transparent';
      textContext.fillRect(0, 0, textCanvas.width, textCanvas.height);
      textContext.font = 'bold 120px Arial';
      textContext.fillStyle = '#ff1493';
      textContext.strokeStyle = '#ffd700';
      textContext.lineWidth = 8;
      textContext.textAlign = 'center';
      textContext.textBaseline = 'middle';
      textContext.strokeText('HAPPY BIRTHDAY!', textCanvas.width / 2, textCanvas.height / 2);
      textContext.fillText('HAPPY BIRTHDAY!', textCanvas.width / 2, textCanvas.height / 2);
      
      const wallTextTexture = new THREE.CanvasTexture(textCanvas);
      const wallTextGeometry = new THREE.PlaneGeometry(10, 2.5);
      const wallTextMaterial = new THREE.MeshStandardMaterial({ 
        map: wallTextTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      const wallText = new THREE.Mesh(wallTextGeometry, wallTextMaterial);
      wallText.position.set(0, 6, -7.8);
      scene.add(wallText);
    }

    // Confetti particles (celebration effect)
    const confettiGeometry = new THREE.BufferGeometry();
    const confettiCount = 500;
    const confettiPosArray = new Float32Array(confettiCount * 3);
    const confettiColors = new Float32Array(confettiCount * 3);
    const confettiVelocities: number[] = [];

    for (let i = 0; i < confettiCount; i++) {
      confettiPosArray[i * 3] = (Math.random() - 0.5) * 20;
      confettiPosArray[i * 3 + 1] = Math.random() * 15 + 5;
      confettiPosArray[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        confettiColors[i * 3] = 1;
        confettiColors[i * 3 + 1] = 0.7;
        confettiColors[i * 3 + 2] = 0.8; // Pink
      } else if (colorChoice < 0.66) {
        confettiColors[i * 3] = 1;
        confettiColors[i * 3 + 1] = 0.84;
        confettiColors[i * 3 + 2] = 0; // Gold
      } else {
        confettiColors[i * 3] = 0.58;
        confettiColors[i * 3 + 1] = 0.44;
        confettiColors[i * 3 + 2] = 0.86; // Purple
      }

      confettiVelocities.push(Math.random() * 0.02 + 0.01);
    }

    confettiGeometry.setAttribute('position', new THREE.BufferAttribute(confettiPosArray, 3));
    confettiGeometry.setAttribute('color', new THREE.BufferAttribute(confettiColors, 3));
    const confettiMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 1,
    });
    const confettiMesh = new THREE.Points(confettiGeometry, confettiMaterial);
    scene.add(confettiMesh);

    // Ambient particles
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
    let animationTime = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      animationTime += 0.016;

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

      // Animate confetti falling
      const positions = confettiGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < confettiCount; i++) {
        positions[i * 3 + 1] -= confettiVelocities[i];
        
        // Reset confetti when it falls below ground
        if (positions[i * 3 + 1] < -2) {
          positions[i * 3 + 1] = 20;
          positions[i * 3] = (Math.random() - 0.5) * 20;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
      }
      confettiGeometry.attributes.position.needsUpdate = true;

      // Fade out confetti after 5 seconds
      if (animationTime > 5 && confettiMaterial.opacity > 0) {
        confettiMaterial.opacity -= 0.01;
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