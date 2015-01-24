/*jshint undef:false */
var Pig = GameEntiity.extend({
	build:function(screen, floorPos){
		//the texture shoud be loaded before this class are instanced
		//the label, is the label on the json of texture loaded
		//the function 'getFramesByRange', is just a helper, this return one array with the labels of textures on json

		var self = this;
		var motionIdle = new SpritesheetAnimation();
		motionIdle.build('idle', this.getFramesByRange('pig0', 1, 23,'', '.png'), 0, true, null);
		// console.log(this.playerModel);
		// motionIdle.build('idle',['pig0001.png'], 1, true, null);
		
		var jumpUp = new SpritesheetAnimation();
		jumpUp.build('jumpUp', ['pig0026.png'], 4, false ,null);

		var dashMotion = new SpritesheetAnimation();
		dashMotion.build('dash', ['pig0028.png'], 1, false, null);


		var jumpDown = new SpritesheetAnimation();
		jumpDown.build('jumpDown', ['pig0027.png'], 4, false, null);


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
	},
	dash:function(isFirst){
		this._super();
		if(!isFirst){
			return;
		}
		this.dashGraphic = new PIXI.Sprite(PIXI.Texture.fromFrame('dashpig.png'));
		this.dashGraphic.anchor.x = 0.95;
		this.dashGraphic.anchor.y = 0.5;
		console.log(this.dashGraphic);
		this.getContent().parent.addChild(this.dashGraphic);

		this.dashGraphic.scale.x = this.getContent().scale.x - 0.5;
		this.dashGraphic.scale.y = this.getContent().scale.y - 0.2;

		this.dashGraphic.position.x = this.getPosition().x;
		this.dashGraphic.position.y = this.getPosition().y;
		TweenLite.to(this.dashGraphic.scale, 0.2, {x:this.getContent().scale.x, y:this.getContent().scale.y});
		TweenLite.to(this.dashGraphic.scale, 0.3, {delay:0.5, x:0.2, y:this.dashGraphic.scale.y * 0.7});
		TweenLite.to(this.dashGraphic.position, 0.3, {delay:0.5, x:this.getPosition().x -230});
		TweenLite.to(this.dashGraphic, 0.3, {delay:0.45, alpha:0});
	}
});