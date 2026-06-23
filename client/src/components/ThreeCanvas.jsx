import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreeCanvas({ theme, phase }) {
  const mountRef = useRef(null);
  const phaseRef = useRef(phase);
  const themeRef = useRef(theme);

  // Keep refs updated to avoid re-triggering useEffect on changes
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const currentMount = mountRef.current;
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // SCENE & RENDERER
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(11, 9, 11);

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
    controls.minDistance = 6;
    controls.maxDistance = 22;

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight.position.set(12, 22, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    const d = 10;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    // Dynamic grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x0a192f, 0x0a192f);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // BASE PLANE WITH SHADOW RECEIVER
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // ── COMMON MATERIALS ──
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
    const rebarMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.7, roughness: 0.3 }); // Orange/rust steel
    const steelBeamMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
    const brickMat = new THREE.MeshStandardMaterial({ color: 0xcc5a37, roughness: 0.85 }); // Red brick
    const brickMortarMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.9 });
    const woodPlankMat = new THREE.MeshStandardMaterial({ color: 0x855b32, roughness: 0.9 }); // Scaffolding wood
    const metalPipeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 }); // Scaffold metal
    const plasterMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.8 }); // Grey plaster
    const wallPaintMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }); // Finished white paint
    const navyAccentMat = new THREE.MeshStandardMaterial({ color: 0x0a192f, metalness: 0.2, roughness: 0.3 }); // Navy blue trim
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.5, roughness: 0.1 });
    const yellowAccentMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.4, roughness: 0.3 });
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.95 });

    // ── GROUPS FOR EACH OF THE 6 STAGES ──
    const foundationGroup = new THREE.Group();
    const brickworkGroup = new THREE.Group();
    const slabcastingGroup = new THREE.Group();
    const plasterGroup = new THREE.Group();
    const finishingGroup = new THREE.Group();
    const completedGroup = new THREE.Group();

    scene.add(foundationGroup);
    scene.add(brickworkGroup);
    scene.add(slabcastingGroup);
    scene.add(plasterGroup);
    scene.add(finishingGroup);
    scene.add(completedGroup);

    // ==========================================
    // STAGE 1: FOUNDATION (Foundation pit, rebar cages, excavator)
    // ==========================================
    // Excavation Pit
    const pitGeo = new THREE.BoxGeometry(7.5, 0.5, 6.5);
    const pit = new THREE.Mesh(pitGeo, dirtMat);
    pit.position.y = -0.25;
    pit.receiveShadow = true;
    foundationGroup.add(pit);

    // Excavator vehicle (simplistic box style representation)
    const excavator = new THREE.Group();
    excavator.position.set(-2.5, 0.1, -2.5);
    // Tracks
    const trackL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, 0.35), new THREE.MeshStandardMaterial({ color: 0x111827 }));
    trackL.position.set(0, 0.125, 0.4);
    const trackR = trackL.clone();
    trackR.position.z = -0.4;
    excavator.add(trackL);
    excavator.add(trackR);
    // Body
    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.9), yellowAccentMat);
    bodyMesh.position.y = 0.5;
    bodyMesh.castShadow = true;
    excavator.add(bodyMesh);
    // Arm Group (for animation)
    const armGroup = new THREE.Group();
    armGroup.position.set(0.4, 0.6, 0);
    const boom = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.15, 0.15), yellowAccentMat);
    boom.position.set(0.4, 0.3, 0);
    boom.rotation.z = Math.PI / 4;
    boom.castShadow = true;
    armGroup.add(boom);
    excavator.add(armGroup);
    foundationGroup.add(excavator);

    // Concrete Footings and Rebar Column Cages (9 Grid Points)
    const gridPositions = [
      [-2, -1.8], [-2, 0], [-2, 1.8],
      [0.5, -1.8], [0.5, 0], [0.5, 1.8],
      [3, -1.8], [3, 0], [3, 1.8]
    ];

    gridPositions.forEach(([x, z]) => {
      // Concrete footings base
      const footing = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.8), concreteMat);
      footing.position.set(x, 0.125, z);
      footing.castShadow = true;
      foundationGroup.add(footing);

      // Rebar cages (4 metal rods rising up)
      const rebarCage = new THREE.Group();
      rebarCage.position.set(x, 0.25, z);
      const rodOffsets = [
        [-0.15, -0.15], [-0.15, 0.15],
        [0.15, -0.15], [0.15, 0.15]
      ];
      rodOffsets.forEach(([rx, rz]) => {
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.8), rebarMat);
        rod.position.set(rx, 0.9, rz);
        rod.castShadow = true;
        rebarCage.add(rod);
      });
      // Horizontal ring ties
      for (let h = 0.2; h <= 1.6; h += 0.3) {
        const tie = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.35), rebarMat);
        tie.position.set(0, h, 0);
        rebarCage.add(tie);
      }
      foundationGroup.add(rebarCage);
    });

    // ==========================================
    // STAGE 2: BRICKWORK (Base slab, set columns, red brick walls, wood scaffold)
    // ==========================================
    // Concrete Base Ground Slab
    const groundSlabStage2 = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.15, 5.2), concreteMat);
    groundSlabStage2.position.set(0.5, 0.075, 0);
    groundSlabStage2.receiveShadow = true;
    brickworkGroup.add(groundSlabStage2);

    // Structural Pillars Fully Poured
    gridPositions.forEach(([x, z]) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.3), concreteMat);
      col.position.set(x, 0.9, z);
      col.castShadow = true;
      col.receiveShadow = true;
      brickworkGroup.add(col);
    });

    // Brick Wall Segments (Red Stacked Clay Bricks)
    // To make it look realistic, we render a solid wall block with decorative small brick overlays on ends and borders
    const wallPositions = [
      { start: [-2, -1.8], end: [3, -1.8], height: 1.4 },  // Back wall
      { start: [-2, -1.8], end: [-2, 1.8], height: 1.2 },  // Left wall
      { start: [3, -1.8], end: [3, 0], height: 1.4 },      // Right wall (partial)
      { start: [0.5, 1.8], end: [3, 1.8], height: 0.8 }    // Front wall (half built)
    ];

    wallPositions.forEach(({ start, end, height }) => {
      const [x1, z1] = start;
      const [x2, z2] = end;
      const length = Math.hypot(x2 - x1, z2 - z1);
      const angle = Math.atan2(z2 - z1, x2 - x1);

      // Core brick wall volume
      const wallCore = new THREE.Mesh(new THREE.BoxGeometry(length, height, 0.18), brickMat);
      wallCore.position.set((x1 + x2) / 2, height / 2 + 0.15, (z1 + z2) / 2);
      wallCore.rotation.y = -angle;
      wallCore.castShadow = true;
      wallCore.receiveShadow = true;
      brickworkGroup.add(wallCore);

      // Stacked brick layers texture simulation (Outstanding edges)
      // Render some individual brick blocks on top to make it look active
      for (let bx = -length / 2 + 0.3; bx < length / 2; bx += 0.8) {
        if (Math.random() > 0.4) {
          const topBrick = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.12), brickMat);
          topBrick.position.set(
            (x1 + x2) / 2 + Math.cos(angle) * bx,
            height + 0.19,
            (z1 + z2) / 2 - Math.sin(angle) * bx
          );
          topBrick.rotation.y = -angle;
          topBrick.castShadow = true;
          brickworkGroup.add(topBrick);
        }
      }
    });

    // Wooden Scaffolding (A-frames & Wood Planks)
    const scaffoldW = new THREE.Group();
    scaffoldW.position.set(0.5, 0.15, 2.2);
    // Vertical wood supports
    for (let x = -2; x <= 2.5; x += 1.5) {
      const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0), woodPlankMat);
      postL.position.set(x, 1.0, 0.1);
      const postR = postL.clone();
      postR.position.z = -0.4;
      scaffoldW.add(postL);
      scaffoldW.add(postR);

      // Cross wooden support
      const cross = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.6), woodPlankMat);
      cross.position.set(x, 1.4, -0.1);
      scaffoldW.add(cross);
    }
    // Horizontal wood walk-way planks
    const plank1 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.04, 0.25), woodPlankMat);
    plank1.position.set(0.25, 1.44, -0.1);
    plank1.castShadow = true;
    scaffoldW.add(plank1);
    brickworkGroup.add(scaffoldW);

    // ==========================================
    // STAGE 3: SLAB CASTING (Completed brickwork, ceiling wooden formwork, steel reinforcement mesh, concrete mixer truck)
    // ==========================================
    const slabcastingBuilding = new THREE.Group();
    // Re-use foundation slab and pillars
    const groundSlabStage3 = groundSlabStage2.clone();
    slabcastingBuilding.add(groundSlabStage3);

    gridPositions.forEach(([x, z]) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.3), concreteMat);
      col.position.set(x, 0.9, z);
      col.castShadow = true;
      col.receiveShadow = true;
      slabcastingBuilding.add(col);
    });

    // Red Brick walls fully built to roof height (1.8m)
    wallPositions.forEach(({ start, end }) => {
      const [x1, z1] = start;
      const [x2, z2] = end;
      const length = Math.hypot(x2 - x1, z2 - z1);
      const angle = Math.atan2(z2 - z1, x2 - x1);

      const wallCore = new THREE.Mesh(new THREE.BoxGeometry(length, 1.8, 0.18), brickMat);
      wallCore.position.set((x1 + x2) / 2, 0.9 + 0.15, (z1 + z2) / 2);
      wallCore.rotation.y = -angle;
      wallCore.castShadow = true;
      wallCore.receiveShadow = true;
      slabcastingBuilding.add(wallCore);
    });

    // Wooden Formwork supporting the slab being cast
    // Underneath formwork wood panels
    const ceilingFormwork = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.08, 5.2), woodPlankMat);
    ceilingFormwork.position.set(0.5, 1.84, 0);
    ceilingFormwork.castShadow = true;
    slabcastingBuilding.add(ceilingFormwork);

    // Steel Reinforcement wire mesh on the roof (Rebar grid)
    const meshGroup = new THREE.Group();
    meshGroup.position.set(0.5, 1.9, 0);
    // X rods
    for (let z = -2.4; z <= 2.4; z += 0.4) {
      const meshX = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 6.0), rebarMat);
      meshX.rotation.z = Math.PI / 2;
      meshX.position.set(0, 0.01, z);
      meshGroup.add(meshX);
    }
    // Z rods
    for (let x = -2.8; x <= 2.8; x += 0.4) {
      const meshZ = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 4.8), rebarMat);
      meshZ.rotation.x = Math.PI / 2;
      meshZ.position.set(x, 0.01, 0);
      meshGroup.add(meshZ);
    }
    slabcastingBuilding.add(meshGroup);

    // Partially poured concrete slab (grey mesh on top of the rebar)
    const concretePour = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.14, 5.2), concreteMat);
    concretePour.position.set(-1.0, 1.95, 0);
    concretePour.castShadow = true;
    slabcastingBuilding.add(concretePour);

    // Concrete Mixer Truck parked next to building
    const mixerTruck = new THREE.Group();
    mixerTruck.position.set(0, 0.15, -4.0);
    
    // Truck Cab
    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.5, roughness: 0.3 })); // Blue Cab
    cab.position.set(-1.8, 0.35, 0);
    cab.castShadow = true;
    mixerTruck.add(cab);
    // Chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.25, 0.65), steelBeamMat);
    chassis.position.set(-0.5, 0.125, 0);
    mixerTruck.add(chassis);
    // Wheels (6 wheels)
    const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.2, 10);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    for (let i = 0; i < 3; i++) {
      const wheelL = new THREE.Mesh(wheelGeo, wheelMat);
      wheelL.rotation.x = Math.PI / 2;
      wheelL.position.set(-1.6 + i * 0.9, 0.1, 0.38);
      const wheelR = wheelL.clone();
      wheelR.position.z = -0.38;
      mixerTruck.add(wheelL);
      mixerTruck.add(wheelR);
    }
    // Rotating Mixer Drum
    const drumGroup = new THREE.Group();
    drumGroup.position.set(-0.4, 0.6, 0);
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.3, 1.5, 12), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.3 }));
    drum.rotation.z = Math.PI / 2 + 0.15;
    drum.castShadow = true;
    drumGroup.add(drum);
    mixerTruck.add(drumGroup);

    // Concrete pumping pipe going from truck to the roof
    const pipePoints = [
      new THREE.Vector3(0.5, 0.5, 0),
      new THREE.Vector3(1.0, 1.4, 0.5),
      new THREE.Vector3(1.0, 2.3, 1.5),
      new THREE.Vector3(0.5, 2.05, 1.5)
    ];
    const pipeCurve = new THREE.CatmullRomCurve3(pipePoints);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 0.06, 8, false);
    const pipe = new THREE.Mesh(pipeGeo, new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 }));
    pipe.position.set(0.5, 0.1, -3.8);
    mixerTruck.add(pipe);

    slabcastingGroup.add(slabcastingBuilding);
    slabcastingGroup.add(mixerTruck);

    // ==========================================
    // STAGE 4: PLASTER (Smooth grey walls, exposed bricks, metal scaffolding)
    // ==========================================
    const plasterBuilding = new THREE.Group();
    // Base concrete slabs
    const groundSlabStage4 = groundSlabStage2.clone();
    plasterBuilding.add(groundSlabStage4);
    const ceilingStage4 = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.15, 5.2), concreteMat);
    ceilingStage4.position.set(0.5, 1.875, 0);
    ceilingStage4.castShadow = true;
    plasterBuilding.add(ceilingStage4);

    // Smooth grey plastered walls
    wallPositions.forEach(({ start, end }) => {
      const [x1, z1] = start;
      const [x2, z2] = end;
      const length = Math.hypot(x2 - x1, z2 - z1);
      const angle = Math.atan2(z2 - z1, x2 - x1);

      const wallCore = new THREE.Mesh(new THREE.BoxGeometry(length, 1.8, 0.2), plasterMat);
      wallCore.position.set((x1 + x2) / 2, 0.9 + 0.15, (z1 + z2) / 2);
      wallCore.rotation.y = -angle;
      wallCore.castShadow = true;
      wallCore.receiveShadow = true;
      plasterBuilding.add(wallCore);
    });

    // Decorative touch: A patch of exposed red bricks to show plaster work in progress
    const brickPatch = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.21), brickMat);
    brickPatch.position.set(1.5, 0.8, -1.8); // Exposed brick segment on back wall
    brickPatch.castShadow = true;
    plasterBuilding.add(brickPatch);

    // Professional Metal Pipe Scaffolding surrounding the building
    const metalScaffold = new THREE.Group();
    // Grid of vertical poles around building
    const poleCoords = [
      [-2.4, -2.2], [0.5, -2.2], [3.4, -2.2],
      [-2.4, 2.2], [0.5, 2.2], [3.4, 2.2]
    ];
    poleCoords.forEach(([x, z]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.6), metalPipeMat);
      pole.position.set(x, 1.3, z);
      pole.castShadow = true;
      metalScaffold.add(pole);
    });
    // Horizontal crossbars connecting poles
    for (let y = 0.8; y <= 2.2; y += 0.8) {
      // Front and Back rails
      for (let z of [-2.2, 2.2]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.025, 0.025), metalPipeMat);
        rail.position.set(0.5, y, z);
        metalScaffold.add(rail);
      }
      // Side rails
      for (let x of [-2.4, 0.5, 3.4]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 4.4), metalPipeMat);
        rail.position.set(x, y, 0);
        metalScaffold.add(rail);
      }
    }
    // Wooden walkboards on scaffolding
    const walkboard = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.03, 0.35), woodPlankMat);
    walkboard.position.set(0.5, 1.6, -2.1);
    walkboard.castShadow = true;
    metalScaffold.add(walkboard);

    plasterBuilding.add(metalScaffold);
    plasterGroup.add(plasterBuilding);

    // ==========================================
    // STAGE 5: FINISHING & PAINTING (White base-coated walls, door/window frames, painter ladders)
    // ==========================================
    const finishingBuilding = new THREE.Group();
    // Base concrete slabs
    const groundSlabStage5 = groundSlabStage2.clone();
    finishingBuilding.add(groundSlabStage5);
    const ceilingStage5 = ceilingStage4.clone();
    finishingBuilding.add(ceilingStage5);

    // Prime coated semi-finished white paint walls
    wallPositions.forEach(({ start, end, height }) => {
      const [x1, z1] = start;
      const [x2, z2] = end;
      const length = Math.hypot(x2 - x1, z2 - z1);
      const angle = Math.atan2(z2 - z1, x2 - x1);

      // Main wall painted white
      const wallCore = new THREE.Mesh(new THREE.BoxGeometry(length, 1.8, 0.2), wallPaintMat);
      wallCore.position.set((x1 + x2) / 2, 0.9 + 0.15, (z1 + z2) / 2);
      wallCore.rotation.y = -angle;
      wallCore.castShadow = true;
      wallCore.receiveShadow = true;
      finishingBuilding.add(wallCore);
    });

    // Dark frames fitted on window opening areas
    // Let's add mock window framing elements
    const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 0.22), navyAccentMat);
    windowFrame.position.set(1.5, 0.9 + 0.15, 1.8);
    finishingBuilding.add(windowFrame);
    
    // Painter's A-Frame Ladder
    const painterLadder = new THREE.Group();
    painterLadder.position.set(-1.2, 0.15, 1.2);
    // Two leaning ladders
    const side1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.5, 0.35), woodPlankMat);
    side1.rotation.z = 0.15;
    side1.position.x = -0.15;
    const side2 = side1.clone();
    side2.rotation.z = -0.15;
    side2.position.x = 0.15;
    painterLadder.add(side1);
    painterLadder.add(side2);
    // Steps
    for (let h = 0.3; h <= 1.2; h += 0.3) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.08), woodPlankMat);
      step.position.set(0, h - 0.75, 0);
      painterLadder.add(step);
    }
    painterLadder.position.y = 0.75;
    finishingBuilding.add(painterLadder);

    // Paint can (metallic cylinders)
    const paintCan = new THREE.Group();
    paintCan.position.set(-0.5, 0.15, 1.2);
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.28, 10), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 }));
    can.position.y = 0.14;
    can.castShadow = true;
    paintCan.add(can);
    const canLid = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.02, 10), yellowAccentMat);
    canLid.position.y = 0.29;
    paintCan.add(canLid);
    finishingBuilding.add(paintCan);

    finishingGroup.add(finishingBuilding);

    // ==========================================
    // STAGE 6: COMPLETE VILLA (Finished luxury house, blue glass windows, gardens)
    // ==========================================
    // Landscaped main ground base compound
    const compound = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.1, 9.0), concreteMat);
    compound.position.y = 0.05;
    compound.receiveShadow = true;
    completedGroup.add(compound);

    // House Core Ground Floor (Smooth White Paint)
    const houseBase = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.0, 5.0), wallPaintMat);
    houseBase.position.set(-0.5, 1.05, 0.5);
    houseBase.castShadow = true;
    houseBase.receiveShadow = true;
    completedGroup.add(houseBase);

    // House First Floor (Navy Blue Accent siding)
    const houseFirstFloor = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.8, 4.5), navyAccentMat);
    houseFirstFloor.position.set(-0.8, 2.95, 0.5);
    houseFirstFloor.castShadow = true;
    houseFirstFloor.receiveShadow = true;
    completedGroup.add(houseFirstFloor);

    // High quality translucent blue glass windows
    const windowGlass1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 2.2), glassMat);
    windowGlass1.position.set(2.41, 1.2, 0.5);
    completedGroup.add(windowGlass1);

    const windowGlass2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 0.1), glassMat);
    windowGlass2.position.set(-0.5, 2.8, 2.76);
    completedGroup.add(windowGlass2);

    // Yellow accent entrance cantilever slab
    const cantileverSlab = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.15, 3.6), yellowAccentMat);
    cantileverSlab.position.set(1.4, 2.0, 0.5);
    cantileverSlab.castShadow = true;
    completedGroup.add(cantileverSlab);

    // Minimalist Modern Landscaped Trees (Trunk + Foliage)
    const stemGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.3);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const leafGeo = new THREE.DodecahedronGeometry(0.72, 1);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 }); // Green Dodecahedron

    const treePositions = [
      [3.8, 3.4], [-3.8, 3.4], [-3.8, -3.4]
    ];
    treePositions.forEach(([x, z]) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0.65, z);
      
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.castShadow = true;
      tree.add(stem);

      const leaves = new THREE.Mesh(leafGeo, leafMat);
      leaves.position.y = 0.95;
      leaves.castShadow = true;
      tree.add(leaves);

      completedGroup.add(tree);
    });

    // Stone pathway to entrance
    const pathway = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 4.0), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 }));
    pathway.rotation.x = -Math.PI / 2;
    pathway.position.set(2.4, 0.11, 0);
    completedGroup.add(pathway);


    // ── ANIMATION & RENDER LOOP ──
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic checks based on state
      const currentPhase = phaseRef.current;
      const currentTheme = themeRef.current;

      // Adjust lights and grid color based on theme
      if (currentTheme === 'dark') {
        ambientLight.color.setHex(0x93c5fd); // Cool blue ambient
        ambientLight.intensity = 0.45;
        dirLight.color.setHex(0xfacc15); // Neon yellow sunlight
        dirLight.intensity = 1.05;
        gridHelper.material.color.setHex(0xfacc15);
        gridHelper.material.opacity = 0.08;
        gridHelper.material.transparent = true;
      } else {
        ambientLight.color.setHex(0xffffff);
        ambientLight.intensity = 0.75;
        dirLight.color.setHex(0xffffff);
        dirLight.intensity = 1.35;
        gridHelper.material.color.setHex(0x0a192f);
        gridHelper.material.opacity = 0.08;
        gridHelper.material.transparent = true;
      }

      // ── PROCEDURAL ANIMATIONS FOR ENGAGEMENT ──
      // 1. Foundation: excavator bucket swing
      if (currentPhase === 'foundation') {
        armGroup.rotation.y = Math.sin(elapsedTime * 1.5) * 0.18;
      }
      // 3. Slab Casting: rotate concrete mixer drum
      if (currentPhase === 'slabcasting') {
        drumGroup.rotation.x = elapsedTime * 2.0;
      }

      // Update scene active visibility dynamically
      updateSceneVisibility();

      controls.update();
      renderer.render(scene, camera);
    };

    function updateSceneVisibility() {
      const activePhase = phaseRef.current;

      // Dynamic visibility of the 6 stages
      foundationGroup.visible = (activePhase === 'foundation');
      brickworkGroup.visible = (activePhase === 'brickwork');
      slabcastingGroup.visible = (activePhase === 'slabcasting');
      plasterGroup.visible = (activePhase === 'plaster');
      finishingGroup.visible = (activePhase === 'finishing');
      completedGroup.visible = (activePhase === 'completed');

      // Lerp camera target point based on active stage height
      let targetY = 1.0;
      if (activePhase === 'foundation') targetY = 0.3;
      else if (activePhase === 'completed') targetY = 1.8;

      controls.target.lerp(new THREE.Vector3(0.5, targetY, 0), 0.05);
    }

    animate();

    // WINDOW RESIZE HANDLER
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 3D Scene Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Orbit & Zoom Micro-Animation Guide */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '24px',
        padding: '6px 14px',
        fontSize: '12px',
        fontWeight: '500',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-secondary)',
        boxShadow: '0 4px 12px var(--shadow-color)',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-color)',
        }} className="pulse-glow" />
        Drag to Orbit / Scroll to Zoom
      </div>
    </div>
  );
}
