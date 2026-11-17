

import { useMemo, useRef, useState } from 'react';
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

  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(1, 5);
  }, []);

  const basePositions = useMemo(() => {
    return new Float32Array(
      geometry.attributes.position.array as ArrayLike<number>
    );
  }, [geometry]);

  useFrame((state, delta) => {
    if (!mesh.current || !material.current) return;

    const time = state.clock.elapsedTime;
    const position = geometry.attributes.position as THREE.BufferAttribute;

    const energy = responding ? 1 : active ? 0.85 : 0;
    const amplitude = 0.035 + energy * 0.045;

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
        Math.sin(nx * 4.2 + time * 0.65) *
        Math.cos(ny * 3.8 - time * 0.48);

      const wave2 =
        Math.sin(nz * 5.1 + time * 0.38) *
        Math.cos((nx + ny) * 3.2 - time * 0.55);

      const wave3 =
        Math.sin((nx - nz) * 7 + time * 0.8) *
        Math.cos((ny + nz) * 5 - time * 0.3);

      const pulse = Math.sin(time * 2.2) * energy * 0.012;

      const radius =
        1 +
        wave1 * amplitude * 0.55 +
        wave2 * amplitude * 0.3 +
        wave3 * amplitude * 0.15 +
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

    mesh.current.rotation.y += delta * 0.1;
    mesh.current.rotation.x =
      Math.sin(time * 0.22) * 0.045;

    const targetGlow = responding ? 1.5 : active ? 1.8 : 0.35;

    material.current.emissiveIntensity = THREE.MathUtils.damp(
      material.current.emissiveIntensity,
      targetGlow,
      5,
      delta
    );

    material.current.iridescence =
      0.8 + Math.sin(time * 0.8) * 0.18;

    material.current.iridescenceIOR =
      1.3 + Math.sin(time * 0.5) * 0.1;

    material.current.roughness =
      0.14 + Math.sin(time * 0.6) * 0.025;
  });

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshPhysicalMaterial
        ref={material}
        color="#c9c0ff"
        emissive="#8055ff"
        emissiveIntensity={0.35}
        metalness={0.3}
        roughness={0.14}
        transmission={0.08}
        thickness={2.5}
        clearcoat={1}
        clearcoatRoughness={0.06}
        iridescence={1}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 900]}
        sheen={1}
        sheenColor="#a9eaff"
        sheenRoughness={0.18}
        envMapIntensity={2}
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

    const target = responding ? 1.13 : active ? 1.1 : 1;
    const current = group.current.scale.x;

    const next = THREE.MathUtils.damp(
      current,
      target,
      4,
      delta
    );

    group.current.scale.setScalar(next);

    group.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.35) * 0.035;
  });

  return (
    <>
      <ambientLight intensity={1.1} />

      <directionalLight
        position={[3, 4, 5]}
        intensity={2.8}
        color="#ffffff"
      />

      <pointLight
        position={[-3, 1, 2]}
        intensity={active || responding ? 55 : 32}
        color="#a77bff"
      />

      <pointLight
        position={[2, -2, 2]}
        intensity={active || responding ? 48 : 26}
        color="#78dcff"
      />

      <pointLight
        position={[0, 3, -3]}
        intensity={active || responding ? 50 : 30}
        color="#ff9de8"
      />

      <group ref={group}>
        <Opal active={active} responding={responding} />
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

  const handleClick = () => {
    setPressed(true);
    onClick?.();

    window.setTimeout(() => {
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
        if (event.key === 'Enter' || event.key === ' ') {
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
        dpr={[1, 2]}
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
