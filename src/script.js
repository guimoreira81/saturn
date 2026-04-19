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
    let forward = game.camera.orientation.forward()
    game.camera.position = game.camera.position.add(forward)
}
rightButton.pressed = () => {
    let forward = game.camera.orientation.forward()
    game.camera.position = game.camera.position.sub(forward)
}
upButton.pressed = () => {
    let forward = game.camera.orientation.forward()
    let right = forward.rotate(new vector3(0, 90, 0))
    game.camera.position = game.camera.position.add(right)
}
downButton.pressed = () => {
    let forward = game.camera.orientation.forward()
    let right = forward.rotate(new vector3(0, 90, 0))
    game.camera.position = game.camera.position.sub(right)
}

flyUpButton.pressed = () => {
    let forward = game.camera.orientation.forward()
    let up = forward.rotate(new vector3(0, 0, 90))
    game.camera.position = game.camera.position.add(up)
}
flyDownButton.pressed = () => {
    let forward = game.camera.orientation.forward()
    let up = forward.rotate(new vector3(0, 0, 90))
    game.camera.position = game.camera.position.sub(up)
}

let timeScale = 1

game.camera.position = new vector3(0, 0, 0)
let Saturn = new Object("Saturn", new vector3(20, 20, 20).div(2), new vector3(0, 0, 0), Models.triangle.saturn)
Saturn.color = "rgb(255, 255, 50)"
Saturn.char = "#"
Saturn.orientation = new vector3(90, 0, 0)
Saturn.rotationVelocity = new vector3(0, 0, 25)

for (let i = 0; i < 500; i++){
    let asteroid = new Object("Asteroid", new vector3(1, 1, 1), new vector3(), Models.dot.dot)
    asteroid.char = "#"
    asteroid.renderMode = "dot"
    asteroid.orientation = new vector3(0, Math.random()*360, 0)
    let l1d = 20
    let l1s = 20
    let l2s = 10
    let distance = l1d+Math.random()*l1s
    if (i > 400){
        distance = l1d+l1s+Math.random()*l2s
    }
    //asteroid.position = asteroid.orientation.forward().mul(distance)
    asteroid.color = "rgb(150, 150, 150)"
    asteroid.velocity = asteroid.orientation.forward().rotate(new vector3(0, -90, 0)).mul(10*0.55)
}

document.addEventListener("keydown", function(event) {
    const forward = game.camera.orientation.forward()
    const right = game.camera.orientation.right()
    const up = game.camera.orientation.up() //forward.rotate(new vector3(0, 0, 90))
    /*console.clear()
    console.log("forward (a+, d-): "+forward.text())
    console.log("right (w+, s-): "+right.text())
    console.log("up (z+, x-): "+up.text())*/
    
    if (event.key == "w"){
        game.camera.position = game.camera.position.add(forward)
    }
    if (event.key == "s"){
        game.camera.position = game.camera.position.add(forward.mul(-1))
    }
    
    if (event.key == "a"){
        game.camera.position = game.camera.position.add(right)
    }
    if (event.key == "d"){
        game.camera.position = game.camera.position.add(right.mul(-1))
    }
    if (event.key == "z"){
        game.camera.position = game.camera.position.add(up)
    }
    if (event.key == "x"){
        game.camera.position = game.camera.position.add(up.mul(-1))
    }

    if (event.key == "ArrowUp"){
        game.camera.orientation = game.camera.orientation.add(new vector3(-game.camera.sensibility, 0, 0))
    }
    if (event.key == "ArrowDown"){
        game.camera.orientation = game.camera.orientation.add(new vector3(game.camera.sensibility, 0, 0))
    }
    if (event.key == "ArrowRight"){
        game.camera.orientation = game.camera.orientation.add(new vector3(0, -game.camera.sensibility, 0))
    }
    if (event.key == "ArrowLeft"){
        game.camera.orientation = game.camera.orientation.add(new vector3(0, game.camera.sensibility, 0))
    }
    
    if (event.key == "q"){
        game.camera.orientation = game.camera.orientation.add(new vector3(0, 0, game.camera.sensibility))
    }
    if (event.key == "e"){
        game.camera.orientation = game.camera.orientation.add(new vector3(0, 0, -game.camera.sensibility))
    }
})

game.updateFrame = (dt) => {
    game.objects.forEach((object, i) => {
        let acceleration = new vector3()
        if (object.name != "Saturn"){
            if (object.position.z > -13 && object.position.z < 13 && object.position.x < 0){
                object.color = "rgb(20, 20, 20)"
            }else if((object.position.z > -20 && object.position.z < 20 && object.position.x < 0)){''
                object.color = "rgb(100, 100, 100)"
            }else{
                object.color = "rgb(150, 150, 150)"
            }
            acceleration = acceleration.add(Saturn.position.sub(object.position).unit().mul(3/3))
        }
        object.velocity = object.velocity.add(acceleration.mul(dt))
        object.orientation = object.orientation.add(object.rotationVelocity.mul(dt))
        object.position = object.position.add(object.velocity.mul(dt))
    })
    
}

game.drawFrame = () => {
    screen.drawPixel("X", screen.size.div(2))
    screen.drawText("camera.orientation = "+game.camera.orientation.text(), new vector2(1, 10))
    screen.drawText("camera.orientation.forward() = "+game.camera.orientation.forward().text(), new vector2(1, 11))
}