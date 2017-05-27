/**
 * Created by Stephen on 5/2/2017.
 */

class Sing extends Component{
  constructor(params = {range: 2}){
    super();
    this.componentType = "Sing";

    this.range = params.range;
  }

  start(){
    //console.log(PhysicsEngine.sphereChecks);
  }

  updateComponent(){

  }

  sing(){
    // Debug.log("singing");
    let hitColliders = [];
    hitColliders = PhysicsEngine.overlapSphere(this.transform.getWorldPosition(), this.range);

    for(let i = 0; i < hitColliders.length; ++i){
      hitColliders[i].listen(this.transform.gameObject);
    }
  }
}