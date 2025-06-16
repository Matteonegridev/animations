import { useRef, useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import "./script.css";
import { degToRad } from "three/src/math/MathUtils.js";
import { Timer } from "three/addons/misc/Timer.js";
import { Sky } from "three/addons/objects/Sky.js";

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

    // RENDER
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // TEXTURES
    const textureLoader = new THREE.TextureLoader();

    // fog texture:
    const floorFog = textureLoader.load("./assets/floor/alpha.webp");

    // floor textures:
    const floorRockColorTexture = textureLoader.load(
      "./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp"
    );
    const floorRockNormalTexture = textureLoader.load(
      "./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp"
    );
    const floorRockARMTexture = textureLoader.load(
      "./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp"
    );
    const floorRockDisplacementTexture = textureLoader.load(
      "./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp"
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
    const doorTexture = textureLoader.load("./assets/door/color.webp");
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    const doorAlphaTexture = textureLoader.load("./assets/door/alpha.webp");
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    const doorHeightTexture = textureLoader.load("./assets/door/height.webp");
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    const doorAoTexture = textureLoader.load("./assets/door/ambientOcclusion.webp");
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    const doorMetalnessTexture = textureLoader.load("./assets/door/metalness.webp");
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    const doorNormalTexture = textureLoader.load("./assets/door/normal.webp");
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    const doorRoughnessTexture = textureLoader.load("./assets/door/roughness.webp");
    doorTexture.colorSpace = THREE.SRGBColorSpace;

    // wall texure:
    const wallColorTexure = textureLoader.load("./assets/wall/castle_brick_broken_06_diff_1k.webp");
    wallColorTexure.colorSpace = THREE.SRGBColorSpace;
    const wallARMTexure = textureLoader.load("./assets/wall/castle_brick_broken_06_arm_1k.webp");
    const wallNormalTexure = textureLoader.load("./assets/wall/castle_brick_broken_06_nor_gl_1k.webp");

    // graves texture:
    const graveARMTexture = textureLoader.load("./assets/grave/plastered_stone_wall_arm_1k.webp");
    const graveColorTexture = textureLoader.load("./assets/grave/plastered_stone_wall_diff_1k.webp");
    const graveNormalTexture = textureLoader.load("./assets/grave/plastered_stone_wall_nor_gl_1k.webp");
    graveColorTexture.colorSpace = THREE.SRGBColorSpace;

    // roof texture:
    const roofARMTexture = textureLoader.load("./assets/roof/roof_slates_02_arm_1k.webp");
    const roofColorTexture = textureLoader.load("./assets/roof/roof_slates_02_diff_1k.webp");
    const roofNormalTexture = textureLoader.load("./assets/roof/roof_slates_02_nor_gl_1k.webp");
    roofColorTexture.colorSpace = THREE.SRGBColorSpace;
    roofColorTexture.repeat.set(3, 1);
    roofARMTexture.repeat.set(3, 1);
    roofNormalTexture.repeat.set(3, 1);

    roofColorTexture.wrapS = THREE.RepeatWrapping;
    roofARMTexture.wrapS = THREE.RepeatWrapping;
    roofNormalTexture.wrapS = THREE.RepeatWrapping;

    // bushes textures:
    const bushARMTexture = textureLoader.load("./assets/bush/leaves_forest_ground_arm_1k.webp");
    const bushColorTexture = textureLoader.load("./assets/bush/leaves_forest_ground_diff_1k.webp");
    const bushNormalTexture = textureLoader.load("./assets/bush/leaves_forest_ground_nor_gl_1k.webp");
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

    // GHOST
    const ghost1 = new THREE.PointLight(0x8800ff, 6);
    const ghost2 = new THREE.PointLight(0xff0088, 6);
    const ghost3 = new THREE.PointLight(0xff0000, 6);
    scene.add(ghost1);
    scene.add(ghost2);
    scene.add(ghost3);

    // LIGHT
    // ambient light:
    const ambientLight = new THREE.AmbientLight(0x86cdff, 0.175);
    scene.add(ambientLight);
    // directional light:
    const directionalLight = new THREE.DirectionalLight(0x86cdff, 1);
    directionalLight.position.set(10, 8, -8);
    const dirLightCameraHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
    dirLightCameraHelper.visible = false;
    scene.add(dirLightCameraHelper);
    scene.add(directionalLight);
    // door light :
    const doorLight = new THREE.PointLight(0xff7d46, 2);
    doorLight.position.set(0, 2.2, 2.5);
    house.add(doorLight);

    // SHADOWS
    // initiate shadows:
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // cast and receive shadows:
    directionalLight.castShadow = true;
    ghost1.castShadow = true;
    ghost2.castShadow = true;
    ghost3.castShadow = true;
    walls.castShadow = true;
    walls.receiveShadow = true;
    roof.castShadow = true;
    floor.receiveShadow = true;
    console.log(gravesGroup);
    gravesGroup.children.forEach((grave) => {
      grave.castShadow = true;
      grave.receiveShadow = true;
    });
    // mapping shadows:
    directionalLight.shadow.mapSize.width = 256;
    directionalLight.shadow.mapSize.height = 256;
    directionalLight.shadow.camera.top = 8;
    directionalLight.shadow.camera.right = 8;
    directionalLight.shadow.camera.bottom = -8;
    directionalLight.shadow.camera.left = -8;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 20;

    ghost1.shadow.mapSize.width = 256;
    ghost1.shadow.mapSize.height = 256;
    ghost1.shadow.camera.far = 10;
    ghost2.shadow.mapSize.width = 256;
    ghost2.shadow.mapSize.height = 256;
    ghost2.shadow.camera.far = 10;
    ghost3.shadow.mapSize.width = 256;
    ghost3.shadow.mapSize.height = 256;
    ghost3.shadow.camera.far = 10;
    ////////////////////////////////////////////

    // SKY
    // we import it from threejs addons:
    const sky = new Sky();
    sky.scale.setScalar(100);
    scene.add(sky);
    sky.material.uniforms["turbidity"].value = 10;
    sky.material.uniforms["rayleigh"].value = 3;
    sky.material.uniforms["mieCoefficient"].value = 0.1;
    sky.material.uniforms["mieDirectionalG"].value = 0.95;
    sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

    // FOG
    scene.fog = new THREE.FogExp2(0x04343f, 0.1);

    const controls = new OrbitControls(camera, canvas.current);

    // INITIATE CLOCK FOR ANIMATION:
    const timer = new Timer();

    const animate = () => {
      timer.update();
      const elapsedTime = timer.getElapsed();

      const ghost1Angle = elapsedTime * 0.5;
      ghost1.position.x = Math.cos(ghost1Angle) * 4;
      ghost1.position.z = Math.sin(ghost1Angle) * 4;
      ghost1.position.y = Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.34) * 4;

      const ghost2Angle = -elapsedTime * 0.38;
      ghost2.position.x = Math.cos(ghost2Angle) * 5;
      ghost2.position.z = Math.sin(ghost2Angle) * 5;
      ghost2.position.y = Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.34) * 5;

      const ghost3Angle = elapsedTime * 0.23;
      ghost2.position.x = Math.cos(ghost3Angle) * 6;
      ghost2.position.z = Math.sin(ghost3Angle) * 6;
      ghost2.position.y = Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.34) * 6;

      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  });
  return (
    <>
      <canvas ref={canvas}></canvas>
    </>
  );
}

export default Animation;
