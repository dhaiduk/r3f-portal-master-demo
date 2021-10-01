import React, { useRef, useEffect } from "react"; 

const MyReticle = (props) => {
  const myMesh = useRef();

  return (
    <mesh ref={myMesh}>
      <ringBufferGeometry args={[1.5, 2, 50, 60]} />
    </mesh>
  );
};

export default MyReticle;
