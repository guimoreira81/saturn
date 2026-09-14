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

const walkSpeed = 5
leftButton.pressed = () => {
    const right = game.camera.orientation.right().mul(walkSpeed*dt)
    game.camera.position = game.camera.position.add(forward)
}
rightButton.pressed = () => {
    const right = game.camera.orientation.right().mul(walkSpeed*dt)
    game.camera.position = game.camera.position.sub(forward)
}
upButton.pressed = () => {
    const forward = game.camera.orientation.forward().mul(walkSpeed*dt)
    game.camera.position = game.camera.position.sub(right)
}
downButton.pressed = () => {
    const forward = game.camera.orientation.forward().mul(walkSpeed*dt)
    game.camera.position = game.camera.position.add(right)
}

flyUpButton.pressed = () => {
    const up = game.camera.orientation.up().mul(walkSpeed*dt)
    game.camera.position = game.camera.position.add(up)
}
flyDownButton.pressed = () => {
    const up = game.camera.orientation.up().mul(walkSpeed*dt)
    game.camera.position = game.camera.position.sub(up)
}

let timeScale = 1

game.camera.setCursorVisibility(false)

game.camera.position = new vector3(-1.6, 0.5, 2.6)
game.camera.orientation = new vector3(10, 30, 0)
let Saturn = new Object("Saturn", new vector3(1, 1, 1).div(2), new vector3(0, 0, 0), Models.triangle.sphere)
Saturn.color = "rgb(255, 255, 50)"
Saturn.char = "#"
Saturn.orientation = new vector3(90, 0, 0)
Saturn.rotationVelocity = new vector3(0, 0, 25)

for (let i = 0; i < 200; i++){
    let asteroid = new Object("Asteroid", new vector3(1, 1, 1), new vector3(), Models.dot.dot)
    asteroid.char = "#"
    asteroid.renderMode = "dot"
    asteroid.orientation = new vector3(0, Math.random()*360, 0)
    let l1d = 1
    let l1s = 1
    let l2s = 1
    let distance = l1d+Math.random()*l1s
    if (i > 400){
        distance = l1d+l1s+Math.random()*l2s
    }
    asteroid.position = asteroid.orientation.forward().mul(distance)
    asteroid.color = "rgb(150, 150, 150)"
    asteroid.velocity = asteroid.orientation.forward().rotate(new vector3(0, -90, 0)).mul(10*0.55*0.2)
}

game.updateFrame = (dt) => {
    const forward = game.camera.orientation.forward().mul(walkSpeed*dt)
    const right = game.camera.orientation.right().mul(walkSpeed*dt)
    const up = game.camera.orientation.up().mul(walkSpeed*dt)
    
    if (game.keys["s"] || game.keys["ArrowDown"]){
        game.camera.position = game.camera.position.add(forward)
    }
    if (game.keys["w"] || game.keys["ArrowUp"]){
        game.camera.position = game.camera.position.add(forward.mul(-1))
    }
    
    if (game.keys["d"] || game.keys["ArrowRight"]){
        game.camera.position = game.camera.position.add(right.mul(-1))
    }
    if (game.keys["a"] || game.keys["ArrowLeft"]){
        game.camera.position = game.camera.position.add(right)
    }
    if (game.keys["z"]){
        game.camera.position = game.camera.position.add(up)
    }
    if (game.keys["x"]){
        game.camera.position = game.camera.position.add(up.mul(-1))
    }
    /*if (game.keys[q]){
        game.camera.orientation = game.camera.orientation.add(new vector3(0, 0, game.camera.sensibility))
    }
    if (game.keys[e]){
        game.camera.orientation = game.camera.orientation.add(new vector3(0, 0, -game.camera.sensibility))
    }*/
    game.camera.orientation = game.camera.orientation.add(new vector3(mouseDirection.y, -mouseDirection.x, 0).mul(game.camera.sensibility).mul(dt))
    game.objects.forEach((object, i) => {
        let acceleration = new vector3()
        if (object.name != "Saturn"){
            if (object.position.z > -1 && object.position.z < 1 && object.position.x < 0){
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
    //screen.drawPixel("X", screen.size.div(2))
    /*screen.drawText("camera.orientation = "+game.camera.orientation.text(), new vector2(1, 10))
    screen.drawText("camera.orientation.forward() = "+game.camera.orientation.forward().text(), new vector2(1, 11))
    screen.drawText("camera.position = "+game.camera.position.text(), new vector2(1, 12))*/
}