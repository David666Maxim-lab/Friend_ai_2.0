


import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type OrbProps = {
  active?: boolean;
  responding?: boolean;
  small?: boolean;
  onClick?: () => void;
};

function Opal({
  active,
  responding
}: {
  active: boolean;
  responding: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshPhysicalMaterial>(null);

  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(1, 5),
    []
  );

  const basePositions = useMemo(
    () => new Float32Array(
      geometry.attributes.position.array
    ),
    [geometry]
  );

  useFrame((state, delta) => {
    if (!mesh.current || !material.current) return;

    const time = state.clock.elapsedTime;
    const position = geometry.attributes.position as THREE.BufferAttribute;

    const energy = responding ? 1 : active ? 0.8 : 0.2;
    const amplitude = 0.035 + energy * 0.035;

    for (let i = 0; i < position.count; i++) {
      const index = i * 3;

      const x = basePositions[index];
      const y = basePositions[index + 1];
      const z = basePositions[index + 2];

      const length = Math.sqrt(x * x + y * y + z * z);

      const nx = x / length;
      const ny = y / length;
      const nz = z / length;

      const wave1 =
        Math.sin(nx * 4.5 + time * 0.65) *
        Math.cos(ny * 4.0 - time * 0.5);

      const wave2 =
        Math.sin(nz * 5.2 + time * 0.4) *
        Math.cos((nx + ny) * 3.5 - time * 0.6);

      const wave3 =
        Math.sin((nx - nz) * 7.5 + time * 0.7) *
        Math.cos((ny + nz) * 5.5 - time * 0.35);

      const wave4 =
        Math.sin((nx + ny + nz) * 3.0 - time * 0.3);

      const pulse =
        Math.sin(time * 2.1) * energy * 0.012;

      const irregularity =
        wave1 * 0.42 +
        wave2 * 0.28 +
        wave3 * 0.18 +
        wave4 * 0.12;

      const radius =
        1 +
        irregularity * amplitude +
        pulse;

      position.setXYZ(
        i,
        nx * radius,
        ny * radius,
        nz * radius
      );
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    mesh.current.rotation.y += delta * (responding ? 0.2 : 0.09);
    mesh.current.rotation.x =
      Math.sin(time * 0.22) * 0.055;

    const targetGlow = responding ? 2.1 : active ? 1.65 : 0.65;

    material.current.emissiveIntensity = THREE.MathUtils.damp(
      material.current.emissiveIntensity,
      targetGlow,
      4,
      delta
    );

    material.current.iridescence =
      0.85 + Math.sin(time * 0.75) * 0.15;

    material.current.iridescenceIOR =
      1.25 + Math.sin(time * 0.45) * 0.12;

    material.current.roughness =
      0.12 + Math.sin(time * 0.55) * 0.025;

    material.current.clearcoatRoughness =
      0.035 + Math.sin(time * 0.7) * 0.015;
  });

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshPhysicalMaterial
        ref={material}
        color="#d8d0ff"
        emissive="#7545ff"
        emissiveIntensity={0.65}
        metalness={0.42}
        roughness={0.12}
        transmission={0.12}
        thickness={3}
        clearcoat={1}
        clearcoatRoughness={0.04}
        iridescence={1}
        iridescenceIOR={1.35}
        iridescenceThicknessRange={[100, 1000]}
        sheen={1}
        sheenColor="#a8edff"
        sheenRoughness={0.12}
        envMapIntensity={2.5}
      />
    </mesh>
  );
}

function Scene({
  active,
  responding
}: {
  active: boolean;
  responding: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    const target = responding ? 1.14 : active ? 1.1 : 1;

    const next = THREE.MathUtils.damp(
      group.current.scale.x,
      target,
      4,
      delta
    );

    group.current.scale.setScalar(next);

    group.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
  });

  return (
    <>
      <ambientLight intensity={0.8} />

      <directionalLight
        position={[3, 4, 5]}
        intensity={2.5}
        color="#ffffff"
      />

      <directionalLight
        position={[-4, -2, 3]}
        intensity={1.8}
        color="#8b6bff"
      />

      <pointLight
        position={[-3, 1, 2]}
        intensity={active || responding ? 65 : 38}
        color="#a77bff"
        distance={8}
      />

      <pointLight
        position={[2, -2, 2]}
        intensity={active || responding ? 58 : 32}
        color="#62ddff"
        distance={8}
      />

      <pointLight
        position={[0, 3, -3]}
        intensity={active || responding ? 55 : 30}
        color="#ff91e8"
        distance={8}
      />

      <pointLight
        position={[-1, -3, -2]}
        intensity={25}
        color="#684bff"
        distance={7}
      />

      <group ref={group}>
        <Opal
          active={active}
          responding={responding}
        />
      </group>
    </>
  );
}

export default function LumaOrb({
  active = false,
  responding = false,
  small = false,
  onClick
}: OrbProps) {
  const [pressed, setPressed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (!onClick) return;

    setPressed(true);
    onClick();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setPressed(false);
    }, 650);
  };

  return (
    <div
      className={`luma-orb ${small ? 'luma-orb-small' : ''} ${
        active || pressed ? 'is-active' : ''
      } ${responding ? 'is-responding' : ''}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (
          onClick &&
          (event.key === 'Enter' || event.key === ' ')
        ) {
          event.preventDefault();
          handleClick();
        }
      }}
      aria-label="Активировать Luma"
    >
      <div className="luma-aura" />
      <div className="luma-aura luma-aura-two" />

      <Canvas
        camera={{ position: [0, 0, 3.3], fov: 38 }}
        dpr={[1, 1.75]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
      >
        <Scene
          active={active || pressed}
          responding={responding}
        />
      </Canvas>

      <div className="luma-flash" />
    </div>
  );
}
