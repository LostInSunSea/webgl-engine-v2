/**
 * Created by Stephen on 4/25/2017.
 */

class NavMesh{
  constructor(){
    this.faceList = null;
    this.boundaryList = null;

    this.loadNavMesh("assets/scenes/ExampleLevel_Nav.json");

    // test/debugging zone
    // raycast on line segments
    // let ray = {origin: [0, 0.75], direction: [20, 1]};
    // let lineSeg = [[-1, 1], [1, 1]];
    // let hitDistance = {dist: null};
    // let hitResult = this.rayIntersectsSegment(ray, lineSeg, 1, hitDistance);

    // point in triangle test either declaration works
    // let pt = [0, 0];
    // let v0 = [0, 0];
    // let v1 = [0, 2];
    // let v2 = [2, 0];
    // let result = this.isPointInTriangle2D(pt, v0, v1, v2);
  }

  loadNavMesh(filename){
    let loadID = GameEngine.registerLoading();

    let finishLoadNavMesh = this._finishLoadNavMesh;
    JsonLoader.loadJSON(filename, finishLoadNavMesh.bind(this, loadID));
  }

  _finishLoadNavMesh(loadID, data){
    if(Debug.navMesh.printLoadFinished){
      Debug.navMesh.printLoadFinishedInfo(data);
    }

    this.boundaryList = data.boundary;
    this.faceList = data.faceList;
    this.vertList = data.vertList;

    // test/debugging zone
    let pt = [20, 0, -13];
    let faceIndex = this.findFace(pt);

    GameEngine.completeLoading(loadID);
  }

  // If the pt is on the line, the pt is considered to be INSIDE the triangle.
  // 2D is on the x and z plane NOT x and y
  isPointInTriangle2D(pt, v0, v1, v2){
    // code from http://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
    let b0 = this._sign(pt, v0, v1) <= 0.0;
    let b1 = this._sign(pt, v1, v2) <= 0.0;
    let b2 = this._sign(pt, v2, v0) <= 0.0;

    let result = ((b0 === b1) && (b1 === b2));

    if(Debug.navMesh.printPointTriangle){
      Debug.navMesh.printPointTriangleInfo(result, pt, v0, v1, v2, b0, b1, b2);
    }

    return result;
  }

  // Appears to be some sort of cross product
  _sign(pt0, pt1, pt2){
    return (pt0[0] - pt2[0]) * (pt1[2] - pt2[2]) - (pt1[0] - pt2[0]) * (pt0[2] - pt2[2]);
  }

  findFace(pt){
    if(Debug.navMesh.printFindFace) {
      let color = vec4.create(); vec4.set(color, 0, 0, 1, 1);
      Debug.drawTeapot(pt, color);
    }

    for(let i = 0; i < this.faceList.length; ++i){
      let face = this.faceList[i].vert;

      if(this.isPointInTriangle2D(pt, face[0], face[1], face[2])){
        if(Debug.navMesh.printFindFace) {
          Debug.navMesh.printFindFaceInfo(pt, i, face);
          let teapot = new GameObject();
          let mesh = new Mesh("Teapot02");
          teapot.addComponent(mesh);
          teapot.transform.setPosition(pt);
          Debug.drawTeapot(face[0]);
          Debug.drawTeapot(face[1]);
          Debug.drawTeapot(face[2]);
        }

        return i;
      }
    }

    if(Debug.navMesh.printFindFace)
      Debug.navMesh.printFindFaceInfo(pt, -1);

    return -1;
  }

  // If collinear: ray does NOT intersect and distance = NaN
  // If ray starts on line but points elsewhere: ray does NOT intersect and distance = 0
  rayIntersectsSegment(ray2D, lineSegment, maxDistance = Number.POSITIVE_INFINITY, hitDistance){
    // code from http://afloatingpoint.blogspot.com/2011/04/2d-polygon-raycasting.html
    let seg = [0, 0];
    seg[0] = lineSegment[1][0] - lineSegment[0][0];
    seg[1] = lineSegment[1][1] - lineSegment[0][1];

    let segPerp = [seg[1], -seg[0]];
    let perpDotd = PhysicsEngine.dot2D(ray2D.direction, segPerp);
    if(perpDotd <= Number.EPSILON && perpDotd >= Number.EPSILON){
      hitDistance.dist = Number.POSITIVE_INFINITY;
      return false;
    }

    let d = [lineSegment[0][0] - ray2D.origin[0], lineSegment[0][1] - ray2D.origin[1]];

    hitDistance.dist = PhysicsEngine.dot2D(segPerp, d) / perpDotd;
    let s = PhysicsEngine.dot2D([ray2D.direction[1], -ray2D.direction[0]], d) / perpDotd;

    let hitResult = hitDistance.dist >= Number.EPSILON && hitDistance.dist <= maxDistance && s >= 0.0 && s <= 1.0;

    if(Debug.navMesh.printRaySegment){
      Debug.navMesh.printRaySegmentInfo(hitResult, ray2D, lineSegment, maxDistance, hitDistance, s);
    }

    return hitResult;
  }
}
NavMesh.prototype.currentNavMesh= null;
