import { useState } from 'react'
import { fileToGenerativePart, generateContent, getBase64 } from '../services/aiService';
import '../assets/css/rottenFoodChecker.css';

export default function RottenFoodChecker() {

	const [foodName, setFoodName] = useState('');
	const [foodDesc, setFoodDesc] = useState('');
	const [foodImg, setFoodImg] = useState<any>({});
	const [imgData, setImgData] = useState([]);
	const [loading, setLoading] = useState(false);
	// const [loadTimer, setLoadTimer] = useState(20);
	let loadTimer = 10;
	// const [foodImgName, setFoodImgName] = useState('');

	const [foodRes, setFoodRes] = useState([]);
	const [error, setError] = useState("");

	// FALSE if Description, TRUE if Image
	const [type, setType] = useState(false);


	const handleClear = () => {
		setError('');
		setFoodRes([]);
		setFoodImg({});
		setFoodName('');
		setFoodDesc('');
		setImgData([])
	}

	const handleLoading = () => {
		setTimeout(() => {
			setLoading(false);

			let interval = setInterval(async function(){
				
				loadTimer = loadTimer - 1;
				console.log(loadTimer);

				if (loadTimer < 0) {
					loadTimer=0;
					clearInterval(interval);
				}

			}, 1000)

		}, loadTimer*1000);
	}


	const handleError = (msg: string) => {
		setError(msg);
		handleLoading();
	}

	const handleImageUpload = async (e: any) => {
		const file = e.target?.files?.[0];
		const MB = 1e6;

		if (file) {
			const { size } = file;
			if (size >= 4 * MB) {
				setError("Upload an image below 4MB");
				return;
			} else {
				setError("");
			}
		}

		const image: any = await getBase64(file);
		let p = await fileToGenerativePart(image);

		// console.log(image);
		// console.log(p);

		setFoodImg(p);
		setImgData([image?.data, file?.name]);

	}

	const prompttxt: string = `PLEASE ONLY GIVE A NUMBER PERCENTAGE WITH THIS TEMPLATE "{{number}}" BASED ON HOW ROTTEN OR EXPIRED THE FOOD DESCRIBED VIA THE FOLLOWING DESCRIPTION OR IMAGE. THE HIGHER THE NUMBER THE MORE ROTTEN AND VICE VERSA. IF THE ITEM IS NOT A FOOD SEND "SORRY". IF THE IMAGE DOES NOT MATCH THE ITEM NAME SEND "SORRY":\n\nItem Name: {{itemName}}\n\n{{itemDesc}}`;

	const rotRate: any = [
		{ min: 0, max: 20, cat: 'Fresh', color: 'fresh', desc: "This is still safe to eat. Don't worry about it." },
		{ min: 21, max: 40, cat: 'Bit Spoiled', color: 'lilspoil', desc: 'Not generally not recommended to eat. Might cause digestive upset or food poisoning.' },
		{ min: 41, max: 60, cat: 'Spoiled', color: 'spoiled', desc: "THIS IS NOT THE MIDDLE GROUND. This is definitely spoiled. It's likely to cause food poisoning and other serious health issues" },
		{ min: 61, max: 80, cat: 'Super Spoiled', color: 'heavyspoil', desc: "Oh yeah, this is not good. Past 40 is already bad, this is just worse." },
		{ min: 81, max: 100, cat: 'Rotten', color: 'rotten', desc: "NO. Just Don't." },
	];

	const handleSubmit = async () => {
		setLoading(true);
		setFoodRes([]);
		setError('');

		if (foodName.trim() == '') return handleError('The Food Name field is empty.');
		if (foodName.match(/{{itemName}}/g)) return handleError("Including invalid tags won't do you any good.");

		let content: any;
		if (type) {
			// FOR IMAGE
			if (Object.keys(foodImg).length == 0) return handleError('The Food Image Field is empty.');
			// if (foodImgName.trim()=='') return handleError('The Food Image field is empty.');
			if (imgData.length == 0) return handleError('The Food Image field is empty.');

			content = await generateContent(prompttxt.replace(/{{itemName}}/, foodName).replace(/{{itemDesc}}/, ''), [foodImg]);
			// content = "{{0}}"

		}
		else {
			// FOR DESCRIPTION
			if (foodDesc.trim() == '') return handleError('The Food Description field is empty.');
			if (foodDesc.match(/{{itemName}}/g)) return handleError("Including invalid tags won't do you any good.");

			content = await generateContent(prompttxt.replace(/{{itemName}}/, foodName).replace(/{{itemDesc}}/, 'Food Description: ' + foodDesc));
		}

		// CHECK IF CONTENT GENERATED SUCCESSFULLY
		if (content) {

			// CHECK IF CONTENT INCLUDES THE TAG
			if (content.match(/{{\d+}}/)) {

				let rate: string = content.split(' ').filter((v: string) => v.match(/{{\d+}}/)).join('').replace(/[{}]/g, '');


				// CHECK IF RATE IS NUMBER
				if (!isNaN(Number(rate))) {
					// SET RATING
					let numrate: number = Number(rate);

					if (numrate >= rotRate[0]?.min && numrate <= rotRate[0]?.max) setFoodRes([numrate, 0]);
					else if (numrate >= rotRate[1]?.min && numrate <= rotRate[1]?.max) setFoodRes([numrate, 1]);
					else if (numrate >= rotRate[2]?.min && numrate <= rotRate[2]?.max) setFoodRes([numrate, 2]);
					else if (numrate >= rotRate[3]?.min && numrate <= rotRate[3]?.max) setFoodRes([numrate, 3]);
					else if (numrate >= rotRate[4]?.min && numrate <= rotRate[4]?.max) setFoodRes([numrate, 4]);
					else return handleError('Something wrong happened.')

					return handleLoading();


				} else return handleError("Number not returned.");


			}
			else if (content.match(/SORRY/)) return handleError(`That is not Food Item "${foodName}"`);
			else return handleError('Rotten Rater might be tweaking');

		} else return handleError(`Rotten Ratings Not Generated. Either there were too many requests or something broke. Check the console.`)


	}

	return (
		<div className='flex flex-col gap-5 justify-center items-center w-[100vw] h-[100vh] px-2'>

			<h1 className="text-3xl font-bold pb-5">ROTTEN FOOD CHECKER</h1>

			<div className='flex flex-row gap-10 justify-center'>
				{/* FORM FIELD */}
				<div className='gap-3 flex flex-col text-xl items-center text-center'>
					<input placeholder='Food Name' className='text-center border border-gray-500' aria-label='foodName' type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} />

					<div className='flex flex-row gap-3 pt-3 select-none'>
						<button type='button' aria-label='tab-button' className={`${type ? '' : 'underline'} text-center`} onClick={() => setType(false)}>by Description</button>
						<button type='button' aria-label='tab-button' className={`${type ? 'underline' : ''} text-center`} onClick={() => setType(true)}>by Image</button>
					</div>

					<textarea placeholder='Describe the food, from its taste, its color, its scent, or however you like to describe it.' className={`w-full h-[10rem] text-base p-2 text-center border border-gray-500 ${type ? 'hidden' : ''}`} aria-label='foodDesc' value={foodDesc} onChange={(e) => setFoodDesc(e.target.value)} />

					<div className={`${type ? '' : 'hidden'} w-full select-none`}>
						<label className='text-center cursor-pointer border text-gray-500 pb-2 pt-1 border-gray-500 h-full flex flex-col' htmlFor='foodImg'>
							<span className={Object.keys(foodImg).length != 0 ? 'hidden' : ''}>Upload Image</span>

							{Object.keys(foodImg).length != 0 ?
								<div className='flex flex-col justify-center items-center'>
									<span className='text-base'>{imgData[1]}</span>
									<img src={imgData[0]} width={200} height={200} />
								</div>
								: <></>
							}

						</label>
						<input id='foodImg' className='hidden' aria-label='foodImg' type="file" accept='.png,.jpg,.webp,.heic,.heif' onChange={handleImageUpload} />
					</div>

					<div className='flex flex-wrap w-full gap-2 pt-3 select-none'>
						<button type='button' className='w-[48%] bg-green-400' onClick={handleSubmit} disabled={loading}>{loading ? `Reloading...` : 'Check'}</button>
						<button type='button' className=' w-[48%] bg-red-400' onClick={handleClear}>Clear</button>

					</div>
				</div>

				{/* RESULT FIELD */}
				<div className={`min-w-[50%] max-w-[50%] flex flex-col justify-center items-center px-5 text-wrap text-center ${foodRes.length != 0 && error == '' ? 'text-white bg-black' : 'border-gray-500 border'}`}>

					{/* BLANK PLACEHOLDER */}
					<span className={`text-gray-500 ${foodRes.length < 2 && error == '' ? '' : 'hidden'}`}>Results Here</span>
					{/* SHOW ERROR */}
					<span className={`text-red-500 ${error == '' ? 'hidden' : ''}`}>Error: {error}</span>

					{/* SHOW RESULTS */}
					{foodRes.length != 0 && error == '' ?

						<div className='flex flex-col justify-center items-center w-full'>

							{/* CATEGORY */}
							<span className={`w-full leading-none uppercase text-center font-bold text-lg ${rotRate[foodRes[1]]?.color}`}>{rotRate[foodRes[1]]?.cat}</span>

							{/* METER */}
							<span className='flex-row flex w-full justify-center items-center gap-2'>
								<span className={`${rotRate[foodRes[1]]?.color} font-bold`}>{foodRes[0]}%</span>
								<meter className={`w-full ${rotRate[foodRes[1]]?.color}`} min={0} max={100} value={foodRes[0]} />
							</span>

							{/* DESCRIPTION */}
							<span className='text-sm pt-2'>{rotRate[foodRes[1]]?.desc}</span>


						</div>

						: <></>}

				</div>
			</div>

		</div>
	)
}
