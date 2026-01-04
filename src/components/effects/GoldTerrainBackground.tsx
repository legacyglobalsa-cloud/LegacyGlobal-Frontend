import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

const GoldTerrainBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const noise3D = createNoise3D();
    let ww = window.innerWidth;
    let wh = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current,
      alpha: true,
    });
    renderer.setSize(ww, wh);
    // Dark background to make gold pop
    renderer.setClearColor(0x050505);

    const scene = new THREE.Scene();
    // Fog matching background
    scene.fog = new THREE.Fog(0x050505, 80, 140);

    const camera = new THREE.PerspectiveCamera(45, ww / wh, 0.1, 200);
    camera.position.x = 70;
    camera.position.y = 30;
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3());

    /* LIGHTS */
    const moonLight = new THREE.PointLight(0xffd700, 2, 150); // Gold light
    scene.add(moonLight);

    let moon: THREE.Mesh;

    function createMoon() {
      const geometry = new THREE.SphereGeometry(8, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: 0xffd700, // Gold
        shininess: 15,
        emissive: 0xb8860b, // Dark Golden Rod
        emissiveIntensity: 0.8,
      });
      moon = new THREE.Mesh(geometry, material);
      moon.position.x = -9;
      moon.position.z = -6.5;
      moon.position.y = 1;
      moon.rotation.y = -1;
      scene.add(moon);
      moonLight.position.copy(moon.position);
      moonLight.position.y += 4;

      const moonLight2 = new THREE.PointLight(0xffd700, 0.6, 150); // Gold light
      scene.add(moonLight2);
      moonLight2.position.x += 20;
      moonLight2.position.y -= 20;
      moonLight2.position.z -= 25;
    }

    function createTerrain() {
      const geometry = new THREE.PlaneGeometry(150, 150, 120, 120);
      const m = new THREE.Matrix4();
      m.makeRotationX(Math.PI * -0.5);
      geometry.applyMatrix4(m);

      const posAttribute = geometry.attributes.position;
      const vertex = new THREE.Vector3();

      for (let i = 0; i < posAttribute.count; i++) {
        vertex.fromBufferAttribute(posAttribute, i);
        const ratio = noise3D(vertex.x * 0.03, vertex.z * 0.03, 0);
        // Adjust height based on noise
        posAttribute.setY(i, ratio * 10);
      }

      geometry.computeVertexNormals();

      const material = new THREE.MeshPhongMaterial({
        color: 0xc5a059, // Metallic Gold
        emissive: 0x332200, // Dark Brown/Gold
        shininess: 30,
        specular: 0xffd700,
      });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);
    }

    const stars = new THREE.Group();
    scene.add(stars);
    const starsLights = new THREE.Group();
    scene.add(starsLights);
    const starsAmount = 20;

    interface Star extends THREE.Mesh {
      vel: THREE.Vector2;
    }

    function createStars() {
      const geometry = new THREE.SphereGeometry(0.3, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xfffacd }); // Lemon Chiffon (Light Gold)

      for (let i = 0; i < starsAmount; i++) {
        const star = new THREE.Mesh(geometry, material) as Star;
        star.position.x = (Math.random() - 0.5) * 150;
        star.position.z = (Math.random() - 0.5) * 150;

        const ratio = noise3D(
          star.position.x * 0.03,
          star.position.z * 0.03,
          0
        );
        star.position.y = ratio * 10 + 0.3;

        stars.add(star);

        const velX =
          (Math.random() + 0.1) * 0.1 * (Math.random() < 0.5 ? -1 : 1);
        const velY =
          (Math.random() + 0.1) * 0.1 * (Math.random() < 0.5 ? -1 : 1);
        star.vel = new THREE.Vector2(velX, velY);

        const starLight = new THREE.PointLight(0xfffacd, 0.8, 3);
        starLight.position.copy(star.position);
        starLight.position.y += 0.5;
        starsLights.add(starLight);
      }
    }

    function updateStar(star: Star, index: number) {
      if (star.position.x < -75) {
        star.position.x = 75;
      }
      if (star.position.x > 75) {
        star.position.x = -75;
      }
      if (star.position.z < -75) {
        star.position.z = 75;
      }
      if (star.position.z > 75) {
        star.position.z = -75;
      }

      star.position.x += star.vel.x;
      star.position.z += star.vel.y;

      const ratio = noise3D(star.position.x * 0.03, star.position.z * 0.03, 0);
      star.position.y = ratio * 10 + 0.3;

      const light = starsLights.children[index];
      if (light) {
        light.position.copy(star.position);
        light.position.y += 0.5;
      }
    }

    function render() {
      // Check if component is still mounted
      if (!canvasRef.current) return;

      requestAnimationFrame(render);
      for (let i = 0; i < starsAmount; i++) {
        updateStar(stars.children[i] as Star, i);
      }
      renderer.render(scene, camera);
    }

    function onResize() {
      ww = window.innerWidth;
      wh = window.innerHeight;
      camera.aspect = ww / wh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, wh);
    }

    createMoon();
    createTerrain();
    createStars();
    const animationId = requestAnimationFrame(render);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
      // Cleanup Three.js resources
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-black pointer-events-none"
    />
  );
};

export default GoldTerrainBackground;
