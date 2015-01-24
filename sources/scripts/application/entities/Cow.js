/*jshint undef:false */
var Cow = SpritesheetEntity.extend({
	init:function(playerModel){
		this.playerModel = playerModel;
		this._super( true );
	},
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

		var jumpUpStatic = new SpritesheetAnimation();
		jumpUpStatic.build('jumpUpStatic', this.getFramesByRange('cupcake0', 26, 26,'', '.png'), 1, false, null);


		var jumpDown = new SpritesheetAnimation();
		jumpDown.build('jumpDown', this.getFramesByRange('cupcake0', 26, 40,'', '.png'), 4, false, null);

		var jumpDownStatic = new SpritesheetAnimation();
		jumpDownStatic.build('jumpDownStatic', this.getFramesByRange('cupcake0', 40, 40,'', '.png'), 1, false, null);

		this.spritesheet = new Spritesheet();
		this.spritesheet.addAnimation(motionIdle);
		this.spritesheet.addAnimation(jumpDown);
		this.spritesheet.addAnimation(jumpUp);
		this.spritesheet.addAnimation(jumpUpStatic);
		this.spritesheet.addAnimation(jumpDownStatic);
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
	setTarget:function(pos){
		this.target = pos;
		if(pointDistance(0,this.getPosition().y,0, this.target) < 4){
			return;
		}
		if(this.target < this.getPosition().y){
			this.velocity.y = -this.upVel;
		}else if(this.target > this.getPosition().y){
			this.velocity.y = this.upVel;
		}

	},
	dash:function(){
		// if(this.inJump){
		// 	return;
		// }
		// this.inJump = true;
		// this.velocity.y = -6;
	},
	jump:function(){
		if(this.inJump){
			return;
		}
		this.inJump = true;
		this.velocity.y = -6;
	},
	update:function(){

		this._super();
		this.spritesheet.texture.anchor.x = 0.5;
		this.spritesheet.texture.anchor.y = 0.5;
		
		// this.spritesheet.texture.rotation  = this.rotation;//(this.velocity.y * 5) * Math.PI / 180;
		// if(this.rotation > 360){
		// 	this.rotation = 0;
		// }
		// TweenLite.to(this, 0.3, {rotation:(this.velocity.y * 5) * Math.PI / 180});
		// this.spritesheet.texture.rotation = this.velocity.y * Math.PI / 180;
		// this.getContent().rotation = this.velocity.y / 10;
		
		if(this.getPosition().x > windowWidth + 50){
			this.preKill();
		}

		this.velocity.y += this.gravity;
		if(this.getPosition().y + this.velocity.y >= this.floorPos){
			this.velocity.y = 0;
			this.inJump = false;
			this.spritesheet.play('idle');
			// console.log('idle');
			// this.setPosition(this.getPosition().x, this.floorPos);
		}
		if(this.velocity.y < 0 && this.spritesheet.currentAnimation.label !== 'jumpUp'){
			console.log('jumpUp');
			this.spritesheet.play('jumpUp');
		}else if(this.velocity.y > 0 && this.spritesheet.currentAnimation.label !== 'jumpDown'){
			console.log('jumpDown');

			this.spritesheet.play('jumpDown');
		}
	},
	destroy:function(){
		this._super();
	}
});