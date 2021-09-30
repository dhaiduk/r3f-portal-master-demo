/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/platform.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="G_02"
          geometry={nodes.G_02.geometry}
          material={materials['Material.002']}
          position={[0, 0.07, 0]}
          scale={[0.03, 0.03, 0.03]}
        />
        <mesh
          name="G_05"
          geometry={nodes.G_05.geometry}
          material={nodes.G_05.material}
          position={[0, 0.03, 0]}
          scale={[0.03, 0.03, 0.03]}
        />
        <mesh
          name="G_01"
          geometry={nodes.G_01.geometry}
          material={nodes.G_01.material}
          position={[0, 0.06, 0]}
          scale={[0.03, 0.03, 0.03]}
        />
        <mesh
          name="G_03"
          geometry={nodes.G_03.geometry}
          material={nodes.G_03.material}
          position={[0, 0.03, 0]}
          scale={[0.03, 0.03, 0.03]}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/platform.glb')