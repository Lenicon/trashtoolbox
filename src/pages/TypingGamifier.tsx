import { useEffect, useState } from 'react'
import { generate } from 'random-words';
import { genRandomNum } from '../services/utils';
import { useSearchParams } from 'react-router-dom';

export default function TypingGamifier() {
  const [words, setWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [maxTimeLeft, setMaxTimeLeft] = useState(20);
  const [mistakes, setMistakes] = useState(20);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);
  

  const [searchParams] = useSearchParams();

  const genRandomWords = () => {
    const res: any = generate({ min: 10, max: 100, seed: genRandomNum().toString() })
    setWords(res);
  }

  async function getData(filename: string) {
    const req = await fetch(`https://api.github.com/gists/${import.meta.env.VITE_GIST_ID}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GIST_TOKEN}`
      }
    });
    const gist = await req.json();
    return gist.files[filename + ".txt"].content;
  }

  useEffect(() => {
    let sp = searchParams.get('id');
    if (sp != null || sp != undefined) {
      if (sp.trim() == '') return;

      try {
        async function g() {
          let data = await getData(sp);
          setWords(data.split(" "));
        }
        g();
      } catch (error) {
        console.error(error);
      }
    } else {
      genRandomWords();
    };


  },[])

  return (
    <div className='lg:w-[920px] md:w-[768px] sm:w-[90%] m-auto'>
      <div className='box-border min-h-screen flex content-center items-center font-mono'>

        <div className='items-center m-1 w-[calc(100%-0.7rem)] p-8 rounded-lg box-border border-[#ced4da] border-[1px] border-solid shadow-md'>

          <div className='words select-none flex flex-wrap'>
            {
              words.map((char, index) => (
                <span key={index} className='char text-xl select-none cursor-text px-1'>
                  {char}
                </span>
              ))
            }
          </div>

          <div className='result flex justify-between items-center mt-4 pt-3 border-t-[2px] border-t-solid border-t-[#6a6a68]'>

            <p>Time Left: <strong>{timeLeft}</strong></p>
            <p>Mistakes: <strong>{mistakes}</strong></p>
            <p>WPM: <strong>{WPM}</strong></p>
            <p>CPM: <strong>{CPM}</strong></p>

          </div>
          <div className='buttons flex justify-center gap-5 items-center mt-4'>
          <button onClick={genRandomWords} aria-label='try-again' className='w-full py-2 hover:bg-green-500 bg-green-400'>Try Again</button>
          <button onClick={genRandomWords} aria-label='try-again' className='w-full py-2 hover:bg-green-500 bg-green-400'>Try Again</button>
          <button onClick={genRandomWords} aria-label='try-again' className='w-full py-2 hover:bg-green-500 bg-green-400'>Try Again</button>
          
          </div>

        </div>

      </div>
    </div>

    
  )
}
