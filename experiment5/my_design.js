/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
    return [
      // {
      //   name: "Lunch atop a Skyscraper", 
      //   assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/lunch-on-a-skyscraper.jpg?v=1714798266994",
      //   credit: "Lunch atop a Skyscraper, Charles Clyde Ebbets, 1932"
      // },
      // {
      //   name: "Train Wreck", 
      //   assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/train-wreck.jpg?v=1714798264965",
      //   credit: "Train Wreck At Monteparnasse, Levy & fils, 1895"
      // },
      // {
      //   name: "Migrant mother", 
      //   assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/migrant-mother.jpg?v=1714778906791",
      //   credit: "Migrant Mother near Nipomo, California, Dorothea Lange, 1936"
      // },
      // {
      //   name: "Disaster Girl", 
      //   assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/girl-with-fire.jpg?v=1714778905663",
      //   credit: "Four-year-old Zoë Roth, 2005"
      // },
      {
        name: "Raytraced Spheres",
        assetUrl: "https://cdn.glitch.global/dab7595b-a0dc-4190-b346-1374e379db66/rt-output-1.jpg?v=1746759644189",
        credit: "Me! (Andy Newton)",
        minSides: 4,
        maxSides: 9,
        minColor: [0,0,0],
        maxColor: [360,100,100],
        minAlpha: 0.1,
        maxAlpha: 0.8,
        numShapes: 225
      },
      {
        name: "Raytraced Spheres (Less Shapes)",
        assetUrl: "https://cdn.glitch.global/dab7595b-a0dc-4190-b346-1374e379db66/rt-output-1.jpg?v=1746759644189",
        credit: "Me! (Andy Newton)",
        minSides: 4,
        maxSides: 9,
        minColor: [0,0,0],
        maxColor: [360,100,100],
        minAlpha: 0.5,
        maxAlpha: 0.5,
        numShapes: 25
      },
      {
        name: "Fireworks",
        assetUrl: "https://cdn.glitch.global/dab7595b-a0dc-4190-b346-1374e379db66/8af20cd4-f39f-449a-9a61-2f98ff853b19.image.png?v=1746760726961",
        credit: "Me! (Andy Newton)",
        minSides: 3,
        maxSides: 5,
        minColor: [0,0,0],
        maxColor: [30,100,100],
        minAlpha: 0.1,
        maxAlpha: 0.8,
        numShapes: 225
      },
      {
        name: "Random Funny Sign in SF",
        assetUrl: "https://cdn.glitch.global/dab7595b-a0dc-4190-b346-1374e379db66/3718bd89-c722-4343-a325-4b72d89c391d.image.png?v=1746761506728",
        credit: "Me! (Andy Newton)",
        minSides: 3,
        maxSides: 5,
        minColor: [0,0,0],
        maxColor: [360,100,100],
        minAlpha: 0.1,
        maxAlpha: 0.8,
        numShapes: 225
      },
      {
        name: "Sunrise in a Plane Window",
        assetUrl: "https://cdn.glitch.global/dab7595b-a0dc-4190-b346-1374e379db66/3382e49f-90f1-4fd8-957d-dea40358b468.image.png?v=1746760628879",
        credit: "Me! (Andy Newton)",
        minSides: 5,
        maxSides: 12,
        minColor: [0,0,0],
        maxColor: [360,100,100],
        minAlpha: 0.1,
        maxAlpha: 0.8,
        numShapes: 225
      },
      {
        name: "Cat on a Step Stool",
        assetUrl: "https://cdn.glitch.global/dab7595b-a0dc-4190-b346-1374e379db66/4af9c31a-279c-450f-b91c-e76bbcf8a183.image.png?v=1746760899800",
        credit: "Me! (Andy Newton)",
        minSides: 4,
        maxSides: 9,
        minColor: [0,0,0],
        maxColor: [360,100,100],
        minAlpha: 0.1,
        maxAlpha: 0.8,
        numShapes: 225
      },
      {
        name: "Sunset on a lake",
        assetUrl: "https://cdn.glitch.global/dab7595b-a0dc-4190-b346-1374e379db66/0ae43f9b-aedc-4d0a-a1a8-3eb04f99478a.image.png?v=1746762921385",
        credit: "Me! (Andy Newton)",
        minSides: 4,
        maxSides: 9,
        minColor: [0,0,0],
        maxColor: [360,100,100],
        minAlpha: 0.1,
        maxAlpha: 0.8,
        numShapes: 225
      },
      {
        name: "Cat at a Table",
        assetUrl: "https://cdn.glitch.global/dab7595b-a0dc-4190-b346-1374e379db66/debcef6b-09a6-4e49-a438-9d064c8bf1d5.image.png?v=1746763006032",
        credit: "Me! (Andy Newton)",
        minSides: 4,
        maxSides: 9,
        minColor: [0,0,0],
        maxColor: [360,100,100],
        minAlpha: 0.1,
        maxAlpha: 0.8,
        numShapes: 225
      },
      {
        name: "Close up Cat",
        assetUrl: "https://cdn.glitch.global/dab7595b-a0dc-4190-b346-1374e379db66/f01ae63b-b4aa-4440-a60a-f58800791dde.image.png?v=1746763848957",
        credit: "Me! (Andy Newton)",
        minSides: 4,
        maxSides: 9,
        minColor: [0,0,0],
        maxColor: [360,100,100],
        minAlpha: 0.1,
        maxAlpha: 0.8,
        numShapes: 225
      },
      {
        name: "Fireplace",
        assetUrl: "https://cdn.glitch.global/dab7595b-a0dc-4190-b346-1374e379db66/593ed55a-c39a-4a1a-83d2-be0b32d6d9ce.image.png?v=1746763985777",
        credit: "Me! (Andy Newton)",
        minSides: 4,
        maxSides: 5,
        minColor: [0,0,0],
        maxColor: [30,100,100],
        minAlpha: 0.1,
        maxAlpha: 0.8,
        numShapes: 225
      }
    ];
  }
  
  function renderRegularPolygon(x, y, sides, width, height, h, s, b, rotation, a) {
    fill(h, s, b, a);
    beginShape()
    for (let i = 0 ; i < sides ; i++) {
      let t = i * (PI * 2.0 / sides) + rotation;
      vertex(Math.cos(t) * width + x, Math.sin(t) * height + y);
    }
    endShape()
  }
  
  function initDesign(inspiration) {
    resizeCanvas(inspiration.image.width / 6, inspiration.image.height / 6);
    
    let design = {
      bg: 128,
      fg: []
    }
    
    for(let i = 0; i < inspiration.numShapes; i++) {
      design.fg.push({x: random(width), y: random(height), sides: Math.floor(random(inspiration.minSides,inspiration.maxSides)),
                      width: random(width / 2),
                      height: random(height / 2),
                      alpha: random(inspiration.minAlpha, inspiration.maxAlpha),
                      rotation: 0,
                      h: random(inspiration.minColor[0], inspiration.maxColor[0]), s: random(inspiration.minColor[1], inspiration.maxColor[1]), b: random(inspiration.minColor[2], inspiration.maxColor[2])});
    }
    
    return design;
  }
  
  function renderDesign(design, inspiration) {
    colorMode(RGB, 255, 255, 255)
    background(design.bg)
    noStroke();
    colorMode(HSB, 360, 100, 100)
    for (let shape of design.fg) {
      renderRegularPolygon(shape.x, shape.y, shape.sides, shape.width, shape.height, shape.h, shape.s, shape.b, shape.rotation, shape.alpha);
    }
  }
  
  function mutateDesign(design, inspiration, rate) {
    design.bg = mut(design.bg, 0, 255, rate);
    for (let shape of design.fg) {
      shape.x = mut(shape.x, 0, width, rate)
      shape.y = mut(shape.y, 0, width, rate)
      shape.sides = Math.round(mut(shape.sides, inspiration.minSides, inspiration.maxSides , rate))
      shape.width = mut(shape.width, 0, width / 4, rate)
      shape.height = mut(shape.height, 0, height / 4, rate)
      shape.h = mut(shape.h, inspiration.minColor[0], inspiration.maxColor[0], rate)
      shape.s = mut(shape.s, inspiration.minColor[1], inspiration.maxColor[1], rate)
      shape.b = mut(shape.b, inspiration.minColor[2], inspiration.maxColor[2], rate)
      shape.rotation = mut(shape.rotation, 0, PI * 2, rate)
      shape.alpha = mut(design.alpha, inspiration.minAlpha, inspiration.maxAlpha, rate);
    }
  }
  
  
  // mut function taken from Wes's example
  function mut(num, min, max, rate) {
      return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
  }
  