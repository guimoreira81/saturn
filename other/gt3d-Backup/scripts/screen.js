const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
ctx.textRendering = "optimizeSpeed"
const standardColor = "rgb(100, 255, 0)"

//letterWidth = windowSize.x/160.083333
//letterHeight = windowSize.y/43.65
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

let screen = []
screen.text = ""
screen.colorMap = []
letterSize = new vector2()
let screenSizeScale = 1.5
screen.setLetterRatio = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let letterRatio = Math.floor(window.innerWidth/95.6)
    letterSize = new vector2(letterRatio*0.6, letterRatio).div(screenSizeScale)
    screen.size = new vector2(Math.round(159*screenSizeScale), Math.round(window.innerHeight/letterSize.y))
    ctx.font = letterSize.y+"px monospace"
}
screen.setLetterRatio()

screen.fill = (character) => {
    screen.setLetterRatio()
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
            ctx.fillText(screen.text[line*screen.size.x+column], column*letterSize.x, (line+1)*letterSize.y)
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

screen.drawTriangle = (charactere, p1, p2, p3, color=standardColor, filled=false) => {
    let positionLimits = {}

    let direction = (p2.sub(p1)).unit()
    let distance = p2.sub(p1).magnitude()
    let reference = p1
    for (let i = 0; i < distance; i++){
        reference = reference.add(direction)
        const roundedY = Math.round(reference.y)
        screen.drawPixel(charactere, reference, color)
        if (positionLimits[roundedY]){
            if (reference.x < positionLimits[roundedY][0]){
                positionLimits[roundedY][0] = reference.x
            }
            if (reference.x > positionLimits[roundedY][1]){
                positionLimits[roundedY][1] = reference.x
            }
        }else{
            positionLimits[roundedY] = [reference.x, reference.x]
        }
    }
    direction = (p3.sub(p2)).unit()
    distance = p3.sub(p2).magnitude()
    reference = p2
    for (let i = 0; i < distance; i++){
        reference = reference.add(direction)
        const roundedY = Math.round(reference.y)
        screen.drawPixel(charactere, reference, color)
        if (positionLimits[roundedY]){
            if (reference.x < positionLimits[roundedY][0]){
                positionLimits[roundedY][0] = reference.x
            }
            if (reference.x > positionLimits[roundedY][1]){
                positionLimits[roundedY][1] = reference.x
            }
        }else{
            positionLimits[roundedY] = [reference.x, reference.x]
        }
    }
    direction = (p1.sub(p3)).unit()
    distance = p1.sub(p3).magnitude()
    reference = p3
    for (let i = 0; i < distance; i++){
        reference = reference.add(direction)
        const roundedY = Math.round(reference.y)
        screen.drawPixel(charactere, reference, color)
        if (positionLimits[roundedY]){
            if (reference.x < positionLimits[roundedY][0]){
                positionLimits[roundedY][0] = reference.x
            }
            if (reference.x > positionLimits[roundedY][1]){
                positionLimits[roundedY][1] = reference.x
            }
        }else{
            positionLimits[roundedY] = [reference.x, reference.x]
        }
    }
    for (const y in positionLimits){
        const xPositions = positionLimits[y]
        const p1 = new vector2(xPositions[0], parseInt(y))
        const p2 = new vector2(xPositions[1], parseInt(y))
        screen.drawLine(charactere, p1, p2, color)
    }
}

screen.drawPolygon = (charactere, positionsList, color=standardColor) => {
    positionsList.forEach((position, index) => {
        let position2
        if (index == 0){
            position2 = positionsList[positionsList.length-1]
        }else{
            position2 = positionsList[index-1]
        }
        screen.drawLine(charactere, position, position2, color)
    })
}