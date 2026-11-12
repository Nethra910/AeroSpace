import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const TAU = Math.PI * 2;
const EARTH_R = 3;
const ORBIT_R = 5.2;
const INCLINATION = THREE.MathUtils.degToRad(51.6);
const ORBIT_PERIOD = 92.68 * 60; // seconds (simulated)
const SIDEREAL_DAY = 86164; // seconds
const TIME_K = ORBIT_PERIOD / 40; // at 1x one orbit takes 40 real seconds
const PHASE0 = 0.9;
const STATION_SCALE = 0.7;
const SUN_DIR = new THREE.Vector3(1, 0.28, 0.6).normalize();
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);

const VIEWS = [
  { id: "free", label: "Free", key: "1", pos: [8, 6, 12] },
  { id: "top", label: "Top", key: "2", pos: [0, 17, 0.01] },
  { id: "side", label: "Side", key: "3", pos: [16, 1.5, 0] },
  { id: "chase", label: "Chase", key: "4", pos: null },
];

const SPEEDS = [
  { id: 0, label: "Pause" },
  { id: 1, label: "1×" },
  { id: 4, label: "4×" },
  { id: 16, label: "16×" },
];

/* -------------------------------------------------------------------------- */
/*  Procedural noise + planet textures (no external assets needed)            */
/* -------------------------------------------------------------------------- */

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;
const ss = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const hash3 = (x, y, z) => {
  let h =
    Math.imul(x, 374761393) ^
    Math.imul(y, 668265263) ^
    Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const noise3 = (x, y, z) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = ss(0, 1, x - xi);
  const yf = ss(0, 1, y - yi);
  const zf = ss(0, 1, z - zi);

  return lerp(
    lerp(
      lerp(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), xf),
      lerp(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), xf),
      yf,
    ),
    lerp(
      lerp(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), xf),
      lerp(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), xf),
      yf,
    ),
    zf,
  );
};

const fbm = (x, y, z, octaves) => {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum +=
      amp * noise3(x * freq + i * 17.3, y * freq + i * 9.1, z * freq + i * 5.7);
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
};

const makeCanvas = (w, h) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

function buildPlanetTextures(W = 1024, H = 512) {
  const dayCanvas = makeCanvas(W, H);
  const nightCanvas = makeCanvas(W, H);
  const cloudCanvas = makeCanvas(W, H);

  const dayImg = new ImageData(W, H);
  const nightImg = new ImageData(W, H);
  const cloudImg = new ImageData(W, H);

  const SEA = 0.535;

  for (let y = 0; y < H; y++) {
    const lat = (0.5 - (y + 0.5) / H) * Math.PI;
    const sl = Math.sin(lat);
    const cl = Math.cos(lat);
    const latAbs = Math.abs(lat) / (Math.PI / 2);

    for (let x = 0; x < W; x++) {
      const phi = ((x + 0.5) / W) * TAU;
      const px = -Math.cos(phi) * cl;
      const pz = Math.sin(phi) * cl;
      const py = sl;
      const i = (y * W + x) * 4;

      const h = fbm(px * 1.7 + 3.1, py * 1.7, pz * 1.7, 6);
      let r;
      let g;
      let b;
      let land = false;
      let e = 0;

      if (h < SEA) {
        const depth = Math.pow(clamp01((SEA - h) / 0.2), 0.65);
        r = lerp(46, 6, depth);
        g = lerp(128, 30, depth);
        b = lerp(176, 76, depth);
      } else {
        land = true;
        e = h - SEA;
        const moist = fbm(px * 3.4 + 11, py * 3.4, pz * 3.4, 4);
        const grass = ss(0.4, 0.65, moist);
        r = lerp(34, 96, grass);
        g = lerp(84, 130, grass);
        b = lerp(44, 60, grass);

        const arid = ss(0.55, 0.4, moist) * (1 - ss(0.35, 0.7, latAbs));
        r = lerp(r, 202, arid);
        g = lerp(g, 172, arid);
        b = lerp(b, 112, arid);

        const tundra = ss(0.6, 0.86, latAbs);
        r = lerp(r, 128, tundra);
        g = lerp(g, 132, tundra);
        b = lerp(b, 118, tundra);

        const mtn = ss(0.08, 0.17, e);
        r = lerp(r, 108, mtn);
        g = lerp(g, 98, mtn);
        b = lerp(b, 86, mtn);

        const snow = ss(0.17, 0.26, e);
        r = lerp(r, 240, snow);
        g = lerp(g, 244, snow);
        b = lerp(b, 250, snow);
      }

      const iceNoise = noise3(px * 6, py * 6, pz * 6);
      const ice = ss(0.82, 0.9, latAbs + (iceNoise - 0.5) * 0.14);
      r = lerp(r, land ? 236 : 214, ice);
      g = lerp(g, land ? 242 : 230, ice);
      b = lerp(b, land ? 250 : 244, ice);

      dayImg.data[i] = r;
      dayImg.data[i + 1] = g;
      dayImg.data[i + 2] = b;
      dayImg.data[i + 3] = 255;

      // City lights
      if (land && e > 0.004) {
        const pop = fbm(px * 4 + 50, py * 4, pz * 4, 3);
        const dots = noise3(px * 38, py * 38, pz * 38);
        const v =
          ss(0.5, 0.62, pop) *
          (0.12 + 0.88 * ss(0.7, 0.9, dots)) *
          (1 - ss(0.6, 0.8, latAbs)) *
          (1 - ss(0.1, 0.25, e));
        nightImg.data[i] = 255 * v;
        nightImg.data[i + 1] = 190 * v;
        nightImg.data[i + 2] = 110 * v;
      }
      nightImg.data[i + 3] = 255;

      // Clouds
      const c = fbm(px * 2.4 + 70, py * 3.2 + 20, pz * 2.4, 5);
      cloudImg.data[i] = 255;
      cloudImg.data[i + 1] = 255;
      cloudImg.data[i + 2] = 255;
      cloudImg.data[i + 3] = ss(0.5, 0.72, c) * 230;
    }
  }

  dayCanvas.getContext("2d").putImageData(dayImg, 0, 0);
  nightCanvas.getContext("2d").putImageData(nightImg, 0, 0);
  cloudCanvas.getContext("2d").putImageData(cloudImg, 0, 0);

  return { dayCanvas, nightCanvas, cloudCanvas };
}

function buildNebulaCanvas(W = 512, H = 256) {
  const canvas = makeCanvas(W, H);
  const img = new ImageData(W, H);

  for (let y = 0; y < H; y++) {
    const lat = (0.5 - (y + 0.5) / H) * Math.PI;
    const cl = Math.cos(lat);
    const sl = Math.sin(lat);
    for (let x = 0; x < W; x++) {
      const phi = ((x + 0.5) / W) * TAU;
      const px = -Math.cos(phi) * cl;
      const pz = Math.sin(phi) * cl;
      // tilted galactic band
      const band = Math.exp(-Math.pow((sl * 0.88 + px * 0.47) * 3.1, 2));
      const n = fbm(px * 2.2 + 5, sl * 2.2, pz * 2.2, 5);
      const v = Math.pow(ss(0.42, 0.85, n), 1.4) * band;
      const tint = noise3(px * 1.4 + 9, sl * 1.4, pz * 1.4);
      const i = (y * W + x) * 4;
      img.data[i] = lerp(60, 150, tint) * v * 0.9;
      img.data[i + 1] = lerp(70, 70, tint) * v * 0.9;
      img.data[i + 2] = lerp(150, 160, tint) * v * 0.9;
      img.data[i + 3] = 255;
    }
  }
  canvas.getContext("2d").putImageData(img, 0, 0);
  return canvas;
}

function buildPanelTexture() {
  const c = makeCanvas(128, 128);
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#0b2d5c";
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = "#3f86d6";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 128; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 128);
    ctx.moveTo(0, i);
    ctx.lineTo(128, i);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(120,190,255,0.35)";
  ctx.lineWidth = 1;
  for (let i = 16; i < 128; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 128);
    ctx.stroke();
  }
  return c;
}

function buildGlowCanvas() {
  const c = makeCanvas(256, 256);
  const ctx = c.getContext("2d");
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.08, "rgba(255,244,214,0.95)");
  grad.addColorStop(0.25, "rgba(255,210,140,0.35)");
  grad.addColorStop(1, "rgba(255,180,90,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return c;
}

/* -------------------------------------------------------------------------- */
/*  Shaders                                                                   */
/* -------------------------------------------------------------------------- */

const EARTH_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const EARTH_FRAG = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform vec3 sunDir;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vWorldPos;
  void main() {
    vec3 n = normalize(vN);
    float ndl = dot(n, sunDir);
    float day = smoothstep(-0.12, 0.22, ndl);

    vec3 d = texture2D(dayMap, vUv).rgb;
    vec3 city = texture2D(nightMap, vUv).rgb;

    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

    vec3 lit = d * (0.06 + max(ndl, 0.0) * 0.98);
    float twilight = smoothstep(-0.2, 0.0, ndl) * (1.0 - smoothstep(0.0, 0.3, ndl));
    lit += vec3(1.0, 0.42, 0.18) * twilight * 0.12;

    vec3 night = d * 0.025 + city * 1.25;
    vec3 col = mix(night, lit, day);
    col += vec3(0.25, 0.55, 1.0) * fres * 0.32 * (0.2 + day);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const ATMO_VERT = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vViewPos;
  varying vec3 vWorldN;
  void main() {
    vNormalV = normalize(normalMatrix * normal);
    vWorldN = normalize(mat3(modelMatrix) * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const ATMO_FRAG = /* glsl */ `
  uniform vec3 sunDir;
  varying vec3 vNormalV;
  varying vec3 vViewPos;
  varying vec3 vWorldN;
  void main() {
    vec3 viewDir = normalize(-vViewPos);
    float d = dot(normalize(vNormalV), viewDir);
    float i = pow(clamp(-d * 2.1, 0.0, 1.0), 2.0);
    float sun = 0.22 + 0.78 * smoothstep(-0.35, 0.45, dot(normalize(vWorldN), sunDir));
    vec3 col = mix(vec3(0.2, 0.5, 1.0), vec3(0.45, 0.8, 1.0), sun) * i * 1.5 * sun;
    gl_FragColor = vec4(col, i * sun);
  }
`;

const OUTPUT_SHADER = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    vec3 toSRGB(vec3 c) {
      c = clamp(c, 0.0, 1.0);
      return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
    }
    void main() {
      vec4 t = texture2D(tDiffuse, vUv);
      gl_FragColor = vec4(toSRGB(t.rgb), 1.0);
    }
  `,
};

/* -------------------------------------------------------------------------- */
/*  Orbital helpers                                                           */
/* -------------------------------------------------------------------------- */

const vecToLatLon = (v) => {
  const lat = THREE.MathUtils.radToDeg(
    Math.asin(THREE.MathUtils.clamp(v.y / v.length(), -1, 1)),
  );
  let phi = Math.atan2(v.z, -v.x);
  if (phi < 0) phi += TAU;
  let lon = THREE.MathUtils.radToDeg(phi) - 180;
  lon = ((lon + 540) % 360) - 180;
  return { lat, lon };
};

const groundPoint = (simT) => {
  const a = PHASE0 + (simT / ORBIT_PERIOD) * TAU;
  const earthRot = (simT / SIDEREAL_DAY) * TAU;
  const v = new THREE.Vector3(Math.cos(a), 0, Math.sin(a))
    .applyAxisAngle(X_AXIS, INCLINATION)
    .applyAxisAngle(Y_AXIS, -earthRot);
  return vecToLatLon(v);
};

const pad = (n) => String(Math.floor(n)).padStart(2, "0");
const formatMET = (s) => {
  const t = Math.max(0, s);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = t % 60;
  return `T+${pad(h)}:${pad(m)}:${pad(sec)}`;
};
const formatLat = (v) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? "N" : "S"}`;
const formatLon = (v) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? "E" : "W"}`;

/* -------------------------------------------------------------------------- */
/*  Small UI pieces                                                           */
/* -------------------------------------------------------------------------- */

function Segmented({ options, value, onChange, label }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex overflow-hidden rounded-lg border border-white/10 bg-space-950/70 p-0.5 backdrop-blur-md"
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors md:text-sm ${
              active
                ? "bg-cyan-400 text-slate-950 shadow-[0_0_18px_rgba(62,224,255,0.45)]"
                : "text-muted hover:bg-white/10"
            }`}
          >
            {opt.label}
            {opt.key && (
              <span
                className={`ml-1.5 hidden text-[10px] md:inline ${active ? "text-slate-700" : "text-muted"}`}
              >
                {opt.key}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function LayerToggle({ label, on, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 py-1 text-left text-xs text-muted hover:text-white"
    >
      <span>{label}</span>
      <span
        className={`relative h-4 w-7 rounded-full transition-colors ${on ? "bg-cyan-400" : "bg-slate-700"}`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${on ? "left-3.5" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

function Stat({ label, value, unit, accent }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-lg tabular-nums ${accent ? "text-signal" : "text-ink"}`}
      >
        {value}
        {unit && <span className="ml-1 text-xs text-muted">{unit}</span>}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

function Simulation() {
  const stageRef = useRef(null);
  const mountRef = useRef(null);
  const labelRef = useRef(null);
  const mapRef = useRef(null);
  const apiRef = useRef({});
  const lastSpeedRef = useRef(1);
  const liveRef = useRef({
    speed: 1,
    view: "free",
    selected: false,
    hover: false,
    layers: { orbit: true, clouds: true, atmosphere: true, labels: true },
  });

  const [selected, setSelectedState] = useState(false);
  const [view, setViewState] = useState("free");
  const [speed, setSpeedState] = useState(1);
  const [layers, setLayers] = useState(liveRef.current.layers);
  const [ready, setReady] = useState(false);
  const [telemetry, setTelemetry] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    liveRef.current.layers = layers;
  }, [layers]);

  const select = useCallback((value) => {
    liveRef.current.selected = value;
    setSelectedState(value);
  }, []);

  const changeView = useCallback((mode) => {
    liveRef.current.view = mode;
    setViewState(mode);
    apiRef.current.goTo?.(mode);
  }, []);

  const changeSpeed = useCallback((value) => {
    if (value > 0) lastSpeedRef.current = value;
    liveRef.current.speed = value;
    setSpeedState(value);
  }, []);

  const togglePause = useCallback(() => {
    changeSpeed(liveRef.current.speed === 0 ? lastSpeedRef.current || 1 : 0);
  }, [changeSpeed]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      stageRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* ------------------------------ Scene setup ----------------------------- */
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const live = liveRef.current;
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const sim = { t: ORBIT_PERIOD * 0.12 };

    const getSize = () => ({
      w: Math.max(container.clientWidth, 1),
      h: Math.max(container.clientHeight, 1),
    });
    let { w, h } = getSize();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#060A13");

    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 1200);
    const introFrom = new THREE.Vector3(24, 15, 32);
    camera.position.copy(introFrom);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.7;
    controls.minDistance = 1.5;
    controls.maxDistance = 60;

    /* Post-processing */
    const renderTarget = new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
      samples: 4,
    });
    const composer = new EffectComposer(renderer, renderTarget);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.5, 0.65, 0.82);
    composer.addPass(bloom);
    // Final pass: linear -> sRGB (works on every three.js version, no OutputPass needed)
    composer.addPass(new ShaderPass(OUTPUT_SHADER));

    /* Environment for metallic station materials */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    const envMap = envRT.texture;

    /* Lighting */
    const sun = new THREE.DirectionalLight(0xfff2de, 3);
    sun.position.copy(SUN_DIR).multiplyScalar(60);
    scene.add(sun);
    scene.add(new THREE.HemisphereLight(0x9fc8ff, 0x0a0f1c, 0.35));

    /* Backdrop */
    const nebulaTex = new THREE.CanvasTexture(buildNebulaCanvas());
    nebulaTex.colorSpace = THREE.SRGBColorSpace;
    const nebula = new THREE.Mesh(
      new THREE.SphereGeometry(480, 48, 32),
      new THREE.MeshBasicMaterial({
        map: nebulaTex,
        side: THREE.BackSide,
        depthWrite: false,
        transparent: true,
        opacity: 0.85,
      }),
    );
    nebula.renderOrder = -2;
    scene.add(nebula);

    const makeStars = (count, size, opacity) => {
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const c = new THREE.Color();
      for (let i = 0; i < count; i++) {
        const u = Math.random() * 2 - 1;
        const a = Math.random() * TAU;
        const s = Math.sqrt(1 - u * u);
        const r = 300 + Math.random() * 120;
        pos.set([r * s * Math.cos(a), r * u, r * s * Math.sin(a)], i * 3);
        c.setHSL(
          0.55 + Math.random() * 0.15 - (Math.random() > 0.8 ? 0.45 : 0),
          0.5,
          0.75 + Math.random() * 0.25,
        );
        col.set([c.r, c.g, c.b], i * 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      const pts = new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          size,
          sizeAttenuation: false,
          vertexColors: true,
          transparent: true,
          opacity,
          depthWrite: false,
        }),
      );
      pts.renderOrder = -1;
      return pts;
    };
    const starsFar = makeStars(2600, 1.4, 0.85);
    const starsBright = makeStars(140, 2.6, 1);
    scene.add(starsFar, starsBright);

    const glowTex = new THREE.CanvasTexture(buildGlowCanvas());
    const sunSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      }),
    );
    sunSprite.position.copy(SUN_DIR).multiplyScalar(140);
    sunSprite.scale.setScalar(80);
    scene.add(sunSprite);

    /* Earth */
    const { dayCanvas, nightCanvas, cloudCanvas } = buildPlanetTextures();
    const dayTex = new THREE.CanvasTexture(dayCanvas);
    const nightTex = new THREE.CanvasTexture(nightCanvas);
    const cloudTex = new THREE.CanvasTexture(cloudCanvas);
    [dayTex, nightTex, cloudTex].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    });

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_R, 96, 96),
      new THREE.ShaderMaterial({
        vertexShader: EARTH_VERT,
        fragmentShader: EARTH_FRAG,
        uniforms: {
          dayMap: { value: dayTex },
          nightMap: { value: nightTex },
          sunDir: { value: SUN_DIR.clone() },
        },
      }),
    );
    scene.add(earth);

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_R * 1.012, 96, 96),
      new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        depthWrite: false,
        roughness: 1,
        metalness: 0,
        opacity: 0.88,
      }),
    );
    scene.add(clouds);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_R * 1.14, 96, 96),
      new THREE.ShaderMaterial({
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        uniforms: { sunDir: { value: SUN_DIR.clone() } },
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    );
    scene.add(atmosphere);

    /* Orbit group (tilted plane) */
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = INCLINATION;
    scene.add(orbitGroup);

    const ringPts = [];
    for (let i = 0; i <= 256; i++) {
      const a = (i / 256) * TAU;
      ringPts.push(
        new THREE.Vector3(Math.cos(a) * ORBIT_R, 0, Math.sin(a) * ORBIT_R),
      );
    }
    const orbitLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(ringPts),
      new THREE.LineBasicMaterial({
        color: "#3EE0FF",
        transparent: true,
        opacity: 0.28,
      }),
    );
    orbitGroup.add(orbitLine);

    const TRAIL_N = 110;
    const trailPos = new Float32Array(TRAIL_N * 3);
    const trailCol = new Float32Array(TRAIL_N * 3);
    for (let i = 0; i < TRAIL_N; i++) {
      const f = Math.pow(i / (TRAIL_N - 1), 1.6);
      trailCol.set([0.24 * f * 2.2, 0.88 * f * 2.2, 1.0 * f * 2.2], i * 3);
    }
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setAttribute("color", new THREE.BufferAttribute(trailCol, 3));
    const trail = new THREE.Line(
      trailGeo,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    );
    trail.frustumCulled = false;
    orbitGroup.add(trail);

    /* Station */
    const station = new THREE.Group();
    const stationMats = [];
    const addMat = (params) => {
      const m = new THREE.MeshStandardMaterial({
        envMap,
        envMapIntensity: 0.8,
        ...params,
      });
      stationMats.push(m);
      return m;
    };

    const hull = addMat({ color: "#E9EEF6", metalness: 0.65, roughness: 0.32 });
    const gold = addMat({ color: "#c9a14a", metalness: 0.85, roughness: 0.35 });
    const truss = addMat({ color: "#9aa6b8", metalness: 0.7, roughness: 0.45 });

    const panelTexture = new THREE.CanvasTexture(buildPanelTexture());
    panelTexture.colorSpace = THREE.SRGBColorSpace;
    panelTexture.wrapS = panelTexture.wrapT = THREE.RepeatWrapping;
    panelTexture.repeat.set(2, 3);
    const panelMat = addMat({
      map: panelTexture,
      color: "#ffffff",
      metalness: 0.55,
      roughness: 0.3,
    });

    const addMesh = (geo, mat, pos = [0, 0, 0], rot = [0, 0, 0]) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(...pos);
      m.rotation.set(...rot);
      station.add(m);
      return m;
    };

    addMesh(
      new THREE.CylinderGeometry(0.17, 0.17, 1.5, 24),
      hull,
      [0, 0, 0],
      [0, 0, Math.PI / 2],
    );
    addMesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.9, 24),
      hull,
      [0.25, 0, 0],
      [Math.PI / 2, 0, 0],
    );
    addMesh(new THREE.SphereGeometry(0.22, 24, 24), gold);
    addMesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.12, 24),
      gold,
      [0.78, 0, 0],
      [0, 0, Math.PI / 2],
    );
    addMesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.12, 24),
      gold,
      [-0.78, 0, 0],
      [0, 0, Math.PI / 2],
    );
    addMesh(new THREE.BoxGeometry(0.07, 3.3, 0.07), truss);

    [
      [-0.38, 0.98],
      [0.38, 0.98],
      [-0.38, -0.98],
      [0.38, -0.98],
    ].forEach(([x, y]) =>
      addMesh(new THREE.BoxGeometry(0.6, 1.1, 0.012), panelMat, [x, y, 0]),
    );

    addMesh(new THREE.BoxGeometry(0.5, 0.02, 0.35), hull, [0.5, 0.0, 0.2]);
    const dish = addMesh(
      new THREE.ConeGeometry(0.16, 0.1, 24, 1, true),
      hull,
      [-0.5, 0.22, 0],
      [Math.PI, 0, 0],
    );
    dish.material.side = THREE.DoubleSide;

    const navRed = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      new THREE.MeshBasicMaterial({ color: "#ff3b5c" }),
    );
    navRed.position.set(0, 1.68, 0);
    const navGreen = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      new THREE.MeshBasicMaterial({ color: "#3dff9a" }),
    );
    navGreen.position.set(0, -1.68, 0);
    station.add(navRed, navGreen);

    // Generous invisible hit target so the station is easy to click
    const hitTarget = new THREE.Mesh(
      new THREE.SphereGeometry(1.7, 12, 12),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    station.add(hitTarget);

    station.scale.setScalar(STATION_SCALE);
    orbitGroup.add(station);

    /* Selection ring */
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.9, 0.96, 64),
      new THREE.MeshBasicMaterial({
        color: "#3EE0FF",
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
      }),
    );
    ring.visible = false;
    ring.renderOrder = 10;
    scene.add(ring);

    /* Interaction */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const canvasEl = renderer.domElement;

    const hitsStation = (event) => {
      const rect = canvasEl.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObject(station, true).length > 0;
    };

    let downX = 0;
    let downY = 0;
    const onPointerDown = (e) => {
      downX = e.clientX;
      downY = e.clientY;
    };
    const onPointerUp = (e) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) return;
      select(hitsStation(e));
    };
    const onPointerMove = (e) => {
      if (e.buttons !== 0) return;
      const hit = hitsStation(e);
      live.hover = hit;
      canvasEl.style.cursor = hit ? "pointer" : "grab";
    };
    const onPointerLeave = () => {
      live.hover = false;
    };
    canvasEl.style.cursor = "grab";
    canvasEl.addEventListener("pointerdown", onPointerDown);
    canvasEl.addEventListener("pointerup", onPointerUp);
    canvasEl.addEventListener("pointermove", onPointerMove);
    canvasEl.addEventListener("pointerleave", onPointerLeave);

    /* Camera choreography */
    let tween = null;
    let chaseSettle = 0;
    const easeInOut = (k) =>
      k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

    const startTween = (toPos, toTarget, dur) => {
      tween = {
        t: 0,
        dur: reduced ? 0.01 : dur,
        fromPos: camera.position.clone(),
        toPos: new THREE.Vector3(...toPos),
        fromTarget: controls.target.clone(),
        toTarget: toTarget.clone(),
      };
    };

    startTween(VIEWS[0].pos, new THREE.Vector3(), 2.6);

    apiRef.current.goTo = (mode) => {
      if (mode === "chase") {
        tween = null;
        chaseSettle = 1.6;
        controls.minDistance = 1.2;
        return;
      }
      const preset = VIEWS.find((v) => v.id === mode);
      if (preset?.pos) startTween(preset.pos, new THREE.Vector3(), 1.4);
    };

    const onControlsStart = () => {
      tween = null;
      if (live.view === "top" || live.view === "side") {
        live.view = "free";
        setViewState("free");
      }
    };
    controls.addEventListener("start", onControlsStart);

    /* Resize */
    const handleResize = () => {
      ({ w, h } = getSize());
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    /* Ground track + minimap */
    const track = [];
    const TRACK_STEP = 45;
    let lastSample = sim.t;
    for (let k = -ORBIT_PERIOD; k <= 0; k += TRACK_STEP) {
      track.push(groundPoint(sim.t + k));
    }

    const drawMap = (gp, sub) => {
      const canvas = mapRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const X = (lon) => ((lon + 180) / 360) * W;
      const Y = (lat) => (0.5 - lat / 180) * H;

      ctx.drawImage(dayCanvas, 0, 0, W, H);

      // night side
      const latS = THREE.MathUtils.degToRad(
        Math.abs(sub.lat) < 0.5 ? 0.5 : sub.lat,
      );
      const lonS = THREE.MathUtils.degToRad(sub.lon);
      ctx.beginPath();
      for (let px = 0; px <= W; px += 4) {
        const lon = THREE.MathUtils.degToRad((px / W) * 360 - 180);
        const la = Math.atan(-Math.cos(lon - lonS) / Math.tan(latS));
        const py = (0.5 - la / Math.PI) * H;
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      if (latS >= 0) {
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
      } else {
        ctx.lineTo(W, 0);
        ctx.lineTo(0, 0);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(3,6,16,0.62)";
      ctx.fill();

      // grid
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let lon = -150; lon <= 150; lon += 30) {
        ctx.moveTo(X(lon), 0);
        ctx.lineTo(X(lon), H);
      }
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.moveTo(0, Y(lat));
        ctx.lineTo(W, Y(lat));
      }
      ctx.stroke();

      // track
      ctx.strokeStyle = "rgba(62,224,255,0.9)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      let prev = null;
      track.forEach((p) => {
        const x = X(p.lon);
        const y = Y(p.lat);
        if (!prev || Math.abs(x - prev.x) > W / 2) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        prev = { x, y };
      });
      ctx.stroke();

      // sun
      ctx.fillStyle = "#ffd36b";
      ctx.beginPath();
      ctx.arc(X(sub.lon), Y(sub.lat), 5, 0, TAU);
      ctx.fill();

      // station
      ctx.strokeStyle = "rgba(62,224,255,0.45)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(X(gp.lon), Y(gp.lat), 9, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = "#3EE0FF";
      ctx.beginPath();
      ctx.arc(X(gp.lon), Y(gp.lat), 4, 0, TAU);
      ctx.fill();
    };

    /* Animation loop */
    const clock = new THREE.Clock();
    const P = new THREE.Vector3();
    const prevP = new THREE.Vector3();
    let hasPrev = false;
    const tmp = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const earthSphere = new THREE.Sphere(new THREE.Vector3(), EARTH_R);
    const losRay = new THREE.Ray();
    const losHit = new THREE.Vector3();
    let tickAcc = 1;
    let firstFrame = true;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;
      sim.t += dt * live.speed * TIME_K;

      const angle = PHASE0 + (sim.t / ORBIT_PERIOD) * TAU;
      const earthRot = (sim.t / SIDEREAL_DAY) * TAU;

      earth.rotation.y = earthRot;
      clouds.rotation.y = earthRot * 1.04 + time * 0.002;
      starsFar.rotation.y += dt * 0.0015;
      starsBright.rotation.y += dt * 0.0015;

      station.position.set(
        Math.cos(angle) * ORBIT_R,
        0,
        Math.sin(angle) * ORBIT_R,
      );
      station.rotation.y = -angle - Math.PI / 2;
      station.getWorldPosition(P);

      // trail
      const arc = 0.85;
      for (let i = 0; i < TRAIL_N; i++) {
        const a = angle - arc * (1 - i / (TRAIL_N - 1));
        trailPos[i * 3] = Math.cos(a) * ORBIT_R;
        trailPos[i * 3 + 1] = 0;
        trailPos[i * 3 + 2] = Math.sin(a) * ORBIT_R;
      }
      trailGeo.attributes.position.needsUpdate = true;

      // eclipse + lighting response
      const along = P.dot(SUN_DIR);
      const perp = tmp.copy(P).addScaledVector(SUN_DIR, -along).length();
      const eclipsed = along < 0 && perp < EARTH_R;
      const envTarget = eclipsed ? 0.12 : 0.8;
      stationMats.forEach((m) => {
        m.envMapIntensity +=
          (envTarget - m.envMapIntensity) * Math.min(1, dt * 4);
      });
      navRed.visible = Math.sin(time * 5) > 0;
      navGreen.visible = Math.sin(time * 5 + 2.4) > 0;

      // layers
      orbitLine.visible = live.layers.orbit;
      trail.visible = live.layers.orbit;
      clouds.visible = live.layers.clouds;
      atmosphere.visible = live.layers.atmosphere;

      // camera: tween or follow
      if (tween) {
        tween.t += dt / tween.dur;
        const k = easeInOut(Math.min(1, tween.t));
        camera.position.lerpVectors(tween.fromPos, tween.toPos, k);
        controls.target.lerpVectors(tween.fromTarget, tween.toTarget, k);
        if (tween.t >= 1) tween = null;
      } else if (live.view === "chase") {
        if (hasPrev) camera.position.add(tmp.copy(P).sub(prevP));
        if (chaseSettle > 0) {
          chaseSettle -= dt;
          const tangent = new THREE.Vector3(1, 0, 0).applyQuaternion(
            station.getWorldQuaternion(q),
          );
          const normal = new THREE.Vector3(0, 1, 0).applyQuaternion(
            orbitGroup.quaternion,
          );
          const desired = P.clone()
            .addScaledVector(P.clone().normalize(), 2.4)
            .addScaledVector(tangent, -2.2)
            .addScaledVector(normal, 1.1);
          const f = 1 - Math.pow(0.002, dt);
          camera.position.lerp(desired, f);
          controls.target.lerp(P, f);
        } else {
          controls.target.copy(P);
        }
      }
      prevP.copy(P);
      hasPrev = true;
      if (live.view !== "chase" && controls.minDistance < 3.4)
        controls.minDistance = 3.4;

      // selection ring
      if (live.selected || live.hover) {
        const dist = camera.position.distanceTo(P);
        const radius = Math.max(1.0, dist * 0.05);
        ring.visible = true;
        ring.position.copy(P);
        ring.quaternion.copy(camera.quaternion);
        ring.scale.setScalar((radius / 0.96) * (1 + 0.05 * Math.sin(time * 3)));
        ring.material.opacity = live.selected ? 0.9 : 0.4;
      } else {
        ring.visible = false;
      }

      controls.update();
      composer.render();

      // HTML label
      const label = labelRef.current;
      if (label) {
        if (live.layers.labels) {
          tmp.copy(P).project(camera);
          if (tmp.z < 1) {
            const lx = (tmp.x * 0.5 + 0.5) * w;
            const ly = (-tmp.y * 0.5 + 0.5) * h;
            const dir = P.clone().sub(camera.position);
            const dist = dir.length();
            losRay.set(camera.position, dir.normalize());
            const hit = losRay.intersectSphere(earthSphere, losHit);
            const occluded = hit && camera.position.distanceTo(losHit) < dist;
            label.style.transform = `translate3d(${lx + 16}px, ${ly - 38}px, 0)`;
            label.style.opacity = occluded ? "0.15" : "1";
          } else {
            label.style.opacity = "0";
          }
        } else {
          label.style.opacity = "0";
        }
      }

      // telemetry tick (4 Hz)
      tickAcc += dt;
      if (tickAcc >= 0.25) {
        tickAcc = 0;
        while (sim.t - lastSample >= TRACK_STEP) {
          lastSample += TRACK_STEP;
          track.push(groundPoint(lastSample));
          if (track.length > 220) track.shift();
        }
        const gp = groundPoint(sim.t);
        const sub = vecToLatLon(
          SUN_DIR.clone().applyAxisAngle(Y_AXIS, -earthRot),
        );
        drawMap(gp, sub);

        const alt = 408 + 4 * Math.sin(2 * angle);
        setTelemetry({
          lat: gp.lat,
          lon: gp.lon,
          alt,
          vel: 7.66 - (alt - 408) * 0.0007,
          orbit: Math.floor(sim.t / ORBIT_PERIOD) + 1,
          sunlit: !eclipsed,
          met: sim.t,
        });
      }

      if (firstFrame) {
        firstFrame = false;
        setReady(true);
      }
    };

    animate();

    /* Cleanup */
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      apiRef.current.goTo = null;
      controls.removeEventListener("start", onControlsStart);
      canvasEl.removeEventListener("pointerdown", onPointerDown);
      canvasEl.removeEventListener("pointerup", onPointerUp);
      canvasEl.removeEventListener("pointermove", onPointerMove);
      canvasEl.removeEventListener("pointerleave", onPointerLeave);

      controls.dispose();

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value && value.isTexture) value.dispose();
            });
            if (material.uniforms) {
              Object.values(material.uniforms).forEach((u) => {
                if (u.value && u.value.isTexture) u.value.dispose();
              });
            }
            material.dispose();
          });
        }
      });

      [dayTex, nightTex, cloudTex, nebulaTex, panelTexture, glowTex].forEach(
        (t) => t.dispose(),
      );
      envRT.dispose();
      pmrem.dispose();
      bloom.dispose?.();
      composer.dispose?.();
      renderTarget.dispose();
      renderer.dispose();

      if (container.contains(canvasEl)) container.removeChild(canvasEl);
    };
  }, [select]);

  /* --------------------------- Keyboard shortcuts -------------------------- */
  const onKeyDown = (e) => {
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === " ") {
      e.preventDefault();
      togglePause();
      return;
    }
    const v = VIEWS.find((item) => item.key === e.key);
    if (v) {
      changeView(v.id);
      return;
    }
    if (e.key === "f" || e.key === "F") toggleFullscreen();
  };

  const toggleLayer = (key) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  /* --------------------------------- Render -------------------------------- */
  return (
    <section className="min-h-screen bg-space-950 px-4 py-10 text-ink md:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-signal">
          Mission Control
        </p>

        <h1 className="mb-3 text-3xl font-bold md:text-5xl">
          Live 3D Simulation
        </h1>

        <p className="mb-8 max-w-2xl text-muted">
          Explore the orbital environment and interact with the simulation. Drag
          to orbit, scroll to zoom, and select the station to lock on to its
          telemetry.
        </p>

        {/* ------------------------------ Stage ------------------------------ */}
        <div
          ref={stageRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={() => stageRef.current?.focus({ preventScroll: true })}
          className="relative h-[540px] overflow-hidden rounded-2xl border border-white/10 bg-space-950 shadow-[0_0_90px_-25px_rgba(62,224,255,0.35)] outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/60 md:h-[680px] [&:fullscreen]:h-screen [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
        >
          <div ref={mountRef} className="absolute inset-0" />

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(6,10,19,0.75)_100%)]" />

          {/* Loader */}
          <div
            className={`absolute inset-0 grid place-items-center bg-space-950 transition-opacity duration-700 ${
              ready ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-signal/20 border-t-cyan-400" />
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Initialising orbital environment
              </p>
            </div>
          </div>

          {/* Station label */}
          <div
            ref={labelRef}
            className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-200"
          >
            <div className="rounded-md border border-signal/40 bg-space-950/80 px-2.5 py-1 backdrop-blur-md">
              <p className="font-mono text-[11px] font-semibold tracking-wider text-signal">
                SIMHA-01
              </p>
              <p className="text-[10px] text-muted">
                LEO · 51.6° inclination
              </p>
            </div>
          </div>

          {/* Status HUD */}
          <div className="absolute left-4 top-4 w-48 rounded-xl border border-white/10 bg-space-950/75 p-4 font-mono text-[11px] leading-relaxed backdrop-blur-md">
            <p className="mb-2 flex items-center gap-2 font-sans text-[11px] font-semibold tracking-[0.2em] text-signal">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              SIMULATION STATUS
            </p>
            <p className="flex justify-between text-muted">
              STATUS{" "}
              <span className="text-emerald-300">
                {speed === 0 ? "PAUSED" : "OPERATIONAL"}
              </span>
            </p>
            <p className="flex justify-between text-muted">
              ORBIT{" "}
              <span className="text-slate-100">
                {telemetry ? `#${telemetry.orbit} ACTIVE` : "ACTIVE"}
              </span>
            </p>
            <p className="flex justify-between text-muted">
              OBJECTS <span className="text-slate-100">01</span>
            </p>
            <p className="flex justify-between text-muted">
              RATE{" "}
              <span className="text-slate-100">
                {speed === 0 ? "—" : `${speed}×`}
              </span>
            </p>
            <p className="mt-2 border-t border-white/10 pt-2 text-sm tabular-nums text-signal">
              {telemetry ? formatMET(telemetry.met) : "T+00:00:00"}
            </p>
          </div>

          {/* Layers */}
          <div className="absolute right-4 top-4 hidden w-44 rounded-xl border border-white/10 bg-space-950/75 p-4 backdrop-blur-md sm:block">
            <p className="mb-2 text-[11px] font-semibold tracking-[0.2em] text-signal">
              LAYERS
            </p>
            <LayerToggle
              label="Orbit path"
              on={layers.orbit}
              onToggle={() => toggleLayer("orbit")}
            />
            <LayerToggle
              label="Clouds"
              on={layers.clouds}
              onToggle={() => toggleLayer("clouds")}
            />
            <LayerToggle
              label="Atmosphere"
              on={layers.atmosphere}
              onToggle={() => toggleLayer("atmosphere")}
            />
            <LayerToggle
              label="Labels"
              on={layers.labels}
              onToggle={() => toggleLayer("labels")}
            />
          </div>

          {/* Controls */}
          <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-2">
            <Segmented
              label="Camera view"
              options={VIEWS}
              value={view}
              onChange={changeView}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Segmented
                label="Simulation speed"
                options={SPEEDS}
                value={speed}
                onChange={changeSpeed}
              />
              <button
                type="button"
                onClick={toggleFullscreen}
                className="rounded-lg border border-white/10 bg-space-950/70 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur-md transition-colors hover:bg-white/10 md:text-sm"
              >
                {fullscreen ? "Exit fullscreen" : "Fullscreen"}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted">
          Shortcuts: <kbd className="rounded bg-white/10 px-1">Space</kbd> pause
          · <kbd className="rounded bg-white/10 px-1">1–4</kbd> camera ·{" "}
          <kbd className="rounded bg-white/10 px-1">F</kbd> fullscreen
        </p>

        {/* ------------------------- Telemetry + map ------------------------- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="rounded-xl border border-white/10 bg-space-800 p-6 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-signal">
                Station Telemetry
              </h2>
              {selected && (
                <span className="flex items-center gap-2 rounded-full border border-signal/30 bg-cyan-400/10 px-3 py-1 text-xs text-signal">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
                  LOCKED · SIMHA-01
                </span>
              )}
            </div>

            {selected && telemetry ? (
              <>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Stat
                    label="Altitude"
                    value={telemetry.alt.toFixed(1)}
                    unit="km"
                    accent
                  />
                  <Stat
                    label="Velocity"
                    value={telemetry.vel.toFixed(2)}
                    unit="km/s"
                    accent
                  />
                  <Stat label="Latitude" value={formatLat(telemetry.lat)} />
                  <Stat label="Longitude" value={formatLon(telemetry.lon)} />
                  <Stat
                    label="Period"
                    value={(ORBIT_PERIOD / 60).toFixed(1)}
                    unit="min"
                  />
                  <Stat label="Inclination" value="51.6" unit="°" />
                  <Stat label="Orbit" value={`#${telemetry.orbit}`} />
                  <Stat
                    label="Illumination"
                    value={telemetry.sunlit ? "Sunlit" : "Eclipse"}
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => changeView("chase")}
                    className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-cyan-300"
                  >
                    Chase camera
                  </button>
                  <button
                    type="button"
                    onClick={() => select(false)}
                    className="rounded-md border border-white/15 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10"
                  >
                    Release lock
                  </button>
                  <p className="text-xs text-muted">
                    Simulated values for demonstration.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-start gap-4 rounded-lg border border-dashed border-white/10 p-6">
                <p className="text-sm text-muted">
                  Select the 3D station in the viewport to view its live
                  telemetry.
                </p>
                <button
                  type="button"
                  onClick={() => select(true)}
                  className="rounded-md border border-signal/40 px-4 py-2 text-sm text-signal transition-colors hover:bg-cyan-400/10"
                >
                  Select SIMHA-01
                </button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-space-800 p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-signal">
                Ground Track
              </h2>
              <span className="text-[11px] text-muted">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#ffd36b]" />
                Sub-solar point
              </span>
            </div>
            <canvas
              ref={mapRef}
              width={480}
              height={240}
              className="aspect-[2/1] w-full rounded-lg border border-white/10"
            />
            <p className="mt-3 text-xs text-muted">
              Last orbit of the station projected onto Earth, with the day/night
              terminator.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Simulation;
