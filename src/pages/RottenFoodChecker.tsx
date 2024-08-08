import { useState } from 'react'



export default function RottenFoodChecker() {
	
	const prompttxt:string = `Please ONLY GIVE A NUMBER PERCENTAGE of how rotten the food is based on the following description or image. Remember ONLY GIVE THE NUMBER PERCENTAGE. And if I don't give a description or an image based about an actual food and I'm talking about something else, type "UNFOODERROR":`;

	const [foodName, setFoodName] = useState('');
	const [type, setType] = useState(false);
	const [foodDesc, setFoodDesc] = useState('');
	const [foodImg, setFoodImg] = useState();


	return (
		<div className='pt-[10rem] flex flex-col gap-5'>
				<input className='border-b border-black' aria-label='foodName' type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} />

				<div className='flex flex-row gap-3'>
					<button onClick={()=>setType(false)}>By Description</button>
					<button onClick={()=>setType(true)}>By Image</button>
				</div>

				<input className={`border-b border-black ${type?'hidden':''}`} aria-label='foodDesc' type="text" value={foodDesc} onChange={(e) => setFoodDesc(e.target.value)} />
				<input className={`${type?'':'hidden'}`} aria-label='foodImg' type="file" accept='.png,.jpg'/>
		</div>
	)
}
