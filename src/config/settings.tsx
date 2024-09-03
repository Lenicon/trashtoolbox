
import RottenFoodChecker from "../pages/RottenFoodChecker";
import SvgColorer from "../pages/SvgColorer";
import BirthdayCelebrator from "../pages/BirthdayCelebrator";
import TypingGamifier from "../pages/TypingGamifier";
import RealityChecker from "../pages/RealityChecker";
import Freebox from "../pages/Freebox";

export const links:any = {
    'svg-colorer': {title:'SVG Colorer', desc:'Change all the colors of an .svg image. If you dont know what that is, look it up.', route:<SvgColorer/>, lefticon:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/SVG_Logo.svg/2048px-SVG_Logo.svg.png", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f58c.svg"}
    ,'rotten-food-checker':{title: 'Rotten Food Checker', desc:"Let something determine how rotten your food is depending on the given description or image!", route:<RottenFoodChecker/>, lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f34f.svg", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1fab1.svg"}
    ,'birthday-celebrator': {title:'Birthday Celebrator', desc:"Celebrate your birthday with Trash Toolbox and other users!", route:<BirthdayCelebrator/>, lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f382.svg", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f389.svg"}
    ,'typing-gamifier': {title:'Typing Gamifier', desc:"Play a typing game, or make your own and share it with others!", route:<TypingGamifier/>, lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/2328.svg", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f3ae.svg"}
    ,'reality-checker': {title:'Reality Checker', desc:"Real talk; no bullsh*t; no delusions.", route:<RealityChecker/>, lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1fac2.svg", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f494.svg"}
    ,'freebox':{title:'Suggest, Report, Message', desc:"GIVE ME MORE IDEAS PLEASE!!", route:<Freebox/>, lefticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/1f5d2.svg", righticon:"https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/2049.svg"}
}

export const homewords:any = [
    'Stuff I made (in a hurry) because why not?'
    ,'Dropping new tool every week, unless I run out of ideas.'
    ,'I wonder what I should make this week?'
    ,'Check out my youtube shorts at youtube.com/@LeniconDev'
    ,'Gimme suggestions plsss 🙏🙏🙏'
]