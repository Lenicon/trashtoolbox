import { useCallback, useRef, useState } from "react";
import parse from 'html-react-parser';

export default function SvgColorer() {
    const [fillObj, setfillObj] = useState<any>({});
    const [mergeObj, setMergeObj] = useState<any>({});
    const [mergeArray, setMergeArray] = useState<any>([]);


    const [mutableSvg, setMutableSVG] = useState('');
    const [finalSvg, setFinalSVG] = useState<any>();
    const [merge, setMerge] = useState(false);

    // Handle File Upload
    function handleFileUpload(e: any) {
        let file = e.target.files[0];

        let fr = new FileReader();

        fr.onload = function () {

            let result = fr.result.toString().replace(/fill=/g, '');
            let newobj = Object.assign({}, result.replace(/"/g, ' ').split(' ').filter((v: any) => v.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)))

            setfillObj(newobj);
            convertObjectIDToValue(newobj);
            convertResToMutableSVGString(fr.result, result.split(' ').filter((v: any) => v.match(/^"#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"$/)).length);

        }

        fr.readAsText(file);

    }


    // Replace HexColor in SVG String to {{id}} so it's easily changeable
    const convertResToMutableSVGString = (file: any, amount: number) => {
        let newsvg = file;
        for (let index = 0; index < amount; index++) {
            newsvg = newsvg.toString().replace(/"#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"/, `"{{${index}}}"`);
        }
        setMutableSVG(newsvg)
    }

    // Turn the Mutable SVG String to Actual SVG that's readable
    const convertStringToReactSVG = (file: string, obj: any) => {
        let checkLength = Object.keys(obj).length;
        let newsvg = file;
        for (let index = 0; index < checkLength; index++) {
            newsvg = newsvg.replace(/"{{[0-9]}}"/, `"${obj[index]}"`);
        }
        setFinalSVG(parse(newsvg));
    }

    // Convert Object ID to Value and Vice Versa. Ex: {0:'#000', 1:'#000'} => {"#000":[0, 1]}
    const convertObjectIDToValue = (obj: any) => {
        let objkeys = Object.keys(obj);
        let newobj: any = {};
        for (let index = 0; index < objkeys.length; index++) {
            newobj[obj[index]] = [];
        }
        for (let index = 0; index < objkeys.length; index++) {
            newobj[obj[index]].push(objkeys[index]);
        }
        setMergeObj(newobj);
        setMergeArray(Object.values(newobj));
    }

    // Convert Object ID to Value and Vice Versa. Ex: {"#000":[0, 1]} => {0:'#000', 1:'#000'}
    const convertObjectValueToID = (obj: any, id:number, value:string) => {
        // let objkeys = Object.keys(obj);
        let objval:any = Object.values(obj);
        let newobj: any = {};
        for (let j = 0; j < objval[id].length; j++) {
                newobj[objval[id][j]] = value
            }
        
        return newobj;
    }

    // Convert SVG to ObjectURL From Blob and Downloading it
    const downloadBlob = (blob: any, filename: any) => {
        const objectUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
    }
    const svgRef = useRef<any>();
    const downloadSVG = useCallback(() => {
        const svg = svgRef.current.innerHTML;
        const blob = new Blob([svg], { type: "image/svg+xml" });
        downloadBlob(blob, `img_${new Date().toISOString()}.svg`);
    }, []);

    return (
        <div className="w-screen h-[90vh] flex flex-col justify-center items-center">

            <a href="/">Back</a>
            <h1 className="text-3xl font-bold pb-10">SVG COLORER</h1>

            <div className="md:w-[80vw] w-screen flex items-center flex-col">
                <input className="pb-5" type='file' id='myFile' name='filename' accept="svg" onChange={(e) => { handleFileUpload(e); }} />

                <div className="pt-5 flex flex-col gap-3 w-full">

                    {/* UNMERGED */}
                    {!merge ? <div className="flex flex-wrap md:gap-3 gap-5 pb-2 items-center justify-center">{Object.keys(fillObj).map((key: string, id: number) => (
                        <input aria-label="color" className="border-b border-black text-center w-[7rem]" key={id} value={'#' + fillObj[key].replace('#', '')} maxLength={7} onChange={(e) => setfillObj({ ...fillObj, [id]: e.target.value })} />
                    ))}</div> : <></>}

                    {/* MERGED */}
                    {merge ? <div className="flex flex-wrap md:gap-3 gap-5 pb-2 items-center justify-center">{Object.keys(mergeObj).map((_key: string, id: number) => (
                        <input aria-label="color" className="border-b border-black text-center w-[7rem]" key={id} value={'#' + fillObj[mergeArray[id][0]].replace('#', '')} maxLength={7} onChange={(e) => {setfillObj({ ...fillObj, ...convertObjectValueToID(mergeObj, id, (e.target.value.replace('#','').match(/([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/g)?e.target.value:e.target.value.replace('#','')))}); }} />
                    ))}</div> : <></>}

                    {finalSvg ?
                        <div className="flex items-center justify-center" ref={svgRef}>
                            <span className="size-[10rem]">{finalSvg}</span>
                        </div> : <></>
                    }

                    <div className="flex flex-wrap pt-5 items-center justify-center">
                        <div className="md:w-[70%] w-[80%] flex flex-row gap-2">
                            <button className="px-2 py-3 w-[33.3333333%] text-sm text-center bg-green-400 font-bold" onClick={() => convertStringToReactSVG(mutableSvg, fillObj)}>Update</button>
                            <button className="px-2 py-3 w-[33.3333333%] text-sm text-center bg-pink-400 font-bold" onClick={() => setMerge(!merge)}>{merge ? 'Unm' : 'M'}erge Fills</button>
                            <button className="px-2 py-3 w-[33.3333333%] text-sm text-center bg-yellow-400 font-bold" onClick={downloadSVG}>Download</button>
                            
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}
