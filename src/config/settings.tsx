import ObjectFielder from "../pages/ObjectFielder";
import RottenFoodChecker from "../pages/RottenFoodChecker";
import SvgColorer from "../pages/SvgColorer";
import BirthdayCelebrator from "../pages/BirthdayCelebrator";
import TypingGamifier from "../pages/TypingGamifier";

export const links:any = {
    'svg-colorer': {title:'SVG Colorer', route:<SvgColorer/>, icon:"!"}
    ,'!object-fielder': {title:'Object Fielder', route:<ObjectFielder/>, icon:"!"}
    ,'rotten-food-checker':{title: 'Rotten Food Checker', route:<RottenFoodChecker/>, icon:"!"}
    ,'birthday-celebrator': {title:'Birthday Celebrator', route:<BirthdayCelebrator/>, icon:"!"}
    ,'typing-gamifier': {title:'Typing Gamifier', route:<TypingGamifier/>, icon:"!"}
}

export const homewords:any = [
    'Stuff I made (in a hurry) because why not?'
    ,'Dropping new tool every week, unless I run out of ideas.'
    ,'I wonder what I should make this week?'
    ,'Check out my youtube shorts at youtube.com/@LeniconDev'
]