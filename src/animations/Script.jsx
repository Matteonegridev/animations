import { useRef, useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import "./script.css";
import { degToRad } from "three/src/math/MathUtils.js";

function Animation() {
  const canvas = useRef(null);

  useEffect(() => {
    if (!canvas.current) return;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);
    scene.add(camera);

    // TEXTURES
    const textureLoader = new THREE.TextureLoader();

    // fog texture:
    const floorFog = textureLoader.load("./assets/floor/alpha.jpg");

    // floor textures:
    const floorRockColorTexture = textureLoader.load(
      "./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg"
    );
    const floorRockNormalTexture = textureLoader.load(
      "./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg"
    );
    const floorRockARMTexture = textureLoader.load(
      "./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg"
    );
    const floorRockDisplacementTexture = textureLoader.load(
      "./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg"
    );

    floorRockColorTexture.colorSpace = THREE.SRGBColorSpace;

    floorRockColorTexture.repeat.set(8, 8);
    floorRockARMTexture.repeat.set(8, 8);
    floorRockDisplacementTexture.repeat.set(8, 8);
    floorRockNormalTexture.repeat.set(8, 8);

    floorRockColorTexture.wrapS = THREE.RepeatWrapping;
    floorRockColorTexture.wrapT = THREE.RepeatWrapping;
    floorRockNormalTexture.wrapS = THREE.RepeatWrapping;
    floorRockNormalTexture.wrapT = THREE.RepeatWrapping;
    floorRockARMTexture.wrapS = THREE.RepeatWrapping;
    floorRockARMTexture.wrapT = THREE.RepeatWrapping;
    floorRockDisplacementTexture.wrapS = THREE.RepeatWrapping;
    floorRockDisplacementTexture.wrapT = THREE.RepeatWrapping;

    // door texture:
    const doorTexture = textureLoader.load("./assets/door/color.jpg");
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    const doorAlphaTexture = textureLoader.load("./assets/door/alpha.jpg");
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    const doorHeightTexture = textureLoader.load("./assets/door/height.jpg");
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    const doorAoTexture = textureLoader.load("./assets/door/ambientOcclusion.jpg");
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    const doorMetalnessTexture = textureLoader.load("./assets/door/metalness.jpg");
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    const doorNormalTexture = textureLoader.load("./assets/door/normal.jpg");
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    const doorRoughnessTexture = textureLoader.load("./assets/door/roughness.jpg");
    doorTexture.colorSpace = THREE.SRGBColorSpace;

    // wall texure:
    const wallColorTexure = textureLoader.load("./assets/wall/castle_brick_broken_06_diff_1k.jpg");
    wallColorTexure.colorSpace = THREE.SRGBColorSpace;
    const wallARMTexure = textureLoader.load("./assets/wall/castle_brick_broken_06_arm_1k.jpg");
    const wallNormalTexure = textureLoader.load("./assets/wall/castle_brick_broken_06_nor_gl_1k.jpg");

    // graves texture:
    const graveARMTexture = textureLoader.load("./assets/grave/plastered_stone_wall_arm_1k.jpg");
    const graveColorTexture = textureLoader.load("./assets/grave/plastered_stone_wall_diff_1k.jpg");
    const graveNormalTexture = textureLoader.load("./assets/grave/plastered_stone_wall_nor_gl_1k.jpg");
    graveColorTexture.colorSpace = THREE.SRGBColorSpace;

    // roof texture:
    const roofARMTexture = textureLoader.load("./assets/roof/roof_slates_02_arm_1k.jpg");
    const roofColorTexture = textureLoader.load("./assets/roof/roof_slates_02_diff_1k.jpg");
    const roofNormalTexture = textureLoader.load("./assets/roof/roof_slates_02_nor_gl_1k.jpg");
    roofColorTexture.colorSpace = THREE.SRGBColorSpace;
    roofColorTexture.repeat.set(3, 1);
    roofARMTexture.repeat.set(3, 1);
    roofNormalTexture.repeat.set(3, 1);

    roofColorTexture.wrapS = THREE.RepeatWrapping;
    roofARMTexture.wrapS = THREE.RepeatWrapping;
    roofNormalTexture.wrapS = THREE.RepeatWrapping;

    // bushes textures:
    const bushARMTexture = textureLoader.load("./assets/bush/leaves_forest_ground_arm_1k.jpg");
    const bushColorTexture = textureLoader.load("./assets/bush/leaves_forest_ground_diff_1k.jpg");
    const bushNormalTexture = textureLoader.load("./assets/bush/leaves_forest_ground_nor_gl_1k.jpg");
    bushColorTexture.colorSpace = THREE.SRGBColorSpace;
    bushColorTexture.repeat.set(2, 1);
    bushARMTexture.repeat.set(2, 1);
    bushNormalTexture.repeat.set(2, 1);

    bushColorTexture.wrapS = THREE.RepeatWrapping;
    bushARMTexture.wrapS = THREE.RepeatWrapping;
    bushNormalTexture.wrapS = THREE.RepeatWrapping;

    // GEOMETRY
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20, 100, 100),
      new THREE.MeshStandardMaterial({
        alphaMap: floorFog,
        transparent: true,
        map: floorRockColorTexture,
        aoMap: floorRockARMTexture,
        roughnessMap: floorRockARMTexture,
        metalnessMap: floorRockARMTexture,
        normalMap: floorRockNormalTexture,
        displacementMap: floorRockDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -0.2,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // HOUSE
    const house = new THREE.Group();
    scene.add(house);

    // WALLS
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: wallColorTexure,
        aoMap: wallARMTexure,
        metalnessMap: wallARMTexure,
        roughnessMap: wallARMTexure,
        normalMap: wallNormalTexure,
      })
    );
    walls.position.y = 1.25;
    house.add(walls);

    // ROOF
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 1.5, 4),
      new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        aoMap: roofARMTexture,
        normalMap: roofNormalTexture,
      })
    );
    roof.position.y = 2.5 + 0.75;
    roof.rotation.y = degToRad(45);
    house.add(roof);

    // DOOR
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 2, 100, 100),
      new THREE.MeshStandardMaterial({
        map: doorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAoTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        displacementBias: 0.04,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
        normalMap: doorNormalTexture,
      })
    );
    door.position.y = 1;
    door.position.z = 2 + 0.001;
    house.add(door);

    // BUSHES
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({
      map: bushColorTexture,
      aoMap: bushARMTexture,
      metalnessMap: bushARMTexture,
      roughnessMap: bushARMTexture,
      normalMap: bushNormalTexture,
    });

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.setScalar(0.5);
    bush1.position.set(0.8, 0.2, 2.2);
    bush1.rotation.x = -0.75;
    house.add(bush1);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.setScalar(0.25);
    bush2.position.set(1.4, 0.1, 2.1);
    bush2.rotation.x = -0.75;
    house.add(bush2);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.setScalar(0.4);
    bush3.position.set(-0.8, 0.1, 2.2);
    bush3.rotation.x = -0.75;
    house.add(bush3);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.setScalar(0.15);
    bush4.position.set(-1, 0.05, 2.6);
    bush4.rotation.x = -0.75;
    house.add(bush4);

    // GRAVES
    const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({
      map: graveColorTexture,
      metalnessMap: graveARMTexture,
      roughnessMap: graveARMTexture,
      aoMap: graveARMTexture,
      normalMap: graveNormalTexture,
    });
    const gravesGroup = new THREE.Group();
    scene.add(gravesGroup);

    // add graves and randomize their angle:
    for (let i = 0; i <= 30; i++) {
      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 4;
      const x = Math.sin(angle) * radius;
      const y = Math.random() * 0.3;
      const z = Math.cos(angle) * radius;
      grave.position.set(x, y, z);
      // rotation:
      grave.rotation.x = (Math.random() - 0.5) * 0.4;
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      gravesGroup.add(grave);
    }

    // LIGHT
    // ambient light:
    const ambientLight = new THREE.AmbientLight(0x86cdff, 0.275);
    scene.add(ambientLight);
    // directional light:
    const directionalLight = new THREE.DirectionalLight(0x86cdff, 1);
    directionalLight.position.set(10, 8, -8);
    const dirLightCameraHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
    scene.add(dirLightCameraHelper);
    scene.add(directionalLight);
    // door light :
    const doorLight = new THREE.PointLight(0xff7d46, 2);
    doorLight.position.set(0, 2.2, 2.5);
    house.add(doorLight);

    const controls = new OrbitControls(camera, canvas.current);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    // RENDER
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    animate();
  });
  return (
    <>
      <canvas ref={canvas}></canvas>
    </>
  );
}

export default Animation;
