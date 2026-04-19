let canvas = document.querySelector("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth
let ctx = canvas.getContext("2d")


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
    to2d(focalLenght){
        if (this.z < -70){
            return new vector2(NaN, NaN)
        }
        return new vector2(focalLenght*this.x/(focalLenght+this.z), focalLenght*this.y/(focalLenght+this.z))
    }
    forward(){
        
        //ERRO ESTÁ AQUI, CONFIRMADO!
        //(POSSIVEL ERRO NA HORA DE CALCULAR A ROTAÇÃO "Z" DO DIRECTION) -> Averiguar
        //FALHA NA HORA DE OLHAR PARA CIMA E ANDAR, FALHA NA HORA DE ANDAR PARA CIMA DEPOIS DE TER ROTACIONADO PARA O LADO, QUANDO SE ESTÁ NO LADO OPOSTO DO 0, 0, 0, O UP SE TORNA EM BAIXO
        //X errado
        //azimuth = x, elevation = y roll = z
        //const x0 = Math.cos(angle.y)*Math.cos(angle.x)
        //const y0 = Math.sin(angle.y)
        //const z0 = Math.cos(angle.y)*Math.sin(angle.x)
        
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
        return direction
    }
    /*forward() {
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

function rad(degrees){
    return (degrees-45)/360*Math.PI*2
}
function rotationToVector(degrees){
    let radians = rad(degrees)
    return new vector2(Math.sin(radians)+Math.cos(radians), Math.cos(radians)-Math.sin(radians))
}
var Models = []
Models.cube = [
[new vector3(0.5, 0.5, -0.5), new vector3(0.5, 0.5, 0.5)],
[new vector3(0.5, 0.5, 0.5), new vector3(-0.5, 0.5, 0.5)],
[new vector3(-0.5, 0.5, 0.5), new vector3(-0.5, 0.5, -0.5)],
[new vector3(-0.5, 0.5, -0.5), new vector3(0.5, 0.5, -0.5)],

[new vector3(0.5, -0.5, -0.5), new vector3(0.5, -0.5, 0.5)],
[new vector3(0.5, -0.5, 0.5), new vector3(-0.5, -0.5, 0.5)],
[new vector3(-0.5, -0.5, 0.5), new vector3(-0.5, -0.5, -0.5)],
[new vector3(-0.5, -0.5, -0.5), new vector3(0.5, -0.5, -0.5)],

[new vector3(0.5, 0.5, -0.5), new vector3(0.5, -0.5, -0.5)],
[new vector3(-0.5, 0.5, -0.5), new vector3(-0.5, -0.5, -0.5)],
[new vector3(0.5, 0.5, 0.5), new vector3(0.5, -0.5, 0.5)],
[new vector3(-0.5, 0.5, 0.5), new vector3(-0.5, -0.5, 0.5)]
]
Models.pyramid = [
[new vector3(0.5, -0.5, -0.5), new vector3(0.5, -0.5, 0.5)],
[new vector3(0.5, -0.5, 0.5), new vector3(-0.5, -0.5, 0.5)],
[new vector3(-0.5, -0.5, 0.5), new vector3(-0.5, -0.5, -0.5)],
[new vector3(-0.5, -0.5, -0.5), new vector3(0.5, -0.5, -0.5)],

[new vector3(0.5, -0.5, -0.5), new vector3(0, 0.5, 0)],
[new vector3(0.5, -0.5, 0.5), new vector3(0, 0.5, 0)],
[new vector3(-0.5, -0.5, 0.5), new vector3(0, 0.5, 0)],
[new vector3(-0.5, -0.5, -0.5), new vector3(0, 0.5, 0)]
]
Models.sphere = [
[new vector3(0.5, 0, 0), new vector3(0.35355339059327373, -0.35355339059327373, 0)], 
[new vector3(0.35355339059327373, -0.35355339059327373, 0), new vector3(0, -0.5, 0)], 
[new vector3(0, -0.5, 0), new vector3(-0.35355339059327373, -0.35355339059327373, 0)], 
[new vector3(-0.35355339059327373, -0.35355339059327373, 0), new vector3(-0.5, 0, 0)], 
[new vector3(-0.5, 0, 0), new vector3(-0.35355339059327373, 0.35355339059327373, 0)], 
[new vector3(-0.35355339059327373, 0.35355339059327373, 0), new vector3(0, 0.5, 0)], 
[new vector3(0, 0.5, 0), new vector3(0.35355339059327373, 0.35355339059327373, 0)], 
[new vector3(0.35355339059327373, 0.35355339059327373, 0), new vector3(0.5, 0, 0)], 
[new vector3(0.5, 0, 0), new vector3(0.35355339059327373, 0, -0.35355339059327373)], 
[new vector3(0.35355339059327373, 0, -0.35355339059327373), new vector3(0, 0, -0.5)], 
[new vector3(0, 0, -0.5), new vector3(-0.35355339059327373, 0, -0.35355339059327373)], 
[new vector3(-0.35355339059327373, 0, -0.35355339059327373), new vector3(-0.5, 0, 0)], 
[new vector3(-0.5, 0, 0), new vector3(-0.35355339059327373, 0, 0.35355339059327373)], 
[new vector3(-0.35355339059327373, 0, 0.35355339059327373), new vector3(0, 0, 0.5)], 
[new vector3(0, 0, 0.5), new vector3(0.35355339059327373, 0, 0.35355339059327373)], 
[new vector3(0.35355339059327373, 0, 0.35355339059327373), new vector3(0.5, 0, 0)], 
[new vector3(0, 0.5, 0), new vector3(0, 0.35355339059327373, -0.35355339059327373)], 
[new vector3(0, 0.35355339059327373, -0.35355339059327373), new vector3(0, 0, -0.5)], 
[new vector3(0, 0, -0.5), new vector3(0, -0.35355339059327373, -0.35355339059327373)], 
[new vector3(0, -0.35355339059327373, -0.35355339059327373), new vector3(0, -0.5, 0)], 
[new vector3(0, -0.5, 0), new vector3(0, -0.35355339059327373, 0.35355339059327373)], 
[new vector3(0, -0.35355339059327373, 0.35355339059327373), new vector3(0, 0, 0.5)], 
[new vector3(0, 0, 0.5), new vector3(0, 0.35355339059327373, 0.35355339059327373)], 
[new vector3(0, 0.35355339059327373, 0.35355339059327373), new vector3(0, 0.5, 0)]
]
Models.cylinder = [
[new vector3(1.41, -0.5, 0), new vector3(1, -0.5, -1)],
[new vector3(1, -0.5, -1), new vector3(0, -0.5, -1.41)],
[new vector3(0, -0.5, -1.41), new vector3(-1, -0.5, -1)],
[new vector3(-1, -0.5, -1), new vector3(-1.41, -0.5, 0)],

[new vector3(-1.41, -0.5, 0), new vector3(-1, -0.5, 1)],
[new vector3(-1, -0.5, 1), new vector3(0, -0.5, 1.41)],
[new vector3(0, -0.5, 1.41), new vector3(1, -0.5, 1)],
[new vector3(1, -0.5, 1), new vector3(1.41, -0.5, 0)],


[new vector3(1.41, 0.5, 0), new vector3(1, 0.5, -1)],
[new vector3(1, 0.5, -1), new vector3(0, 0.5, -1.41)],
[new vector3(0, 0.5, -1.41), new vector3(-1, 0.5, -1)],
[new vector3(-1, 0.5, -1), new vector3(-1.41, 0.5, 0)],

[new vector3(-1.41, 0.5, 0), new vector3(-1, 0.5, 1)],
[new vector3(-1, 0.5, 1), new vector3(0, 0.5, 1.41)],
[new vector3(0, 0.5, 1.41), new vector3(1, 0.5, 1)],
[new vector3(1, 0.5, 1), new vector3(1.41, 0.5, 0)],

[new vector3(0, -0.5, 1.41), new vector3(0, 0.5, 1.41)],
[new vector3(0, -0.5, -1.41), new vector3(0, 0.5, -1.41)],
[new vector3(1.41, -0.5, 0), new vector3(1.41, 0.5, 0)],
[new vector3(-1.41, -0.5, 0), new vector3(-1.41, 0.5, 0)],
]
Models.cone = [
[new vector3(1.41, -0.5, 0), new vector3(1, -0.5, -1)],
[new vector3(1, -0.5, -1), new vector3(0, -0.5, -1.41)],
[new vector3(0, -0.5, -1.41), new vector3(-1, -0.5, -1)],
[new vector3(-1, -0.5, -1), new vector3(-1.41, -0.5, 0)],

[new vector3(-1.41, -0.5, 0), new vector3(-1, -0.5, 1)],
[new vector3(-1, -0.5, 1), new vector3(0, -0.5, 1.41)],
[new vector3(0, -0.5, 1.41), new vector3(1, -0.5, 1)],
[new vector3(1, -0.5, 1), new vector3(1.41, -0.5, 0)],


[new vector3(0, -0.5, 1.41), new vector3(0, 0.5, 0)],
[new vector3(0, -0.5, -1.41), new vector3(0, 0.5, 0)],
[new vector3(1.41, -0.5, 0), new vector3(0, 0.5, 0)],
[new vector3(-1.41, -0.5, 0), new vector3(0, 0.5, 0)],
]
Models.dot = [[new vector3(0, 0, 0), new vector3(0.1, 0, 0)]]

/*Models.sphere2 = []
let lados = 16
let direction = new vector3(1, 0, 0)
let old = undefined
for (let i2 = 0; i2 < lados/2+1; i2++){
    for (let i = 0; i < lados+1; i++){
        if (old){
            Models.sphere2.push([old.unit(), direction.unit()])
        }
        old = direction
        direction = direction.rotate(new vector3(-360/lados*i2, 0, 360/lados))
    }
}
direction = new vector3(0, 0, 1)
old = undefined
for (let i2 = 0; i2 < lados/2+1; i2++){
    for (let i = 0; i < lados+1; i++){
        if (old){
            Models.sphere2.push([old.unit(), direction.unit()])
        }
        old = direction
        direction = direction.rotate(new vector3(/*i2*22.5*0, 360/lados, 0))
    }
}
*/
/*let t = "Models.sphere = ["
Models.sphere.forEach((v, i) => {
    t += "[new vector3"+v[0].div(2).text()+", new vector3"+v[1].div(2).text()+"]"
    if (i < Models.sphere.length-1){
        t += ", \n"
    }
})
t = t+"]"
console.log(t)
*/
/*direction = new vector3(-1, 0, 0)
old = undefined
for (let z = 0; z < lados+1; z++){
    old = undefined
    for (let y = 0; y < lados+1; y++){
        if (old){
            Models.sphere2.push([old, direction])
        }
        old = direction
        direction = direction.rotate(new vector3(360/lados, 0, 0))
    }
    direction = direction.rotate(new vector3(0, 0, 360/lados))
}*/

//letterWidth = windowSize.x/160.083333
//letterHeight = windowSize.y/43.65
let standardColor = "rgb(100, 255, 0)"
let windowSize = new vector2(window.innerWidth, window.innerHeight)
ctx.textRendering = "optimizeSpeed"


/*
letterRatio = 20
Tamanho da tela: 159, 44
*/
/*
letterSize = new vector2()
function setLetterRatio(){
    let letterRatio = Math.floor(windowSize.x/95.6)
    letterSize = new vector2(letterRatio*0.6, letterRatio)
    screen.size = new vector2(159, Math.round(windowSize.y/letterSize.y))
    ctx.font = letterRatio+"px monospace"
}
setLetterRatio()
*/


let screen = []
screen.text = ""
screen.colorMap = []
letterSize = new vector2()
let screenSizeScale = 2
function setLetterRatio(){
    let letterRatio = Math.floor(windowSize.x/95.6)
    letterSize = new vector2(letterRatio*0.6, letterRatio).div(screenSizeScale)
    screen.size = new vector2(Math.round(159*screenSizeScale), Math.round(windowSize.y/letterSize.y))
    ctx.font = letterSize.y+"px monospace"
}
setLetterRatio()

/*
function setLetterRatio(){
    screen.size = new vector2(159, 44)
    let letterRatio = Math.floor(windowSize.y/screen.size.y)
    letterSize = new vector2(letterRatio*0.5, letterRatio)
    let standardCharWidth = ctx.measureText("a").width
    ctx.font = letterRatio+"px monospace"
}
setLetterRatio()
*/
screen.fill = (character) => {
    screen.text = ""
    screen.colorMap = []
    for (let i = 0; i < screen.size.x*screen.size.y; i++){
        screen.text += character
        screen.colorMap.push(standardColor)
    }
}

screen.refresh = () => {
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (let line = 0; line < screen.size.y; line++){
        for (let column = 0; column < screen.size.x; column++){
            ctx.fillStyle = screen.colorMap[line*screen.size.x+column]
            ctx.fillText(screen.text[line*screen.size.x+column], column*letterSize.x, (line+1)*letterSize.y) //Muda o tamanho da tela
        }
    }
}

screen.drawPixel = (character, position, color=standardColor) => {
    position = new vector2(Math.floor(position.x), Math.floor(position.y))
    if (position.x >= 0 && position.y >= 0 && position.x < screen.size.x && position.y < screen.size.y){
        let index = screen.size.x*position.y+position.x
        screen.text = screen.text.substring(0, index)+character+screen.text.substring(index+character.length)
        screen.colorMap[index] = color
    }
}

screen.drawRect = (charactere, position, size, color=standardColor) => {
    for (let y = 0; y < size.y; y++){
        for (let x = 0; x < size.x; x++){
            screen.drawPixel(charactere, position.add(new vector2(x, y)), color)
        }
    }
}

screen.drawText = (text, position, color=standardColor) => {
    let i = 0
    for (const char of text){
        screen.drawPixel(char, position.add(new vector2(i, 0)), color)
        i++
    }
}

screen.drawLine = (charactere, position1, position2, color=standardColor) => {
    let direction = (position2.sub(position1)).unit()
    let distance = position2.sub(position1).magnitude()
    let reference = position1
    for (let i = 0; i < distance; i++){
        reference = reference.add(direction)
        screen.drawPixel(charactere, reference, color)
    }
}

screen.drawPolygon = (charactere, positionsList, filled=false) => {
    positionsList.forEach((position, index) => {
        if (index == 0){
            screen.drawLine(charactere, position, positions[positions.length-1])
        }else{
            screen.drawLine(charactere, position, positions[index-1])
        }
    })
}

//Principal
const focalLenght = 70

let game = []
game.objects = []
game.ui = []
let buttonsList = []

let camera = []
camera.position = new vector3(0, 0, 0)
camera.speed = 5
camera.orientation = new vector3(0, 0, 0)
camera.sensibility = 5

class Button{
    constructor(){
        this.name = "button"
        this.size = new vector2(10, 10)
        this.position = new vector2(0, 0)
        this.visible = true
        this.text = "test"
        this.textColor = "rgb(255, 255, 255)"
        this.char = "#"
        this.borderChar = "A"
        this.color = standardColor
        this.borderColor = "rgb(50, 50, 50)"
        this.mouseDown = ()=>{}
        this.mouseUp = ()=>{}
        this.pressed = ()=>{}
        game.ui.push(this)
    }
    relativeSize(size){
        this.size = size.mul(screen.size)
    }
    relativePosition(position){
        this.position = position.mul(screen.size)
    }
}
let touchScreen = 'ontouchstart' in window || navigator.msMaxTouchPoints || false

let upButton = new Button()
upButton.text = "^"
upButton.relativePosition(new vector2(0.2, 0.8))
upButton.relativeSize(new vector2(.1, .1))
upButton.color = "rgb(100, 100, 100)"

let downButton = new Button()
downButton.text = "v"
downButton.relativePosition(new vector2(0.2, 0.9))
downButton.relativeSize(new vector2(.1, .1))
downButton.color = "rgb(120, 120, 120)"

let rightButton = new Button()
rightButton.text = ">"
rightButton.relativePosition(new vector2(0.3, 0.9))
rightButton.relativeSize(new vector2(.1, .1))
rightButton.color = "rgb(100, 100, 100)"

let leftButton = new Button()
leftButton.text = "<"
leftButton.relativePosition(new vector2(0.1, 0.9))
leftButton.relativeSize(new vector2(.1, .1))
leftButton.color = "rgb(100, 100, 100)"

let flyUpButton = new Button()
flyUpButton.text = "Cima"
flyUpButton.relativePosition(new vector2(0.95, 0.8))
flyUpButton.relativeSize(new vector2(.1, .1))
flyUpButton.color = "rgb(120, 120, 120)"

let flyDownButton = new Button()
flyDownButton.text = "Baixo"
flyDownButton.relativePosition(new vector2(0.95, 0.9))
flyDownButton.relativeSize(new vector2(.1, .1))
flyDownButton.color = "rgb(100, 100, 100)"

flyUpButton.visible = touchScreen
flyDownButton.visible = touchScreen
upButton.visible = touchScreen
downButton.visible = touchScreen
rightButton.visible = touchScreen
leftButton.visible = touchScreen

leftButton.pressed = () => {
    let forward = camera.orientation.forward()
    camera.position = camera.position.add(forward)
    //console.log("up")
}
rightButton.pressed = () => {
    let forward = camera.orientation.forward()
    camera.position = camera.position.sub(forward)
    //console.log("down")
}
upButton.pressed = () => {
    let forward = camera.orientation.forward()
    let right = forward.rotate(new vector3(0, 90, 0))
    camera.position = camera.position.add(right)
    //console.log("right")
}
downButton.pressed = () => {
    let forward = camera.orientation.forward()
    let right = forward.rotate(new vector3(0, 90, 0))
    camera.position = camera.position.sub(right)
    //console.log("left")
}

flyUpButton.pressed = () => {
    let forward = camera.orientation.forward()
    let up = forward.rotate(new vector3(0, 0, 90))
    camera.position = camera.position.add(up)
    //console.log("right")
}
flyDownButton.pressed = () => {
    let forward = camera.orientation.forward()
    let up = forward.rotate(new vector3(0, 0, 90))
    camera.position = camera.position.sub(up)
    //console.log("left")
}

let currentID = 0
class Object{
    constructor(name, size, position = new vec, model){
        this.name = name
        this.size = size
        this.position = position
        this.orientation = new vector3()
        this.velocity = new vector3()
        this.rotationVelocity = new vector3()
        this.model = model
        this.color = "rgb(100, 255, 0)"
        this.anchored = false
        this.ID = currentID
        currentID++
        game.objects.push(this)
    }
}

let Saturn = new Object("Saturn", new vector3(20, 20, 20), new vector3(), Models.sphere)
Saturn.color = "rgb(255, 255, 50)"
Saturn.rotationVelocity = new vector3(0, -50, 0)

for (let i = 0; i < 350; i++){
    let position = new vector3(Math.random()*100-50, 0, Math.random()*100-50)
    position = position.unit().mul(Math.random()*5+30)
    let object = new Object("Asteroid", new vector3(1, 1, 1), position, Models.dot)
    object.orientation = new vector3(0, Math.random()*360, 0)
    let pos = 20+Math.random()*20
    if (i > 300){
        pos = 45+Math.random()*5
    }
    object.position = object.orientation.forward().mul(pos)
    object.color = "rgb(150, 150, 150)"
    object.velocity = object.orientation.forward().rotate(new vector3(0, -90, 0)).mul(10)
}

document.addEventListener("keydown", function(event) {
    let forward = camera.orientation.forward()
    let right = forward.rotate(new vector3(0, 90, 0))
    let up = forward.rotate(new vector3(0, 0, 90))
    if (event.key == "a"){
        camera.position = camera.position.add(forward)
    }
    if (event.key == "w"){
        camera.position = camera.position.add(right)
    }
    if (event.key == "s"){
        camera.position = camera.position.add(right.mul(-1))
    }
    if (event.key == "d"){
        camera.position = camera.position.add(forward.mul(-1))
    }
    if (event.key == "z"){
        camera.position = camera.position.add(up)
    }
    if (event.key == "x"){
        camera.position = camera.position.add(up.mul(-1))
    }

    if (event.key == "ArrowUp"){
        camera.orientation = camera.orientation.add(new vector3(-camera.sensibility, 0, 0))
    }
    if (event.key == "ArrowDown"){
        camera.orientation = camera.orientation.add(new vector3(camera.sensibility, 0, 0))
    }
    if (event.key == "ArrowRight"){
        camera.orientation = camera.orientation.add(new vector3(0, -camera.sensibility, 0))
    }
    if (event.key == "ArrowLeft"){
        camera.orientation = camera.orientation.add(new vector3(0, camera.sensibility, 0))
    }
    
    if (event.key == "q"){
        camera.orientation = camera.orientation.add(new vector3(0, 0, -camera.sensibility))
    }
    if (event.key == "e"){
        camera.orientation = camera.orientation.add(new vector3(0, 0, camera.sensibility))
    }
})
let mousePosition = new vector2()
let mouseDown = false


window.addEventListener("pointermove", (event) => {
    mousePosition = new vector2(event.clientX, event.clientY).div(windowSize).mul(screen.size)
})
window.addEventListener("pointerup", (event) => {
    mouseDown = false
})
window.addEventListener("pointerdown", (event) => {
    mouseDown = true
})

document.addEventListener("mousemove", (event) => {
    mousePosition = new vector2(event.clientX, event.clientY).div(windowSize).mul(screen.size)
})
document.body.onmousedown = () => {
    mouseDown = true
}
document.body.onmouseup = () => {
    mouseDown = false
}

function updateFrame(dt){
    game.objects.forEach((object, i) => {
        let acceleration = new vector3()
        if (object.name != "Saturn"){
            acceleration = acceleration.add(Saturn.position.sub(object.position).unit().mul(3))
        }
        object.velocity = object.velocity.add(acceleration.mul(dt))
        object.orientation = object.orientation.add(object.rotationVelocity.mul(dt))
        object.position = object.position.add(object.velocity.mul(dt))
    })
}

function drawFrame(){
    setLetterRatio()
    screen.fill(" ", "rgb(100, 100, 100)")
    screen.drawPixel("P", new vector2(screen.size.x, 0), "rgb(255, 255, 255)")
    game.objects.forEach((object, i) => {
        object.model.forEach((line, i2) => {
            /*
            let size = object.size
            let position = object.position.add(camera.position)
            */
            let size = object.size.mul(screen.size.y).div(20)
            let position = object.position.add(camera.position).mul(screen.size.y).div(20)
            let v1 = line[0].mul(size)
            let v2 = line[1].mul(size)
            v1 = v1.rotate(object.orientation)
            v2 = v2.rotate(object.orientation)
            v1 = v1.add(position)
            v2 = v2.add(position)
            v1 = v1.add(new vector3(0, 0, 70))
            v2 = v2.add(new vector3(0, 0, 70))
            v1 = v1.rotate(camera.orientation)
            v2 = v2.rotate(camera.orientation)
            v1 = v1.sub(new vector3(0, 0, 70))
            v2 = v2.sub(new vector3(0, 0, 70))
            v1 = v1.to2d(focalLenght)
            v2 = v2.to2d(focalLenght)
            v1 = v1.add(screen.size.div(2))
            v2 = v2.add(screen.size.div(2))
            screen.drawLine("▆", v1, v2, object.color)
        })
    })
    game.ui.forEach((uiItem, i) =>{
        if (uiItem.visible){
            let uiItemPosition = uiItem.position.sub(uiItem.size.div(2))
            screen.drawRect(uiItem.char, uiItemPosition, uiItem.size, uiItem.color)
            screen.drawText(uiItem.text, uiItemPosition.add(new vector2(uiItem.text.length/2, uiItem.size.y/2)), uiItem.textColor)
            if (uiItem instanceof Button){
                if (mouseDown && mousePosition.x > uiItem.position.x-uiItem.size.x/2 && mousePosition.x < uiItem.position.x+uiItem.size.x/2 && mousePosition.y > uiItem.position.y-uiItem.size.y/2 && mousePosition.y < uiItem.position.y+uiItem.size.y/2){
                    uiItem.pressed()
                }
            }
        }
    })
    
    screen.drawPixel("X", screen.size.div(2))
    screen.refresh()
}

/*
const vetor = new vector3(0, 0, 1)
const angulo = new vector3(90, 0, 0)
const resultado = vetor.rotate(angulo)
console.log(resultado.text())
*/


const FPS = 12
const wait = time => new Promise(res => setTimeout(res, time))
async function _load(){
    while (true){
        const dt = 1/FPS
        updateFrame(dt)
        drawFrame()
        await wait(dt*1000)
    }
}
_load()