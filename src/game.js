let game = {
    "objects": [],
    "ui": [],
    "updateFrame": (dt) => {},
    "drawFrame": () => {},
    "light": {
        "lightDirection": new vector3(1, 0, 0)
    },
    "camera": {
        "focalLenght": 70,
        "position": new vector3(0, 0, 0),
        "speed": 5,
        "orientation": new vector3(0, 0, 0),
        "sensibility": 5
    },
    "render": {

    }
}

game.camera.worldPositionToScreen = (vector) => {
    vector = new vector2(game.camera.focalLenght*vector.x/(game.camera.focalLenght+vector.z), game.camera.focalLenght*vector.y/(game.camera.focalLenght+vector.z))
    vector = new vector2(vector.x*1.4, vector.y)
    vector = vector.add(screen.size.div(2))
    return vector
}

function rgbToNumber(rgb){
    rgb = rgb.substring(4, rgb.length-1).split(", ")
    return [parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2])]
}

let renderingQueue = []

let currentID = 0
class Object{
    constructor(name, size, position = new vector3(0, 0, 0), model){
        this.name = name
        this.size = size
        this.position = position
        this.orientation = new vector3()
        this.velocity = new vector3()
        this.rotationVelocity = new vector3()
        this.model = model
        this.char = "▆"
        this.color = "rgb(100, 255, 0)"
        this.anchored = false
        this.renderMode = "triangle"
        this.ID = currentID
        currentID++
        game.objects.push(this)
    }
    
    transformFromObject(vector){
        let size = this.size.mul(screen.size.y).div(20)
        let position = this.position.add(game.camera.position).mul(screen.size.y).div(20)
        vector = new vector3(vector[0], vector[1], vector[2])
        vector = vector.mul(size)
        vector = vector.rotate(this.orientation)
        vector = vector.add(position)
        const zAngle = game.camera.orientation.z*Math.PI/180/2
        const zcos = Math.cos(zAngle), zsin = Math.sin(zAngle)

        const co = game.camera.orientation
        
        //vector = vector.rotate(new vector3(co.x*zcos-co.x*zsin, co.y*zcos+co.y*zsin, 0))
        vector = vector.rotate(new vector3(game.camera.orientation.x, game.camera.orientation.y, 0))
        vector = vector.rotate(new vector3(0, 0, game.camera.orientation.z))
        vector = vector.sub(new vector3(0, 0, game.camera.focalLenght))
        return vector
    }

    render(){
        this.model.forEach((face) => {
            let color = rgbToNumber(this.color)
                if (this.renderMode == "triangle"){
                    const colorOffset = face[face.length-2]
                    const faceCenter = new vector3(face[0][0], face[0][1], face[0][2])
                    let facePosition = faceCenter.mul(this.size).rotate(this.orientation)
                    let LightPosition = game.light.lightDirection.mul(this.size.x)
                    let lightDistance = (LightPosition.sub(facePosition)).magnitude()
                    const y = 140
                    color = [color[0]-lightDistance/this.size.x*y, color[1]-lightDistance/this.size.x*y, color[2]-lightDistance/this.size.x*y]
                    color = [color[0]+colorOffset[0], color[1]+colorOffset[1], color[2]+colorOffset[2]]
                }

            let outsideScreen = false

            let faceResult = {
                color: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                char: this.char,
                vertex: [],
                depth: 0
            }

            switch (this.renderMode){
                case "dot":
                    face = [this.transformFromObject(face[0])]
                    outsideScreen = face[0].z<-game.camera.focalLenght
                    faceResult.depth = face[0].z
                    faceResult.vertex = [game.camera.worldPositionToScreen(face[0])]
                    
                    outsideScreen = outsideScreen||faceResult.vertex[0].x<0&&faceResult.vertex[0].x>screen.size.x&&faceResult.vertex[0].y<0&&faceResult.vertex[0].y>screen.size.y
                    break
                case "line":
                    face = [this.transformFromObject(face[0]), this.transformFromObject(face[1])]
                    outsideScreen = face[0].z<game.camera.focalLenght||face[1].z<-game.camera.focalLenght
                    faceResult.depth = face[0].z
                    faceResult.vertex = [game.camera.worldPositionToScreen(face[0]), game.camera.worldPositionToScreen(face[1])]
                    outsideScreen = outsideScreen||faceResult.vertex[0].x<0&&faceResult.vertex[0].x>screen.size.x&&faceResult.vertex[0].y<0&&faceResult.vertex[0].y>screen.size.y
                    outsideScreen = outsideScreen||faceResult.vertex[1].x<0&&faceResult.vertex[1].x>screen.size.x&&faceResult.vertex[1].y<0&&faceResult.vertex[1].y>screen.size.y
                    break
                case "triangle": 
                    face = [this.transformFromObject(face[0]), this.transformFromObject(face[1]), this.transformFromObject(face[2])]
                    outsideScreen = face[0].z<-game.camera.focalLenght||face[1].z<-game.camera.focalLenght||face[2].z<-game.camera.focalLenght
                    faceResult.depth = face[0].z
                    faceResult.vertex = [game.camera.worldPositionToScreen(face[0]), game.camera.worldPositionToScreen(face[1]), game.camera.worldPositionToScreen(face[2])]
                    outsideScreen = outsideScreen||faceResult.vertex[0].x<0&&faceResult.vertex[0].x>screen.size.x&&faceResult.vertex[0].y<0&&faceResult.vertex[0].y>screen.size.y
                    outsideScreen = outsideScreen||faceResult.vertex[1].x<0&&faceResult.vertex[1].x>screen.size.x&&faceResult.vertex[1].y<0&&faceResult.vertex[1].y>screen.size.y
                    outsideScreen = outsideScreen||faceResult.vertex[2].x<0&&faceResult.vertex[2].x>screen.size.x&&faceResult.vertex[2].y<0&&faceResult.vertex[0].y>screen.size.y
                    break
            }

            if (!outsideScreen){
                renderingQueue.push(faceResult)
            }
        })
    }
}
let buttonsList = []
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
const touchScreen = 'ontouchstart' in window || navigator.msMaxTouchPoints || false

let mousePosition = new vector2()
let mouseDown = false

window.addEventListener("pointermove", (event) => {
    mousePosition = new vector2(event.clientX/window.innerWidth, event.clientY/window.innerHeight).mul(screen.size)
})
window.addEventListener("pointerup", (event) => {
    mouseDown = false
})
window.addEventListener("pointerdown", (event) => {
    mouseDown = true
})

document.addEventListener("mousemove", (event) => {
    mousePosition = new vector2(event.clientX/window.innerWidth, event.clientY/window.innerHeight).mul(screen.size)
})
document.body.onmousedown = () => {
    mouseDown = true
}
document.body.onmouseup = () => {
    mouseDown = false
}


function sort(renderingQueue){
    let newArray = []
    let renderingQueueLength = renderingQueue.length
    for (let i2 = 0; i2 < renderingQueueLength; i2++){
            let minIndex = undefined
            let maxValue = undefined
            renderingQueue.forEach((face, index)=>{
                let thisValue = face.depth
                if(maxValue == undefined || thisValue > maxValue){
                    maxValue = thisValue
                    minIndex = index
                }
            })
            let newValue = renderingQueue[minIndex]
            renderingQueue.splice(minIndex, 1)
            newArray.push(newValue)
        }
    return newArray
}


const FPS = 12
const wait = time => new Promise(res => setTimeout(res, time))
async function _load(){
    while (true){
        const dt = 1/FPS
        game.updateFrame(dt)

        screen.fill(" ", "rgb(100, 100, 100)")
        renderingQueue = []
        game.objects.forEach((object, i) => {
            object.render()
        })
        renderingQueue = sort(renderingQueue)
        renderingQueue.forEach((face) => {
            switch (face.vertex.length){
                case 1:
                    screen.drawText(face.char, face.vertex[0], face.color)
                    break
                case 2:
                    screen.drawLine(face.char, face.vertex[0], face.vertex[1], face.color)
                    break
                case 3:
                    screen.drawTriangle(face.char, face.vertex[0], face.vertex[1], face.vertex[2], face.color)
                    break
            }
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
        game.drawFrame()
        screen.refresh()
        await wait(dt*1000)
    }
}
_load()