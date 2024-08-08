import ObjectFielder from "../pages/ObjectFielder";
import RottenFoodChecker from "../pages/RottenFoodChecker";
import SvgColorer from "../pages/SvgColorer";

export const links:any = {
    'svg-colorer': {title:'SVG Colorer', route:<SvgColorer/>},
    '!object-fielder': {title:'Object Fielder', route:<ObjectFielder/>},
    'rotten-food-checker':{title: 'Rotten Food Checker', route:<RottenFoodChecker/>}
}

export const homewords:any = [
    'Stuff I made (in a hurry) because why not?',
    'Dropping new tool every week, unless I run out of ideas.',
    'I wonder what I should make this week?'
]