import { gsap } from "gsap";

import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/portal.glb");

  useFrame(() => {
    group.current.rotation.y += 0.006; 
  });

  return (
    <group ref={group} {...props} dispose={null}> 
      <ambientLight />
      <group name="Scene">
        <group name="Empty" rotation={[0, 0.45, 0]} />
        <mesh
          name="Cube"
          geometry={nodes.Cube.geometry}
          material={materials["Material.006"]}
          castShadow
        />
        <mesh
          name="Cube001"
          geometry={nodes.Cube001.geometry}
          material={materials["Material.007"]}
          castShadow
        />
        <mesh
          name="Cube002"
          geometry={nodes.Cube002.geometry}
          material={materials["Material.004"]}
          castShadow
        />
        <mesh
          name="outer_portal036"
          castShadow
          geometry={nodes.outer_portal036.geometry}
          material={nodes.outer_portal036.material}
          scale={[0.32, 0.15, 0.32]}
        />
        <mesh
          name="outer_portal037"
          castShadow
          geometry={nodes.outer_portal037.geometry}
          material={nodes.outer_portal037.material}
          scale={[0.23, 0.23, 0.23]}
        />
        <mesh
          name="Cylinder001"
          castShadow
          geometry={nodes.Cylinder001.geometry}
          material={materials["Material.005"]}
        />
        <mesh
          name="outer_portal001"
          castShadow
          geometry={nodes.outer_portal001.geometry}
          material={materials["Material.008"]}
          scale={[0.25, 0.25, 0.25]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/portal.glb");
