import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
let score =0;

const app = express();
const port = 3000;
const API_URL = "https://api.jikan.moe/v4/anime";
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

let title_show = "";
let image_src ="";

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/public/welcome.html");
});

app.get("/game",async (req,res)=>{
    const response = await axios.get(API_URL);
    const data = response.data;

    const animes = data.data;
    const index = Math.floor(Math.random()*animes.length)

    title_show = animes[index].title;
    image_src = animes[index].images.jpg.large_image_url;
    console.log(title_show);
    console.log(image_src);

    res.render("index.ejs",{
        anime_title: title_show,
        image:image_src,
        points:score
    });
});

app.post("/check",(req,res)=>{
    const guess = req.body.anime_guess;
    if(guess.toLowerCase() === title_show.toLowerCase()){
        score++;
    }

    res.render("check.ejs",{
        anime_title: title_show,
        image:image_src,
        anime_guess:guess,
        points:score
    });
});

app.get("/quit",(req,res)=>{
    res.render("thanks.ejs",{
        points:score
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

