/**
 * Created by ajermaky on 5/22/17.
 */
class StatueController extends Playerable{
  constructor(params = {singingDelay: 0, singingDuration: 3}) {
    super({singingCooldown: params.singingDelay});
    // Debug.log(this._singingCooldown);

    this._maxSingingDuration = params.singingDuration;
  }

  start() {
    super.start();
    for(let i = 0; i < this._colliders.length; ++i) {
      this._colliders[i].setLayer(FILTER_KINEMATIC);
    }
    this._maxSingingDuration = 3;
    this._currentSingingDuration = 0;
  }

  startClient() {
    super.startClient();
  }

  updateComponent() {
    if(this._singer && this._singer!==null) {
      if (this.singing === 0 && this._lastSingInput === 1) {
        this._nextSingTime = Time.time + this._singingCooldown;
        // if(!IS_SERVER) this._singingSrc.pauseSound();
      }

      this._lastSingInput = this.singing;

      if (Time.time >= this._nextSingTime && this._currentSingingDuration < this._maxSingingDuration) {
        this.singing = 1;
        this._currentState = PlayerState.singing;
        this._currentSingingDuration += Time.deltaTime;
        //if !injured
        this._singer.sing();
      } else {
        this._currentSingingDuration = 0;
        this.singing = 0;
        this._currentState = PlayerState.default;
      }

      if (this._currentState === PlayerState.singing) {
        this._singer.sing();
      } else {
        this._singer.quiet();
      }
    }
  }

  updateComponentClient() {
    if(this._singingSrc && this._singingSrc!==null) {
      if (this.singing === 1 && Time.time >= this._nextSingTime) {
        this._singingSrc.playSound();
      } else {
        this._singingSrc.pauseSound();
      }
    }
  }

  movement() {

  }

  serialize() {
    let data = super.serialize();
    return data;
  }

  applySerializedData(data) {
    // Debug.log(this);
    super.applySerializedData(data);
  }
}