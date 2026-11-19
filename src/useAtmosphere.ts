import { useEffect,useRef,useState } from 'react';
interface Atmosphere { context:AudioContext; master:GainNode; bass:OscillatorNode; overtone:OscillatorNode; noise:AudioBufferSourceNode; filter:BiquadFilterNode; }
/** Sound is constructed only in response to an explicit button press. */
export function useAtmosphere(intensity:number){
  const graph=useRef<Atmosphere|null>(null);
  const [enabled,setEnabled]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const mounted=useRef(true);
  function stop(){const current=graph.current;graph.current=null;if(current){current.bass.stop();current.overtone.stop();current.noise.stop();void current.context.close().catch(()=>{});}setEnabled(false);}
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;const current=graph.current;graph.current=null;if(current)void current.context.close().catch(()=>{});};},[]);
  useEffect(()=>{const current=graph.current;if(current){current.master.gain.setTargetAtTime(.014+intensity*.027,current.context.currentTime,.8);current.filter.frequency.setTargetAtTime(280+intensity*450,current.context.currentTime,.9);current.bass.frequency.setTargetAtTime(48-intensity*9,current.context.currentTime,1);}},[intensity]);
  async function toggle(){
    if(busy)return;if(enabled){stop();return;}setBusy(true);setError('');
    try{
      if(!window.AudioContext)throw new Error('Sound is unavailable in this browser.');
      const context=new AudioContext();
      const master=context.createGain();master.gain.value=.014+intensity*.027;master.connect(context.destination);
      const bass=context.createOscillator();bass.type='sine';bass.frequency.value=48-intensity*9;bass.connect(master);
      const overtone=context.createOscillator();overtone.type='sine';overtone.frequency.value=63;const quiet=context.createGain();quiet.gain.value=.2;overtone.connect(quiet);quiet.connect(master);
      const buffer=context.createBuffer(1,context.sampleRate*3,context.sampleRate);const samples=buffer.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*.1;
      const noise=context.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=280+intensity*450;noise.connect(filter);filter.connect(master);
      graph.current={context,master,bass,overtone,noise,filter};bass.start();overtone.start();noise.start();await context.resume();
      if(mounted.current)setEnabled(true);else{graph.current=null;await context.close();}
    }catch(e){const current=graph.current;graph.current=null;if(current)void current.context.close().catch(()=>{});if(mounted.current)setError(e instanceof Error?e.message:'Sound is unavailable.');}
    finally{if(mounted.current)setBusy(false);}
  }
  return {enabled,busy,error,toggle,stop};
}
