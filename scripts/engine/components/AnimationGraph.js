class AnimationGraph extends Components {
  constructor() {
    super();
    this.animGraph = {};
    /* animGraph
      {
        animationState name: animationState,
        ...
      }
    */
    this.name = '';
    ssfsd

    this.componentType = 'AnimationGraph';
  }

  loadAnimation() {
    // set this.animGraph
  }

  // override state with new state
  setState(objState, nextStateName) {
    const nextState = animGraph[nextStateName];
    if(!nextState) {
      console.log('Illegal setState from...[tbi]');
      return false;
    }

    nextState.setState(objState, nextStateName); // modifies state and animation
  }
}