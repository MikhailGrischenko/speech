const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

const words = {
  hi: 'hi',
  bye: 'bye'
}

const wordList = Object.keys(words);

const grammar = `#JSGF V1.0; grammar greetings; public <greetings> = ${wordList.join(' | ')} ;`

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const recognitionTextResultHi = document.querySelector('.recognition-result--hi');
const recognitionTextResultBye = document.querySelector('.recognition-result--bye');

let hi = [];
let bye = [];

function checkResult(speechResult) {
  return {
    bye: speechResult.transcript.toLocaleLowerCase().match(/bye/g),
    hi: speechResult.transcript.toLocaleLowerCase().match(/hi/g),
  }
}

recognition.onresult = function(event) {
  const result = checkResult(event.results[0][0]);
  if (result.hi) hi = hi.concat(result.hi)
  if (result.bye) bye = bye.concat(result.bye)
  recognitionTextResultHi.textContent = hi.join(', ');
  recognitionTextResultBye.textContent = bye.join(', ');
  console.log('Confidence: ' + event.results[0][0].confidence);
};

recognition.onend = function() {
  recognition.start();
};

recognition.start();
