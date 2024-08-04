import { useCallback, useRef, useState } from "react";
import parse from 'html-react-parser';

export default function SvgColorer() {
    const [fillObj, setfillObj] = useState<any>({});
    const [mutableSvg, setMutableSVG] = useState('');
    const [finalSvg, setFinalSVG] = useState<any>();

    function handleChange(e: any) {
        let file = e.target.files[0];

        let fr = new FileReader();

        fr.onload = function () {

            setfillObj(Object.assign({}, fr.result.toString().replace(/fill=/g, '').replace(/"/g, ' ').split(' ').filter((v: any) => v.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/))));
            // setTXTFile(fr.result.toString().split(' '));
            replaceloop(fr.result, fr.result.toString().replace(/fill=/g, '').split(' ').filter((v: any) => v.match(/^"#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"$/)).length);

            console.log(mutableSvg);
            console.log(fillObj);
        }

        fr.readAsText(file);

    }

    const replaceloop = (file: any, amount: number) => {
        let newsvg = file;
        for (let index = 0; index < amount; index++) {
            newsvg = newsvg.toString().replace(/"#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"/, `"{{${index}}}"`);
        }
        setMutableSVG(newsvg)
    }

    const finalLoop = (file: string, obj: any) => {
        let newobj = Object.keys(obj);
        let newsvg = file;
        for (let index = 0; index < newobj.length; index++) {
            newsvg = newsvg.replace(/"{{[0-9]}}"/, `"${obj[index]}"`);
        }
        setFinalSVG(parse(newsvg));
    }

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

            <div className="md:w-[80vw] w-screen">
                <input type='file' id='myFile' name='filename' onChange={(e) => handleChange(e)} />
                <br />

                <div className="pt-5 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2 pb-2">{Object.keys(fillObj).map((value: string, id: number) => (
                        <input className="border border-black" key={id} value={fillObj[value]} onChange={(e) => setfillObj({ ...fillObj, [id]: e.target.value })} />
                    ))}</div>

                    <div className="flex flex-wrap">
                        <button className="p-3 w-[50%] text-center bg-green-400 font-bold" onClick={() => finalLoop(mutableSvg, fillObj)}>Fill</button>
                        <button className="p-3 w-[50%] text-center bg-yellow-400 font-bold" onClick={downloadSVG}>Download</button>
                    </div>

                    <div className="size-[10rem]" ref={svgRef}>
                        {finalSvg}
                    </div>
                </div>




            </div>
        </div>
    )
}
