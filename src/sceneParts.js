import React, { Suspense, useEffect, useRef, useState } from "react";
import ThePortal from "./Modelz/Portal";
import ThePlatform from "./Modelz/Platform";
import { Html, Environment, Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import useStore from "./state";
import { useThree } from "@react-three/fiber";
import { CubeTextureLoader } from "three";
 
function InvisibleCube(...props) {
  const ref = useRef();
  return (
    <mesh {...props} ref={ref} scale={[.5,.5,.5]}>
      <boxGeometry />
      <meshBasicMaterial
        colorWrite={false} 
      />
    </mesh>
  );
}

function SkyBox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();

  const texture = loader.load([
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
  ]);

  scene.background = texture;
  return null;
}

const sceneParts = ({ name, updateCtx }) => {
  const { camera } = useThree();
  const refelevatorgroup = useRef();
  const { floorClickedZ } = useStore();
  const { hasFirstPlacement } = useStore();
  const [isInPortalSpace, setisInPortalSpace] = useState(null);
  const [tapTarget, setTapTarget] = useState(null);

  useFrame(() => {
    if (hasFirstPlacement) {
      if (floorClickedZ) {
        var isInPortalSpace = camera.position.z < floorClickedZ - 0.5; //allow for offset with .5

        if (isInPortalSpace) {
          console.log("Yes isInPortalSpace");
        }
      }
    }

    // const withinPortalBounds =
    //   position.y < this.data.height &&
    //   Math.abs(position.x) < this.data.width / 2;
    // if (this.wasOutside !== isOutside && withinPortalBounds) {
    //   this.isInPortalSpace = !isOutside
    // }
    // this.contents.object3D.visible = this.isInPortalSpace || isOutside
    // this.walls.object3D.visible = !this.isInPortalSpace && isOutside
    // this.portalWall.object3D.visible = this.isInPortalSpace && !isOutside
    // this.wasOutside = isOutside
  });

  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={2.3} />

      <spotLight
        intensity={1.6}
        position={[1, 10, 1]}
        angle={0.2}
        penumbra={1}
        shadow-mapSize-width={5000}
        shadow-mapSize-height={5000}
        castShadow
      />

      <Suspense
        fallback={
          <Html>
            <h1 style={{ color: "white" }}>Loading...</h1>
          </Html>
        }
      >
        <group position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
          <Suspense fallback={<Html></Html>}>
            {/* <Environment preset={"city"} background /> */}
          </Suspense>
        </group>
        {/* <SkyBox/> */}
        <Suspense fallback={<Html>Loading..</Html>}>
          <group
            ref={refelevatorgroup}
            position={[0, 1.5, 0.5]} // -.5 small adjustment seems to be good!
            rotation={[Math.PI / 2, 0, 0]}
          >
            <ThePortal />

            <group
              scale={0.6}
              position={[0, -.5, 1]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ThePlatform />
            </group>
 
            <group position={[0, 0.5, 1]}>
              <InvisibleCube visible={!hasFirstPlacement} />
            </group>
 
          </group>
        </Suspense>
      </Suspense>
    </group>
  );
};

export default sceneParts;
