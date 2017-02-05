class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.transitionsHistory = [];
        this.undoArray = [];
        if (config){
            this.config = config;
            this.currentState = config.initial;
            this.transitionsHistory.push(config.initial);
        } else{
            throw new Error("Config is Epmpty");
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        for (let stateName in this.config.states){
            if (this.config.states.hasOwnProperty(stateName)){
                if (stateName === state){
                    this.currentState = state;
                    this.transitionsHistory.push(state);
                    this.undoArray = [];
                    return;
                }
            }
        }
        throw new Error("State doesn't exist");
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        for (let eventName in this.config.states[this.currentState].transitions){
            if (this.config.states[this.currentState].transitions.hasOwnProperty(eventName)){
                if (eventName === event){
                    this.currentState = this.config.states[this.currentState].transitions[eventName];
                    this.transitionsHistory.push(this.currentState);
                    this.undoArray = [];
                    return;
                }
            }
        }
        throw new Error("State doesn't exist");
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let statesList = [];
        for (let stateName in this.config.states){
            if (this.config.states.hasOwnProperty(stateName)){
                if (event){
                    if (this.config.states[stateName].transitions[event] && statesList.indexOf(stateName) === -1){
                        statesList.push(stateName);
                    }
                } else{
                    statesList.push(stateName);
                }
            }
        }
        return statesList;
    }            

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.transitionsHistory.length === 1){
            return false;
        } else{
            this.undoArray.push(this.transitionsHistory[this.transitionsHistory.length - 1]);
            this.transitionsHistory.splice(this.transitionsHistory.length - 1, 1);
            this.currentState = this.transitionsHistory[this.transitionsHistory.length - 1];
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.undoArray.length > 0){
            this.currentState = this.undoArray[this.undoArray.length - 1];
            this.transitionsHistory.push(this.currentState);
            this.undoArray.splice(this.undoArray.length - 1, 1);
            return true;
        } else{
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.transitionsHistory = [];
        this.transitionsHistory.push(this.currentState);
        this.undoArray = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
