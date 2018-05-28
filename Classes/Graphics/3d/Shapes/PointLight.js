/*
    3d pointlight class
    Author: Tar van Krieken
    Starting Date: 16/05/2018
*/
class PointLight3d extends Shape3d{
    constructor(graphics, color, intensity, distance, decay, preInit){
        super(graphics, color, function(){
            this.color = typeof(color)=="Number"?color:0xffffff;
            this.intensity = typeof(intensity)=="Number"?intensity:1;
            this.distance = typeof(distance)=="Number"?distance:500;
            this.decay = typeof(decay)=="Number"?decay:1;
            
            if(color && color.call) color.call(this);
            if(intensity && intensity.call) intensity.call(this);
            if(distance && distance.call) distance.call(this);
            if(decay && decay.call) decay.call(this);
            if(preInit && preInit.call) preInit.call(this);
        });
        
        if(window.debug){
            var geometry = new THREE.SphereGeometry(0.005, 32, 32);
            var material = new THREE.MeshBasicMaterial(0xffffff);
            this.mesh.add(new THREE.Mesh(geometry, material));
        }
    }
    __createShape(){}
    __createMaterial(){}
    __createMesh(){
        this.mesh = new THREE.PointLight(this.color, this.intensity, this.distance, this.decay);
        return this;
    }
    
    //change properties
    setIntensity(intensity){
        this.intensity = intensity;
        this.mesh.power = intensity*4*Math.PI;
        return this;
    }
    getIntensity(){
        return this.intensity;
    }
    setDistance(distance){
        this.distance = distance;
        this.mesh.distance = distance;
        return this;
    }
    getDistance(){
        return this.distance;
    }
    setDecay(decay){
        this.decay = decay;
        this.mesh.decay = decay;
        return this;
    }
    getDecay(){
        return this.decay;
    }
    setColor(color){
        this.mesh.color.setHex(color);
        this.color = color;
        return this;
    }
}