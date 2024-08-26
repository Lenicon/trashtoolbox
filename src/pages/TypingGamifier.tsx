import { useEffect, useRef, useState } from 'react'
import { generate } from 'random-words';
import { genRandomNum, randomRange } from '../services/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as getID } from 'uuid';

export default function TypingGamifier() {
  const [words, setWords] = useState('loading...');
  const [maxTime, setMaxTime] = useState(50);
  const [maxTimeFocus, setMaxTimeFocus] = useState(false);
  const maxTimeRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [corrected, setCorrected] = useState(0);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);
  const inputRef = useRef(null);
  const charRefs = useRef([]);
  const [tamaMali, setTamaMali] = useState([]);

  const [sharing, setSharing] = useState(false);

  const [entry, setEntry] = useState('');
  const entryRef = useRef(null);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const genRandomWords = () => {
    const res: any = generate({ min: 10, max: 30, seed: genRandomNum().toString() })
    setWords(res.join(" "));
  }


  const getData = async (filename: string) => {
    const req = await fetch(`https://api.github.com/gists/${import.meta.env.VITE_GIST_TYPING_GAMIFIER_ID}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GIST_TOKEN}`
      }
    });
    const gist = await req.json();
    return gist.files[filename + ".txt"].content;
  }

  async function setData(filename:string, data:string) {
    const req = await fetch(`https://api.github.com/gists/${import.meta.env.VITE_GIST_TYPING_GAMIFIER_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GIST_TOKEN}`,
      },
      body: JSON.stringify({
        files: {
          [filename]: {
            content: data,
          },
        },
      }),
    });
  
    return req.json();
  }

  useEffect(() => {
    let sp = searchParams.get('id');
    if (sp != null || sp != undefined) {
      if (sp.trim() == '') return;

      try {
        async function g() {
          let data = await getData(sp);
          setWords(data);
        }
        g();
      } catch (error) {
        console.error(error);
      }
    } else {
      if (words.trim() == 'test') genRandomWords();
    };

  }, []);


  useEffect(() => {
    if(searchParams.get('customoredit') && entryRef.current != null){
      entryRef?.current.focus();
    }

    if (inputRef.current != null){
      inputRef?.current.focus();
      setTamaMali(Array(charRefs.current.length).fill(''));
    }
    
  }, []);

  useEffect(()=>{
    let tl = searchParams.get('timelimit');
    if (tl){
      let tln = parseInt(tl);
      if (isNaN(tln) || !tln) return;

      if (tln > 999) {setMaxTime(999); setTimeLeft(999);}
      else if (tln < 1) {setMaxTime(1); setTimeLeft(1);}
      else {setMaxTime(tln); setTimeLeft(tln);}
    }

  },[])

  const handleKeyDown = (e: any) => {
    if (e.code == 'ArrowLeft' || e.code == 'ArrowUp' || e.code == 'ArrowRight' || e.code == 'ArrowDown' || e.code == 'Home' || e.code == 'End' || e.code == 'PageUp' || e.code == 'PageDown') {
      e.preventDefault();
    }
  }

  const handleChange = (e: any) => {
    const characters = charRefs.current.filter((v)=>v != null);
    const curChar = charRefs.current.filter((v)=>v != null)[charIndex];
    let typedChar = e.target.value.slice(-1);

    if (charIndex < characters.length && timeLeft > 0) {
      if (!isTyping) {
        setIsTyping(true);
      }

      setCharIndex(e.target.value.length);

      if (typedChar == curChar.textContent) {
        tamaMali[charIndex] = "bg-green-400"
      } else if (e.target.value.length < charIndex && typedChar != curChar.textContent) {
        tamaMali[charIndex] = ''
      } else {
        setMistakes(mistakes + 1);
        tamaMali[charIndex] = "text-red-700 bg-pink-300"

      }

      setCorrected(mistakes - tamaMali.filter((v)=>v == "text-red-700 bg-pink-300").length);

      if (charIndex === characters.length - 1) setIsTyping(false);
    }
    else {
      setIsTyping(false);
    }

  };

  const restart = () => {
    setTimeLeft(maxTime);
    charRefs.current = []
    setCharIndex(0);
    setIsTyping(false);
    setMistakes(0);
    setCorrected(0);
    setWPM(0);
    setCPM(0);
    setTamaMali([]);
    if (inputRef.current != null) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }

  const customEntry = () => {
    restart();
    setEntry('');
    navigate('?customoredit=true')
  }

  const editEntry = () => {
    restart();
    setEntry(words);
    navigate('?customoredit=true');
  }

  const randomEntry = () => {
    genRandomWords();
    let rr = randomRange(10, 30);
    setMaxTime(rr);
    setTimeLeft(rr);
    restart();
  }

  const playEntry = async() => {
    if(entry.trim()!=''){
      await setWords(entry);
      await navigate('');
      await restart();
    }
  }
  const clearEntry = () => {
    if(entry.trim()!='') setEntry('');
    entryRef?.current.focus()
  }

  const shareEntry = async () => {
    setSharing(true);
    let id = await getID();
    let res = await setData(id+".txt", words);
    // let res = true;
    if (res) {
      await navigate(`?id=${id}&timelimit=${maxTime}`);
      await navigator.clipboard.writeText(`${window.location}`);
      alert('Copied link to Clipboard:\n'+window.location);
    }
  }

  useEffect(()=>{
    let interval:any;
    if (sharing) {
      interval = setInterval(()=>{
        setSharing(false);
      }, 10000)
    }
    return (()=>clearInterval(interval));
  }, [sharing]);


  useEffect(() => {
    let interval: any;
    if (isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        let correctChars = charIndex - mistakes;
        let totalTime = maxTime - timeLeft;

        let cpm = correctChars * (60 / totalTime);
        cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
        setCPM(parseInt(cpm.toString(), 10));

        let wpm = Math.round((correctChars / 5 / totalTime) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        setWPM(wpm);

      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsTyping(false);
      alert("Time's Up!");
    }
    return () => {
      clearInterval(interval);
    };

  }, [isTyping, timeLeft]);

  return (
    <div className='lg:w-[920px] md:w-[768px] sm:w-[90%] m-auto'>


      <div className='box-border mt-20 flex flex-col justify-center content-center items-center'>
        <h1 className='font-bold pb-5 text-2xl'>Typing Gamifier</h1>


        {searchParams.get('customoredit') ?
          // IF ON CUSTOM ENTRY
          <div className='font-mono items-center m-1 w-[calc(100%-0.7rem)] p-8 rounded-lg box-border border-[#ced4da] border-[1px] border-solid shadow-md mb-10'>

          <div className='words select-none flex flex-col border-2'>
            <textarea className='w-full focus:outline-none text-xl' maxLength={2000} placeholder='Input what you want to typing gamify.' ref={entryRef} onKeyDown={handleKeyDown} onKeyUp={handleKeyDown} onChange={(e)=>setEntry(e.target.value)} value={entry}/>
              
            <span className='text-right text-gray-500'>{entry.length} / 2000</span>
          </div>
          <span className='text-xl flex flex-row w-full border-2 mt-2 hover:cursor-text gap-2' onClick={()=>{maxTimeRef?.current?.focus();}}>
          <p className='w-full text-center'>Time Limit: <span className={maxTimeFocus?`border-b-2 border-b-blue-600`:''}>{maxTime}</span> seconds</p>
          <input maxLength={3} ref={maxTimeRef} className='absolute opacity-0' onFocus={()=>setMaxTimeFocus(true)} onBlur={()=>setMaxTimeFocus(false)} value={maxTime} onChange={(e)=>setMaxTime(e.target.value.trim()!='' ? parseInt(e.target.value):0)}/>
          </span>
          <div className='buttons flex md:flex-row flex-col justify-center md:gap-5 gap-2 items-center mt-4 select-none'>
            <button onClick={clearEntry} aria-label='clear' className='w-full py-3 md:py-5 hover:bg-yellow-500 bg-yellow-400'>Clear</button>
            <button onClick={playEntry} disabled={entry.trim()==''} aria-label='play' className='w-full py-3 md:py-5 hover:bg-green-500 bg-green-400'>Play Entry</button>
          </div>

        </div>
        
        :
        // IF NOT ON CUSTOM ENTRY
        <div className='font-mono items-center m-1 w-[calc(100%-0.7rem)] p-8 rounded-lg box-border border-[#ced4da] border-[1px] border-solid shadow-md mb-10'>

          <div className='words select-none flex flex-wrap'>
            <input type='text' onKeyDown={handleKeyDown} onKeyUp={handleKeyDown} onChange={handleChange} className='input-field absolute opacity-0 -z-50' ref={inputRef}/>
            {
              words.split('').map((char, index) => (
                
                char.trim()==''?
                <span ref={(e)=>charRefs.current[index]=e} key={index}
                className={`${index === charIndex?'border-b-2 border-b-blue-600':''} ${tamaMali[index]} px-1 text-xl select-none`}>
                  {' '}
                </span>:
                <span ref={(e)=>charRefs.current[index]=e} key={index}
                className={`${index === charIndex?'border-b-2 border-solid border-blue-600':''} ${tamaMali[index]} text-xl select-none`}>
                  {char}
                </span>
              ))
            }
          </div>

          <div className='font-mono result flex justify-between items-center mt-4 pt-3 border-t-[2px] border-t-solid border-t-[#6a6a68]'>

            <p>Time Left: <strong>{timeLeft}</strong></p>
            <p>Mistakes: <strong>{mistakes}</strong></p>
            <p>Corrected: <strong>{corrected}</strong></p>
            <p>WPM: <strong>{WPM}</strong></p>
            <p>CPM: <strong>{CPM}</strong></p>

          </div>
          <div className='buttons flex md:flex-row flex-col justify-center md:gap-5 gap-1 items-center mt-4 select-none'>
            <button onClick={customEntry} aria-label='custom-entry' className='w-full py-3 md:py-5 hover:bg-yellow-500 bg-yellow-400'>Custom Entry</button>
            <button onClick={editEntry} aria-label='edit-entry' className='w-full py-3 md:py-5 hover:bg-orange-500 bg-orange-400'>Edit Entry</button>
            <button onClick={randomEntry} aria-label='random-entry' className='w-full py-3 md:py-5 hover:bg-blue-500 bg-blue-400'>Random Entry</button>
            <button onClick={shareEntry} disabled={sharing} aria-label='share' className='w-full py-3 md:py-5 hover:bg-pink-500 bg-pink-400'>{sharing?'On Cooldown':'Share Entry'}</button>
            <button onClick={restart} aria-label='try-again' className='w-full py-3 md:py-5 hover:bg-green-500 bg-green-400'>Try Again</button>

          </div>

        </div>
      
      }

      </div>
    </div>


  )
}
