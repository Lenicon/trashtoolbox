// import React from 'react'

import { useEffect, useRef, useState } from "react";
import { checkUserExist, createUserAsync, getCurrentBDCelebrants, getUpcomingBDCelebrants, getUserDataAllAsync, getUserDataByArray, sendBDGift, updateUserAsync } from "../services/dbService";
import Calendar from "../components/calendar/Calendar";
import secureLocalStorage from "react-secure-storage";
import Countdown from "../components/Countdown";
import { differenceInYears, format, isBefore } from "date-fns";
import '../assets/css/rainbow.css';
import useSound from 'use-sound';
import birthdaySound from '/birthday.mp3';
import { getOrdinal } from "../services/utils";

export default function BirthdayCelebrator() {
  const lsUserInfo: any = useRef(secureLocalStorage.getItem('birthday'));
  // const authToken: any = useRef(localStorage.getItem('authToken'));

  const [play, {stop}] = useSound(birthdaySound);

  const uid = useRef('');
  const bd = useRef('');

  const [curCeleb, setCurCeleb] = useState<any>([]);
  const [upCeleb, setUpCeleb] = useState<any>([]);
  const [upLoading, setUpLoading] = useState(false);
  const [curLoading, setCurLoading] = useState(false);

  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);
  const [username, setUsername] = useState<any>('');

  const [userInfo, setUserInfo] = useState<any>({});

  const [submitLoading, setSubmitLoading] = useState(false);

  const [giftLoading, setGiftLoading] = useState(false);
  


  /***  ON RENDER USER INFO  ***/
  useEffect(() => {
    let bi: any = secureLocalStorage.getItem('userInfo');
    let au = localStorage.getItem('authToken');
    if (bi == null || bi == undefined) {
      console.log('bi is null')
      if (au == null) return;
      async function getData() {
        let docs = await getUserDataAllAsync(au);
        await secureLocalStorage.setItem('userInfo', docs);
        await setUserInfo(docs);
      }
      getData();
    } else {
      if (au == null) secureLocalStorage.removeItem('userInfo');
      else setUserInfo(bi);
    }
  }, []);


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
  }, []);


  /*** IF CURRENTLY YOUR BIRTHDAY ***/
  useEffect(() => {
    let authToken = localStorage.getItem('authToken');
    let bi: any = secureLocalStorage.getItem('userInfo');

    if (!bi?.birthday) return;

    let bday = new Date(bi?.birthday.toString());
    if (format(new Date(), 'MM-dd-yyyy') == format(bday, 'MM-dd-yyyy')) {

      async function updateClear() {
        await updateUserAsync(authToken, { giftsReceived: 0 });
        bi.giftsReceived = 0;
        await secureLocalStorage.setItem('userInfo', bi);
        await setUserInfo(bi);
      }

      if (bi?.cleared == false) {
        updateClear();
      }

      async function setbday() {
        let u = await getUserDataAllAsync(localStorage.getItem('authToken'));

        if (bi == null || bi == undefined) bi = {};

        bi.giftsReceived = u?.giftsReceived + 1;
        if (!bi?.username) bi.username = u?.username;
        bi.cleared = true;

        await secureLocalStorage.setItem('userInfo', bi);
        await setUserInfo(bi);
      }

      if (!bi?.username || !bi?.giftsReceived) setbday();
      else setUserInfo(secureLocalStorage.getItem('userInfo'));

      playBdaySong();

    }
    else {
      if (bi?.cleared == null) bi.cleared = false;
      secureLocalStorage.setItem('userInfo', bi);
      setUserInfo(bi);
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
        let bi: any = secureLocalStorage.getItem('userInfo');

        if (bi == null || bi == undefined) bi = {};
        if (!bi?.username) bi.username = info?.username;
        if (!bi?.birthday) bi.birthday = info?.birthday.toISOString();

        await secureLocalStorage.setItem('userInfo', bi);
        bd.current = info?.birthday.toISOString();
        await localStorage.setItem('authToken', user);
        uid.current = user;
        return window.location.reload();
      }

    } catch (error) {
      console.log(error);
      setSubmitLoading(false);
    }

  }

  useEffect(() => {
    let bi = secureLocalStorage.getItem('userInfo')
    if (bi != null || bi != undefined) setUserInfo(bi);
  }, [])


  /***  LOAD CURRENT CELEBRANTS  ***/
  const handleLoadCurrentCelebrants = async () => {
    setCurLoading(true);

    let bi: any = secureLocalStorage.getItem('userInfo');

    if (bi?.usersGifted?.length != 0 && bi?.usersGifted != undefined && bi?.usersGifted != null) {
      // console.log(bi?.usersGifted);

      let ugData = await getUserDataByArray(bi?.usersGifted);
      // console.log(ugData, '2');

      await ugData.forEach(({ id, birthday }: any) => {
        // Check if birthday already happend before today
        if (isBefore(new Date(format(birthday, 'MMMM dd')), new Date(format(new Date(), 'MMMM dd')))) {
          bi.usersGifted = bi?.usersGifted.filter((val: string) => val != id);
        }
      });

      // console.log(bo?.usersGifted);
      // console.log('bongos binted');
      await secureLocalStorage.setItem('userInfo', bi);
      await updateUserAsync(localStorage.getItem('authToken'), { usersGifted: bi?.usersGifted });

    }

    let celeb = await getCurrentBDCelebrants(localStorage.getItem('authToken'));
    if (!celeb) setCurCeleb([{}])
    else setCurCeleb(celeb);
    console.log(curCeleb);

    setCurLoading(false);

  }


  /***  LOAD UPCOMING CELEBRANTS  ***/
  const handleLoadUpcomingCelebrants = async () => {
    setUpLoading(true);
    let bi: any = secureLocalStorage.getItem('userInfo');

    if (bi?.usersGifted?.length != 0 && bi?.usersGifted != undefined && bi?.usersGifted != null) {
      let ugData = await getUserDataByArray(bi?.usersGifted);
      // console.log(ugData, '2');

      await ugData.forEach(({ id, birthday }: any) => {
        // Check if birthday already happend before today
        if (isBefore(new Date(format(birthday, 'MMMM dd')), new Date(format(new Date(), 'MMMM dd')))) {
          bi.usersGifted = bi?.usersGifted.filter((val: string) => val != id);
        }
      });


      // console.log('bongos binted');
      await secureLocalStorage.setItem('userInfo', bi);
      await updateUserAsync(localStorage.getItem('authToken'), { usersGifted: bi });

    }

    let celeb = await getUpcomingBDCelebrants(localStorage.getItem('authToken'));
    if (!celeb) setUpCeleb([{}])
    else setUpCeleb(celeb);

    setUpLoading(false);

  }



  const handleSendGift = async (gifterToken: string, receiverToken: string) => {
    setGiftLoading(true);
    let giftedArray = await sendBDGift(gifterToken, receiverToken);
    if (!giftedArray) return setGiftLoading(false);

    let bi: any = secureLocalStorage.getItem('userInfo');
    bi.usersGifted = giftedArray;
    await secureLocalStorage.setItem('userInfo', bi);
    await setUserInfo(bi);
    setGiftLoading(false);

  }

  const playBdaySong = () => {
    stop();
    play();
  }

  const getAge = () => {
    return differenceInYears(new Date(format(new Date(), 'MM-dd-yyyy')), new Date(format(userInfo?.birthday, 'MM-dd-yyyy')));
  }

  return (
    <div className="lg:w-[920px] md:w-[768px] sm:w-[90%] m-auto">

      {userInfo?.birthday != null && localStorage.getItem('authToken') != undefined || localStorage.getItem('authToken') != null ?

        <div className="mt-7">

          {/* {format(new Date(), 'MM-dd-yyyy') != format(new Date(secureLocalStorage.getItem('birthday').toString()), 'MM-dd-yyyy') ? <span>Received {userInfo?.gifts||0} 🎁 this year.</span>:<></>} */}

          {/* SHOW COUNTDOWN */}
          {format(new Date(), 'MMMM dd') != format(new Date(userInfo?.birthday ? userInfo?.birthday?.toString() : 'August 8'), 'MMMM dd') ?
            <div className="flex flex-col gap-3 justify-center items-center h-[50vh]">
              <p className="text-center">Hello <strong>{userInfo?.username}</strong>,<br/>You Received <strong>{userInfo?.gifts || 0} Presents</strong> 🎁 this year.</p>
              <Countdown toDate={new Date(userInfo?.birthday ? format(userInfo?.birthday, 'MMMM dd') : 'August 8')} />
              <p className="text-2xl">...left until your Birthday!</p>
            </div>
            :
            <div className="flex flex-col gap-3 justify-center items-center h-[65vh] mb-5">

              <h1 className="text-2xl font-bold">HAPPY <span className="rainbowText">{getAge()}{getOrdinal(getAge()).toUpperCase()}</span> BIRTHDAY, <span className="rainbowText">{userInfo?.username ? userInfo?.username.toUpperCase() : '❔'}</span>!</h1>
              <img className="size-[50%]" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f382.svg" />
              <h2 className="text-lg font-bold">You Received <span className="rainbowText">{userInfo?.gifts ? userInfo?.gifts : 1} Present{userInfo?.gifts > 1 ? 's' : ''} 🎁</span></h2>
              <button onClick={()=>playBdaySong()} className="rainbowBG py-4 md:px-3 md:w-[62%] w-[70vw] font-bold text-base text-center">Play Happy Birthday Song</button>
            </div>
          }
          {/* LOAD CELEBRANTS*/}
          <div className="flex md:flex-row flex-col md:gap-5 gap-2 justify-center -mt-7 md:items-baseline items-center">


            {/* CURRENT CELEBRANTS */}
            {curCeleb.length == 0 ?
              <button onClick={handleLoadCurrentCelebrants}
              className="py-5 bg-green-400 hover:bg-green-300 md:w-[30%] w-[70%] font-bold h-full disabled:bg-gray-300 disabled:hover:cursor-progress"
              disabled={curLoading}>
                Load Current Celebrants
              </button>
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
                        <button onClick={() => handleSendGift(localStorage.getItem('authToken'), id)} aria-label="sendGift"
                        className="bg-lime-500 hover:bg-lime-600 px-2 rounded-r w-[40%] disabled:bg-gray-300 font-semibold disabled:hover:cursor-not-allowed"
                          disabled={giftLoading ? true : userInfo?.usersGifted ? userInfo?.usersGifted.includes(id) : false}>
                          {giftLoading ? 'GIFTING...' : 'GIFT'}
                        </button>

                      </div> : <span key={0} className="text-gray-800 text-center">No {format(new Date(), 'MM-dd-yyyy') != format(new Date(userInfo?.birthday ? userInfo?.birthday?.toString() : '8/8/2006'), 'MM-dd-yyyy') ? 'Current' : 'Other'} Celebrants found in this site...</span>
                    ))
                  }
                </div>
              </div>
            }

            {/* UPCOMING CELEBRANTS */}
            {upCeleb.length == 0 ?
              <button onClick={handleLoadUpcomingCelebrants}
              className="py-5 bg-yellow-400 hover:bg-yellow-300 md:w-[30%] w-[70%] font-bold h-full disabled:bg-gray-300 disabled:hover:cursor-progress"
              disabled={upLoading}>
                Load Upcoming Celebrants
              </button>
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
                        <button onClick={() => handleSendGift(localStorage.getItem('authToken'), id)} aria-label="sendGift"
                        className="bg-lime-500 hover:bg-lime-600 px-2 rounded-r w-[40%] disabled:bg-gray-300 font-semibold disabled:hover:cursor-not-allowed"
                          disabled={giftLoading ? true : userInfo?.usersGifted ? userInfo?.usersGifted.includes(id) : false}>
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

          <input maxLength={30} type="text" className="border border-black text-center text-lg" aria-label="username" placeholder="Your Name" value={lsUserInfo.current?.username ? lsUserInfo.current?.username : username} disabled={lsUserInfo.current?.username != null || lsUserInfo.current?.username != undefined} onChange={(e) => setUsername(e.target.value)} />

          <Calendar className='m-0' value={currentDate} onChange={setCurrentDate} />
          <button type="button" onClick={handleSubmitInfo} className="m-0 bg-green-400 p-4 font-bold disabled:bg-gray-300 disabled:hover:cursor-progress" disabled={(username.trim() == '' || currentDate == null || currentDate == undefined || submitLoading == true)}>{submitLoading ? 'LOADING...' : 'SUBMIT'}</button>
        </form>
        : <></>}

    </div>
  )
}
