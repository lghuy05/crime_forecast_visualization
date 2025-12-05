
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ShaderAnimationProps {
  className?: string;
  intensity?: number;
  speed?: number;
  colors?: [string, string, string]; // [primary, secondary, accent]
}

export function ShaderAnimation({
  className = "",
  intensity = 1.0,
  speed = 1.0,
  colors = ["#3b82f6", "#8b5cf6", "#ec4899"],
}: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // Custom shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0.0 },
        u_intensity: { value: intensity },
        u_speed: { value: speed },
        u_color1: { value: new THREE.Color(colors[0]) },
        u_color2: { value: new THREE.Color(colors[1]) },
        u_color3: { value: new THREE.Color(colors[2]) },
        u_resolution: { value: new THREE.Vector2() },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform float u_intensity;
        uniform float u_speed;
        uniform vec3 u_color1;
        uniform vec3 u_color2;
        uniform vec3 u_color3;
        uniform vec2 u_resolution;
        varying vec2 vUv;
        
        #define PI 3.14159265359
        
        // Noise functions
        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          
          for (int i = 0; i < 5; i++) {
            value += amplitude * noise(p * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
          }
          
          return value;
        }
        
        void main() {
          vec2 uv = vUv * 2.0 - 1.0;
          uv.x *= u_resolution.x / u_resolution.y;
          
          // Animated time
          float t = u_time * 0.2 * u_speed;
          
          // Create flowing pattern
          vec2 p = uv * 3.0;
          float pattern = fbm(p + t * 0.5);
          
          // Add another layer
          p = uv * 5.0 + vec2(t * 0.3, t * 0.2);
          pattern += 0.5 * fbm(p);
          
          // Add pulsing effect
          float pulse = sin(t + uv.x * 2.0) * 0.5 + 0.5;
          pattern += pulse * 0.2;
          
          // Create color gradient
          vec3 color1 = u_color1;
          vec3 color2 = u_color2;
          vec3 color3 = u_color3;
          
          // Mix colors based on pattern
          float mix1 = smoothstep(0.0, 0.5, pattern);
          float mix2 = smoothstep(0.5, 1.0, pattern);
          
          vec3 color = mix(color1, color2, mix1);
          color = mix(color, color3, mix2);
          
          // Add intensity
          color *= u_intensity;
          
          // Vignette effect
          float vignette = 1.0 - length(uv) * 0.3;
          vignette = smoothstep(0.0, 1.0, vignette);
          color *= vignette;
          
          // Alpha for transparency
          float alpha = 0.8;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    // Geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();
      renderer.setSize(width, height);
      material.uniforms.u_resolution.value.set(width, height);
    };

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      if (material) {
        material.uniforms.u_time.value += 0.016 * speed; // ~60fps
      }

      renderer.render(scene, camera);

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    // Store reference
    sceneRef.current = {
      scene,
      camera,
      renderer,
      material,
      animationId: 0,
    };

    // Initial setup
    handleResize();
    window.addEventListener("resize", handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }

        // Dispose of Three.js resources
        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, [intensity, speed, colors]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    />
  );
}
