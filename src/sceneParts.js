import React, { Suspense, useEffect, useRef, useState } from "react";
import ThePortal from "./Modelz/Portal";
import ThePlatform from "./Modelz/Platform";
import { Html, Environment, Box } from "@react-three/drei";
import useStore from "./state";

function InvisiblePanel(...props) {
  const ref = useRef();
  return (
    <mesh {...props} ref={ref} scale={[1, 0.001, 1]}>
      <boxGeometry />
      <meshBasicMaterial color={"orange"} />
    </mesh>
  );
}
function TestInvisiblePanel(...props) {
  const ref = useRef();
  return (
    <mesh {...props} ref={ref} scale={[1, 0.001, 1]}>
      <boxGeometry />
      <meshBasicMaterial color={"blue"} />
    </mesh>
  );
}

const sceneParts = ({ name, updateCtx }) => {
  const refelevatorgroup = useRef();
  const myMesh = useRef();
  const viddRef = useRef();
  const floor = useStore((state) => state.floor);
  const doorOpener = useStore((state) => state.doorOpener);
  const raiser = useStore((state) => state.triggerRaiser);
  const { modelNum } = useStore();
  const {
    hasFirstPlacement,
    floorClickedX,
    floorClickedY,
    floorClickedZ,
  } = useStore();

  //debugging tools!
  const [mytextX, setMyTextX] = useState("");
  const [mytextY, setMyTextY] = useState("--Y:");
  const [mytextZ, setMyTextZ] = useState("--Z:");

  useEffect(() => {
    setMyTextX("X: " + floorClickedX);
    setMyTextY("Y: " + floorClickedY);
    setMyTextZ("Z: " + floorClickedZ);
  });

  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={1.3} />

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
            {/* <Environment preset={"night"} background /> */}
          </Suspense>
        </group>

        <Suspense fallback={<Html>Loading..</Html>}>
          <group
            ref={refelevatorgroup}
            position={[0, 1.5, 0.5]} // -.5 small adjustment seems to be good!
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group position={[1, 0, 1]}>
              <TestInvisiblePanel />
            </group>

            <ThePortal />

            {/* <group position={[0, 0, 0]}>
              <ThePlatform />
            </group> */}
 
            <group position={[-1, 0, -1]}>
              <InvisiblePanel />
            </group>
          </group>
        </Suspense>
      </Suspense>
    </group>
  );
};

export default sceneParts;
