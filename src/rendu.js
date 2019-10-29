let intParticles = [],
 extParticles =[],
 allParticles = [],
 startIntX = [],
 startIntY = [],
 startExtX = [],
 startExtY = [],
 canvas = document.querySelector('#myCanvas'),
 ctx = canvas.getContext('2d'),
 CANVAS_WIDTH,
 CANVAS_HEIGHT,
 color = "white",
 currentTime = 0,
 angle,
 alpha = 0,
 center = {},
 radiusInt = {},
 radiusExt = {},
 particle,
 mouse = {x: 0, y: 0},
 flag = false,
 animationCurrentTime = 0,
 animationDuration = 15,
 now = Date.now(),
 lastTime = now,
 deltaTime = 16;


class Particle{
    constructor(size, x, y){
        this.size = size
        this.x = x
        this.y = y
        this.depX = getRandom(-0.1, 0.1) * deltaTime
        this.depY = getRandom(-0.1, 0.1) * deltaTime
    }

    draw(){
        ctx.beginPath()
        ctx.save()

        ctx.translate(this.x, this.y)
        ctx.arc(0, 0, this.size, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()

        ctx.restore()
        ctx.closePath()
    }


    moveTo(x, y){
        this.x = x
        this.y = y
    }

    update() {
        if (this.x >= CANVAS_WIDTH - this.size || this.x <= this.size){
            this.depX *= -1;
        }
        if (this.y >= CANVAS_HEIGHT - this.size || this.y <= this.size){
            this.depY *= -1;
        }

        this.x += this.depX
        this.y += this.depY

        this.draw()
    }
}

function init(){
    CANVAS_WIDTH = window.innerWidth;
    CANVAS_HEIGHT = window.innerHeight;
    canvas.style.width = CANVAS_WIDTH + "px";
    canvas.style.height = CANVAS_HEIGHT + "px";
    ctx.canvas.width = CANVAS_WIDTH;
    ctx.canvas.height = CANVAS_HEIGHT;

    initParticles(40)

}


function easeInOutSine (t, b, c, d){
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b
}

function selectColor(){
    color = `hsl(${currentTime * 10}, 100%, 50%)`
}

function animationEasing(){
    if (flag){
        animationCurrentTime += 0.016
        for(let i = 0; i < intParticles.length; i++){
            angle = i/intParticles.length * Math.PI * 2 + (animationCurrentTime/intParticles.length) * (Math.cos(animationCurrentTime)) * 5
            let finalIntX = center.x + Math.cos(angle) * radiusInt.x
            let finalIntY = center.y + Math.sin(angle) * radiusInt.y
            let easeIntX = easeInOutSine(animationCurrentTime, startIntX[i], finalIntX - startIntX[i], animationDuration)
            let easeIntY = easeInOutSine(animationCurrentTime, startIntY[i], finalIntY - startIntY[i], animationDuration)

            intParticles[i].moveTo(easeIntX,easeIntY)

            for(let j = 0; j < extParticles.length; j++){
                angle = j/extParticles.length * Math.PI * 2 + (animationCurrentTime/extParticles.length) * (Math.sin(animationCurrentTime)) * 3
                let finalExtX = center.x + Math.cos(angle) * radiusExt.x
                let finalExtY = center.y + Math.sin(angle) * radiusExt.y
                let easeExtX = easeInOutSine(animationCurrentTime, startExtX[j], finalExtX - startExtX[j], animationDuration)
                let easeExtY = easeInOutSine(animationCurrentTime, startExtY[j], finalExtY - startExtY[j], animationDuration)

                extParticles[j].moveTo(easeExtX,easeExtY)


                drawLines(intParticles[i], extParticles[i], animationCurrentTime / animationDuration)

                if (animationCurrentTime >= animationDuration) {
                    flag = false
                    animationCurrentTime = 0
                    startIntY[i] = intParticles[i].y
                    startIntX[i] = intParticles[i].x
                    startExtX[j] = extParticles[j].x
                    startExtY[j] = extParticles[j].y
                }
            }
        }
        if (animationCurrentTime >= 4){
            alpha += 0.016
            drawRect()
        }
    }
}



function frame(){
    // ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctx.fillStyle = "rgba(0,0,0,0.05)"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


    currentTime += 0.016
    updateTime()
    selectColor()
    drawParticles()
    animationEasing()

    requestAnimationFrame(frame)
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function updateTime() {
    now = Date.now()
    deltaTime =  now - lastTime
    lastTime = now
}

function drawParticles(){
    for(let i = 0; i < intParticles.length; i++){
        intParticles[i].update()
        startIntX[i] = intParticles[i].x
        startIntY[i] = intParticles[i].y
    }
    for(let j = 0; j < extParticles.length; j++){
        extParticles[j].update()
        startExtX[j] = extParticles[j].x
        startExtY[j] = extParticles[j].y
    }
}

function drawRect(){
    ctx.save()

    ctx.globalAlpha = 0 + alpha
    ctx.strokeStyle = color
    ctx.translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/2)
    ctx.rotate(animationCurrentTime * Math.PI/2 )

    ctx.rect(0, 0, 35, 35)
    ctx.rect(0, 0, -35, -35 )
    ctx.stroke()
    ctx.restore()
}
function drawLines(int, ext, alpha){
    let x1 = int.x
    let x2 = ext.x
    let y1 = int.y
    let y2 = ext.y

    ctx.save()
    ctx.beginPath()
    ctx.globalAlpha = alpha

    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = color
    ctx.stroke()

    ctx.closePath()
    ctx.restore()

}


function initParticles(number){
    center = {x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT/2}
    radiusInt = {x: 150, y: 150}
    radiusExt = {x: 300, y:300}
    let size = 5

    for (let int = 0; int < number; int++){
        angle = int/number * Math.PI * 2
        let intX = center.x
        let intY = center.y
        particle = new Particle(size, intX, intY)

        intParticles.push(particle)
        allParticles.push(particle)

    }

    for (let ext = 0; ext < number; ext++){
        angle = ext/number * Math.PI * 2
        let extX = center.x
        let extY = center.y
        particle = new Particle(size, extX, extY)

        extParticles.push(particle)
        allParticles.push(particle)
    }

}

init()


frame()
window.addEventListener('resize', init)
window.addEventListener('click', (e) => {
    flag = !flag
    animationCurrentTime = 0
})
