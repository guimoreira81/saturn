class vector2{
    constructor(x=0, y=0){
        this.x = x
        this.y = y
    }
    text(){
        return `(${this.x}, ${this.y})`
    }
    roundedText(precision=10){
        return `(${Math.round(this.x*precision)/precision}, ${Math.round(this.y*precision)/precision})`
    }
    add(other){
        return new vector2(this.x+other.x, this.y+other.y)
    }
    sub(other){
        return new vector2(this.x-other.x, this.y-other.y)
    }
    mul(other){
        if (typeof(other) == "number"){
            return new vector2(this.x*other, this.y*other)
        }else{
            return new vector2(this.x*other.x, this.y*other.y)
        }
    }
    div(other){
        if (typeof(other) == "number"){
            return new vector2(this.x/other, this.y/other)
        }else{
            return new vector2(this.x/other.x, this.y/other.y)
        }
    }
    magnitude(){
        return Math.sqrt(this.x*this.x+this.y*this.y)
    }
    unit(){
        return this.div(this.magnitude())
    }
    //Reverificar
    rotate(angle){
        let vertice = this
        angle = angle.mul(Math.PI).div(180)
        vertice = new vector2(vertice.x, vertice.y*Math.cos(angle.x))
        vertice = new vector2(vertice.x*Math.cos(angle.y), vertice.y)
        return vertice
    }
}
class vector3{
    constructor(x=0, y=0, z=0){
        this.x = x
        this.y = y
        this.z = z
    }
    text(){
        return "("+this.x+", "+this.y+", "+this.z+")"
    }
    rText(precision=10){
        return "("+Math.round(this.x*precision)/precision+", "+Math.round(this.y*precision)/precision+", "+Math.round(this.z*precision)/precision+")"
    }
    add(other){
        return new vector3(this.x+other.x, this.y+other.y, this.z+other.z)
    }
    sub(other){
        return new vector3(this.x-other.x, this.y-other.y, this.z-other.z)
    }
    mul(other){
        if (typeof(other)=="number"){
            return new vector3(this.x*other,this.y*other, this.z*other)
        }else{
            return new vector3(this.x*other.x, this.y*other.y, this.z*other.z)
        }
    }
    div(other){
        if (typeof(other)=="number"){
            return new vector3(this.x/other, this.y/other, this.z/other)
        }else{
            return new vector3(this.x/other.x, this.y/other.y, this.z/other.z)
        }
    }
    magnitude(){
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)
    }
    unit(){
        return this.div(this.magnitude())
    }
    rotate(angle) {
        let vector = this
        angle = angle.mul(Math.PI).div(180)
        const cosX = Math.cos(angle.x), sinX = Math.sin(angle.x)
        const cosY = Math.cos(angle.y), sinY = Math.sin(angle.y)
        const cosZ = Math.cos(angle.z), sinZ = Math.sin(angle.z)

        vector = new vector3(vector.x*cosZ-vector.y*sinZ, vector.x*sinZ+vector.y*cosZ, vector.z)
        vector = new vector3(vector.x*cosY+vector.z*sinY, vector.y, -vector.x*sinY+vector.z*cosY)
        vector = new vector3(vector.x, vector.y*cosX-vector.z*sinX, vector.y*sinX+vector.z*cosX)
        
        return vector
    }
    forward(){
        let angle = this.mul(Math.PI).div(180)

        return new vector3(
            Math.cos(angle.x)*Math.sin(angle.y),
            -Math.sin(angle.x),
            -Math.cos(angle.x)*Math.cos(angle.y)
        ).mul(-1)
    }
    right(){
        let angle = this.mul(Math.PI).div(180)

        return new vector3(
            Math.cos(angle.y),
            0,
            Math.sin(angle.y)
        )
    }

    up(){
        let angle = this.mul(Math.PI).div(180)

        return new vector3(
            Math.sin(angle.x)*Math.sin(angle.y),
            Math.cos(angle.x),
            -Math.sin(angle.x)*Math.cos(angle.y)
        )
    }      
}