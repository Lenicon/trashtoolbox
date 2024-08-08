import { useState } from 'react';

export default function ObjectFielder() {
  const [data, setData] = useState<any>({});
  const [fieldNum, setFieldNum] = useState([0]);
  const [fieldTitle, setFieldTitle] = useState('');
  const [fieldNames, setFieldNames] = useState<any>({});
  const [fieldValues, setFieldValues] = useState<any>({});
  // const [fields, setFields] = useState<any>({});



  const handleUpdate = () => {
    let fv: any = Object.values(fieldValues);
    let fn: any = Object.values(fieldNames);
    let newfields: any = {}

    fieldNum.map((_val, id) => {
      let fvid = fv[id]
      if (Number(fv[id])) fvid = Number(fv[id]);
      newfields[fn[id]] = fvid;
    });
    setData({ ...data, [fieldTitle]: newfields });
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='flex flex-col gap-1'>
        <input placeholder='Field Title' id='fieldTitle' className='border-b border-black' aria-label='fieldTitle'
          type='text' value={fieldTitle} onChange={(e) => setFieldTitle(e.target.value)} />

        {
          fieldNum.map((id: number) => (
            <div key={id}>
              <input placeholder='Name' onChange={(e) => setFieldNames({ ...fieldNames, [id]: e.target.value })} id={`fieldName_${id}`} aria-label='fieldName' type='text' className='border border-gray-500' />
              
              <input placeholder='Value' onChange={(e) => setFieldValues({ ...fieldValues, [id]: e.target.value })} id={`fieldValue_${id}`} aria-label='fieldValue' type='text' className='border border-gray-500' />
              
              <button type='button' aria-label='remove field'
                onClick={() => {
                  if (fieldNum.length == 1) return;
                  let a = { ...fieldNames };
                  let b = { ...fieldValues };

                  delete a[id];
                  delete b[id];

                  setFieldNum(c=>c.filter((i)=>i != id))
                  setFieldNames(a);
                  setFieldValues(b);
                }}>
                X
              </button>
            </div>
          ))
        }

        <div className='flex flex-wrap gap-3 items-center text-center justify-center w-full'>
          <button type='button' className='bg-green-400 py-2 width-[33.3333%]' onClick={handleUpdate}>Update</button>
          <button type='button' className='bg-green-400 py-2 width-[33.3333%]' onClick={() => setFieldNum(old => [...old, fieldNum.length])}>Add Field</button>
          <button type='button' className='bg-green-400 py-2 width-[33.3333%]' onClick={() => {
            let a = {...data};
            delete a[fieldTitle]
            setData(a);
          }}>Remove Set</button>
        </div>

        <code className='flex flex-col gap-1'>

          <textarea className='border' value={JSON.stringify(data)}/>

        </code>

      </div>
    </div>
  )
}
