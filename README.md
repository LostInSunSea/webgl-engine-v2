#WEBGL 3D Game Engine

#Based on the CSE 125 Engine But Rewritten in Typescript
To compile the type script into javascript simply run the following command
with no arguments
```
tsc
```

### Running Client Locally Without Server
Within `scripts/engine/Debug.js` set:
```
Debug.clientUpdate = true;
```
to enable running client code locally without server.

### Running Client Locally With Remote Server
Within `scripts/engine/Networking.js @ createClientSocket` set:
```
  let url = 'http://162.243.136.237:3000/' ;
```

### Disclaimer
Do not replace existing cannon.min.js.
It has been modified to not require `window` for server use.
