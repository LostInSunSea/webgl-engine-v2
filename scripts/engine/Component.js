/**
 * Created by Accipiter Chalybs on 4/5/2017.
 */
class Component
{
  constructor(){
    this.gameObject = null;
    this.transform = null;
    this.visible = true;
    this.active = true;
    this.componentType = null; //must override in subclass!
  }

  start(){
  }

  update(deltaTime){
    this.start();

    // Use updateComponent if you want access to start
    if (this.updateComponent){
      this.update = this.updateComponent;
    }
  }

  draw(){
  }

  _setGameObject(go){
    this.gameObject = go;
    if (go !== null) {
        this.transform = go.transform;
    } else {
        this.transform = null;
    }
  }

  onCollisionEnter(collision){
  }

  onTriggerEnter(collider){
  }
}