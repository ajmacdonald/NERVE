
class DragHandler{
    
    constructor(){
        this.current = null;
    }
    
    set(widget){
        this.current = widget;
    }
    
    get(){
        return this.current;
    }
    
    has(){
        return this.current === null;
    }
    
    clear(){
        this.current = null;
    }
    
    static getInstance(){
        return DragHandler.instance;
    }
    
}

DragHandler.instance = new DragHandler();
module.exports = DragHandler;

