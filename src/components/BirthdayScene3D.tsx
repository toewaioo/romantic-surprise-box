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
    scene.background = new THREE.Color(0xfff9f9);
    scene.fog = new THREE.Fog(0xfff9f9, 15, 35);
    
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 20, 8);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xffe4e1, 2, 25);
    pointLight1.position.set(-8, 8, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffd4e5, 2, 25);
    pointLight2.position.set(8, 8, 5);
    scene.add(pointLight2);

    const rimLight = new THREE.DirectionalLight(0xffc0e8, 0.6);
    rimLight.position.set(-10, 5, -10);
    scene.add(rimLight);

    // Floor with gradient effect
    const floorGeometry = new THREE.PlaneGeometry(35, 35, 50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xfff0f5,
      roughness: 0.6,
      metalness: 0.15,
      envMapIntensity: 0.5
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Elegant Table
    const tableTopGeometry = new THREE.BoxGeometry(9, 0.4, 9);
    const tableMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf5f5dc,
      roughness: 0.3,
      metalness: 0.4,
      envMapIntensity: 1
    });
    const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial);
    tableTop.position.y = 0;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    scene.add(tableTop);

    // Elegant Table legs with carved design
    const legGeometry = new THREE.CylinderGeometry(0.12, 0.18, 2, 32);
    const legPositions = [
      [-3.5, -1, -3.5],
      [3.5, -1, -3.5],
      [-3.5, -1, 3.5],
      [3.5, -1, 3.5]
    ];
    
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeometry, tableMaterial);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      scene.add(leg);
      
      // Decorative ring on leg
      const ringGeometry = new THREE.TorusGeometry(0.2, 0.03, 16, 32);
      const ring = new THREE.Mesh(ringGeometry, tableMaterial);
      ring.position.set(x, y + 0.5, z);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    });

    // Bottom cake layer with smooth edges
    const cakeBaseGeometry = new THREE.CylinderGeometry(2, 2, 1.4, 64);
    const cakeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xfffaf0,
      roughness: 0.4,
      metalness: 0.1,
      envMapIntensity: 0.8
    });
    const cakeBase = new THREE.Mesh(cakeBaseGeometry, cakeMaterial);
    cakeBase.position.set(0, 0.85, 0);
    cakeBase.castShadow = true;
    cakeBase.receiveShadow = true;
    scene.add(cakeBase);

    // Elegant decorative rosettes on bottom layer
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const rosetteGeometry = new THREE.SphereGeometry(0.15, 32, 32);
      const rosetteMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffc0cb,
        roughness: 0.2,
        metalness: 0.4,
        emissive: 0xffc0cb,
        emissiveIntensity: 0.1
      });
      const rosette = new THREE.Mesh(rosetteGeometry, rosetteMaterial);
      rosette.position.set(
        Math.cos(angle) * 2,
        1.55,
        Math.sin(angle) * 2
      );
      rosette.scale.set(1, 0.8, 1);
      rosette.castShadow = true;
      scene.add(rosette);
      
      // Pearl decoration
      const pearlGeometry = new THREE.SphereGeometry(0.06, 16, 16);
      const pearlMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.8
      });
      const pearl = new THREE.Mesh(pearlGeometry, pearlMaterial);
      pearl.position.set(
        Math.cos(angle) * 2,
        1.6,
        Math.sin(angle) * 2
      );
      pearl.castShadow = true;
      scene.add(pearl);
    }

    // Elegant bottom frosting layer with shimmer
    const frostingGeometry = new THREE.CylinderGeometry(2.05, 2.05, 0.25, 64);
    const frostingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffd4e5,
      roughness: 0.15,
      metalness: 0.5,
      emissive: 0xffd4e5,
      emissiveIntensity: 0.15
    });
    const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial);
    frosting.position.set(0, 1.67, 0);
    frosting.castShadow = true;
    scene.add(frosting);

    // Middle cake layer with elegant proportions
    const cakeLayer2Geometry = new THREE.CylinderGeometry(1.5, 1.5, 1.2, 64);
    const cakeLayer2 = new THREE.Mesh(cakeLayer2Geometry, cakeMaterial);
    cakeLayer2.position.set(0, 2.5, 0);
    cakeLayer2.castShadow = true;
    cakeLayer2.receiveShadow = true;
    scene.add(cakeLayer2);

    // Middle decorative rosettes
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const rosetteGeometry = new THREE.SphereGeometry(0.13, 32, 32);
      const rosetteMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffe4f0,
        roughness: 0.2,
        metalness: 0.4,
        emissive: 0xffe4f0,
        emissiveIntensity: 0.1
      });
      const rosette = new THREE.Mesh(rosetteGeometry, rosetteMaterial);
      rosette.position.set(
        Math.cos(angle) * 1.5,
        3.1,
        Math.sin(angle) * 1.5
      );
      rosette.scale.set(1, 0.8, 1);
      rosette.castShadow = true;
      scene.add(rosette);
    }

    // Middle frosting with shimmer
    const middleFrostingGeometry = new THREE.CylinderGeometry(1.55, 1.55, 0.22, 64);
    const middleFrosting = new THREE.Mesh(middleFrostingGeometry, frostingMaterial);
    middleFrosting.position.set(0, 3.21, 0);
    middleFrosting.castShadow = true;
    scene.add(middleFrosting);

    // Top cake layer with elegant design
    const cakeLayer3Geometry = new THREE.CylinderGeometry(1.1, 1.1, 0.9, 64);
    const cakeLayer3 = new THREE.Mesh(cakeLayer3Geometry, cakeMaterial);
    cakeLayer3.position.set(0, 3.87, 0);
    cakeLayer3.castShadow = true;
    cakeLayer3.receiveShadow = true;
    scene.add(cakeLayer3);

    // Top decorative rosettes with elegant spacing
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const rosetteGeometry = new THREE.SphereGeometry(0.11, 32, 32);
      const rosetteMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xfff0f8,
        roughness: 0.2,
        metalness: 0.4,
        emissive: 0xfff0f8,
        emissiveIntensity: 0.12
      });
      const rosette = new THREE.Mesh(rosetteGeometry, rosetteMaterial);
      rosette.position.set(
        Math.cos(angle) * 1.1,
        4.32,
        Math.sin(angle) * 1.1
      );
      rosette.scale.set(1, 0.8, 1);
      rosette.castShadow = true;
      scene.add(rosette);
    }

    // Top frosting with elegant finish
    const topFrostingGeometry = new THREE.CylinderGeometry(1.15, 1.15, 0.18, 64);
    const topFrosting = new THREE.Mesh(topFrostingGeometry, frostingMaterial);
    topFrosting.position.set(0, 4.41, 0);
    topFrosting.castShadow = true;
    scene.add(topFrosting);

    // Elegant birthday name plaque on cake
    const nameCanvas = document.createElement('canvas');
    const nameContext = nameCanvas.getContext('2d');
    if (nameContext) {
      nameCanvas.width = 1024;
      nameCanvas.height = 256;
      
      // Create gradient background
      const gradient = nameContext.createLinearGradient(0, 0, nameCanvas.width, 0);
      gradient.addColorStop(0, '#ffe4f0');
      gradient.addColorStop(0.5, '#ffd4e5');
      gradient.addColorStop(1, '#ffe4f0');
      nameContext.fillStyle = gradient;
      nameContext.fillRect(0, 0, nameCanvas.width, nameCanvas.height);
      
      // Add elegant text with shadow
      nameContext.font = 'bold italic 90px Georgia';
      nameContext.fillStyle = '#8b0040';
      nameContext.strokeStyle = '#ffd700';
      nameContext.lineWidth = 3;
      nameContext.textAlign = 'center';
      nameContext.textBaseline = 'middle';
      nameContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
      nameContext.shadowBlur = 10;
      nameContext.shadowOffsetX = 3;
      nameContext.shadowOffsetY = 3;
      nameContext.strokeText(birthdayName, nameCanvas.width / 2, nameCanvas.height / 2);
      nameContext.fillText(birthdayName, nameCanvas.width / 2, nameCanvas.height / 2);
      
      const nameTexture = new THREE.CanvasTexture(nameCanvas);
      const nameGeometry = new THREE.PlaneGeometry(2.8, 0.7);
      const nameMaterial = new THREE.MeshStandardMaterial({ 
        map: nameTexture,
        transparent: true,
        roughness: 0.3,
        metalness: 0.3
      });
      const namePlaque = new THREE.Mesh(nameGeometry, nameMaterial);
      namePlaque.position.set(0, 2.5, 1.52);
      namePlaque.castShadow = true;
      scene.add(namePlaque);
      
      // Frame for the plaque
      const frameGeometry = new THREE.BoxGeometry(2.9, 0.05, 0.05);
      const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        roughness: 0.2,
        metalness: 0.8
      });
      [-0.4, 0.4].forEach(yOffset => {
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 2.5 + yOffset, 1.54);
        scene.add(frame);
      });
    }

    // Beautiful decorative strawberries and fruits on top
    const fruitPositions = [
      [0.55, 4.5, 0.35],
      [-0.45, 4.5, -0.55],
      [0.65, 4.5, -0.25],
      [-0.55, 4.5, 0.45],
      [0, 4.5, -0.6],
      [0, 4.5, 0.6]
    ];
    
    fruitPositions.forEach(([x, y, z], index) => {
      const strawberryGeometry = new THREE.SphereGeometry(0.14, 32, 32);
      const strawberryMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff1744,
        roughness: 0.4,
        metalness: 0.2,
        emissive: 0xff1744,
        emissiveIntensity: 0.1
      });
      const strawberry = new THREE.Mesh(strawberryGeometry, strawberryMaterial);
      strawberry.scale.set(1, 1.3, 1);
      strawberry.position.set(x, y, z);
      strawberry.castShadow = true;
      scene.add(strawberry);
      
      // Detailed strawberry leaf
      const leafGeometry = new THREE.ConeGeometry(0.1, 0.08, 8);
      const leafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2e7d32,
        roughness: 0.6,
        metalness: 0.1
      });
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.set(x, y + 0.17, z);
      leaf.rotation.x = Math.PI;
      leaf.castShadow = true;
      scene.add(leaf);
      
      // Add sparkle on fruit
      const sparkleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
      const sparkleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
      sparkle.position.set(x + 0.05, y + 0.08, z + 0.05);
      scene.add(sparkle);
    });

    // Elegant candles with realistic flames
    const candles: THREE.Mesh[] = [];
    const flames: THREE.Mesh[] = [];
    const candlePositions = [
      [0, 4.5, 0],
      [-0.35, 4.5, 0],
      [0.35, 4.5, 0]
    ];

    candlePositions.forEach(([x, y, z]) => {
      // Striped elegant candle
      const candleGeometry = new THREE.CylinderGeometry(0.09, 0.09, 0.7, 32);
      const candleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd4e5,
        roughness: 0.3,
        metalness: 0.5,
        emissive: 0xffd4e5,
        emissiveIntensity: 0.1
      });
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      candle.position.set(x, y + 0.35, z);
      candle.castShadow = true;
      scene.add(candle);
      candles.push(candle);

      // Gold stripe on candle
      const stripeGeometry = new THREE.CylinderGeometry(0.095, 0.095, 0.1, 32);
      const stripeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        roughness: 0.2,
        metalness: 0.8
      });
      const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
      stripe.position.set(x, y + 0.35, z);
      scene.add(stripe);

      // Realistic flame with multiple layers
      const flameGeometry = new THREE.SphereGeometry(0.12, 32, 32);
      const flameMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff4500,
        transparent: true,
        opacity: 1
      });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.scale.set(0.7, 1.4, 0.7);
      flame.position.set(x, y + 0.82, z);
      scene.add(flame);
      flames.push(flame);

      // Inner flame (brighter)
      const innerFlameGeometry = new THREE.SphereGeometry(0.08, 32, 32);
      const innerFlameMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffff00,
        transparent: true,
        opacity: 0.9
      });
      const innerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
      innerFlame.scale.set(0.8, 1.3, 0.8);
      innerFlame.position.set(x, y + 0.82, z);
      scene.add(innerFlame);
      flames.push(innerFlame);

      // Outer glow
      const glowGeometry = new THREE.SphereGeometry(0.18, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffa500,
        transparent: true,
        opacity: 0.3
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.set(x, y + 0.82, z);
      scene.add(glow);
      flames.push(glow);

      // Dynamic candle light with higher intensity
      const candleLight = new THREE.PointLight(0xff8800, 1.5, 4);
      candleLight.position.set(x, y + 0.82, z);
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

    // Elegant Wish Envelope on table
    const envelopeGroup = new THREE.Group();
    
    // Premium envelope body with texture
    const envelopeGeometry = new THREE.BoxGeometry(1.2, 0.03, 0.85);
    const envelopeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xfffaf0,
      roughness: 0.4,
      metalness: 0.3,
      envMapIntensity: 0.7
    });
    const envelope = new THREE.Mesh(envelopeGeometry, envelopeMaterial);
    envelope.castShadow = true;
    envelopeGroup.add(envelope);

    // Elegant envelope flap
    const flapGeometry = new THREE.BufferGeometry();
    const flapVertices = new Float32Array([
      -0.6, 0.015, -0.425,
      0.6, 0.015, -0.425,
      0, 0.015, 0.425,
    ]);
    flapGeometry.setAttribute('position', new THREE.BufferAttribute(flapVertices, 3));
    flapGeometry.computeVertexNormals();
    const flapMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffe4f0,
      side: THREE.DoubleSide,
      roughness: 0.3,
      metalness: 0.4
    });
    const flap = new THREE.Mesh(flapGeometry, flapMaterial);
    flap.castShadow = true;
    envelopeGroup.add(flap);

    // Elegant heart seal with glow
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.12, -0.18, -0.12, -0.18, 0);
    heartShape.bezierCurveTo(-0.18, 0.06, -0.12, 0.12, 0, 0.18);
    heartShape.bezierCurveTo(0.12, 0.12, 0.18, 0.06, 0.18, 0);
    heartShape.bezierCurveTo(0.18, -0.12, 0, -0.12, 0, 0);
    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 5
    });
    const heartMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff1470,
      roughness: 0.2,
      metalness: 0.6,
      emissive: 0xff1470,
      emissiveIntensity: 0.2
    });
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.position.set(0, 0.04, 0);
    heart.rotation.x = -Math.PI / 2;
    heart.castShadow = true;
    envelopeGroup.add(heart);

    // Gold trim on envelope edges
    const trimGeometry = new THREE.BoxGeometry(1.22, 0.01, 0.01);
    const trimMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffd700,
      roughness: 0.2,
      metalness: 0.9
    });
    [-0.43, 0.43].forEach(zPos => {
      const trim = new THREE.Mesh(trimGeometry, trimMaterial);
      trim.position.set(0, 0.02, zPos);
      envelopeGroup.add(trim);
    });

    envelopeGroup.position.set(-3.2, 0.25, 2.8);
    envelopeGroup.rotation.y = Math.PI / 5;
    envelopeGroup.rotation.z = -0.05;
    scene.add(envelopeGroup);

    // Beautiful floating balloons with shine
    const balloonData = [
      [-10, 5, -8, 0xff1493, 0.65], // Hot pink
      [-7, 6.5, -8, 0xffd700, 0.7], // Gold
      [-4, 5.5, -8, 0xff69b4, 0.6], // Light pink
      [-1, 7, -8, 0xda70d6, 0.75], // Orchid
      [2, 6, -8, 0xffe4e1, 0.65], // Misty rose
      [5, 5.5, -8, 0xffb6c1, 0.7], // Light pink
      [8, 6.5, -8, 0xffc0cb, 0.68], // Pink
      [11, 5, -8, 0xff1493, 0.72], // Deep pink
    ];

    balloonData.forEach(([x, y, z, color, scale]) => {
      // Realistic balloon with highlight
      const balloonGeometry = new THREE.SphereGeometry(0.55, 64, 64);
      balloonGeometry.scale(1, 1.3, 1);
      const balloonMaterial = new THREE.MeshStandardMaterial({ 
        color: color as number,
        roughness: 0.2,
        metalness: 0.7,
        emissive: color as number,
        emissiveIntensity: 0.15,
        envMapIntensity: 1.2
      });
      const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
      balloon.position.set(x, y, z);
      balloon.scale.setScalar(scale as number);
      balloon.castShadow = true;
      scene.add(balloon);

      // Highlight on balloon
      const highlightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const highlightMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.6
      });
      const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
      highlight.position.set(x - 0.2, y + 0.3, z + 0.4);
      highlight.scale.setScalar(scale as number);
      scene.add(highlight);

      // Elegant ribbon string
      const stringGeometry = new THREE.CylinderGeometry(0.012, 0.012, 2.5, 16);
      const stringMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        roughness: 0.4,
        metalness: 0.6
      });
      const string = new THREE.Mesh(stringGeometry, stringMaterial);
      string.position.set(x, y - 1.9, z);
      scene.add(string);

      // String knot at bottom
      const knotGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const knot = new THREE.Mesh(knotGeometry, stringMaterial);
      knot.position.set(x, y - 3.15, z);
      scene.add(knot);
    });

    // Elegant "Happy Birthday" banner on wall
    const bannerCanvas = document.createElement('canvas');
    const bannerContext = bannerCanvas.getContext('2d');
    if (bannerContext) {
      bannerCanvas.width = 2560;
      bannerCanvas.height = 640;
      
      // Transparent background
      bannerContext.clearRect(0, 0, bannerCanvas.width, bannerCanvas.height);
      
      // Add decorative elements
      bannerContext.font = 'bold italic 140px Georgia, serif';
      bannerContext.textAlign = 'center';
      bannerContext.textBaseline = 'middle';
      
      // Text shadow for depth
      bannerContext.shadowColor = 'rgba(255, 20, 147, 0.5)';
      bannerContext.shadowBlur = 20;
      bannerContext.shadowOffsetX = 5;
      bannerContext.shadowOffsetY = 5;
      
      // Gold stroke
      bannerContext.strokeStyle = '#ffd700';
      bannerContext.lineWidth = 12;
      bannerContext.lineJoin = 'round';
      bannerContext.strokeText('HAPPY BIRTHDAY!', bannerCanvas.width / 2, bannerCanvas.height / 2);
      
      // Gradient fill
      const textGradient = bannerContext.createLinearGradient(0, 0, 0, bannerCanvas.height);
      textGradient.addColorStop(0, '#ff1493');
      textGradient.addColorStop(0.5, '#ff69b4');
      textGradient.addColorStop(1, '#ff1493');
      bannerContext.fillStyle = textGradient;
      bannerContext.fillText('HAPPY BIRTHDAY!', bannerCanvas.width / 2, bannerCanvas.height / 2);
      
      const bannerTexture = new THREE.CanvasTexture(bannerCanvas);
      const bannerGeometry = new THREE.PlaneGeometry(12, 3);
      const bannerMaterial = new THREE.MeshStandardMaterial({ 
        map: bannerTexture,
        transparent: true,
        side: THREE.DoubleSide,
        emissive: 0xff1493,
        emissiveIntensity: 0.1
      });
      const banner = new THREE.Mesh(bannerGeometry, bannerMaterial);
      banner.position.set(0, 7.5, -7.8);
      scene.add(banner);
      
      // Decorative banner frame lights
      for (let i = 0; i < 10; i++) {
        const lightX = -5.5 + (i * 1.2);
        const lightGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const lightMaterial = new THREE.MeshStandardMaterial({ 
          color: i % 2 === 0 ? 0xffd700 : 0xff1493,
          emissive: i % 2 === 0 ? 0xffd700 : 0xff1493,
          emissiveIntensity: 0.8,
          roughness: 0.3,
          metalness: 0.7
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(lightX, 9, -7.7);
        scene.add(light);
        
        const bottomLight = light.clone();
        bottomLight.position.set(lightX, 6, -7.7);
        scene.add(bottomLight);
      }
    }

    // Luxurious confetti celebration effect
    const confettiGeometry = new THREE.BufferGeometry();
    const confettiCount = 800;
    const confettiPosArray = new Float32Array(confettiCount * 3);
    const confettiColors = new Float32Array(confettiCount * 3);
    const confettiVelocities: number[] = [];

    for (let i = 0; i < confettiCount; i++) {
      confettiPosArray[i * 3] = (Math.random() - 0.5) * 25;
      confettiPosArray[i * 3 + 1] = Math.random() * 18 + 8;
      confettiPosArray[i * 3 + 2] = (Math.random() - 0.5) * 25;

      const colorChoice = Math.random();
      if (colorChoice < 0.25) {
        confettiColors[i * 3] = 1;
        confettiColors[i * 3 + 1] = 0.08;
        confettiColors[i * 3 + 2] = 0.58; // Hot pink
      } else if (colorChoice < 0.5) {
        confettiColors[i * 3] = 1;
        confettiColors[i * 3 + 1] = 0.84;
        confettiColors[i * 3 + 2] = 0; // Gold
      } else if (colorChoice < 0.75) {
        confettiColors[i * 3] = 1;
        confettiColors[i * 3 + 1] = 0.75;
        confettiColors[i * 3 + 2] = 0.93; // Light pink
      } else {
        confettiColors[i * 3] = 0.85;
        confettiColors[i * 3 + 1] = 0.44;
        confettiColors[i * 3 + 2] = 0.84; // Orchid
      }

      confettiVelocities.push(Math.random() * 0.025 + 0.015);
    }

    confettiGeometry.setAttribute('position', new THREE.BufferAttribute(confettiPosArray, 3));
    confettiGeometry.setAttribute('color', new THREE.BufferAttribute(confettiColors, 3));
    const confettiMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true
    });
    const confettiMesh = new THREE.Points(confettiGeometry, confettiMaterial);
    scene.add(confettiMesh);

    // Magical ambient sparkle particles
    const sparkleGeometry = new THREE.BufferGeometry();
    const sparkleCount = 400;
    const sparklePosArray = new Float32Array(sparkleCount * 3);
    const sparkleColors = new Float32Array(sparkleCount * 3);

    for (let i = 0; i < sparkleCount; i++) {
      sparklePosArray[i * 3] = (Math.random() - 0.5) * 30;
      sparklePosArray[i * 3 + 1] = Math.random() * 15;
      sparklePosArray[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      // Soft pink and gold sparkles
      const isGold = Math.random() > 0.5;
      if (isGold) {
        sparkleColors[i * 3] = 1;
        sparkleColors[i * 3 + 1] = 0.84;
        sparkleColors[i * 3 + 2] = 0.5;
      } else {
        sparkleColors[i * 3] = 1;
        sparkleColors[i * 3 + 1] = 0.8;
        sparkleColors[i * 3 + 2] = 0.95;
      }
    }

    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePosArray, 3));
    sparkleGeometry.setAttribute('color', new THREE.BufferAttribute(sparkleColors, 3));
    const sparkleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });
    const particlesMesh = new THREE.Points(sparkleGeometry, sparkleMaterial);
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

      // Animate flames with realistic flicker
      flames.forEach((flame, index) => {
        const time = Date.now() * 0.004;
        const baseY = flame.position.y;
        flame.scale.y = 1.3 + Math.sin(time + index) * 0.25 + Math.sin(time * 3 + index) * 0.1;
        flame.scale.x = 0.7 + Math.sin(time * 2 + index) * 0.15;
        flame.scale.z = 0.7 + Math.cos(time * 2 + index) * 0.15;
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

      // Fade out confetti after 6 seconds
      if (animationTime > 6 && confettiMaterial.opacity > 0) {
        confettiMaterial.opacity -= 0.008;
      }

      // Animate sparkle particles with gentle drift
      particlesMesh.rotation.y += 0.0008;
      const sparklePositions = sparkleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkleCount; i++) {
        sparklePositions[i * 3 + 1] += Math.sin(animationTime * 0.5 + i) * 0.002;
      }
      sparkleGeometry.attributes.position.needsUpdate = true;

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