import ObjectFielder from "../pages/ObjectFielder";
import RottenFoodChecker from "../pages/RottenFoodChecker";
import SvgColorer from "../pages/SvgColorer";
import BirthdayCelebrator from "../pages/BirthdayCelebrator";
import TypingGamifier from "../pages/TypingGamifier";

export const links:any = {
    'svg-colorer': {title:'SVG Colorer', route:<SvgColorer/>, lefticon:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/SVG_Logo.svg/2048px-SVG_Logo.svg.png", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f58c.svg"}
    ,'!object-fielder': {title:'Object Fielder', route:<ObjectFielder/>}
    ,'rotten-food-checker':{title: 'Rotten Food Checker', route:<RottenFoodChecker/>, lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f34f.svg", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1fab1.svg"}
    ,'birthday-celebrator': {title:'Birthday Celebrator', route:<BirthdayCelebrator/>, lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f382.svg", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f389.svg"}
    ,'typing-gamifier': {title:'Typing Gamifier', route:<TypingGamifier/>, lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/2328.svg", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f3ae.svg"}
    ,'?':{title:'More Coming Soon...', lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/2753.svg"}
}

export const homewords:any = [
    'Stuff I made (in a hurry) because why not?'
    ,'Dropping new tool every week, unless I run out of ideas.'
    ,'I wonder what I should make this week?'
    ,'Check out my youtube shorts at youtube.com/@LeniconDev'
]