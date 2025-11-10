import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface GiftBoxProps {
  onOpen: () => void;
  isOpened: boolean;
}

export const GiftBox = ({ onOpen, isOpened }: GiftBoxProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffb6c1, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffd700, 0.8, 100);
    pointLight2.position.set(-5, 5, -5);
    scene.add(pointLight2);

    // Gift box body
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshPhongMaterial({
      color: 0xd4a5a5,
      shininess: 100,
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box);

    // Ribbon horizontal
    const ribbonHGeometry = new THREE.BoxGeometry(2.1, 0.2, 0.3);
    const ribbonMaterial = new THREE.MeshPhongMaterial({
      color: 0xc77d7e,
      shininess: 100,
    });
    const ribbonH = new THREE.Mesh(ribbonHGeometry, ribbonMaterial);
    scene.add(ribbonH);

    // Ribbon vertical
    const ribbonVGeometry = new THREE.BoxGeometry(0.3, 2.1, 0.3);
    const ribbonV = new THREE.Mesh(ribbonVGeometry, ribbonMaterial);
    scene.add(ribbonV);

    // Lid
    const lidGeometry = new THREE.BoxGeometry(2.2, 0.3, 2.2);
    const lidMaterial = new THREE.MeshPhongMaterial({
      color: 0xe6b8b8,
      shininess: 100,
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 1.15;
    scene.add(lid);

    // Bow on top
    const bowGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const bow = new THREE.Mesh(bowGeometry, ribbonMaterial);
    bow.position.y = 1.5;
    bow.scale.set(1, 0.5, 1);
    scene.add(bow);

    camera.position.z = 5;
    camera.position.y = 1;

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
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

    // Animation
    let animationProgress = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      if (!isOpened) {
        box.rotation.y += 0.005;
        lid.rotation.y += 0.005;
        ribbonH.rotation.y += 0.005;
        ribbonV.rotation.y += 0.005;
        bow.rotation.y += 0.005;

        // Floating effect
        box.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        lid.position.y = 1.15 + Math.sin(Date.now() * 0.001) * 0.1;
        bow.position.y = 1.5 + Math.sin(Date.now() * 0.001) * 0.1;
      } else {
        // Opening animation
        if (animationProgress < 1) {
          animationProgress += 0.02;
          lid.position.y = 1.15 + animationProgress * 2;
          lid.rotation.x = animationProgress * Math.PI * 0.3;
          bow.position.y = 1.5 + animationProgress * 2;
          bow.rotation.x = animationProgress * Math.PI * 0.3;
        }
      }

      // Hover effect
      if (isHovered && !isOpened) {
        box.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
        lid.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      } else {
        box.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        lid.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }

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
      mountRef.current?.removeChild(renderer.domElement);
      scene.clear();
      renderer.dispose();
    };
  }, [isOpened, isHovered]);

  return (
    <div
      ref={mountRef}
      className="w-full h-screen cursor-pointer"
      onClick={onOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};
