var oldPlayState = 0;
var countdown = false;
var currentTrack = "";

function $(el) { return document.getElementById(el); }
function trackUpdate(track)
{
	$('title').innerHTML = track.property('title') || "Track Name";
	$('artist').innerHTML = track.property('artist') || "Artist";
	$('album').innerHTML = track.property('album') || "Album";
	
	$('time_total').innerHTML = (track.property('length') !== undefined)? secToString(track.property('length')) : "00:00";	
	
	currentTrack = track;

	updateRatingUI(Player.rating());
}
function artworkUpdate(artURL)
{
	if (artURL == "") {
		$('art').src = '';
	} else {
		$('art').src = artURL;
	}
}
function playerUpdate()
{
	var pState = Player.playState();
	if (pState != oldPlayState)
	{
		if (pState == 0 || pState == 2)
			$('playLink').className = 'play';
		else
			$('playLink').className = 'pause';
		
		oldPlayState = pState;
	}
	
	$('progress').style.width = Math.ceil((Player.playerPosition() / currentTrack.property('length'))*100) + "%";
    

  var time = Player.playerPosition();
  if (countdown) {
    var totalLength = currentTrack.length;
    time = totalLength - time;
  }

  $('time_current').innerHTML = secToString(time) || "00:00";
	
	updateRatingUI(Player.rating());
}
function playPause()
{
	Player.playPause();
	playerUpdate();
}

function setRating(rating)
{
	updateRatingUI(rating);
	Player.setRating(rating);
}

function updateRatingUI(rating)
{
	for(i=1;i<=5;i++)
	{
		if(rating >= (i*20)){
			$('star'+i).innerHTML = '★';
		} else {
			$('star'+i).innerHTML = '☆';
		}
	}
}

// Bowlet Drag and drop handling
mouseDown = false;
mouseX = 0;
mouseY = 0;

mouseStartX = 0;
mouseStartY = 0;
startFrame = [];
document.onmousedown = function(e){
	mouseDown = true;
	
	mouseStartX = e.screenX;
	mouseStartY = e.screenY;
	startFrame = Bowtie.frame();
}
document.onmouseup = function(){
	mouseDown = false;
}
document.onmousemove = function(e){
	mouseX = e.screenX;
	mouseY = e.screenY;
	
	if (mouseDown)
	{
		deltaX = mouseX - mouseStartX;
		deltaY = mouseStartY - mouseY;	// flipped coordinate system
		
		Bowtie.setFrame(startFrame[0]+deltaX,
			startFrame[1]+deltaY,
			startFrame[2],
			startFrame[3]);
	}
}
function secToString(time)
{
	min = (time - (time % 60)) / 60;
	sec = Math.round(time % 60);
	
	if(min < 10) min = "0" + min;
	if(sec < 10) sec = "0" + sec;

  if (countdown) min = "-" + min;

	return min + ":" + sec;
}

function toggleCountdown() {
  countdown = !countdown;
}
