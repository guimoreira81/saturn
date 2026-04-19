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
    forward2(){
        //ERRO ESTÁ AQUI, CONFIRMADO!
        //(POSSIVEL ERRO NA HORA DE CALCULAR A ROTAÇÃO "Z" DO DIRECTION) -> Averiguar
        //FALHA NA HORA DE OLHAR PARA CIMA E ANDAR, FALHA NA HORA DE ANDAR PARA CIMA DEPOIS DE TER ROTACIONADO PARA O LADO, QUANDO SE ESTÁ NO LADO OPOSTO DO 0, 0, 0, O UP SE TORNA EM BAIXO
        //X errado
        //azimuth = x, elevation = y roll = z
        //const x0 = Math.cos(angle.y)*Math.cos(angle.x)
        //const y0 = Math.sin(angle.y)
        //const z0 = Math.cos(angle.y)*Math.sin(angle.x)
        
        let angle = this.mul(Math.PI).div(180)

        let d = new vector3(
            Math.cos(angle.x)*Math.cos(angle.y), 
            -Math.sin(angle.x),
            Math.cos(angle.x)*Math.sin(angle.y)
        ) //mudar X e Z pelo angulo Y
        //return d

        d = new vector3(0, Math.sin(angle.y)*Math.cos(angle.z), Math.cos(angle.y)*Math.cos(angle.z)) //mudar Y e Z pelo angulo X

        const x0 = Math.cos(angle.x)*Math.cos(angle.y)
        const y0 = Math.sin(angle.x)
        const z0 = Math.cos(angle.x)*Math.sin(angle.y)

        const cosR = Math.cos(angle.z)
        const sinR = Math.sin(angle.z)

        const x = x0*cosR-y0*sinR
        const y = x0*sinR+y0*cosR
        const z = z0

        let direction = new vector3(x, y, z)
        return direction //new vector3(1, 0, 0).rotate(angle)
    }

    forward(){
        let angle = this.mul(Math.PI).div(180)
        let d = new vector3(
            Math.cos(angle.x)*Math.cos(angle.y), 
            -Math.sin(angle.x),
            Math.cos(angle.x)*Math.sin(angle.y)
        ) //mudar X e Z pelo angulo Y
        return new vector3()
        //return d.rotate(new vector3(90, 0, 0))
    }
    right(){
        let angle = this.mul(Math.PI).div(180)
        let d = new vector3(
            -Math.sin(angle.x),
            Math.cos(angle.x)*Math.cos(angle.y), 
            Math.cos(angle.x)*Math.sin(angle.y)
        ) //mudar X e Z pelo angulo Y
        return d.rotate(new vector3(0, -90, 0))
    }
    up(){
        let angle = this.mul(Math.PI).div(180)
        let d = new vector3(
            Math.cos(angle.x)*Math.cos(angle.y), 
            -Math.sin(angle.x),
            Math.cos(angle.x)*Math.sin(angle.y)
        ) //mudar X e Z pelo angulo Y
        return d
    }

    /*forward() {
    Versão z não altera x e y (rotacionar o angulo Y altera o X e o Z perfeitamente)
        let angle = this.mul(Math.PI).div(180)

        const x = Math.cos(angle.x)*Math.cos(angle.y)
        const y = Math.sin(angle.x)
        const z = Math.cos(angle.x)*Math.sin(angle.y)

        let direction = new vector3(x, y, z)
        return direction //new vector3(1, 0, 0).rotate(angle)

    Versão antiga
        ----------
        let angle = this.mul(Math.PI).div(180)

        const x0 = Math.cos(angle.x)*Math.cos(angle.y)
        const y0 = Math.sin(angle.x)
        const z0 = Math.cos(angle.x)*Math.sin(angle.y)

        const cosR = Math.cos(angle.z)
        const sinR = Math.sin(angle.z)

        const x = x0*cosR-y0*sinR
        const y = x0*sinR+y0*cosR
        const z = z0

        let direction = new vector3(x, y, z)
        return direction //new vector3(1, 0, 0).rotate(angle)

        ---------
    COMPLETAMENTE ERRADO
        const [rx, ry, rz] = [this.x, this.y, this.z]
      
        // Calcula seno e cosseno para cada ângulo
        const cx = Math.cos(rx), sx = Math.sin(rx)
        const cy = Math.cos(ry), sy = Math.sin(ry)
        const cz = Math.cos(rz), sz = Math.sin(rz)
      
        // Matriz de rotação composta (Z * Y * X)
        const dir = [
          cy * sz * sx + sy * cz,
          sy * sz * sx - cy * cz,
          sz * cx
        ]
      
        // Normaliza o vetor de direção
        const length = Math.hypot(dir[0], dir[1], dir[2])
        let resultado = dir.map(v => v / length)
        return new vector3(resultado[0], resultado[1], resultado[2])
    }*/
      
}