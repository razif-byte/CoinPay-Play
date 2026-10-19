import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '../../utils/audio';
import { Play, RotateCcw, Volume2, VolumeX, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Trophy, Coins, Sparkles, Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface SnowPlow3DGameProps {
  onEarnCoins: (coins: number, gameTitle: string) => void;
  isDark: boolean;
}

export const SnowPlow3DGame: React.FC<SnowPlow3DGameProps> = ({ onEarnCoins, isDark }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [snowCleared, setSnowCleared] = useState(0);
  const [combo, setCombo] = useState(1);
  const [highScore, setHighScore] = useState(1280);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [bladeLevel, setBladeLevel] = useState(1);
  const [engineLevel, setEngineLevel] = useState(1);
  const [capacityLevel, setCapacityLevel] = useState(1);
  const [hopperFill, setHopperFill] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hudCollapsed, setHudCollapsed] = useState(false);

  // Mutable game state in refs to keep 60fps loop isolated from React re-renders
  const stateRef = useRef({
    truckPos: new THREE.Vector3(0, 0, 0),
    truckRot: 0,
    speed: 0,
    maxSpeed: 10 + engineLevel * 2,
    turnSpeed: 2.8,
    bladeWidth: 2.2 + bladeLevel * 0.6,
    hopperCapacity: 100 + capacityLevel * 50,
    snowPiles: [] as { id: number; pos: THREE.Vector3; active: boolean; mesh: THREE.Mesh }[],
    keys: { forward: false, backward: false, left: false, right: false },
    lastPlowTime: 0,
    comboCount: 1,
    comboTimer: 0,
    particles: [] as { pos: THREE.Vector3; vel: THREE.Vector3; life: number; mesh: THREE.Mesh }[],
  });

  // Sync upgrades to state
  useEffect(() => {
    stateRef.current.maxSpeed = 9 + engineLevel * 2.2;
    stateRef.current.bladeWidth = 2.0 + bladeLevel * 0.6;
    stateRef.current.hopperCapacity = 80 + capacityLevel * 40;
  }, [engineLevel, bladeLevel, capacityLevel]);

  useEffect(() => {
    sounds.isMuted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE & CAMERA SETUP (Isometric Orthographic / Damped Perspective)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdce9f5);
    scene.fog = new THREE.FogExp2(0xdce9f5, 0.018);

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.5, 300);
    camera.position.set(22, 28, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. STUDIO PBR LIGHTING RIG
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0xb0c4de, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff3db, 1.4);
    sunLight.position.set(35, 50, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 150;
    const d = 35;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // 3. PROCEDURAL TERRAIN, ROADS & COZY CHALET ENVIRONMENT
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xf0f5fa,
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Darker cleared asphalt roads
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.85,
    });
    const road1 = new THREE.Mesh(new THREE.PlaneGeometry(12, 120), roadMat);
    road1.rotation.x = -Math.PI / 2;
    road1.position.y = 0.02;
    road1.receiveShadow = true;
    scene.add(road1);

    const road2 = new THREE.Mesh(new THREE.PlaneGeometry(120, 12), roadMat);
    road2.rotation.x = -Math.PI / 2;
    road2.position.y = 0.02;
    road2.receiveShadow = true;
    scene.add(road2);

    // Road markings
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    for (let i = -50; i <= 50; i += 8) {
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 3), dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.03, i);
      scene.add(dash);

      const dashH = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.5), dashMat);
      dashH.rotation.x = -Math.PI / 2;
      dashH.position.set(i, 0.03, 0);
      scene.add(dashH);
    }

    // Cozy Chalets (Procedural 4-part houses with snow-covered roofs)
    const housePositions = [
      { x: -16, z: -16, color: 0x8b5a2b },
      { x: 16, z: -16, color: 0xa0522d },
      { x: -16, z: 16, color: 0x7c3f00 },
      { x: 16, z: 16, color: 0x8b4513 },
      { x: -30, z: -8, color: 0x964b00 },
      { x: 30, z: -8, color: 0x6e260e },
      { x: -8, z: 30, color: 0xa0522d },
      { x: 8, z: -30, color: 0x8b5a2b },
    ];

    housePositions.forEach(({ x, z, color }) => {
      const houseGroup = new THREE.Group();
      // Walls
      const wallMesh = new THREE.Mesh(
        new THREE.BoxGeometry(7, 5, 6),
        new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
      );
      wallMesh.position.y = 2.5;
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      houseGroup.add(wallMesh);

      // Snowy Pitched Roof
      const roofMesh = new THREE.Mesh(
        new THREE.ConeGeometry(5.5, 3.5, 4),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
      );
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.position.y = 6.2;
      roofMesh.castShadow = true;
      houseGroup.add(roofMesh);

      // Chimney with cozy brick tone
      const chimney = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 3, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.9 })
      );
      chimney.position.set(1.5, 6.5, 1);
      chimney.castShadow = true;
      houseGroup.add(chimney);

      // Warm glowing window
      const win = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 1.2),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      win.position.set(0, 2.8, 3.01);
      houseGroup.add(win);

      houseGroup.position.set(x, 0, z);
      scene.add(houseGroup);
    });

    // Snowy Pine Trees (InstancedMesh foliage)
    const treeCount = 45;
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 2.5, 6);
    const foliageGeo = new THREE.ConeGeometry(2.2, 4.5, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2d5a36, roughness: 0.8 });
    const snowCapMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });

    for (let i = 0; i < treeCount; i++) {
      const angle = (i / treeCount) * Math.PI * 2 + (i % 3);
      const rad = 24 + (i % 5) * 8 + Math.random() * 6;
      const tx = Math.cos(angle) * rad;
      const tz = Math.sin(angle) * rad;

      // Skip trees on roads
      if (Math.abs(tx) < 8 || Math.abs(tz) < 8) continue;

      const treeGroup = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.25;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 4.2;
      foliage.castShadow = true;
      treeGroup.add(foliage);

      const snowCap = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.2, 6), snowCapMat);
      snowCap.position.y = 5.2;
      snowCap.castShadow = true;
      treeGroup.add(snowCap);

      const scale = 0.8 + Math.random() * 0.4;
      treeGroup.scale.set(scale, scale, scale);
      treeGroup.position.set(tx, 0, tz);
      scene.add(treeGroup);
    }

    // Street Lamps with warm glowing light
    const lampPositions = [
      { x: -5, z: -10 },
      { x: 5, z: 10 },
      { x: -10, z: 5 },
      { x: 10, z: -5 },
      { x: -5, z: 22 },
      { x: 5, z: -22 },
    ];
    lampPositions.forEach(({ x, z }) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.15, 5, 8),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 })
      );
      pole.position.set(x, 2.5, z);
      scene.add(pole);

      const lightOrb = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      lightOrb.position.set(x, 5.1, z);
      scene.add(lightOrb);

      const pointLight = new THREE.PointLight(0xfef08a, 1.2, 16);
      pointLight.position.set(x, 5, z);
      scene.add(pointLight);
    });

    // 4. COMPOSITE 8-PART HERO SNOW-PLOW VEHICLE (THREE.Group)
    const truckGroup = new THREE.Group();

    // Chassis & Main Body
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Electric Blue
      metalness: 0.4,
      roughness: 0.3,
    });
    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.3, 3.8), bodyMat);
    bodyMesh.position.y = 1.2;
    bodyMesh.castShadow = true;
    truckGroup.add(bodyMesh);

    // Cabin
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.3,
      roughness: 0.4,
    });
    const cabinMesh = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.1, 1.8), cabinMat);
    cabinMesh.position.set(0, 2.2, 0.4);
    cabinMesh.castShadow = true;
    truckGroup.add(cabinMesh);

    // Windshield (Glass reflection)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.7,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const glassMesh = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.7, 0.1), glassMat);
    glassMesh.position.set(0, 2.3, 1.31);
    truckGroup.add(glassMesh);

    // Heavy Front Snow-Plow Wedge Blade
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber / Hazard orange
      metalness: 0.8,
      roughness: 0.25,
    });
    const bladeMesh = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.9, 0.4), bladeMat);
    bladeMesh.position.set(0, 0.7, 2.2);
    bladeMesh.castShadow = true;
    truckGroup.add(bladeMesh);

    // 4 Heavy-Duty Winter Wheels
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
    });
    const wheelGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.5, 16);
    const wheelOffsets = [
      { x: -1.3, z: 1.2 },
      { x: 1.3, z: 1.2 },
      { x: -1.3, z: -1.2 },
      { x: 1.3, z: -1.2 },
    ];
    wheelOffsets.forEach(({ x, z }) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.65, z);
      wheel.castShadow = true;
      truckGroup.add(wheel);
    });

    // Amber Emergency Beacon Light on Roof
    const beaconMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.3, 12),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    beaconMesh.position.set(0, 2.9, 0.4);
    truckGroup.add(beaconMesh);

    // Headlights
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hlLeft = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), lightMat);
    hlLeft.position.set(-0.8, 1.2, 1.95);
    truckGroup.add(hlLeft);

    const hlRight = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), lightMat);
    hlRight.position.set(0.8, 1.2, 1.95);
    truckGroup.add(hlRight);

    // Rear Snow Hopper / Salt Tank
    const hopperMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.8, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.4 })
    );
    hopperMesh.position.set(0, 1.7, -1.0);
    hopperMesh.castShadow = true;
    truckGroup.add(hopperMesh);

    // Soft Radial Contact Shadow below truck
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 5.0),
      new THREE.MeshBasicMaterial({
        color: 0x0f172a,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.04;
    truckGroup.add(shadowMesh);

    truckGroup.position.set(0, 0, 0);
    scene.add(truckGroup);

    // 5. PROCEDURAL SNOW MOUNDS / PILES ON THE ROADS
    const snowPileMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      metalness: 0.0,
    });
    const snowPiles: { id: number; pos: THREE.Vector3; active: boolean; mesh: THREE.Mesh }[] = [];
    const pileGeo = new THREE.SphereGeometry(1.1, 10, 8);

    // Spawn 70 snow piles along roads
    let pileId = 0;
    for (let z = -45; z <= 45; z += 3.5) {
      if (Math.abs(z) > 1) {
        const mesh = new THREE.Mesh(pileGeo, snowPileMat);
        mesh.scale.set(1.4, 0.5, 1.4);
        const offsetX = (Math.random() - 0.5) * 6;
        mesh.position.set(offsetX, 0.25, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
        snowPiles.push({ id: pileId++, pos: mesh.position.clone(), active: true, mesh });
      }
    }
    for (let x = -45; x <= 45; x += 3.5) {
      if (Math.abs(x) > 1) {
        const mesh = new THREE.Mesh(pileGeo, snowPileMat);
        mesh.scale.set(1.4, 0.5, 1.4);
        const offsetZ = (Math.random() - 0.5) * 6;
        mesh.position.set(x, 0.25, offsetZ);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
        snowPiles.push({ id: pileId++, pos: mesh.position.clone(), active: true, mesh });
      }
    }
    stateRef.current.snowPiles = snowPiles;

    // 6. SNOW PARTICLE BURST POOL
    const particleGeo = new THREE.SphereGeometry(0.18, 6, 6);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const particlePool: { pos: THREE.Vector3; vel: THREE.Vector3; life: number; mesh: THREE.Mesh }[] = [];
    for (let i = 0; i < 60; i++) {
      const pMesh = new THREE.Mesh(particleGeo, particleMat);
      pMesh.visible = false;
      scene.add(pMesh);
      particlePool.push({ pos: new THREE.Vector3(), vel: new THREE.Vector3(), life: 0, mesh: pMesh });
    }
    stateRef.current.particles = particlePool;

    // 7. KEYBOARD CONTROLS
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.forward = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') stateRef.current.keys.backward = true;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.forward = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') stateRef.current.keys.backward = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 8. ANIMATION LOOP (60fps simulation with clamped dt & damped camera)
    let animationFrameId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      animationFrameId = requestAnimationFrame(tick);
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);

      const state = stateRef.current;

      if (isPlaying) {
        // Turning
        if (state.keys.left) state.truckRot += state.turnSpeed * dt;
        if (state.keys.right) state.truckRot -= state.turnSpeed * dt;

        // Acceleration & Damping
        if (state.keys.forward) {
          state.speed = THREE.MathUtils.damp(state.speed, state.maxSpeed, 4, dt);
        } else if (state.keys.backward) {
          state.speed = THREE.MathUtils.damp(state.speed, -state.maxSpeed * 0.5, 4, dt);
        } else {
          state.speed = THREE.MathUtils.damp(state.speed, 0, 5, dt);
        }

        // Move Truck Forward along heading
        const heading = new THREE.Vector3(Math.sin(state.truckRot), 0, Math.cos(state.truckRot));
        state.truckPos.addScaledVector(heading, state.speed * dt);

        // Clamp to play boundaries
        state.truckPos.x = THREE.MathUtils.clamp(state.truckPos.x, -55, 55);
        state.truckPos.z = THREE.MathUtils.clamp(state.truckPos.z, -55, 55);

        truckGroup.position.copy(state.truckPos);
        truckGroup.rotation.y = state.truckRot;

        // Blade position in front of truck
        const bladePos = state.truckPos.clone().add(heading.clone().multiplyScalar(2.2));

        // Check snow pile collision
        let plowedThisFrame = false;
        state.snowPiles.forEach((pile) => {
          if (!pile.active) return;
          const dist = bladePos.distanceTo(pile.pos);
          if (dist < state.bladeWidth) {
            pile.active = false;
            pile.mesh.visible = false;
            plowedThisFrame = true;

            // Spawn snow puff particles
            for (let p = 0; p < 6; p++) {
              const inactiveP = state.particles.find((item) => item.life <= 0);
              if (inactiveP) {
                inactiveP.pos.copy(pile.pos).add(new THREE.Vector3((Math.random() - 0.5) * 1.5, 0.5, (Math.random() - 0.5) * 1.5));
                inactiveP.vel.set((Math.random() - 0.5) * 5, 2 + Math.random() * 3, (Math.random() - 0.5) * 5);
                inactiveP.life = 0.5;
                inactiveP.mesh.position.copy(inactiveP.pos);
                inactiveP.mesh.visible = true;
              }
            }
          }
        });

        // Combo & Scoring Logic
        if (plowedThisFrame) {
          sounds.playPlowWhoosh(1.2);
          state.comboTimer = 2.8; // 2.8 seconds window
          state.comboCount = Math.min(state.comboCount + 1, 16);

          if (state.comboCount % 3 === 0) {
            sounds.playComboFanfare(state.comboCount);
          }

          const points = 10 * state.comboCount;
          setScore((s) => s + points);
          setSnowCleared((c) => c + 1);
          setCombo(state.comboCount);

          // Fill hopper
          setHopperFill((f) => {
            const next = Math.min(f + 1, state.hopperCapacity);
            if (next >= state.hopperCapacity) {
              sounds.playCoinChime();
              setCoinsEarned((coin) => coin + 15);
              onEarnCoins(15, 'Snow Plow 3D - Full Hopper Bonus');
              return 0; // Empty hopper after reward
            }
            return next;
          });
        } else {
          if (state.comboTimer > 0) {
            state.comboTimer -= dt;
            if (state.comboTimer <= 0) {
              state.comboCount = 1;
              setCombo(1);
            }
          }
        }

        // Respawn snow pile if too few remain
        const activeCount = state.snowPiles.filter((p) => p.active).length;
        if (activeCount < 15) {
          state.snowPiles.forEach((p) => {
            if (!p.active && Math.random() < 0.6) {
              p.active = true;
              p.mesh.visible = true;
            }
          });
        }
      }

      // Update Snow Particles
      state.particles.forEach((p) => {
        if (p.life > 0) {
          p.life -= dt;
          p.pos.addScaledVector(p.vel, dt);
          p.vel.y -= 9.8 * dt; // gravity
          p.mesh.position.copy(p.pos);
          const scale = Math.max(p.life / 0.5, 0.01);
          p.mesh.scale.set(scale, scale, scale);
          if (p.life <= 0) p.mesh.visible = false;
        }
      });

      // Smooth Exponential Damped Camera Follow
      const targetCamPos = state.truckPos.clone().add(new THREE.Vector3(20, 26, 20));
      camera.position.lerp(targetCamPos, 1 - Math.exp(-4 * dt));
      camera.lookAt(state.truckPos.x, 1, state.truckPos.z);

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(tick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isPlaying]);

  const handleStartGame = () => {
    sounds.playClick();
    setIsPlaying(true);
    setScore(0);
    setSnowCleared(0);
    setCombo(1);
  };

  const handleReset = () => {
    sounds.playClick();
    setIsPlaying(false);
    stateRef.current.truckPos.set(0, 0, 0);
    stateRef.current.speed = 0;
    stateRef.current.truckRot = 0;
    setScore(0);
  };

  const handleUpgradeBlade = () => {
    if (bladeLevel < 5) {
      sounds.playCoinChime();
      setBladeLevel((l) => l + 1);
    }
  };

  const handleUpgradeEngine = () => {
    if (engineLevel < 5) {
      sounds.playCoinChime();
      setEngineLevel((l) => l + 1);
    }
  };

  const handleUpgradeCapacity = () => {
    if (capacityLevel < 5) {
      sounds.playCoinChime();
      setCapacityLevel((l) => l + 1);
    }
  };

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700 select-none bg-slate-900">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Title & Start Screen Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/75 backdrop-blur-md text-white text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center mb-4 shadow-xl shadow-blue-500/20">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-300">
            Snow Plow Odyssey 3D™
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
            Pandu jentera pembajak salji 3D isometrik, bersihkan jalan bandar salji yang tenang, bina kombo pengganda berantai dan kumpul Reward Coins CoinPay Play™!
          </p>

          <div className="flex items-center gap-4 my-5 text-xs font-semibold text-slate-400">
            <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
              🎮 Kawalan: <strong>WASD / Anak Panah</strong>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
              ⚡ Multiplier: <strong>Hingga 16x</strong>
            </span>
          </div>

          <button
            onClick={handleStartGame}
            className="btn-3d btn-3d-primary px-8 py-3.5 rounded-2xl font-black text-sm tracking-wide flex items-center gap-2.5 shadow-2xl"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Mula Membajak Salji</span>
          </button>
        </div>
      )}

      {/* Top HUD: Unobstructed Perimeter Clusters */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        {/* Left: Score & Combo Badge */}
        <div className="flex items-center gap-2.5">
          <div className="px-4 py-2 rounded-2xl bg-slate-900/85 border border-slate-700/80 shadow-lg pointer-events-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Skor Semasa</span>
            <span className="text-xl font-black text-white tabular-nums tracking-tight">{score}</span>
          </div>

          {combo > 1 && (
            <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs shadow-lg animate-bounce pointer-events-auto flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{combo}x KOMBO!</span>
            </div>
          )}
        </div>

        {/* Right: Coins & Sound Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 font-extrabold text-xs shadow-md">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>+{coinsEarned} Coins</span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white transition shadow-md"
            aria-label="Bunyi"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Touch Direction Controls (Shown on mobile screens) */}
      <div className="absolute bottom-24 left-4 z-10 md:hidden flex flex-col items-center gap-1.5 opacity-80 pointer-events-auto">
        <button
          onTouchStart={() => (stateRef.current.keys.forward = true)}
          onTouchEnd={() => (stateRef.current.keys.forward = false)}
          className="w-11 h-11 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-white active:bg-blue-600"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <button
            onTouchStart={() => (stateRef.current.keys.left = true)}
            onTouchEnd={() => (stateRef.current.keys.left = false)}
            className="w-11 h-11 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-white active:bg-blue-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onTouchStart={() => (stateRef.current.keys.backward = true)}
            onTouchEnd={() => (stateRef.current.keys.backward = false)}
            className="w-11 h-11 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-white active:bg-blue-600"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onTouchStart={() => (stateRef.current.keys.right = true)}
            onTouchEnd={() => (stateRef.current.keys.right = false)}
            className="w-11 h-11 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-white active:bg-blue-600"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ergonomic Collapsible Bottom Control & Upgrades Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-xl">
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white text-[10px] font-bold flex items-center gap-1 shadow-md"
          >
            {hudCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            <span>{hudCollapsed ? 'Papar Panel Naik Taraf' : 'Sembunyi Panel'}</span>
          </button>
        </div>

        {!hudCollapsed && (
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs text-white">
            {/* Upgrade: Blade */}
            <div className="flex-1 min-w-[130px] p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-semibold">Bilah Bajak</span>
                <span className="font-extrabold text-blue-400">Lv {bladeLevel}/5</span>
              </div>
              <button
                onClick={handleUpgradeBlade}
                disabled={bladeLevel >= 5}
                className="w-full btn-3d btn-3d-subtle py-1 rounded-lg text-[10px] font-bold text-slate-200 disabled:opacity-40"
              >
                {bladeLevel >= 5 ? 'Maksimum' : 'Naik Taraf (+Lejar)'}
              </button>
            </div>

            {/* Upgrade: Engine Speed */}
            <div className="flex-1 min-w-[130px] p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-semibold">Kelajuan Enjin</span>
                <span className="font-extrabold text-indigo-400">Lv {engineLevel}/5</span>
              </div>
              <button
                onClick={handleUpgradeEngine}
                disabled={engineLevel >= 5}
                className="w-full btn-3d btn-3d-subtle py-1 rounded-lg text-[10px] font-bold text-slate-200 disabled:opacity-40"
              >
                {engineLevel >= 5 ? 'Maksimum' : 'Naik Taraf (+Laju)'}
              </button>
            </div>

            {/* Hopper Tank Fill Status */}
            <div className="flex-1 min-w-[130px] p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-semibold">Kapasiti Salji</span>
                <span className="font-extrabold text-amber-400">{hopperFill}/{stateRef.current.hopperCapacity}</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-200"
                  style={{ width: `${(hopperFill / stateRef.current.hopperCapacity) * 100}%` }}
                />
              </div>
            </div>

            {/* Reset / Stop Button */}
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-300 hover:bg-rose-600/40 transition"
              title="Mula Semula"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
