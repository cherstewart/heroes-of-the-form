// click events

$(".hero-selection > ul > li").live("click", function(e) {
	var h = $(e.target).parent().attr("id");
	setHero(h);
});
$("a.play").live("click", function() {
	var heroName = hero.name;
	heroName ? loadBattleground(heroName, showBattleground) : loadBattleground("murky", showBattleground);
});
$("a.hero").live("click", function(e){
	var c = e.target.className.split(" ")[0], 
	    heroName;
	c != "brightwing" ? heroName = hero.name : heroName = "brightwing"; 
	heroName ? playAudio(heroName) : playAudio("murky");
});
$("a.minion").live("click", function(){
	score++;
	$(this).remove();
	updateScore(score);
});

$("a.boss").live("click", function(){
	$this = $(this)
	var thisCounter = $this.data('counter') || 0;
	thisCounter++;
    $this.data('counter', thisCounter);
	if (thisCounter == 10) {
		$this.remove();
		score = score+10;
		updateScore(score);
	}
});

var hero = { name: "murky" };
var score = 0;
var timer = 0;

function setHero(heroName) {
	hero = { name: heroName};
	$(".hero-selection > ul > li.selected").removeClass("selected");
	$(".hero-selection > ul > li#"+hero.name).addClass("selected");
	if (hero.name == "kt") {
		$("#kt").addClass("murky");
		hero.name = "murky";
		alert("Dirty KT Picker!");
		loadBattleground(hero.name, showBattleground);
	}
};

function loadBattleground(heroName, callback) {
	$("#main").removeClass("active");
	$("#loading").addClass("active");
	$("#hero-loading").addClass(heroName);
	$(".hero-name").html(capitalizeName(heroName));
	$(".hero.friendly").addClass(heroName).html(capitalizeName(heroName));
	insertAudioClip(heroName);
	setTimeout(function() { callback && callback(startGame); }, 5000);
}

function capitalizeName(heroName) {
	return heroName.charAt(0).toUpperCase() + heroName.slice(1);
}

function insertAudioClip(heroName) {
	$(".hero-battle").append("<audio id='"+heroName+"-audio'><source src='/audio/"+heroName+".mp3' type='audio/mpeg' /></audio>")
}

function playAudio(heroName) {
	var audio = document.getElementById(heroName+"-audio");
	audio.play();
}
function showBattleground(callback) {
	$("#loading").removeClass("active");
	$("#battleground").addClass("active");
	callback && callback();
}

function updateScore() {
	var s = $(".hero-points");
	s.html(score);
}
function startGame() {
	var minions = setInterval(function() {
		timer++; 
		create("minion"); 
		if (timer == 60) {
			clearInterval(minions);
			var minions = setInterval( function(){
				create("minion"); 
			}, 500);
		}
	}, 1000);	
	var bosses = setInterval( function() {
		create("boss");
		if (timer == 90) {
			clearInterval(bosses);
			var bosses = setInterval( function(){
				create("boss"); 
			}, 5000);
		}
	}, 10000);
	setInterval(function(){
		var $m = $(".minion"),
			$b = $(".boss"),
			enemies = $(".enemy"),
			$battle = $(".hero-battle");
		$m.css({right: '+=15px'});
		$b.css({right: '+=5px'});
		$.each(enemies, function() {
			var $this = $(this);
			if ($this.css("right").replace("px", "") >= 1075 || $this.css("right").replace("px", "") >= 1075) {
				clearInterval(bosses);
				clearInterval(minions);
				showEndScreen();
				$battle.remove();
			}
		});
	},500)
}
function create(type) {
	var $battle = $(".hero-battle");
	$battle.prepend("<a href='javascript:;' class='"+type+" enemy'>"+type+"</a>")
}
function showEndScreen() {
	$("#battleground").removeClass("active");
	$("#end").addClass("active");
	$(".final-points-container span").html(getFinalScore());
	$(".high-score span").html(getHighScore());
}
function getFinalScore() {
	var u = "point";
	if (score != 1) { u = u+"s"; }
	return score+" "+u;
}
function getHighScore() {
	var u = "point";
	highScore = localStorage.getItem('highScore');
	if (highScore) {
		if (score > highScore) {
			highScore = score;
			localStorage.setItem('highScore', score);
		}
	}
	else {
		localStorage.setItem('highScore', score);
		highScore = score;
	}
	if (highScore != 1) { u = u+"s"; }
	highScore = highScore+" "+u;
	return highScore;
}