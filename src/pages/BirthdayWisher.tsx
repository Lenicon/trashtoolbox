// import React from 'react'

import { useEffect, useRef, useState } from "react";
import { checkUserExist, createUserAsync, getCurrentBDCelebrants, getUpcomingBDCelebrants, getUserDataAllAsync, getUserDataAsync, sendBDGift } from "../services/dbService";
import Calendar from "../components/calendar/Calendar";
import secureLocalStorage from "react-secure-storage";
import Countdown from "../components/Countdown";
import { format } from "date-fns";
import '../assets/css/rainbow.css';

export default function BirthdayWisher() {
  const uid = useRef('');
  const bd = useRef('');

  const [curCeleb, setCurCeleb] = useState<any>([]);

  const [upCeleb, setUpCeleb] = useState<any>([]);

  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);
  const [username, setUsername] = useState<any>('');

  const [birthdayInfo, setBirthdayInfo] = useState<any>({});

  const [submitLoading, setSubmitLoading] = useState(false);

  const [giftLoading, setGiftLoading] = useState(false);


  /***  ON RENDER BDAY  ***/
  useEffect(() => {
    let bday = secureLocalStorage.getItem('birthday');

    // Check if bday localstorage not exist
    if (!bday) {
      // Set bday localstorage to the bd ref save.
      if (bd.current.trim() != '') secureLocalStorage.setItem('birthday', bd.current);

    } else {
      // if bd ref not the same as the bday in localstorage
      if (bd.current != bday) {
        // set bday in localstorage as bd ref.
        if (bd.current.trim() != '') secureLocalStorage.setItem('birthday', bd.current);
        else bd.current = bday.toString();
      }
    }
  }, [])

  /***  ON RENDER AUTH TOKEN  ***/
  useEffect(() => {
    let authToken = localStorage.getItem('authToken');

    // Check if authToken exists
    if (authToken != undefined || authToken != null) {
      let res = checkUserExist(authToken.toString());

      // Check if authToken is a user in database.
      if (res) {
        // Check if uid ref contains authToken
        if (authToken == uid.current) return;
        // set uid ref as authtoken if uid ref isnt the authtoken
        uid.current = authToken.toString();

        // check if birthday is NOT in localstorage
        if (secureLocalStorage.getItem('birthday') == null || secureLocalStorage.getItem('birthday') == undefined) {

          async function setbday() {
            let bdaydata = await getUserDataAsync(authToken.toString(), 'birthday');

            await secureLocalStorage.setItem('birthday', new Date(bdaydata.toDate()).toISOString());
            window.location.reload()
          }
          setbday();

        }
      }
      // If not a user in database
      else {
        // if uidref exists, set token as uidref
        if (uid.current.trim() != '') localStorage.setItem('authToken', uid.current);
        // if uidref doesnt exist remove authToken then reload;
        else {
          localStorage.removeItem('authToken');
          window.location.reload();
        }
      };
    }
    // Check if authToken cant be found in localstorage
    else {
      // check if useref userID exists
      if (uid.current.trim() != '') {
        // set authtoken as uid ref
        localStorage.setItem('authToken', uid.current);
      }
    }
  }, [])

  /*** IF CURRENTLY YOUR BIRTHDAY ***/
  useEffect(() => {
    if (secureLocalStorage.getItem('birthday') == null || secureLocalStorage.getItem('birthday') == undefined) return;

    let bday = new Date(secureLocalStorage.getItem('birthday').toString());
    if (format(new Date(), 'MM-dd-yyyy') == format(bday, 'MM-dd-yyyy')) {

      let bi: any = secureLocalStorage.getItem('birthdayInfo');

      async function setbday() {
        let u = await getUserDataAllAsync(localStorage.getItem('authToken'));

        if (bi == null || bi == undefined) bi = {};

        bi.gifts = u?.giftsReceived + 1;
        if (!bi?.username) bi.username = u?.username;

        await secureLocalStorage.setItem('birthdayInfo', bi);
        await setBirthdayInfo(bi);
      }

      if (!bi?.username || !bi?.giftsReceived) setbday();
      else setBirthdayInfo(secureLocalStorage.getItem('birthdayInfo'));

    }

  }, []);

  /***  PLACE BIRTHDAY AND NAME AND BE PART OF THE PROGRAM ***/
  const handleSubmitInfo = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (uid.current.trim() != '') {
      localStorage.setItem('authToken', uid.current);
      window.location.reload();
    }

    if (username.trim() == '' || currentDate == undefined) return alert('Missing username and/or birth date.');

    let info = {
      username: username,
      birthday: currentDate
    }

    setSubmitLoading(true);

    try {

      let user = await createUserAsync({ username: info?.username, birthday: info?.birthday, giftsReceived: 0, usersGifted: [] });

      if (user != null) {
        // await setBDayAsync(user, info?.username, info?.birthday);
        // bd.current = info?.birthday.toISOString();
        await secureLocalStorage.setItem('birthday', info?.birthday.toISOString());
        await secureLocalStorage.setItem('birthdayInfo', { username: info?.username });
        bd.current = info?.birthday.toISOString();

        return window.location.reload();
      }

    } catch (error) {
      console.log(error);
      setSubmitLoading(false);
    }

  }

  useEffect(() => {
    let bi = secureLocalStorage.getItem('birthdayInfo')
    if (bi != null || bi != undefined) setBirthdayInfo(bi);
  }, [])


  /***  LOAD CURRENT CELEBRANTS  ***/
  const handleLoadCurrentCelebrants = async () => {
    let celeb = await getCurrentBDCelebrants(localStorage.getItem('authToken'));
    if (!celeb) setCurCeleb([{}])
    else setCurCeleb(celeb);
    console.log(curCeleb);
  }


  /***  LOAD UPCOMING CELEBRANTS  ***/
  const handleLoadUpcomingCelebrants = async () => {
    let celeb = await getUpcomingBDCelebrants(localStorage.getItem('authToken'));
    if (!celeb) setUpCeleb([{}])
    else setUpCeleb(celeb);
    console.log(upCeleb);
  }



  const handleSendGift = async (gifterToken: string, receiverToken: string) => {
    let giftedArray = await sendBDGift(gifterToken, receiverToken);
    if (!giftedArray) return;

    let bi: any = secureLocalStorage.getItem('birthdayInfo');

    if (bi == null || bi == undefined) bi = {};
    bi.usersGifted = giftedArray;

    await secureLocalStorage.setItem('birthdayInfo', bi);
    await setBirthdayInfo(bi);
    await window.location.reload();

  }

  const test = async () => {
    secureLocalStorage.setItem('badaw', { gayporn: 1 });
    let ab: any = secureLocalStorage.getItem('badaw');
    console.log(secureLocalStorage.getItem('badaw'), '1');
    ab.greg = 3;
    ab.abby = 'hi';
    console.log(ab, '2');
    secureLocalStorage.setItem('badaw', ab);
    console.log(secureLocalStorage.getItem('badaw'), '3');
  }

  return (
    <div className="lg:w-[920px] md:w-[768px] sm:w-[90%] m-auto">

      {secureLocalStorage.getItem('birthday') != null && localStorage.getItem('authToken') != undefined || localStorage.getItem('authToken') != null ?

        <div className="mt-7">

          {/* {format(new Date(), 'MM-dd-yyyy') != format(new Date(secureLocalStorage.getItem('birthday').toString()), 'MM-dd-yyyy') ? <span>Received {birthdayInfo?.gifts||0} 🎁 this year.</span>:<></>} */}

          {/* SHOW COUNTDOWN */}
          {format(new Date(), 'MM-dd-yyyy') != format(new Date(secureLocalStorage.getItem('birthday').toString()), 'MM-dd-yyyy') ?
            <div className="flex flex-col gap-3 justify-center items-center h-[50vh]">
              <p>Received <strong>{birthdayInfo?.gifts || 0} Presents</strong> 🎁 this year.</p>
              <button onClick={test}>test</button>
              <Countdown toDate={new Date(secureLocalStorage.getItem('birthday').toString())} />
              <p className="text-2xl">...left until your Birthday!</p>
            </div>
            :
            <div className="flex flex-col gap-3 justify-center items-center h-[50vh] mb-5">

              <h1 className="text-2xl font-bold">HAPPY BIRTHDAY, <span className="rainbowText">{birthdayInfo?.username ? birthdayInfo?.username.toUpperCase() : '❔'}</span>!</h1>
              <img className="size-[50%]" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f382.svg" />
              <h2 className="text-lg font-bold">You Received <span className="rainbowText">{birthdayInfo?.gifts ? birthdayInfo?.gifts:1} Present{birthdayInfo?.gifts > 1 ? 's' : ''} 🎁</span> this Year!</h2>
            </div>
          }
          {/* LOAD CELEBRANTS*/}
          <div className="flex md:flex-row flex-col md:gap-5 gap-2 justify-center -mt-7 md:items-baseline items-center">


            {/* CURRENT CELEBRANTS */}
            {curCeleb.length == 0 ?
              <button onClick={handleLoadCurrentCelebrants} className="py-5 bg-green-400 hover:bg-green-300 md:w-[30%] w-[70%] font-bold md:mb-0 mb-2 h-full">Load Current Celebrants</button>
              :
              <div className="flex flex-col gap-3 items-center justify-center md:mb-16 mb-5">
                <span className="font-bold text-xl">{format(new Date(), 'LLLL dd')} Birthday Celebrants</span>
                <div className="flex flex-wrap gap-1 items-center justify-center w-full">
                  {
                    curCeleb.map(({ id, username }: any) => (
                      id ? <div key={id} className="w-full flex flex-row">
                        <span className="bg-gray-200 py-2 rounded-l justify-around flex-col flex w-full items-center">
                          <p className="font-bold">{username}</p>
                          <time>TODAY!</time>
                        </span>

                        {/* GIFT BUTTON */}
                        <button onClick={() => handleSendGift(localStorage.getItem('authToken'), id)} aria-label="sendGift" className="bg-lime-500 hover:bg-lime-600 px-2 rounded-r w-[40%] disabled:bg-gray-300 font-semibold disabled:hover:cursor-not-allowed"
                          disabled={giftLoading ? true : birthdayInfo?.usersGifted ? birthdayInfo?.usersGifted.includes(id) : false}>
                          {giftLoading ? 'GIFTING...' : 'GIFT'}
                        </button>

                      </div> : <span key={0} className="text-gray-800 text-center">No {format(new Date(), 'MM-dd-yyyy') != format(new Date(secureLocalStorage.getItem('birthday').toString()), 'MM-dd-yyyy') ? 'Current' : 'Other'} Celebrants found in this site...</span>
                    ))
                  }
                </div>
              </div>
            }

            {/* UPCOMING CELEBRANTS */}
            {upCeleb.length == 0 ?
              <button onClick={handleLoadUpcomingCelebrants} className="py-5 bg-yellow-400 hover:bg-yellow-300 md:w-[30%] w-[70%] font-bold h-full">Load Upcoming Celebrants</button>
              :
              <div className="flex flex-col gap-3 items-center justify-center mb-16">
                <span className="font-bold text-xl">Upcoming Birthday Celebrants</span>
                <div className="flex flex-wrap gap-1 items-center justify-center w-full">
                  {
                    upCeleb.map(({ id, username, birthday }: any) => (
                      id ? <div key={id} className="w-full flex flex-row">
                        <span className="bg-gray-200 py-2 rounded-l justify-around flex-col flex w-full items-center">
                          <p className="font-bold">{username}</p>
                          <time>{new Date(birthday?.seconds * 1000 + birthday?.nanoseconds / 1000).toLocaleDateString()}</time>
                        </span>

                        {/* GIFT BUTTON */}
                        <button onClick={() => handleSendGift(localStorage.getItem('authToken'), id)} aria-label="sendGift" className="bg-lime-500 hover:bg-lime-600 px-2 rounded-r w-[40%] disabled:bg-gray-300 font-semibold disabled:hover:cursor-not-allowed"
                          disabled={giftLoading ? true : birthdayInfo?.usersGifted ? birthdayInfo?.usersGifted.includes(id) : false}>
                          {giftLoading ? 'GIFTING...' : 'GIFT'}
                        </button>

                      </div> : <span key={0} className="text-gray-800 text-center">No Upcoming Celebrants within 10 days after today...</span>
                    ))
                  }
                </div>
              </div>
            }



          </div>

        </div>

        : <></>}



      {!localStorage.getItem('authToken') ?

        <form className="flex flex-col justify-center h-screen gap-2">
          <h1 className="font-bold text-center text-xl">Input your Name and Birth Date</h1>
          <input maxLength={30} type="text" className="border border-black text-center text-lg" aria-label="username" placeholder="Your Name" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Calendar className='m-0' value={currentDate} onChange={setCurrentDate} />
          <button type="button" onClick={handleSubmitInfo} className="m-0 bg-green-400 p-4 font-bold disabled:bg-gray-300 disabled:hover:cursor-not-allowed" disabled={(username.trim() == '' || currentDate == null || currentDate == undefined || submitLoading == true)}>{submitLoading ? 'LOADING...' : 'SUBMIT'}</button>
        </form>
        : <></>}

    </div>
  )
}
