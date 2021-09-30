# Portal Master

This React-Three/Fiber project is the main portal simulation.
 
###  Reading the source code

The good stuff is in the 'Experience'.  The main part SceneParts and is found in the Experience folder referenced by XR3F.js.  Like so:

```
<mesh castShadow position={tapTarget} visible={!!tapTarget} ref={$box}>  
    <SceneParts/>   
</mesh> 
```

Look in sceneParts.js to find how it places the model and sets the items to be displayed according to the floor number.

State management:  Uses zustand (by creator of R3F).  Search for: ```import useStore from './state'```

###  To Get up and running locally

```
yarn install (preferred to npm install)
yarn run build 
```
Then use ```yarn run serve``` to see the QR code for mobile ease.

