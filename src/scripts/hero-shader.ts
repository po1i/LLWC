// Hero "silk" field: domain-warped noise lit in brass on charcoal.
// Raw WebGL1, no dependencies. Renders at reduced resolution (the image is
// soft by design), pauses when offscreen or the tab is hidden, adapts its
// resolution if frames run slow, and draws a single still frame under
// prefers-reduced-motion. If WebGL is unavailable the CSS glow beneath stays.

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);

  // A soft lens that leans the folds toward the cursor.
  float md = length(p - m);
  p += (m - p) * 0.12 * exp(-md * 2.5);

  float t = uTime * 0.035;
  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 1.1 + 2.2 * q + vec2(1.7, 9.2) + t * 1.4),
                fbm(p * 1.1 + 2.2 * q + vec2(8.3, 2.8) - t * 0.8));
  float f = fbm(p * 0.9 + 2.6 * r);

  float body  = smoothstep(0.30, 0.85, f);
  float sheen = pow(1.0 - abs(sin(f * 9.0 + r.x * 3.0)), 8.0) * body;

  vec3 bg    = vec3(0.059, 0.055, 0.047);   // --bg  #0f0e0c
  vec3 brass = vec3(0.788, 0.651, 0.420);   // --brass #c9a66b
  // Broad warm glow plus the silk folds and their highlights.
  float glow = smoothstep(1.3, 0.0, length((uv - vec2(0.78, 0.8)) * vec2(aspect * 0.8, 1.0)));
  vec3 col = bg
    + brass * glow * 0.10
    + brass * (body * 0.30 + sheen * 0.55) * (0.55 + 0.45 * glow)
    + vec3(0.08, 0.05, 0.02) * q.x * body;

  // Weight the light to the upper right, away from the copy, and fade
  // fully to the page colour at the bottom edge so there is no seam.
  float mask = smoothstep(1.15, 0.05, length((uv - vec2(0.8, 0.85)) * vec2(aspect * 0.75, 1.0)));
  mask *= smoothstep(0.0, 0.35, uv.y);
  col = mix(bg, col, mask);

  // Fine grain to prevent banding in the dark gradients.
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.012;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function initHeroShader(canvas: HTMLCanvasElement, layer: HTMLElement) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false,
  });
  if (!gl) return;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  // One oversized triangle covers the viewport.
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uMouse = gl.getUniformLocation(prog, 'uMouse');

  // Render scale: the field is soft, so ~half resolution is invisible to the eye.
  let scale = Math.min(window.devicePixelRatio || 1, 1) * (window.innerWidth < 768 ? 0.4 : 0.5);
  const resize = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth * scale));
    const h = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, w, h);
  };

  const mouse = { x: 0.72, y: 0.7, tx: 0.72, ty: 0.7 };
  const start = performance.now();
  // Start partway into the animation so the first frame is already interesting.
  const t0 = 40;
  const draw = (now: number) => {
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    gl.uniform1f(uTime, t0 + (now - start) / 1000);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const reveal = () => canvas.classList.add('is-ready');

  resize();
  if (reduce) {
    draw(start);
    reveal();
    new ResizeObserver(() => { resize(); draw(start); }).observe(canvas);
    return;
  }

  let visible = true;
  let raf = 0;
  let frames = 0;
  let slowFrames = 0;
  let last = performance.now();
  let adapted = false;

  const loop = (now: number) => {
    raf = 0;
    if (!visible || document.hidden) return;

    // If the first ~90 frames average slower than ~45fps, drop resolution once.
    const dt = now - last;
    last = now;
    if (!adapted && frames > 10) {
      if (dt > 22) slowFrames++;
      if (frames > 100) {
        if (slowFrames > 45) { scale *= 0.6; resize(); }
        adapted = true;
      }
    }
    frames++;

    draw(now);
    if (frames === 1) reveal();

    // Fade and drift the whole layer as the hero scrolls away (transform + opacity only).
    const h = layer.offsetHeight || 1;
    const p = Math.min(1, Math.max(0, window.scrollY / h));
    layer.style.opacity = String(1 - p * 0.85);
    layer.style.transform = `translate3d(0, ${p * 18}%, 0)`;

    raf = requestAnimationFrame(loop);
  };
  const play = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) play(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) play(); });
  new ResizeObserver(resize).observe(canvas);

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    mouse.tx = e.clientX / window.innerWidth;
    mouse.ty = 1 - e.clientY / window.innerHeight;
  }, { passive: true });

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    canvas.remove();
  });

  play();
}
