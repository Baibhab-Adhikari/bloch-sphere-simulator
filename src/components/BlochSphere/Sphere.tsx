/**
 * Sphere — The Bloch sphere wireframe with equator and surface.
 *
 * Renders a semi-transparent sphere with wireframe overlay,
 * latitude/longitude grid lines, and a highlighted equator ring.
 */

import { useMemo } from 'react';
import * as THREE from 'three';

export function Sphere() {
  // Sphere geometry (shared between surface and wireframe)
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 64, 48), []);

  // Equator ring
  const equatorPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)));
    }
    return points;
  }, []);

  const equatorGeometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(equatorPoints),
    [equatorPoints]
  );

  // Latitude/longitude grid lines
  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];

    // Longitude lines (meridians) — every 45°
    for (let lon = 0; lon < 360; lon += 45) {
      const points: THREE.Vector3[] = [];
      const phi = (lon * Math.PI) / 180;
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI;
        points.push(
          new THREE.Vector3(
            Math.sin(theta) * Math.cos(phi),
            Math.cos(theta),
            Math.sin(theta) * Math.sin(phi)
          )
        );
      }
      lines.push(points);
    }

    // Latitude lines — every 45°
    for (let lat = 45; lat < 180; lat += 45) {
      if (lat === 90) continue; // Skip equator — it's drawn separately
      const points: THREE.Vector3[] = [];
      const theta = (lat * Math.PI) / 180;
      const r = Math.sin(theta);
      const y = Math.cos(theta);
      for (let i = 0; i <= 64; i++) {
        const phi = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(r * Math.cos(phi), y, r * Math.sin(phi)));
      }
      lines.push(points);
    }

    return lines;
  }, []);

  return (
    <group>
      {/* Semi-transparent sphere surface */}
      <mesh geometry={sphereGeometry}>
        <meshPhysicalMaterial
          color="#cbd5e1"
          transparent
          opacity={0.15}
          roughness={0.8}
          metalness={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={sphereGeometry}>
        <meshBasicMaterial
          color="#64748b"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Grid lines */}
      {gridLines.map((points, i) => (
        <line key={`grid-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#94a3b8" transparent opacity={0.3} />
        </line>
      ))}

      {/* Equator ring — highlighted */}
      {/* @ts-expect-error - R3F <line> clashes with React's SVG <line> type */}
      <line geometry={equatorGeometry}>
        <lineBasicMaterial color="#0891b2" transparent opacity={0.6} linewidth={1} />
      </line>
    </group>
  );
}
