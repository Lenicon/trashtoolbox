import { firestore as db } from '../config/firebase';
import { v4 as getID } from 'uuid';
import {
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  limit,
  increment,
  arrayUnion,
  Timestamp,
  documentId,
} from 'firebase/firestore';
import { addDays, format } from 'date-fns';


export const objectFilter = (obj: any, predicate: any) =>
  Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res: any, key) => (res[key] = obj[key], res), {});

const genRandomNum = () => {
  return Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
}

export const checkUserExist = async (authToken: string) => {
  try {
    const docRef = doc(db, 'users', authToken);
    let docSnap = await getDoc(docRef);

    if (docSnap.exists() == true) return true;
    else return false;

  } catch (error) {
    return console.error(error);
  }
}

export const createUserAsync = async (creds: any) => {
  try {
    let authToken = getID();
    const docRef = doc(db, 'users', authToken);
    let docSnap = await getDoc(docRef);

    // JUST IN CASE UUID COLLIDES
    if (docSnap.exists() === true) createUserAsync(creds);
    else {
      const cred: any = {
        ...creds,
        random: genRandomNum(),
        dateCreated: serverTimestamp(),
      }

      await setDoc(docRef, cred)
        .catch((err) => {
          console.error("Error: ", err)
          return null;
        })

      await localStorage.setItem('authToken', authToken);
      return authToken;

    }

  } catch (e) {
    console.error(e);
    return null;
  }
}

export const updateUserAsync = async (authToken: string, creds: any) => {
  try {
    const docRef = doc(db, 'users', authToken);
    let docSnap = await getDoc(docRef);

    if (docSnap.exists() == true) {
      await updateDoc(docRef, creds);
    }

  } catch (e) {
    console.error(e);
  }
}

export const getUserDataAllAsync = async (authToken: string) => {
  try {
    const docRef = doc(db, 'users', authToken);
    let docSnap = await getDoc(docRef);

    if (docSnap.exists() == true) {
      let dat = await docSnap.data();

      let datedat = objectFilter(dat, (d: any) => d instanceof Timestamp);
      let newdatedat: any = {};
      if (Object.keys(datedat).length != 0) {
        Object.keys(datedat).map((key: any) => {
          newdatedat[key] = datedat[key].toDate();
        })
      }

      let compiledData = { ...dat, ...newdatedat };
      // console.log(compiledData);

      return compiledData;
    }

  } catch (e) {
    console.error(e);
  }
}

export const getUserDataAsync = async (authToken: string, data: string) => {
  try {
    const docRef = doc(db, 'users', authToken);
    let docSnap = await getDoc(docRef);

    if (docSnap.exists() == true) {
      let dat = await docSnap.data()[data];

      if (dat instanceof Timestamp) dat.toDate();
      // console.log(dat);

      return dat;
    }

  } catch (e) {
    console.error(e);
  }
}

export const getUserDataByArray = async (arrAuthToken: Array<string>) => {
  try {
    const docRef = query(collection(db, 'users'), where(documentId(), 'in', arrAuthToken));
    let docSnap = await getDocs(docRef);

    if (!docSnap.empty) {
      let dat = [...docSnap.docs.map((d) => ({ id: d.id, ...d.data() }))];
      let compiledData:any = []

      dat.map((i) => {
        let datedat = objectFilter(i, (d: any) => d instanceof Timestamp);
        let newdatedat: any = {};
        if (Object.keys(datedat).length != 0) {
          Object.keys(datedat).map((key: any) => {
            newdatedat[key] = datedat[key].toDate();
          })
        }

        compiledData = [...compiledData, { ...i, ...newdatedat }];
      });

      // console.log(compiledData);

      return compiledData;
    }

  } catch (error) {
    console.error(error);
  }
}


export const getEveryoneAsync = async () => {
  try {
    const docRef = collection(db, 'users');
    let docSnap = await getDocs(docRef);

    if (!docSnap.empty) {
      let docs = [...docSnap.docs.map((d) => ({ id: d.id, ...d.data() }))];

      return docs;
    }

  } catch (e) {
    console.error(e);
  }
}



/***  BIRTHDAY WISHER  ***/

export const getCurrentBDCelebrants = async (authToken: string) => {
  try {
    let startTime = new Date(format(new Date(), 'MM/dd/yyyy'));
    let endTime = addDays(new Date(), 1);

    const random = genRandomNum();

    const docRefUpper = query(collection(db, 'users'), where('birthday', ">=", startTime), where("birthday", "<", endTime),
      where('random', '>=', random), limit(3));
    let docRefUnder = query(collection(db, 'users'), where('birthday', ">=", startTime), where("birthday", "<", endTime),
      where('random', '<', random), limit(3));

    let docSnapUpper = await getDocs(docRefUpper);

    if (!docSnapUpper.empty) {
      let docs = [...docSnapUpper.docs.map((d) => ({ id: d.id, ...d.data() }))];

      if (docs.length < 3) {
        let lim: number = 3 - docs.length;
        docRefUnder = query(collection(db, 'users'), where('birthday', ">=", startTime), where("birthday", "<", endTime),
          where('random', '<', random), limit(lim));

        let docSnapUnder = await getDocs(docRefUnder);

        if (!docSnapUnder.empty) {
          docs.push(...docSnapUnder.docs.map((d) => ({ id: d.id, ...d.data() })));
        }

      }

      // console.log(docs);
      let a = docs.filter((d) => (d.id != authToken));
      if (a.length == 0) return [{}];
      return a;

    } else {

      let docSnapUnder = await getDocs(docRefUnder);
      if (!docSnapUnder.empty) {
        let docs = [...docSnapUnder.docs.map((d) => ({ id: d.id, ...d.data() }))];

        // console.log(docs);
        let a = docs.filter((d) => (d.id != authToken));
        if (a.length == 0) return [{}];
        return a;

      }

    }

  } catch (e) {
    console.error(e);
  }
}

export const getUpcomingBDCelebrants = async (authToken: string) => {
  try {
    let startTime = new Date();
    let endTime = addDays(new Date(), 10);
    const random = genRandomNum();

    const docRefUpper = query(collection(db, 'users'), where('birthday', ">", startTime), where("birthday", "<=", endTime),
      where('random', '>=', random), limit(3));
    let docRefUnder = query(collection(db, 'users'), where('birthday', ">", startTime), where("birthday", "<=", endTime),
      where('random', '<', random), limit(3));

    let docSnapUpper = await getDocs(docRefUpper);

    if (!docSnapUpper.empty) {
      let docs = [...docSnapUpper.docs.map((d) => ({ id: d.id, ...d.data() }))];

      if (docs.length < 3) {
        let lim: number = 3 - docs.length
        docRefUnder = query(collection(db, 'users'), where('birthday', ">", startTime), where("birthday", "<=", endTime),
          where('random', '<', random), limit(lim));

        let docSnapUnder = await getDocs(docRefUnder);

        if (!docSnapUnder.empty) {
          docs.push(...docSnapUnder.docs.map((d) => ({ id: d.id, ...d.data() })));
        }

      }

      // console.log(docs);
      let a = docs.filter((d) => (d.id != authToken));
      if (a.length == 0) return [{}];
      return a;

    } else {

      let docSnapUnder = await getDocs(docRefUnder);
      if (!docSnapUnder.empty) {
        let docs = [...docSnapUnder.docs.map((d) => ({ id: d.id, ...d.data() }))];

        // console.log(docs);
        let a = docs.filter((d) => (d.id != authToken));
        if (a.length == 0) return [{}];
        return a;

      }

    }

  } catch (e) {
    console.error(e);
  }
}

export const sendBDGift = async (gifterToken: string, receiverToken: string) => {
  try {
    const receiverRef = doc(db, 'users', receiverToken);
    const gifterRef = doc(db, 'users', gifterToken);
    let receiverSnap = await getDoc(receiverRef);

    if (receiverSnap.exists() == true) {
      let gifterSnap = await getDoc(gifterRef);
      if (gifterSnap.exists() == true) {

        await updateDoc(receiverRef, {
          giftsReceived: increment(1)
        }).catch((e) => {
          console.error(e);
        })

        await updateDoc(gifterRef, {
          usersGifted: arrayUnion(receiverToken)
        }).catch((e) => {
          console.error(e);
        })

        let gifterdoc = await getDoc(gifterRef);
        return await gifterdoc.data()['usersGifted'];

      }
    }

  } catch (error) {
    console.error(error);
  }
}