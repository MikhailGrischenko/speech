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

const microphoneIcon = document.querySelector('.microphone__image');
const microphoneWrapper = document.querySelector('.microphone-wrapper');
const audioRecordAnimation = document.querySelector('.audio-record-animation');
const speechRecognitionSection = document.querySelector(
  '.speech-recognition-section'
);
const recognitionTextResult = document.querySelector('.recognition-result');

function checkResult(speechResult) {
  return {
    received: !!speechResult.length,
    correctResult: !!speechResult.length ? Object.values(words).includes(speechResult[0][0].transcript) : false,
    result: speechResult[0][0].transcript,
  }
}

microphoneIcon.onclick = function() {
  recognition.start();
  console.log('Waiting for a voice command');
};

recognition.onaudiostart = function() {
  microphoneWrapper.style.visibility = 'hidden';
  audioRecordAnimation.style.visibility = 'visible';
};

recognition.onresult = function(event) {
  const result = checkResult(event.results);
  if (!result.received) {
    recognitionTextResult.textContent = `К сожалению ничего не услышали. Попробуйте еще раз`;
  } else {
    if (result.correctResult) {
      recognitionTextResult.textContent = `Правильный результат: ${result.result}`;
    } else {
      recognitionTextResult.textContent = `Ожидали "hi" или "bye", а услышали: "${result.result}"`;
    }
  }
  console.log('Confidence: ' + event.results[0][0].confidence);
};

recognition.onspeechend = function() {
  recognition.stop();
  microphoneWrapper.style.visibility = 'visible';
  audioRecordAnimation.style.visibility = 'hidden';
};

recognition.onnomatch = function(event) {
  alert("I didn't recognise that color.");
};

recognition.onerror = function(event) {
  alert(`Error occurred in recognition: ${event.error}`);
};
