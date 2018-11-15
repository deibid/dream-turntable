
let mPiano;
let mUIKeyGrid;

let mMasterKeyScale = [];

let cM  = ['c','d','e','f','g','a','b'];
let aHm = ['a','b','c','d','e','f','g#'];
let dHm = ['d','e','f','g','a','bb','c#']
let bM = ['b','c#','d#','e','f#','g#','a#']
// find index of root note
// assign the grid to that eq scale


const SEQUENCER_STEPS = 12;
const SEQUENCER_TRACKS = 4;
let mDrumSequence;
let mDrumSet;
let mDrumSoundMap;



let mCurrentStep = -1;



$(document).ready(function(){

  loadEmptyDrumTrack();
  loadDrumSounds();
  initializeTransport();
  

});


function stepPressed(id){

  let x = id.split("-")[1];
  let y = id.split("-")[2];
  mDrumSequence[x][y] = !mDrumSequence[x][y];

  if(mDrumSequence[x][y]){
    $("#"+id).addClass("step-selected");
  }else{
    $("#"+id).removeClass("step-selected");
  }
  

}




function loadEmptyDrumTrack(){

  mDrumSequence = [];
  for(let i=0; i<SEQUENCER_TRACKS; i++){
    mDrumSequence.push(new Array(SEQUENCER_STEPS));
    for(let j=0; j<SEQUENCER_STEPS; j++){
      mDrumSequence[i][j] = false;
    }
  }
}


function loadDrumSounds(){

  mDrumSet = new Tone.Players({
      "hh" : "/sound/percussion/hh.wav",
      "kick" : "/sound/percussion/kick.wav",
      "tom" : "/sound/percussion/tom.wav",
      "snare" : "/sound/percussion/snare.wav"
  }).toMaster();

  mDrumSoundMap = ['hh','kick','tom','snare'];

}

function initializeTransport(){

  Tone.Transport.scheduleRepeat(onBeat,"8n");

}


function onBeat(time){

  mCurrentStep++;
  if(mCurrentStep >SEQUENCER_STEPS-1)mCurrentStep = 0;
  

  for(let track = 0; track < SEQUENCER_TRACKS; track++){
    if(mDrumSequence[track][mCurrentStep]){
      let sound = mDrumSet.get(mDrumSoundMap[track]);
      sound.start(time);
      
    }
  }



  let activeStep = mCurrentStep;
  let previuosStep = (mCurrentStep === 0) ? 11:mCurrentStep-1;
  $("#sequence-step-numbers-container").children().eq(activeStep).addClass("step-at-playhead");
  $("#sequence-step-numbers-container").children().eq(previuosStep).removeClass("step-at-playhead");
  
}


function sliderInput(value){
  console.log(`Slider ${value}`);
  Tone.Transport.bpm.value = value;
}


function play(){
  Tone.Transport.start();
}

function stop(){

  Tone.Transport.stop(0);

}

