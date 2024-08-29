import ObjectFielder from "../pages/ObjectFielder";
import RottenFoodChecker from "../pages/RottenFoodChecker";
import SvgColorer from "../pages/SvgColorer";
import BirthdayCelebrator from "../pages/BirthdayCelebrator";
import TypingGamifier from "../pages/TypingGamifier";

export const links:any = {
    'svg-colorer': {title:'SVG Colorer', desc:'Change all the colors of an .svg image. If you dont know what that is, look it up.', route:<SvgColorer/>, lefticon:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/SVG_Logo.svg/2048px-SVG_Logo.svg.png", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f58c.svg"}
    ,'!object-fielder': {title:'Object Fielder', route:<ObjectFielder/>}
    ,'rotten-food-checker':{title: 'Rotten Food Checker', desc:"Let something determine how rotten your food is depending on the given description or image!", route:<RottenFoodChecker/>, lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f34f.svg", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1fab1.svg"}
    ,'birthday-celebrator': {title:'Birthday Celebrator', desc:"Celebrate your birthday with Trash Toolbox and other users!", route:<BirthdayCelebrator/>, lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f382.svg", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f389.svg"}
    ,'typing-gamifier': {title:'Typing Gamifier', desc:"Play a typing game, or make your own and share it with others!", route:<TypingGamifier/>, lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/2328.svg", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f3ae.svg"}
    ,'?':{title:'More Coming Soon...', desc:"I make 1 tool per week. Be patient. You can even suggest me ideas!", lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/2753.svg"}
}

export const homewords:any = [
    'Stuff I made (in a hurry) because why not?'
    ,'Dropping new tool every week, unless I run out of ideas.'
    ,'I wonder what I should make this week?'
    ,'Check out my youtube shorts at youtube.com/@LeniconDev'
]