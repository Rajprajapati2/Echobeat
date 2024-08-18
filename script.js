console.log("let start the javascript")
// In our main function there was current songs 
let currentSong = new Audio(); //i want to play this current songs
let songs;
let currFolder;

//this function is mintune and second of songs
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // Pad minutes and seconds with leading zeros if necessary
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Now how to play a song on our browers so we used fetch api
// when you create a asyns function then only await you can used about that it will show the error 
async function getSongs(folder) {
    currFolder = folder;
    //our getsongs is there it take a name of folder, kis folder kya under search karna hain aapko,or vah wahi load karega

    let a = await fetch(`/${folder}/`)//this links you can take for songs go to google and wrte 127.0.0.1:5500/songs 
    let response = await a.text()


    let div = document.createElement("div")//one div was created 
    div.innerHTML = response; //we can responsing our songs 
    let as = div.getElementsByTagName("a")//which name you can give to the string they return you that suppose you are giving a so in a there was fetch api 
    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3" ))//our song is ends with .m4a or mp3 
        {
            songs.push(element.href.split(`/${folder}/`)[1])//songs. push song ko daldo that why we create a empty array let songs = [] split mean it give you a 2 array ek is play 1 songs kya phele ka dega or ek songs kya baad ka dega tho songs kya baad ka leliya humne [1]
        }
        // this our function which can return our songs in songs dirctly se     
    }

    // play the first songs



    //Show all the songs in the playlist 
    // in output you can see all songs is there 
    // how we can play our first songs go to google and search for play audio in js 

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0] // it will append all the songs in songs list 
    songUL.innerHTML = " "
    for (const song of songs) { //we used the for of loop because we want array
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Raj</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
        //replaceAll the 20% ko space se karo 
    }

    //Attach an event listener to each songs

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        //give me all li which is present in songs list, in output you can see all li are came 
        e.addEventListener("click", element => {//if you click it so you want to play mp3 songs



            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());//which music you want to play info.firstelement music, there was error playmusic is not defined so we make play music function trim is removing all the spaces
        })

    })
    return songs



}

const playMusic = (track, pause = false) => {//now we want to play music how can we do
    // let audio = new Audio("/songs/"+ track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {

        currentSong.play()
        play.src = "img/pause.svg"//when song was play so you save this svg 
        //pause.svg tabhi hoga when you play the songs
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    console.log("display albums");
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0];
            //get the meta data of the folder
            try {
                let a = await fetch(`/songs/${folder}/info.json`);
                
                
                if (!a.ok) {
                    // console.error(`Failed to fetch info.json for folder: ${folder}, status: ${a.status}`);
                    continue;
                }
                
                let response = await a.json();
                console.log(response);
                cardContainer.innerHTML = cardContainer.innerHTML + `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <circle cx="12" cy="12" r="12" fill="#1ed760" />
                                <path d="M15.8906 12.846C15.5371 14.189 13.8667 15.138 10.5257 17.0361C7.296 18.8709 5.6812 19.7884 4.37983 19.4196C3.8418 19.2671 3.35159 18.9776 2.95624 18.5787C2 17.6139 2 15.7426 2 12C2 8.2574 2 6.3861 2.95624 5.42132C3.35159 5.02245 3.8418 4.73288 4.37983 4.58042C5.6812 4.21165 7.296 5.12907 10.5257 6.96393C13.8667 8.86197 15.5371 9.811 15.8906 11.154C16.0365 11.7084 16.0365 12.2916 15.8906 12.846Z"
                                    fill="black" transform="translate(3, 1)" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description} </p>
                    </div>`;
            } catch (err) {
                console.error(`Error fetching/parsing info.json for folder: ${folder}`, err);
            }
        }
    }

    // Load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            
        });
    });
}

    

async function main() {


    // get the list of all the songs 
    await getSongs("songs/ncs")
    playMusic(songs[0], true)

    //Display all the album on the page thorugh the folder
    await displayAlbums();
    


    //Attach an event listener to play, next and pervious
    play.addEventListener("click", () => { //what this arrow function do what it will be play if you want to pause so it will pause it , play hai to pause kar dega or pause hain to play kar dega
        if (currentSong.paused) { //this we do play and pause 
            currentSong.play()
            //we want to change icon also when it will pasuse so pause icon and it will play so play icon
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }

    })

    // Listen for time update event time will update for as song will run
    currentSong.addEventListener("timeupdate", () => {
        // whenver time wil update so give me a report and duration
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)} `

        // now we want to run our seekbar so what we do we change our .circle left
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        //currenttime divide by duration and multiple by 100 + % what we do we editing a css on that much percentage only, you can see in output seekbar is moving 
    })

    //Add a event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        // console.log(e.offsetX, e.offsetY); when you go to output and click the seekbar so you will get different different value of X AND Y
        // we create varible to store the this  (e.offsetX/e.target.getBoundingClientRect().width)* 100 
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100; //this function getBoundingClientRect is suggeset us where we on the page it will show us x-axis,y-axis and width
        document.querySelector(".circle").style.left = percent + "%"; //now we want when the songs is running of our seekbar also stated moving we can chage our current time and duratin 
        currentSong.currentTime = ((currentSong.duration) * percent) / 100 //we want exzed sec s divide by 100
    })

    //Add a event listener for hamebuger
    document.querySelector(".hambuger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //Add a event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // we are creating pervious and next seekbar
    //this is pervious play
    previous.addEventListener("click", () => {
        console.log("previous clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // what is length suppose we have 3 songs and lenght will be 3 suppse index is 2 so next nhi hona chaiye
        if ((index - 1) >= 0) {

            playMusic(songs[index - 1])
        }
    })
    // we are creating next play 
    next.addEventListener("click", () => {
        console.log("Next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // what is length suppose we have 3 songs and lenght will be 3 suppse index is 2 so next nhi hona chaiye
        if ((index + 1) < songs.length) {

            playMusic(songs[index + 1])
        }



    })

    //Add a event to volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(("setting vloue to ", e.target.value), "/100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0){
            document.querySelector(".volume>img").src =  document.querySelector(".volume>img").src.replace( "mute.svg", "volume.svg")
        }

    })


 //    Add the addEventListener to mute the volue buttom 
 document.querySelector(".volume>img").addEventListener("click", e=>{
    console.log(e.target)
    console.log("changing", e.target)
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src =  e.target.src.replace( "mute.svg", "volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
 })









    // we can't do this play the first song it can't mean anything 
    // play the first songs 
    // var audio = new Audio(songs[0]); //it will it automataclly, now there is one thiking it was playing automatally we do that user can't asses till it cn't play 
    // audio.play();


    // audio.addEventListener("loadeddata", () => { //this add event fire only one time, our the audio only upadte one time that we could't want i want it upate bar bar 
    //   let duration = audio.duration;
    //   console.log(duration)
    //   // The duration variable now holds the duration (in seconds) of the audio clip
    // });
}

main()


