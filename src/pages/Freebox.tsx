import { useEffect, useRef, useState } from 'react'
import { v4 as getID } from 'uuid';

export default function Freebox() {

  const [type, setType] = useState('SUGGESTION');
  const [message, setMessage] = useState('');
  const ID = useRef(getID());
  const [loading, setLoading] = useState(false);

  window.addEventListener("load", function () {
    const form: any = document.getElementById('my-form');
    form.addEventListener("submit", function (e: any) {
      e.preventDefault();
      setLoading(true);
      ID.current = getID();
      const data = new FormData(form);
      const action = e.target.action;
      fetch(action, {
        method: 'POST',
        body: data,
      })
        .then(() => {
          alert("Thanks for reaching out!");
          setLoading(false);
        }).catch((error) => {
          console.error(error);
          setLoading(false);
        })
    });
  });

  return (
    <div className='lg:w-[920px] md:w-[768px] sm:w-[90%] m-auto'>
      <div className='md:mt-16 mt-10 flex flex-col justify-center content-center items-center'>

        <h1 className='font-bold md:text-2xl pb-5 text-xl'>FREEBOX - Suggest, Report, Message</h1>

        <form
          id='my-form'
          method='post'
          action={import.meta.env.VITE_FREEBOX_URL}
          className='sm:w-[70%] w-[90%] flex flex-col gap-1 text-lg'
        >
          <input aria-label='ID' name='ID' value={ID.current} className='hidden' readOnly />
          <select aria-label='TYPE' onChange={(e) => setType(e.target.value)} value={type} name="TYPE" id="TYPE" className='border-gray-400 border'>
            <option value="SUGGESTION">SUGGESTION</option>
            <option value="BUG">BUG REPORT</option>
            <option value="MESSAGE">MESSAGE</option>
          </select>
          <textarea aria-label='MESSAGE' name='MESSAGE' value={message} onChange={(e) => setMessage(e.target.value)} placeholder={type == 'SUGGESTION' ? "Send me ideas and suggestions!! PLEASE I AM IN DIRE NEED OF IDEAS!!" : type == "BUG" ? "Tell me what's wrong with one of the tools." : "Write me a letter, just for fun :)"} className='border-1 border border-gray-400 h-[50vh] p-1 outline-none' />
          <input type='submit' value={loading?"Loading...":"Submit"} disabled={type.trim() == '' || ID.current.trim() == '' || message.trim() == '' || message.length < 10 || loading} className='font-bold disabled:bg-gray-400 py-3 bg-green-400 hover:bg-green-500 hover:cursor-pointer' />

        </form>

      </div>
    </div>
  )
}
