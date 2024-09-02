import { useEffect, useState } from 'react'
import { random } from '../services/utils';
import { generateContent } from '../services/aiService';

export default function RealityChecker() {
  let prompttxt = "ANSWER THE FOLLOWING QUESTION LIKE A BEST FRIEND TELLING A DELUSIONAL FRIEND NO AND BREAK OFF THEIR DELUSIONAL ROMANCE. DO NOT GENDER YOUR RESPONSE. ONLY GIVE AN ANSWER IN ABOUT 100 CHARACTERS OR LESS:\n"
  const placeholders = ["Does she love me?", "Will I ever be with her?", "Will she ever love me?", "Do I still have hope?", "Will she ever love me as much as I love her?", "Do I even deserve her?"];

  const [curPlaceholder, setCurPlaceholder] = useState(placeholders[random(placeholders.length - 1)]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  let cdTimer = 10;

  const [cd, setCD] = useState(false);

  useEffect(() => {
    setCurPlaceholder(placeholders[random(placeholders.length - 1)]);
  }, [answer])

  const handleCD = () => {
    setTimeout(() => {
      setCD(false);

      let interval = setInterval(async function () {

        cdTimer = cdTimer - 1;

        if (cdTimer < 0) {
          cdTimer = 0;
          clearInterval(interval);
        }

      }, 1000)

    }, cdTimer * 1000);
  }

  const handleRealityCheck = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (question.trim() == "" || question.length < 7) return;
    setError(false);
    setLoading(true);

    try {
      let content = await generateContent(prompttxt + question, null, 25);
      await setAnswer(`"${question}"\n\n${content}`);
    } catch (error) {
      setError(true);
      console.error(error);
    }

    setQuestion('');
    setCD(true);
    setLoading(false);
    handleCD();
  }

  return (
    <div className="lg:w-[920px] md:w-[768px] sm:w-[90%] m-auto">
      <div className='md:mt-20 mt-10 flex flex-col justify-center content-center items-center'>

        <h1 className='font-bold pb-5 md:text-2xl text-xl'>Reality Checker</h1>

        <div className='md:w-[50%] w-[95%] flex flex-col gap-1 text-lg'>

          <input className='border-1 border-gray-400 border p-1 text-center' type="text" placeholder={curPlaceholder} maxLength={50} onChange={(e) => setQuestion(e.target.value)} value={question} />

          <button type='button' disabled={loading || cd} onClick={handleRealityCheck} className='disabled:bg-red-600 hover:bg-red-400 bg-red-300 font-bold p-1'>{question.length < 7 || question.trim() == '' ? 'What is it?' : loading ? "Sigh, alright... ✋" : error ? "Not this time..." : cd ? "Lemme cooldown rq..." : "You sure you want an answer?"}</button>

          {answer == undefined || answer == null ? <></> : answer.trim() != '' ? <textarea className='border-1 border border-gray-400 h-[50vh] mb-14 p-1' readOnly placeholder='Solution will be displayed here.' value={answer} /> : <></>}


        </div>

      </div>
    </div>
  )
}
