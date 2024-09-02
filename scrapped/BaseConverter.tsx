// import { useState } from 'react';
// import { superscript } from '../services/utils';

// export default function BaseConverter() {
//   const [num, setNum] = useState('');
//   const [curBase, setCurBase] = useState(0);
//   const [base, setBase] = useState(0);
//   const [solution, setSolution] = useState('');

//   const frombin = (bin: number, isFrac: boolean = false) => {
//     let nums: number[] = [];
//     let binarr = bin.toString().split('');
//     binarr.forEach((value) => {
//       nums.push(parseInt(value));
//     });


//     let numarr: number[] = []
//     if (!isFrac) {
//       nums.forEach((value, index) => {
//         numarr[index] = value * 2 ** ((nums.length - 1) - index);
//       })
//     }
//     else {
//       nums.forEach((value, index) => {
//         numarr[index] = (value * 2) ** (-(index + 1));
//       })
//     }
//     let res: number = 0;
//     numarr.forEach(num => res += num);
//     return res;
//   }

//   const binToDec = async (bin: number) => {
//     let sol = '';
//     let whole: number[] = [];
//     let fraction: number[] = [];
//     let afterRadix = false;

//     let resWhole: number = 0;
//     let resFrac: number = 0;

//     // SPLIT EACH BINARY NUMBER TO BINARY ARRAY
//     let binarr = bin.toString().split('');

//     // SEPARATE BINARY WHOLE PART AND FRACTIONAL PART TO RESPECTIVE ARRAY
//     await binarr.forEach((value) => {
//       if (['1', '0'].includes(value) && afterRadix == false) {
//         whole.push(parseInt(value));
//       }
//       if (value == '.') {
//         afterRadix = true;
//       }
//       if (['1', '0'].includes(value) && afterRadix == true) {
//         fraction.push(parseInt(value));
//       }
//     })

//     let resWholeArray: number[] = [];
//     let resFracArray: number[] = [];

//     // BINARY WHOLE PART
//     if (whole.length != 0 && !whole.every(item => item == 0)) {
//       sol = sol + "Whole Part:\n";
//       await whole.forEach((value, index) => {
//         resWholeArray[index] = value * 2 ** ((whole.length - 1) - index);
//         sol = sol + `${value} × 2${superscript(`${(whole.length - 1) - index}`)} = ${resWholeArray[index]}\n`;
//       });
//       await resWholeArray.forEach(num => resWhole += num);
//       sol = sol + `${resWholeArray.join('+')} = ${resWhole}\n`;
//     }

//     // BINARY FRACTIONAL PART
//     if (fraction.length != 0 && !fraction.every(item => item == 0)) {

//       sol = sol == "" ? "Fractional Part:" : sol + "\nFractional Part:";
//       await fraction.forEach((value, index) => {
//         if (value == 1) resFracArray[index] = (value * 2) ** (-(index + 1));
//         else resFracArray[index] = 0;
//         sol = sol + `\n${value} × 2${superscript(`-${index + 1}`)} = ${resFracArray[index]}`;
//       });
//       await resFracArray.forEach(num => resFrac += num);
//       sol = sol + `\n${resFracArray.join('+')} = ${resFrac}`;
//     }

//     setSolution(`Answer: ${resWhole + resFrac}\n---\nSolution:\n` + sol);
//   }


//   const binToOct = async (bin: number) => {
//     let arr: any[] = bin.toString().match(/(\d+?)(?=(\d{3})+(?!\d)|$)|\./g);
//     console.log(bin);
//     console.log(arr);
//     arr = arr.map(value=>value.includes('.')?'.':parseInt(value));
//     console.log(arr);

//     let res = '';

//     await arr.forEach((value, _index) => {
//       if (value.toString().includes('.')) res = res+'.';
//       else res = res + frombin(value).toString();

//     });
//     console.log(res)


//   }

//   const handleConvert = async (e: any) => {
//     e.preventDefault();
//     if (num.trim() == '') return;
//     setSolution("");
//     // 0-BINARY, 1-OCTAL, 2-DECIMAL, 3-HEXADECIMAL
//     switch (curBase) {
//       case 0:
//         let bin = parseFloat(num.replace(/ /g, ''));
//         if (isNaN(bin)) return;
//         if (!/^[.01]+$/.test(num)) return;
//         await setNum(bin.toString());
//         switch (base) {
//           case 1:
//             binToOct(bin);
//             break;
//           case 2:
//             binToDec(bin);
//             break;
//           case 3:
//             break;
//           default:
//             break;
//         }
//         break;

//       case 1:
//         switch (base) {
//           case 0:
//             break;
//           case 2:
//             break;
//           case 3:
//             break;
//           default:
//             break;
//         }
//         break;

//       case 2:
//         switch (base) {
//           case 0:
//             break;
//           case 1:
//             break;
//           case 3:
//             break;
//           default:
//             break;
//         }
//         break;

//       case 3:
//         switch (base) {
//           case 0:
//             break;
//           case 1:
//             break;
//           case 2:
//             break;
//           default:
//             break;
//         }
//         break;

//       default:
//         break;
//     }
//   }

//   return (
//     <div className="lg:w-[920px] md:w-[768px] sm:w-[90%] m-auto">
//       <div className='md:mt-20 mt-10 flex flex-col justify-center content-center items-center'>

//         <h1 className='font-bold pb-5 md:text-2xl text-xl'>Base Converter</h1>

//         <div className='w-[50%] flex flex-col gap-1 text-lg'>
//           {/* INPUT NUMBERS HERE */}
//           <input className='border-1 border-gray-400 border p-1' type='text' placeholder={`Input ${curBase == 0 ? 'Binary (Base 2)' : ''}${curBase == 1 ? 'Octal (Base 8)' : ''}${curBase == 2 ? 'Decimal (Base 10)' : ''}${curBase == 3 ? 'Hexadecimal (Base 16)' : ''}`} value={num} onChange={(e) => setNum(e.target.value)} />

//           {/* SELECT CONVERSION */}
//           <div className='flex flex-row justify-between items-center'>
//             <select defaultValue={0} className='w-full border-1 border border-gray-400 p-1' onChange={(e) => setCurBase(parseInt(e.target.value))} name="curBase" id="curBase">
//               <option key={0} value='0'>BINARY</option>
//               <option key={1} value='1'>OCTAL</option>
//               <option key={2} value='2'>DECIMAL</option>
//               <option key={3} value='3'>HEXADECIMAL</option>
//             </select>

//             <p className='font-bold mx-3'>TO</p>

//             <select className='w-full border-1 border border-gray-400 p-1' onChange={(e) => setBase(parseInt(e.target.value))} name="base" id="base">

//               {curBase != 0 ? <option value="0">BINARY</option> : <></>}
//               {curBase != 1 ? <option value="1">OCTAL</option> : <></>}
//               {curBase != 2 ? <option value="2">DECIMAL</option> : <></>}
//               {curBase != 3 ? <option value="3">HEXADECIMAL</option> : <></>}

//             </select>
//           </div>

//           {/* CONVERSION BUTTON */}
//           <button type='button' className='hover:bg-blue-400 bg-blue-300 font-bold p-1' onClick={handleConvert}>CONVERT</button>

//           <textarea value={solution} className='border-1 border border-gray-400 h-[50vh] mb-14 p-1' readOnly placeholder='Solution will be displayed here.' />

//         </div>
//       </div>
//     </div>
//   )
// }
