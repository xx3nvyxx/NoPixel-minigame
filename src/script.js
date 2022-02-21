"use strict"

// langue française = 'FR'
// lengua española = 'ES'
// lingua italiana = 'IT'
// english language = 'EN'
export const LANGUAGE_OPTION = 'EN'

import { $, delay, playSound } from './helpers.js'
import { doPuzzle } from './puzzle-handler.js'

// runs on site load and handles entire  flow
async function start(){
    var streak = 0;
    // reset from previous
    $('.try-again').classList.add('hidden')
    $('.spy-icon').src = 'assets/spy-icon.png'
    $('.streak-display').innerHTML = streak

    if ($("#sound-input").checked){
        const dialing = playSound('assets/dialing.mp3', 0.1)
    }

    // mock loading screen
    setInformationText('ESTABLISHING CONNECTION')
    await delay(0.8)
    setInformationText('DOING SOME HACKERMANS STUFF...')
    await delay(1)
    setInformationText('ACCESS CODE FLAGGED; REQUIRES HUMAN CAPTCHA INPUT..')
    await delay(0.8)

    // hide text and show squares
    $('#text-container').classList.toggle('hidden')
    $('#number-container').classList.toggle('hidden')
    


    // activate puzzle 4 times, break on fail
    let submitted
    let answer
    let result = true

    while(result) {
        [submitted, answer] = await doPuzzle()
        result = (submitted?.toLowerCase() == answer)
        if(result) {
            streak++;
        }
        console.log(streak);
        $('.streak-display').innerHTML = streak;
    //for (let i = 0; i < 4 && result; i++) {
    }

    // hide squares and show text
    $('.answer-section').classList.add('hidden')
    $('.number-container').classList.add('hidden')
    $('#text-container').classList.remove('hidden')
    
    // display result
    setInformationText((result) ? 'the system has been bypassed.' : "The system didn't accept your answers")
    if(!result) $('.spy-icon').src = 'assets/failed.png'

    // if(result) {
    //     console.log
    //     streak++;
    // }else {
    //     streak = 0;
    // }

    
    $('#answer-reveal').textContent = answer

    $('#submitted-reveal').textContent = (result) ?             'Good job, indeed the' :
                                        ((submitted == null) ?  "The time ran out," : 
                                                                `You wrote "${submitted || ' '}", the`)

    $('.try-again').classList.remove('hidden')
}


function setInformationText(text){
    
    const capitalized = text.toUpperCase()
    const infoText = `<span class="capital">${capitalized.charAt(0)}</span>${capitalized.substring(1)}`
    
    $("#loading-text").innerHTML = infoText
}


// count visitors
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-7E64QM2WXT');

// help menu
const overlay = $('#overlay')
$('#help-on').addEventListener('click', () => overlay.style.display = "block")
$('#overlay').addEventListener('click', () => overlay.style.display = "none")


$('#try-again-button').addEventListener('click', start)

start()
