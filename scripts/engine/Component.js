/**
 * Created by Accipiter Chalybs on 4/5/2017.
 */
class Component {

    constructor () {
        this.gameObject = null;
        this.visible = true;
        this.active = true;
    }

    update (deltaTime) {

    }

    draw () {

    }

    set gameObject(go) {
        this.gameObject = go;
    }

    onCollisionEnter (collision) {

    }

}