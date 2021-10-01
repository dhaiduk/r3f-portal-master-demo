# Portal Master
This React-Three/Fiber project is the main portal template and demo.

###  To Get up and running locally

```
yarn install  
yarn run build 
```
Then ```yarn run serve``` to see mobile QR code
 
###  Reading the source code

The good stuff is in the 'Experience'.  The main part SceneParts and is found in the Experience folder referenced by XR3F.js.  Like so:

```
<mesh castShadow position={tapTarget} visible={!!tapTarget} ref={$box}>  
    <SceneParts/>   
</mesh> 
```
 