/*jshint undef:false */
var Pig = GameEntiity.extend({
	build:function(screen, floorPos){
		//the texture shoud be loaded before this class are instanced
		//the label, is the label on the json of texture loaded
		//the function 'getFramesByRange', is just a helper, this return one array with the labels of textures on json

		var self = this;
		var motionIdle = new SpritesheetAnimation();
		motionIdle.build('idle', this.getFramesByRange('cupcake0', 1, 23,'', '.png'), 1, true, null);
		// console.log(this.playerModel);
		// motionIdle.build('idle',['cupcake0001.png'], 1, true, null);
		
		var jumpUp = new SpritesheetAnimation();
		jumpUp.build('jumpUp', this.getFramesByRange('cupcake0', 24, 26,'', '.png'), 4, false ,null);

		var dashMotion = new SpritesheetAnimation();
		dashMotion.build('dash', ['dash.png'], 1, false, null);


		var jumpDown = new SpritesheetAnimation();
		jumpDown.build('jumpDown', this.getFramesByRange('cupcake0', 26, 40,'', '.png'), 4, false, null);


		this.spritesheet = new Spritesheet();
		this.spritesheet.addAnimation(motionIdle);
		this.spritesheet.addAnimation(jumpDown);
		this.spritesheet.addAnimation(jumpUp);
		this.spritesheet.addAnimation(dashMotion);
		// this.spritesheet.addAnimation(motionHurt);
		this.spritesheet.play('jumpUp');

		this.screen = screen;
		this.floorPos = floorPos;
		this.defaultVel = 50 * gameScale;

		this.upVel = this.playerModel.velocity * gameScale;

		// TweenLite.to(this.getContent().position, 0.5, {x:500});
		// console.log(this.spritesheet.texture.rotation = 10);
		// TweenLite.to(this.spritesheet.texture, 0.5, {rotation:90});
		// this.getContent().pivot.x = this.spritesheet.texture.width * 1.5 ;// / 2;
		// this.getContent().pivot.y = this.spritesheet.texture.height* 1.5;// / 2;
		this.spritesheet.texture.anchor.x = 0.5;
		this.spritesheet.texture.anchor.y = 0.5;
		this.rotation = 0;

		this.gravity = 0.2;
		// console.log(this.spritesheet.texture);
	}
});