
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type OrbProps = {
  active?: boolean;
  responding?: boolean;
  small?: boolean;
  onClick?: () => void;
};

function Opal() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((state, delta) => {
    if (!mesh.current || !material.current) return;

    const time = state.clock.elapsedTime;
    const geometry = mesh.current.geometry;
    const position = geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      const wave =
        Math.sin(x * 3.2 + time * 0.55) *
        Math.cos(y * 3.7 - time * 0.42) *
        Math.sin(z * 3.1 + time * 0.35);

      const wave2 =
        Math.sin(x * 6 + time * 0.3) *
        Math.sin(y * 5 - time * 0.4);

      const radius = 1 + wave * 0.035 + wave2 * 0.012;

      position.setXYZ(i, x * radius, y * radius, z * radius);
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    mesh.current.rotation.y += delta * 0.12;
    mesh.current.rotation.x = Math.sin(time * 0.22) * 0.08;

    material.current.iridescence = 0.75 + Math.sin(time * 0.7) * 0.15;
    material.current.iridescenceIOR = 1.3 + Math.sin(time * 0.4) * 0.12;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 64]} />
      <meshPhysicalMaterial
        ref={material}
        color="#c9b9ff"
        metalness={0.22}
        roughness={0.16}
        transmission={0.12}
        thickness={2.2}
        clearcoat={1}
        clearcoatRoughness={0.08}
        iridescence={1}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 800]}
        sheen={1}
        sheenColor="#a9eaff"
        sheenRoughness={0.2}
        envMapIntensity={1.8}
      />
    </mesh>
  );
}

function Scene({ active, responding }: {
  active: boolean;
  responding: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    const target = responding ? 1.13 : active ? 1.09 : 1;
    const current = group.current.scale.x;
    const next = THREE.MathUtils.damp(current, target, 4, delta);

    group.current.scale.setScalar(next);
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.035;
  });

  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={3.2} color="#ffffff" />
      <pointLight position={[-3, 1, 2]} intensity={35} color="#a77bff" />
      <pointLight position={[2, -2, 2]} intensity={28} color="#78dcff" />
      <pointLight position={[0, 3, -3]} intensity={35} color="#ff9de8" />

      <group ref={group}>
        <Opal />
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
    window.setTimeout(() => setPressed(false), 450);
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
        gl={{ alpha: true, antialias: true }}
      >
        <Scene active={active || pressed} responding={responding} />
      </Canvas>

      <div className="luma-flash" />
    </div>
  );
}
