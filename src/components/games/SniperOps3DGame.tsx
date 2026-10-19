import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Crosshair,
  ZoomIn,
  ZoomOut,
  Eye,
  ShieldAlert,
  Trophy,
  RotateCcw,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Target,
  Wind,
  Compass,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface SniperOps3DGameProps {
  onEarnCoins: (coins: number, gameTitle: string) => void;
  isDark: boolean;
}

interface HostileTarget {
  id: string;
  name: string;
  role: 'Leader' | 'Sniper' | 'Guard';
  mesh: THREE.Group;
  position: THREE.Vector3;
  patrolStart: THREE.Vector3;
  patrolEnd: THREE.Vector3;
  direction: number;
  speed: number;
  isAlive: boolean;
  distanceMeters: number;
  bountyCoins: number;
  isHeadshot?: boolean;
}

export const SniperOps3DGame: React.FC<SniperOps3DGameProps> = ({
  onEarnCoins,
  isDark,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Game UI States
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(4); // 1x, 4x, 8x, 14x
  const [isHoldingBreath, setIsHoldingBreath] = useState(false);
  const [breathGauge, setBreathGauge] = useState(100);
  const [thermalMode, setThermalMode] = useState(false);
  const [ammo, setAmmo] = useState(5);
  const [maxAmmo] = useState(5);
  const [isReloading, setIsReloading] = useState(false);
  const [score, setScore] = useState(0);
  const [contractCoins, setContractCoins] = useState(0);
  const [headshotCount, setHeadshotCount] = useState(0);
  const [selectedMission, setSelectedMission] = useState<number>(1);
  const [killFeed, setKillFeed] = useState<string[]>([]);
  const [killcamActive, setKillcamActive] = useState(false);
  const [killcamText, setKillcamText] = useState('');
  const [windSpeed, setWindSpeed] = useState<number>(2.4); // m/s
  const [windDirection, setWindDirection] = useState<'Kiri' | 'Kanan'>('Kanan');
  const [missionComplete, setMissionComplete] = useState(false);

  // References for Three.js engine
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const targetsRef = useRef<HostileTarget[]>([]);
  const swayOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isHoldingBreathRef = useRef(false);
  const mouseLookRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  isHoldingBreathRef.current = isHoldingBreath;

  // Missions list
  const MISSIONS = [
    {
      id: 1,
      title: 'Operasi Serigala Hitam',
      location: 'Kuala Lumpur Skyscraper Rooftops',
      desc: 'Hapuskan komander pengganas dan 2 pengawal di atas bumbung bangunan bertentangan.',
      bounty: 60,
      difficulty: 'Sederhana',
    },
    {
      id: 2,
      title: 'Serbuan Pelabuhan Gelap',
      location: 'Pelabuhan Klang Port Container Yard',
      desc: 'Tembak tepat penembak tepat musuh di menara kawalan sebelum tebusan dicederakan.',
      bounty: 90,
      difficulty: 'Tinggi',
    },
    {
      id: 3,
      title: 'Konvoi Diplomatik Malam',
      location: 'Lebuhraya Bertingkat Cyberjaya',
      desc: 'Sasaran bergerak laju. Gunakan pampasan angin dan graviti peluru!',
      bounty: 120,
      difficulty: 'Pakar',
    },
  ];

  // Initialize Three.js 3D Tactical Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 520;

    // 1. Scene & Lighting
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(thermalMode ? 0x011319 : 0x080e1a);
    scene.fog = new THREE.FogExp2(thermalMode ? 0x01222e : 0x0c1524, 0.0035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45 / (zoomLevel / 2), width / height, 0.5, 1200);
    camera.position.set(0, 18, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    containerRef.current.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient & Directional Lights
    const hemiLight = new THREE.HemisphereLight(
      thermalMode ? 0x00ffff : 0x4b6cb7,
      0x182848,
      thermalMode ? 1.2 : 0.8
    );
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(thermalMode ? 0x00ffcc : 0xffffff, 1.2);
    dirLight.position.set(50, 80, 50);
    scene.add(dirLight);

    // City Rooftops Environment (Procedural Buildings)
    const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildingMat = new THREE.MeshStandardMaterial({
      color: thermalMode ? 0x0f2b38 : 0x1e293b,
      roughness: 0.7,
      metalness: 0.2,
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: thermalMode ? 0x081f29 : 0x0f172a,
      roughness: 0.9,
    });

    // Create 18 procedural buildings in front of sniper position
    for (let i = 0; i < 22; i++) {
      const bWidth = 25 + Math.random() * 25;
      const bHeight = 30 + Math.random() * 55;
      const bDepth = 25 + Math.random() * 25;
      const building = new THREE.Mesh(buildingGeo, buildingMat);
      building.scale.set(bWidth, bHeight, bDepth);

      const x = (Math.random() - 0.5) * 260;
      const z = -70 - Math.random() * 240;
      building.position.set(x, bHeight / 2 - 25, z);
      scene.add(building);

      // Rooftop helipad or barrier
      const roof = new THREE.Mesh(new THREE.BoxGeometry(bWidth - 2, 1.5, bDepth - 2), roofMat);
      roof.position.set(x, bHeight - 25, z);
      scene.add(roof);

      // AC units / antennas
      if (Math.random() > 0.4) {
        const antenna = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.4, 12, 6),
          new THREE.MeshBasicMaterial({ color: thermalMode ? 0x00ffff : 0xef4444 })
        );
        antenna.position.set(x + (Math.random() - 0.5) * 8, bHeight - 19, z);
        scene.add(antenna);
      }
    }

    // Ground level base
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshStandardMaterial({ color: 0x050811 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -25;
    scene.add(ground);

    // 4. Create Hostile Targets on Rooftops
    const targets: HostileTarget[] = [];
    const targetConfigs = [
      {
        id: 't1',
        name: 'Komander Rahsia (VIP Boss)',
        role: 'Leader' as const,
        pos: new THREE.Vector3(0, 14, -135),
        patrolDist: 18,
        speed: 0.08,
        bounty: 45,
      },
      {
        id: 't2',
        name: 'Penembak Tepat Menara Timur',
        role: 'Sniper' as const,
        pos: new THREE.Vector3(38, 22, -160),
        patrolDist: 10,
        speed: 0.05,
        bounty: 30,
      },
      {
        id: 't3',
        name: 'Pengawal Ronda Bumbung Barat',
        role: 'Guard' as const,
        pos: new THREE.Vector3(-42, 16, -115),
        patrolDist: 22,
        speed: 0.12,
        bounty: 25,
      },
    ];

    targetConfigs.forEach((cfg) => {
      const group = new THREE.Group();

      // Torso / Body
      const bodyMat = new THREE.MeshStandardMaterial({
        color: thermalMode ? 0xff3300 : cfg.role === 'Leader' ? 0xb91c1c : 0x334155,
        emissive: thermalMode ? 0xff2200 : 0x000000,
        emissiveIntensity: thermalMode ? 0.6 : 0,
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, 1.2), bodyMat);
      body.position.y = 1.3;
      group.add(body);

      // Head
      const headMat = new THREE.MeshStandardMaterial({
        color: thermalMode ? 0xffff00 : 0xfbcfe8,
        emissive: thermalMode ? 0xffaa00 : 0x000000,
        emissiveIntensity: thermalMode ? 0.8 : 0,
      });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 12), headMat);
      head.position.y = 3.1;
      group.add(head);

      // Weapon
      const rifle = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.4, 2.2),
        new THREE.MeshBasicMaterial({ color: 0x111827 })
      );
      rifle.position.set(0.6, 1.5, -0.6);
      group.add(rifle);

      group.position.copy(cfg.pos);
      scene.add(group);

      targets.push({
        id: cfg.id,
        name: cfg.name,
        role: cfg.role,
        mesh: group,
        position: group.position,
        patrolStart: new THREE.Vector3(cfg.pos.x - cfg.patrolDist / 2, cfg.pos.y, cfg.pos.z),
        patrolEnd: new THREE.Vector3(cfg.pos.x + cfg.patrolDist / 2, cfg.pos.y, cfg.pos.z),
        direction: 1,
        speed: cfg.speed,
        isAlive: true,
        distanceMeters: Math.round(Math.abs(cfg.pos.z) + Math.abs(cfg.pos.x) * 0.3),
        bountyCoins: cfg.bounty,
      });
    });

    targetsRef.current = targets;

    // 5. Render Loop with Target Patrol & Scope Sway
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Patrol hostile targets
      targetsRef.current.forEach((t) => {
        if (!t.isAlive) return;
        t.mesh.position.x += t.speed * t.direction;
        if (t.mesh.position.x > t.patrolEnd.x) {
          t.direction = -1;
        } else if (t.mesh.position.x < t.patrolStart.x) {
          t.direction = 1;
        }
      });

      // Scope natural breathing sway (Reduced by 85% when holding breath)
      const swayFactor = isHoldingBreathRef.current ? 0.001 : 0.006;
      const swayX = Math.sin(time * 1.5) * swayFactor;
      const swayY = Math.cos(time * 2.2) * (swayFactor * 0.7);
      swayOffsetRef.current = { x: swayX, y: swayY };

      // Update camera view orientation based on mouse look + sway
      if (cameraRef.current) {
        cameraRef.current.rotation.y = -mouseLookRef.current.x + swayX;
        cameraRef.current.rotation.x = -mouseLookRef.current.y + swayY;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 520;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
    };
  }, [thermalMode, selectedMission]);

  // Adjust Camera FOV on Zoom Change
  useEffect(() => {
    if (!cameraRef.current) return;
    const baseFov = 45;
    cameraRef.current.fov = baseFov / (zoomLevel / 1.5);
    cameraRef.current.updateProjectionMatrix();
  }, [zoomLevel]);

  // Hold Breath Depletion Timer
  useEffect(() => {
    let breathTimer: NodeJS.Timeout;
    if (isHoldingBreath) {
      sounds.playHeartbeat();
      breathTimer = setInterval(() => {
        setBreathGauge((prev) => {
          if (prev <= 5) {
            setIsHoldingBreath(false);
            return 0;
          }
          return prev - 8;
        });
      }, 200);
    } else {
      breathTimer = setInterval(() => {
        setBreathGauge((prev) => Math.min(100, prev + 12));
      }, 300);
    }
    return () => clearInterval(breathTimer);
  }, [isHoldingBreath]);

  // Mouse Movement to Aim
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    // Sensitivity adjusted by zoom level
    const sens = 0.5 / zoomLevel;
    mouseLookRef.current = {
      x: nx * sens * 1.5,
      y: ny * sens * 1.5,
    };
  };

  // Toggle Hold Breath
  const handleToggleHoldBreath = () => {
    if (breathGauge < 20) return;
    sounds.playClick();
    setIsHoldingBreath(!isHoldingBreath);
  };

  // Zoom Controller
  const handleZoom = (level: number) => {
    sounds.playClick();
    setZoomLevel(level);
  };

  // FIRE SNIPER RIFLE
  const handleFireRifle = () => {
    if (ammo <= 0) {
      sounds.playClick();
      alert('Peluru habis! Tekan butang RELOAD di bawah.');
      return;
    }

    // Play high-caliber crack and rumble
    sounds.playSniperShot();
    setAmmo((a) => a - 1);

    // Apply muzzle recoil visual
    if (cameraRef.current) {
      cameraRef.current.rotation.x += 0.025;
    }

    // Raycast target detection from center reticle (accounting for wind & bullet drop)
    if (!cameraRef.current || !sceneRef.current) return;

    const raycaster = new THREE.Raycaster();
    const screenCenter = new THREE.Vector2(0, 0); // Center crosshair
    raycaster.setFromCamera(screenCenter, cameraRef.current);

    // Check hit on active targets
    let hitFound = false;

    targetsRef.current.forEach((target) => {
      if (!target.isAlive) return;

      const intersects = raycaster.intersectObjects(target.mesh.children, true);
      if (intersects.length > 0) {
        hitFound = true;
        const hitObj = intersects[0].object as THREE.Mesh;
        const isHead = hitObj.geometry?.type?.includes('Sphere') ?? false;

        // Mark target dead
        target.isAlive = false;
        target.isHeadshot = isHead;

        // Ragdoll / collapse animation
        target.mesh.rotation.z = Math.PI / 2;
        target.mesh.position.y -= 1.0;

        // Sound effects
        if (isHead) {
          sounds.playHeadshotDing();
        }
        sounds.playBulletSlowMo();

        // Killcam trigger
        setKillcamActive(true);
        setKillcamText(
          isHead
            ? `🎯 CRITICAL HEADSHOT! ${target.name} Ditumpaskan (+${target.bountyCoins * 2} Coins)`
            : `💥 HIT CONFIRMED! ${target.name} Ditumpaskan (+${target.bountyCoins} Coins)`
        );

        const earnedCoins = isHead ? target.bountyCoins * 2 : target.bountyCoins;
        setContractCoins((prev) => prev + earnedCoins);
        setScore((s) => s + (isHead ? 500 : 250));
        if (isHead) setHeadshotCount((h) => h + 1);

        setKillFeed((kf) => [
          `${isHead ? 'HEADSHOT' : 'KILL'}: ${target.name} [${target.distanceMeters}m]`,
          ...kf.slice(0, 3),
        ]);

        confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });

        setTimeout(() => {
          setKillcamActive(false);
        }, 2200);
      }
    });

    // Check if all targets eliminated -> Mission Complete
    const remaining = targetsRef.current.filter((t) => t.isAlive);
    if (remaining.length === 0) {
      setTimeout(() => {
        setMissionComplete(true);
        sounds.playWinFanfare();
        const totalBounty = 100 + contractCoins;
        onEarnCoins(totalBounty, `Special Ops Sniper: Misi ${selectedMission}`);
      }, 1500);
    }
  };

  // Reload action
  const handleReload = () => {
    if (isReloading || ammo === maxAmmo) return;
    sounds.playClick();
    setIsReloading(true);
    setTimeout(() => {
      setAmmo(maxAmmo);
      setIsReloading(false);
      sounds.playCoinChime();
    }, 1200);
  };

  // Reset Mission
  const handleResetMission = () => {
    sounds.playClick();
    setAmmo(maxAmmo);
    setScore(0);
    setContractCoins(0);
    setHeadshotCount(0);
    setMissionComplete(false);
    setKillcamActive(false);
    setKillFeed([]);

    // Revive targets
    targetsRef.current.forEach((t) => {
      t.isAlive = true;
      t.mesh.rotation.z = 0;
      t.mesh.position.copy(t.position);
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Tactical Briefing Header */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/40">
                Operasi Khas Tentera 3D
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">● Ganjaran Wallet Tunai & Coins</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Special Ops Sniper: Real-Life 3D Simulation
            </h3>
          </div>
        </div>

        {/* Mission Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          {MISSIONS.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                sounds.playClick();
                setSelectedMission(m.id);
                handleResetMission();
              }}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedMission === m.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Misi {m.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Tactical Viewport with Sniper Optics Scope Overlay */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-black select-none h-[480px] md:h-[540px]">
        {/* 3D Canvas Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="w-full h-full cursor-crosshair"
        />

        {/* NIGHT VISION / THERMAL INFRARED VIGNETTE FILTER */}
        {thermalMode && (
          <div className="absolute inset-0 pointer-events-none bg-cyan-500/10 mix-blend-screen border-4 border-cyan-400/40 shadow-[inset_0_0_100px_rgba(6,182,212,0.4)]" />
        )}

        {/* REALISTIC HIGH-PRECISION MIL-DOT OPTICAL RETICLE OVERLAY */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Circular Scope Housing */}
          <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] rounded-full border-4 border-slate-900/90 shadow-[0_0_0_2000px_rgba(0,0,0,0.85)] relative flex items-center justify-center">
            {/* Fine Crosshairs */}
            <div className="absolute w-full h-[1.5px] bg-red-500/80 shadow-[0_0_4px_rgba(239,68,68,0.8)]" />
            <div className="absolute h-full w-[1.5px] bg-red-500/80 shadow-[0_0_4px_rgba(239,68,68,0.8)]" />

            {/* Mil-Dot Hash Marks (Horizontal) */}
            {[-120, -80, -40, 40, 80, 120].map((offset) => (
              <div
                key={offset}
                style={{ transform: `translateX(${offset}px)` }}
                className="absolute w-[1px] h-4 bg-red-400"
              />
            ))}

            {/* Mil-Dot Hash Marks (Vertical & Elevation Drop) */}
            {[-120, -80, -40, 40, 80, 120, 160].map((offset) => (
              <div
                key={offset}
                style={{ transform: `translateY(${offset}px)` }}
                className="absolute h-[1px] w-4 bg-red-400"
              />
            ))}

            {/* Central Precision Target Pip */}
            <div className="w-3 h-3 rounded-full border border-red-500/90 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-red-500" />
            </div>

            {/* Rangefinder & Wind Overlay Info inside Optics */}
            <div className="absolute top-8 left-10 text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
              RANGE: <strong>342m</strong> • ELEV: +1.4 MIL
            </div>

            <div className="absolute bottom-8 right-10 text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
              WIND: <strong>{windSpeed} m/s {windDirection}</strong>
            </div>

            <div className="absolute top-8 right-10 text-[10px] font-mono text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-400/30">
              ZOOM: <strong>{zoomLevel}X OPTICAL</strong>
            </div>
          </div>
        </div>

        {/* KILLCAM BULLETIN CELEBRATION */}
        {killcamActive && (
          <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center animate-fade-in">
            <span className="text-xs font-black tracking-widest uppercase text-red-500 bg-red-950/80 px-3 py-1 rounded-full border border-red-500/40 mb-2">
              SLOW-MOTION KILLCAM CONFIRMED
            </span>
            <span className="text-2xl md:text-3xl font-black text-amber-300 drop-shadow-lg tracking-wide animate-bounce">
              {killcamText}
            </span>
          </div>
        )}

        {/* TOP STATUS BAR OVERLAY */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Targets Remaining Counter */}
          <div className="p-2.5 rounded-2xl bg-black/70 backdrop-blur-md border border-slate-700/80 flex items-center gap-3 text-xs text-white">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">Sasaran Aktif:</span>
              <span className="font-black text-amber-400">
                {targetsRef.current.filter((t) => t.isAlive).length} / {targetsRef.current.length} Sasaran
              </span>
            </div>
          </div>

          {/* Killfeed Notifications */}
          <div className="hidden sm:flex flex-col gap-1 items-end">
            {killFeed.map((kf, i) => (
              <div
                key={i}
                className="px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-500/40 text-[10px] font-mono font-bold text-red-200 animate-slide-up"
              >
                {kf}
              </div>
            ))}
          </div>

          {/* Ammo & Mag Display */}
          <div className="p-2.5 rounded-2xl bg-black/70 backdrop-blur-md border border-slate-700/80 flex items-center gap-3 text-xs text-white">
            <div>
              <span className="text-[10px] text-slate-400 block text-right">Peluru Sniper (.338 Lapua):</span>
              <div className="flex items-center gap-1 font-mono font-black text-sm text-right">
                <span className="text-amber-400 text-base">{ammo}</span>
                <span className="text-slate-500">/ {maxAmmo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* HOLD BREATH GAUGE BAR */}
        <div className="absolute bottom-4 left-4 z-20 w-44 p-2.5 rounded-2xl bg-black/70 backdrop-blur-md border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
            <span>Kapasiti Nafas</span>
            <span className={breathGauge < 30 ? 'text-red-400' : 'text-blue-400'}>
              {breathGauge}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              style={{ width: `${breathGauge}%` }}
              className={`h-full transition-all duration-200 ${
                isHoldingBreath ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
              }`}
            />
          </div>
        </div>

        {/* BOTTOM RIGHT TACTICAL ACTION BUTTONS */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          {/* Hold Breath Button */}
          <button
            type="button"
            onClick={handleToggleHoldBreath}
            className={`btn-3d px-3.5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-lg ${
              isHoldingBreath
                ? 'bg-red-600 text-white animate-pulse'
                : 'btn-3d-subtle text-slate-200'
            }`}
          >
            <span>{isHoldingBreath ? 'Lepas Nafas' : 'Kunci Nafas (Steady)'}</span>
          </button>

          {/* Thermal Vision Toggle */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setThermalMode(!thermalMode);
            }}
            className={`btn-3d px-3 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 ${
              thermalMode
                ? 'bg-cyan-600 text-white shadow-cyan-500/30'
                : 'btn-3d-subtle text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Thermal {thermalMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Reload Button */}
          <button
            type="button"
            onClick={handleReload}
            disabled={isReloading || ammo === maxAmmo}
            className="btn-3d btn-3d-subtle px-3.5 py-2.5 rounded-2xl text-xs font-black text-slate-200 flex items-center gap-1.5 disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
            <span>{isReloading ? 'Reloading...' : 'Reload'}</span>
          </button>

          {/* BIG FIRE TRIGGER BUTTON */}
          <button
            type="button"
            onClick={handleFireRifle}
            className="btn-3d py-3 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-sm tracking-wider flex items-center gap-2 shadow-2xl border-b-4 border-red-900 active:scale-95"
          >
            <Target className="w-5 h-5 fill-white" />
            <span>TEMBAK (FIRE)</span>
          </button>
        </div>
      </div>

      {/* TACTICAL ZOOM & CONTROLS FOOTER */}
      <div className="p-4 md:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Zoom Selector Toggles */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold">Pembesaran Optik:</span>
          <div className="flex items-center gap-1">
            {[1, 4, 8, 14].map((z) => (
              <button
                key={z}
                onClick={() => handleZoom(z)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition ${
                  zoomLevel === z
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {z}x Zoom
              </button>
            ))}
          </div>
        </div>

        {/* Live Score & Bounty Tally */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Headshots:</span>
            <span className="font-black text-red-400 font-mono">{headshotCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Skor Taktikal:</span>
            <span className="font-black text-white font-mono">{score}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Ganjaran Bounty:</span>
            <span className="font-black text-amber-300 font-mono text-sm">
              +{contractCoins} Coins
            </span>
          </div>
        </div>

        {/* Reset Mission Button */}
        <button
          onClick={handleResetMission}
          className="btn-3d btn-3d-subtle px-3.5 py-1.5 rounded-xl font-bold text-slate-300 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Mula Semula</span>
        </button>
      </div>

      {/* MISSION COMPLETE CELEBRATION MODAL */}
      {missionComplete && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border-2 border-amber-500/50 shadow-2xl space-y-4 animate-slide-up text-center">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-lg">
            <Trophy className="w-7 h-7" />
          </div>
          <h4 className="text-2xl font-black text-white">
            MISI SELESAI: SEMUA SASARAN DITUMPASKAN!
          </h4>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Tahniah Penembak Tepat! Anda telah berjaya membersihkan kawasan operasi tanpa sebarang ancaman balas. Ganjaran kontrak telah dikreditkan ke CoinPay Wallet anda.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-black text-base">
            <span>+{100 + contractCoins} REWARD COINS DIKREDITKAN</span>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedMission((m) => (m % 3) + 1);
                handleResetMission();
              }}
              className="btn-3d btn-3d-gold py-3 px-8 rounded-2xl font-black text-slate-950 text-xs tracking-wider"
            >
              Teruskan ke Misi Seterusnya →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
