import React, { useEffect, useState, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import useStore from "../state";
import useSound from "use-sound";
import popNoise from "../audio/showContentInfo.mp3";
import SceneParts from "../sceneParts";
import { Scene } from "three";
import MyReticle from "../Component/elements/Reticle";
import { BoxGeometry, MeshBasicMaterial, Mesh } from "three";

 
const XR3F = ({ name, updateCtx }) => {
  const { scene, gl, camera } = useThree();
  const [tapTarget, setTapTarget] = useState(null);
  const $surface = useRef();
  const $box = useRef();
  const ringRef = useRef();
  const invisibleRef = useRef();
  const [hasFirstPlacement, setFirstPlacement] = useState(false);
  const { hasPlacedRoutine } = useStore();
  const { setfloorClickedX, setfloorClickedY, setfloorClickedZ } = useStore();
  const { floorClickedX, floorClickedY, floorClickedZ } = useStore();
  const canvas = gl.domElement;
  canvas.id = name;

  console.log("create scene");

  //do in effect
  var xxxTempScene = new Scene();

  const geometry = new BoxGeometry(2, 2, 1);
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  xxxTempScene.add(cube);
  cube.colorWrite = false;
  cube.position.x = floorClickedX;
  cube.position.y = floorClickedY - 0.3;
  cube.position.z = floorClickedZ - 0.5;
  gl.autoClear = false;
  // material.stencilWriteMask = 0;
  // material.stencilFail = true;

  const [thepopNoise] = useSound(popNoise, {
    volume: 1.18,
  });

  function InvisibleCube(...props) {
    const ref = useRef();
    return (
      <mesh {...props} ref={ref} scale={[0.5, 0.01, 0.5]}>
        <boxGeometry />
        <meshBasicMaterial
          colorWrite={false}
          // stencilFail
          // stencilWriteMask={0}
          color={"red"}
          // renderOrder={2}
        />
      </mesh>
    );
  }

  // clipping_planes_fragment: clipping_planes_fragment,
  // 	clipping_planes_pars_fragment: clipping_planes_pars_fragment,
  // 	clipping_planes_pars_vertex: clipping_planes_pars_vertex,
  // 	clipping_planes_vertex: clipping_planes_vertex,

  // Yes. You have to #include them in the same/similar places that they are included in
  // e.g. MeshBasicMaterial, whose shaders you will find in the ShaderLib
  // folder (three.js\src\renderers\shaders\ShaderLib).
  // They are named meshbasic_vert.glsl.js and meshbasic_frag.glsl.js

  useFrame(({ gl, scene, camera, raycaster }) => {
    // clear buffers now: color, depth, stencil
    // renderer.clear(true, true, true);
    // // do not clear buffers before each render pass
    // renderer.autoClear = false;

 
    // renderer.render(scene, camera);

    // // set things back to normal
    // renderer.autoClear = true;

 

// gl.enable(gl.STENCIL_TEST);

//     gl.depthMask(false);
//     gl.stencilMask(0xFF);	

//     gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
//     gl.stencilFunc(gl.ALWAYS, 1, 0xff);

//     renderer.render(stencil, camera);

//     gl.depthMask(true);
//     gl.stencilMask(0x00);
//     gl.stencilFunc(gl.EQUAL, 0, 0xff);

//     renderer.render(scene, camera);
    
//     gl.disable(gl.STENCIL_TEST);
 
    // gl.render(scene, camera);
    // Manually clear the renderer
    gl.clear();

    // Sets which color components to enable or to disable when drawing or rendering to a WebGLFramebuffer
    gl.context.colorMask(false, false, false, false); // R, G, B, A
    gl.render(xxxTempScene, camera);

    // Enable back the writing into the color and alpha component
    gl.context.colorMask(true, true, true, true);
    gl.render(scene, camera);    gl.render(xxxTempScene, camera);
  }, 1);

  // useFrame(({ gl, scene, camera, raycaster }) => {

  //   gl.clearDepth();

  //   //TURN BOX OFF - NEED REF TO GET TO BOX
  //   // invisibleRef.display = false;
  //   gl.render(scene, camera);
  //   // gl.render(xxxTempScene, camera);
  //   gl.autoClear = false;
  //   gl.clear(true, false, true);

  //   //dont render if

  //   // stencilWrite
  //   // You can disable stencil writing by either setting stencilWriteMask to 0 or setting stencilFail

  //   //TURN BOX ON
  //   // invisibleRef.display = true;
  //   gl.render(scene, camera);
  //   gl.render(xxxTempScene, camera);
  //   gl.autoClear = true;
  // }, 1);

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
    gl.autoClear = true;
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
        <mesh scale={[0.13, 0.13, 0.13]} rotation={[-Math.PI / 2, 0, 0]}>
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

          <group position={[0, 0.8, 1]}>
            <InvisibleCube visible={!hasFirstPlacement} ref={invisibleRef} />
          </group>
        </mesh>
      </group>
    </group>
  );
};

export default XR3F;
