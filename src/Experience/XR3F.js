//import * as THREE from 'three';
import React, { useEffect, useState, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import useStore from "../state";
import useSound from "use-sound";
import popNoise from "../audio/showContentInfo.mp3";
import SceneParts from "../sceneParts";
import { Ring } from "@react-three/drei"; 
import { gsap } from "gsap";

function MyReticle() {
  const myMesh = useRef();
 
  //change this to an image, or ring when we know what is needed

  return (
    <mesh ref={myMesh}>
      <ringBufferGeometry args={[1.5,2,50,60]}/> 
    </mesh>
  );
}
 
 

const XR3F = ({ name, updateCtx }) => {
  const { scene, gl, camera } = useThree();

  const [tapTarget, setTapTarget] = useState(null);
  const $surface = useRef();
  const $box = useRef();
  const ringRef = useRef();
  const [hasFirstPlacement, setFirstPlacement] = useState(false);
  const { hasPlacedRoutine } = useStore();
  const { doBoundsWarning } = useStore();
  const { boundsWarning } = useStore();
  const { floorClickedZ } = useStore();
  const { setfloorClickedX, setfloorClickedY, setfloorClickedZ } = useStore();

  const canvas = gl.domElement;
  canvas.id = name;

  const [thepopNoise] = useSound(popNoise, {
    volume: 1.18,
  });

  useFrame(({ gl, scene, camera, raycaster }) => {
    gl.clearDepth();
    gl.render(scene, camera);
 
  }, 1);

  const { XR8, THREE } = window;

  useEffect(() => {
    XR8.addCameraPipelineModule({
      name: "xrthree",
      onStart,
      onUpdate,
      onCanvasSizeChange,
      xrScene: xrScene,
    });
  });

  const onCanvasSizeChange = ({ canvasWidth, canvasHeight }) => {
    gl.setSize(canvasWidth, canvasHeight);
    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();
  };

  const onStart = ({ canvasWidth, canvasHeight }) => {
    gl.autoClear = false;
    gl.setSize(canvasWidth, canvasHeight);
    gl.antialias = true;

    debugger;
    // Update React ctx
    updateCtx({
      scene,
      camera,
      renderer: gl,
    });

    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    });
    console.dir(XR8);
  };

  const onUpdate = ({ processCpuResult }) => {
    camera.updateProjectionMatrix();

    let data = processCpuResult.reality;
    if (!(data && data.intrinsics)) return;

    let { intrinsics, position, rotation } = data;
    let { elements } = camera.projectionMatrix;

    for (let i = 0; i < 16; i++) {
      elements[i] = intrinsics[i];
    }

    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    //camera.projectionMatrixInverse.getInverse(camera.projectionMatrix);
    camera.setRotationFromQuaternion(rotation);
    camera.position.copy(position);
  };

  const xrScene = () => {
    return { scene, camera, renderer: gl };
  };

  function youClickedFloor(e) {
    if (hasFirstPlacement) {
      return;
    } else {
      XR8.xrController().recenter();
      setFirstPlacement(true);
      hasPlacedRoutine();
      thepopNoise();
      var tempVec = new THREE.Vector3(
        ringRef.current.position.x,
        ringRef.current.position.y,
        ringRef.current.position.z
      );
      setfloorClickedX(ringRef.current.position.x);
      setfloorClickedY(ringRef.current.position.y);
      setfloorClickedZ(ringRef.current.position.z);
      return setTapTarget(tempVec);
    }
  }

  useFrame(() => {
    const raycaster = new THREE.Raycaster();

    var rayOrigin = new THREE.Vector2(0, 0);
    var cursorLocation = new THREE.Vector3(0, 1, -1);

    raycaster.setFromCamera(rayOrigin, camera);

    const intersects = raycaster.intersectObject($surface.current, true);
    if (intersects.length > 0) {
      const [intersect] = intersects;
      cursorLocation = intersect.point;
    }

    if (!hasFirstPlacement) {
      ringRef.current.position.y = 0.01;
      ringRef.current.position.lerp(cursorLocation, 0.4);
      ringRef.current.rotation.y = camera.rotation.y;
    }
  });

  return (
    <group>
      <group name="crawlingreticle" visible={!hasFirstPlacement} ref={ringRef}>
        <mesh scale={[0.13, 0.13, 0.13]} rotation={[-Math.PI/2, 0, 0]}>
          <MyReticle />
        </mesh>
      </group>

      <mesh
        name="floormeshsurface"
        onPointerDown={youClickedFloor}
        receiveShadow
        position={[0, 0, 0]}
        ref={$surface}
        rotation-x={-Math.PI / 2}
      >
        <planeGeometry attach="geometry" args={[4000, 4000, 1, 1]} />
        <shadowMaterial opacity={0.3} />
      </mesh>

      <group position={[0, 0, 0]}>
        <mesh castShadow position={tapTarget} visible={!!tapTarget} ref={$box}>
          <SceneParts />
        </mesh>
      </group>
    </group>
  );
};

export default XR3F;
