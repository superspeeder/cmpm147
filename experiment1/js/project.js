const fillers = {
  wrong_synonym: ["wrong", "bad", "upside-down", "inside-out"],
  land: ["Land", "Planet", "World", "Star System", "Depths", "Skies"],
  whatland: ["the Dead", "the Living", "the Sun", "Humanity", "Dogs", "Pears", "Trilobites", "Numbers", "Reality", "Unreality", "Air", "Not-Bears", "Western Northeastland"],
  adjective: ["wonderous", "terrible", "incompetent", "tall", "short", "long", "looooong", "trollish", "frank", "great", "grand", "horrible", "questionable", "curious", "tangerine-like", "ancient"],
  target: ["Human", "Dog", "Tree", "Frank", "Computer", "Army", "Pit", "Tardigrade", "King", "Queen", "Monarch Butterfly", "Train", "Brain named Brian"],
  verbed: ["walked", "ran", "lumbered", "stumbled", "flew", "dropped", "delivered itself", "defenestrated", "sailed"],
  whatdid: ["fire hydrant", "slab of concrete", "journey", "train", "city bus", "boat", "space ship", "hypothetical plane made of numbers"],
  whatmet: ["talking cat", "dinosaur", "human", "creature made of space dust", "reanimated quilt", "moose"],
  verbed2: ["jumped", "climbed", "flung themselves", "flew", "phased into reality", "ran", "stepped"],
  hidingplace: ["rock", "cloud of green mist", "wall", "great wall (of China)", "thin sheet of safety glass"],
  weapon: ["knife", "machete", "shotgun", "pineapple", "klein bottle", "charcuterie board"],
  attack: ["stabbed", "shot", "slashed at", "pelted", "hugged", "unraveled the subatomic particles of", "fed"]
};

const template = `Before we get to where it all went $wrong_synonym, let me tell you how we got here.

Once upon a time, in the $land of $whatland, there was once a $adjective $target. They $verbed away on a great $whatdid, and met many a $whatmet. However, this is where it all went $wrong_synonym.

One of the $whatmet wasn't what they appeared to be, and when the our hero least expected it, the $whatmet $verbed2 from behind a $hidingplace with a $weapon, and $attack our hero with it.
`;


// STUDENTS: You don't need to edit code below this line.
const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);
  console.log($("#box"))
}

/* global clicker */
$("#clicker").click(generate);

generate();
