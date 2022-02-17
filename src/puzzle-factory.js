import { randomInt, sample } from './helpers.js'

import TRANSLATIONS from './language.js'

const selectedLang = TRANSLATIONS.SELECTED_LANGUAGE

if(!TRANSLATIONS.LANGUAGES.includes(selectedLang)) console.log(`LANGUAGE NOT SUPPORTED\nSELECTED: ${TRANSLATIONS.SELECTED_LANGUAGE}\nAVAILABLE: ${TRANSLATIONS.LANGUAGES}`)
const LANG = TRANSLATIONS[selectedLang]

const SHAPES = ["square", "triangle", "rectangle", "circle"]
const COLORABLE = ['background', 'colortext', 'shapetext', 'number', 'shape']

const COLOR_CODES = ['black', 'white','#1991F9','#8C0C00','#FFE335','#FF9900','#46A04F','#A43AB5']

const LANG_COLORS = LANG.COLORS.reduce((obj, key, i) => {obj[key] = COLOR_CODES[i]; return obj}, {})


// console.log('colors var', COLORS)
// COLORS becomes this:
const COLORS = {
    'black' : 'black',
    'white' : 'white', 
    'blue' : '#2195EE',
    'red' : '#7B0100',
    'yellow' : '#FCEB3D', //done
    'orange' : '#FD9802',
    'green' : '#4CAE4f', //done
    'purple' : '#9926AC', //done
}

// functions that return answers from PuzzleData class
const QUESTIONS = {
    'background color' : (d) => d.colors['background'],
    'color text background color' : (d) => d.colors['colortext'],
    'shape text background color' : (d) => d.colors['shapetext'],
    'number color' : (d) => d.colors['number'],
    'shape color' : (d) => d.colors['shape'],
    'color text' : (d) => d.text[0],
    'shape text' : (d) => d.text[1],
    'shape' : (d) => d.shape
}

class PuzzleData {
    constructor(shape, number, text, colors, type) {
      this.shape = shape
      this.number = number
      this.text = text
      this.colors = colors
      this.type = type
    }
}

var finalNumbers = []

export function emptyFinalNumbers() {
    finalNumbers = []
}

// generates a random puzzle
export function generateRandomPuzzle(puzzleAmount){

    const shape = sample(SHAPES)
    var number = randomInt(puzzleAmount) + 1
    while(finalNumbers.includes(number)){
        number = randomInt(puzzleAmount) + 1
    }
    finalNumbers.push(number)

    const type = randomInt(2)
    var topText = "";
    var bottomText = "";
    if (type==1){
        topText = sample(Object.keys(LANG_COLORS))
        bottomText = sample(SHAPES)
    }
    else{
        topText = sample(SHAPES)
        bottomText = sample(Object.keys(LANG_COLORS))
    }


    const colors = COLORABLE.reduce((obj, color) => {obj[color] = sample(Object.keys(COLORS)); return obj}, {})

    // ensure shape and background don't blend
    while(colors['text'] == colors['background'])
        colors['text'] = sample(Object.keys(COLORS))

    while(['colortext', 'shapetext'].map(i => colors[i]).includes(colors['background']))
        colors['background'] = sample(Object.keys(COLORS))

    while(colors['colortext'] == colors['shapetext']){
        colors['colortext'] = sample(Object.keys(COLORS))
    }

    // ensure nothing blends with shape
    while(['background', 'colortext', 'shapetext', 'number'].map(i => colors[i]).includes(colors['shape']))
    colors['shape'] = sample(Object.keys(COLORS))


    return new PuzzleData(shape, number, [topText, bottomText], colors, type)
        
}


export function generateQuestionAndAnswer(nums, puzzles, answers){
    let p = Array()
    while (p.length < answers){
        let tempP = randomInt(nums.length)
        if (!p.includes(tempP)){
            p.push(tempP)
        }   
    }
    let q = Array()
    while (q.length < answers){
        let tempQ = sample(Object.keys(QUESTIONS))
        if (!q.includes(tempQ)){
            q.push(tempQ)
        }   
    }
    let prompts = Array()
    for (let i = 0; i < answers; i++){
        prompts.push(q[i] + " (" + p[i] + ")")
    }

    const andWord = 'AND'
    const question = prompts.join(" " + andWord + " ")
    
    let a = Array()
    for (let i = 0; i < answers; i++){
        if (puzzles[p[i]].type==0 && q[i]=="color text"){
            q[i] = "shape text"
        } else if (puzzles[p[i]].type==0 && q[i]=="shape text"){
            q[i] = "color text"
        }
        a.push(QUESTIONS[q[i]](puzzles[p[i]]))
    }    

    const answer = a.join(' ')


    return [question, answer]
}


// LANGUAGE TRANSLATION FUNCTIONS 
// Should implement a more robust method for all text, but this is a start

// takes in a puzzleData class and converts language of colors
function convertPuzzleDataLang(puzzle){
    const result = puzzle
    puzzle.colors.background = convertColor(puzzle.colors.background)
    puzzle.colors.number = convertColor(puzzle.colors.number)
    puzzle.colors.shape = convertColor(puzzle.colors.shape)
    puzzle.colors.colortext = convertColor(puzzle.colors.colortext)
    puzzle.colors.shapetext = convertColor(puzzle.colors.shapetext)
    puzzle.text = puzzle.text.map(i => isColor(i) ? convertColor(i) : i)
    return result
}

const isColor = (string) => TRANSLATIONS.EN.COLORS.includes(string)

function convertColor(originalColor){
    const englishColors = TRANSLATIONS.EN.COLORS
    const position = englishColors.indexOf(originalColor)
    return LANG.COLORS[position]
}
