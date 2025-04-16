/* exported setup, draw */

let seed = 1152;

function setup() {
    let canvas = createCanvas(500, 400);
    canvas.parent('canvas-container')
    canvas.style('margin-left: auto;margin-right: auto;display:block');
    colors = [color(112,57,26), color(220,182,148)]
}

const startColor = [112,57,26]

const STRATA = 4
const STRATA2 = 40
const SEP = 60
const SEP2 = 15

let center = 250

function draw() {
    background(50, 25, 8)
    noiseSeed(seed)

    noStroke()
    resetMatrix()

    center = cos(millis() / 10000) * 50 + 300

    {
        c = color(100, 48, 16)
        for (let i = 0 ; i < 400 ; i += 10) {
            fill(lerpColor(c, colors[1], (noise(i / 2) / 4) * i / 200))
            quad(center, 0 + i, 500, i + 0 - noise(1000) * 50, 500, 400, center + noise(1500) * 25, 400)
        }
    }

    let pa = 1000
    let pb = 400
    for (let i = STRATA ; i > 1 ; i--) {
        let t = pow(noise(0, i, millis() / 20000), 2) / 2
        fill(lerpColor(colors[0], colors[1], t - 0.1))
        // ellipse(80, 0, i * pow(1 + noise(i, 0, millis() / 100000) / 2,0.5) * SEP, i * pow(1 + noise(i, 50, millis() / 100000) / 2,0.5) * SEP / 2)
        ellipse(center - 170, 0, pa, pb)
        fill(lerpColor(colors[0], colors[1], t))
        ellipse(center - 160, -5, pa, pb)
        pa -= noise(i * 10, 0) * SEP * 4
        pb -= noise(i * 20, 0) * SEP * 2
    }

    {
        let lastx = center - 210
        let lasty = 200
        let pa = 400
        let pb = 100
        for (let i = STRATA2 ; i > 1 ; i--) {
            fill(lerpColor(colors[0], colors[1], noise(0, i / 2, millis() / 20000) / 2))
            // ellipse(lastx, lasty, i * pow(1 + noise(i, 100) / 2,1.5) * SEP2 + 50, i * pow(1 + noise(i, 150) / 2,.5) * SEP2 / 5)
            ellipse(lastx, lasty, pa, pb)
            if (i > STRATA2 / 2) {
                pa -= noise(i * 10, 0) * SEP2
            } else {
                pa += noise(i * 10, 0) * SEP2 / 2
            }
            pb -= noise(i * 20, 0) * SEP2 / 4
            lasty += noise(i, -100) * 15
        }
    }

    {
        fill(colors[1])
        beginShape()
        vertex(0, 400)
        let lastx = 0
        let i = 0
        vertex(lastx, 350 + 50 * noise(i, 200))
        lastx = cos(millis() / 10000) * 25
        do {
            lastx += 40 * noise(i, 450)
            vertex(lastx, (lastx / 500) * 30 + 350 + 20 * noise(i, 200))

            lastx += 150 * noise(i, 250)
            vertex(lastx, (lastx / 500) * 30 +350 + 20 * noise(i + 0.1, 200))


            i++
        } while (lastx < 500)
            
        vertex(500, 400)
        endShape()        
    }
}