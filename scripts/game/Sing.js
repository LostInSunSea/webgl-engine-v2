/**
 * Created by Stephen on 5/2/2017.
 */

const LIGHT_EXPAND_RATE = 5;
const LIGHT_DIMINISH_RATE = 15;

class Sing extends Component{
  constructor(params = {range: 2, light: -1, lightIntensity: 10, maxLightRange: 8, minLightRange: 1}){
    super();
    this.componentType = "Sing";

    this.range = params.range;

    this._singing = 0;
    this._lightIntensity = params.lightIntensity;
    this._maxLightRange = params.maxLightRange;
    this._minLightRange = params.minLightRange;


    this._pointLight = null;
    this._lightIndex = params.light;
    this._audioSrc = null;
  }

  start(){
    this.gameObject.addComponentToSerializeableList(this);
    this._audioSrc = this.transform.gameObject.getComponent('AudioSource');
    this._pointLight = GameObject.prototype.SerializeMap[this._lightIndex].getComponent("Light");
    if(this._pointLight && this._pointLight !== null) {
      this._pointLight.setColor(vec3.scale(vec3.create(), this._pointLight.color, this._lightIntensity));
    }
    //console.log(PhysicsEngine.sphereChecks);
  }

  startClient() {
    this.gameObject.addComponentToSerializeableList(this);
  }

  updateComponent(){
    if(this._singing === 1){
      if (this._pointLight && this._pointLight !== null) {
        this._pointLight.setRange(Utility.moveTowards(this._pointLight.range, this._maxLightRange, LIGHT_EXPAND_RATE * Time.deltaTime));
      }

      if(this._audioSrc && this._audioSrc !== null) {
        this._audioSrc.setState(AudioState.playSound);
      }
    }else {
      if(this._audioSrc && this._audioSrc !== null) {
        this._audioSrc.setState(AudioState.pause);
      }
      if(this._pointLight && this._pointLight !== null) {
        this._pointLight.setRange(Utility.moveTowards(this._pointLight.range, this._minLightRange, LIGHT_DIMINISH_RATE * Time.deltaTime));
      }
    }
  }

  updateComponentClient(){

  }

  sing(){
    this._singing = 1;

    let hitColliders = PhysicsEngine.overlapSphere(this.transform.getWorldPosition(), this.range);

    for(let i = 0; i < hitColliders.length; ++i){
      hitColliders[i].listen(this.transform.gameObject);
    }
  }

  quiet(){
    // Debug.log("i am quiet");
    this._singing = 0;


  }

  serialize() {
    let data = {};
    data.s = this._singing;
    return data;
  }

  applySerializedData(data) {
    this._singing = data.s;
  }
}