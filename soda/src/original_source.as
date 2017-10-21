import flash.events.KeyboardEvent;
import net.andremattos.color.Pallete;
import flash.geom.ColorTransform;

var sound:Sound;
var nParticles:Number = 1400;
var PEAK_THRESHOLD:Number = 0.85;
var count:uint = 0;
var vyAmount:Number = 8;
var particlesContainer:Sprite;
var arrParticles:Array = new Array ();
var attractForce:Number;
var sndChannel:SoundChannel;
var oldSongPosition:Number = 0;
var peak:Number = 0;
var palletes:Array = [
	new Pallete (0xFFFFFF),
	new Pallete (0x59ffe2, 0x59bbff, 0xff405b, 0xddf365, 0xFFFFFF),
	new Pallete (0xC1272D, 0xED1C24, 0xF15A24, 0xF7931E, 0xFBB03B, 0xFCEE21),
	new Pallete (0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00),
	new Pallete (0x490A3D, 0xBD1550, 0xE97F02, 0xF8CA00, 0x8A9B0F)
]

var pallete:Pallete;
var ct:ColorTransform = new ColorTransform();

var types:Array = ["ball", "cross", "triangle", "line","line","line","line","line", "txt"];
var type:String;
var lineRotation:Number;
var intervalTimeout:uint;
var paused:Boolean = false;

init ();


function pause (...e)
{
	removeEventListener (Event.ENTER_FRAME, renderFrame);
	if (sndChannel)
	{
		oldSongPosition = sndChannel.position;
		sndChannel.stop();
	}
	
	paused = true;
}

function unpause (...e)
{
	addEventListener (Event.ENTER_FRAME, renderFrame);
	sndChannel = sound.play(oldSongPosition, 9999)
	
	paused = false;

}
 
function init ()
{
	stage.align= "topLeft"
	stage.scaleMode = "noScale"
	sound = new Sound ();
	sound.load(new URLRequest ("music/nightmare_on_wax_70s80s.mp3"))
	
	unpause ()
	
	addEventListener (Event.ENTER_FRAME, renderFrame);
	
	particlesContainer = new Sprite ();
	addChild (particlesContainer);
	
	getNextForm();
	
	stage.addEventListener (KeyboardEvent.KEY_DOWN, onKey);
	
	
}

function getNextForm ()
{
	pallete = palletes[Math.floor (Math.random()*palletes.length)];
	
	type = types[Math.floor (Math.random()*types.length)];
	
	var cousin45deg:Number = Math.floor(Math.random()*8)*45;
	lineRotation = Math.random() * 2 < 1 ? -1 : cousin45deg;
	
	for (var i:uint=0; i < arrParticles.length;i++)
	{
		var particle:Object = arrParticles[i];
		ct.color = pallete.getRandomColor();
		particle.shape.cacheAsBitmap=false;
		treatShape (particle.shape, type);
		particle.shape.transform.colorTransform = ct;
		particle.shape.cacheAsBitmap=true;
	}
	
	
	clearTimeout (intervalTimeout);
	intervalTimeout = setTimeout (getNextForm, 10000);
}

function treatShape (shape:Particle, type:String)
{
	shape.rotation=0;
	shape.ball.visible = shape.cross.visible = shape.triangle.visible = shape.line.visible = shape.txt.visible = false;
	shape[type].visible = true;
	switch (type)
	{
		case "txt":
			shape.txt.txt.text = Math.floor(Math.random()*10).toString();
		break;
		case "triangle":
			shape.rotation = Math.random() * 360;
		break;
		case "cross":
			shape.cross.bar1.scaleX = shape.cross.bar2.scaleX = Math.random()*1+0.1;
		break;
		case "line":
			shape.rotation = lineRotation == -1 ? Math.random()*360 : lineRotation;
		break;
	}
}

function onKey (e:KeyboardEvent)
{
	if (e.keyCode == Keyboard.SPACE)
	{
		if (!paused) pause();
		else unpause();
		
	}
	else
	{
		// foward
		pause ();
		oldSongPosition += 5000;
		unpause();
	}
}

function renderFrame (evt:Event)
{
	// building and moving particles
	createParticle (15);
	moveParticles ()

	peak = sndChannel.leftPeak;
	if (peak > PEAK_THRESHOLD)
	{
		attractForce = 0.5 * sndChannel.leftPeak * 0.1;
		attractForce = Math.random() < 0.5 ? -attractForce : attractForce;
		attractParticles (Math.random() * stage.stageWidth, Math.random() * stage.stageHeight)
	}
	
	//if (peak > 0.97) getNextForm ();
	
}

 
function moveParticles ()
{
	
	for (var a:uint = 0; a < arrParticles.length; a++)
	{
		var particle:Object = arrParticles[a];
 
		particle.vx += Math.cos (particle.angleVX) * particle.radiusVX;
		particle.vy += (particle.vyDest - particle.vy) * 0.1;
		particle.vx *= 0.4;
 
		particle.shape.x += particle.vx;
		particle.shape.y += particle.vy;
 
		particle.angleVX += particle.speedAngle;
 
		if (particle.shape.y < -10)
		{
			restartParticle (particle)
		}
	}
}
function createParticle (amount:uint = 1)
{
	if (count >= nParticles) return;
 
	for (var a:uint = 0; a < amount; a++)
	{
		var particleRadius:Number = Math.random() * 10 < 1 ? Math.random() * 25 + 15 : Math.random() * 8 + 3
		var particle:Object = new Object ()
		
		particle.radius = particleRadius * 3;
		particle.shape = new Particle ();
		particle.shape.width = particle.radius;
		particle.shape.scaleY = particle.shape.scaleX;
		treatShape (particle.shape, type);
 
 		particlesContainer.addChild(particle.shape);
 
		arrParticles.push (particle);
		restartParticle (particle);
 
	 	particle.shape.cacheAsBitmap = true;
 
		count++;
	}
}
 
function restartParticle (particle:Object)
{
	var xCenter:Number = stage.stageWidth / 2 + (Math.random () * 20 - 10);
	var outCenter:Boolean = Math.random() * 10 < 2;
 
	
	particle.shape.x = Math.random() * stage.stageWidth
	particle.shape.y = stage.stageHeight + 50;
	
	particle.vx = 0;
	particle.vy = 0;
	particle.vyDest = Math.random () * vyAmount / 2 - vyAmount;
	particle.angleVX = Math.random () * Math.PI * 2;
	particle.radiusVX = Math.random () * 1;
	particle.speedAngle = Math.random () * 0.05;
}
 
function attractParticles (x:Number, y:Number)
{
	for (var a:uint = 0; a < arrParticles.length; a++)
	{
		var particle:Object = arrParticles[a];
		var dx:Number = x - particle.shape.x;
		var dy:Number = y - particle.shape.y;
		var dist:Number = Math.sqrt(dx * dx + dy * dy)
		var angle:Number = Math.atan2(dy, dx);
 		
			particle.vx += Math.cos(angle) * Math.abs(stage.stageWidth - dist)* attractForce;
			particle.vy += Math.sin(angle) * Math.abs(stage.stageHeight - dist) * attractForce / 2
		
	}
}