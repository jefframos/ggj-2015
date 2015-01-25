/*jshint undef:false */
var Chicken = Entity.extend({
	init:function(source, screen){
		this._super( true );
		this.updateable = true;
		this.deading = false;
		this.range = 80;
		this.width = 1;
		this.height = 1;
		this.type = 'bullet';
		this.target = 'enemy';
		this.fireType = 'physical';
		this.node = null;
		this.power = 1;
		this.defaultVelocity = 1;
		this.imgSource = source;
		this.velFactor = 1;
		this.screen = screen;
	},
	build: function(){

		this.sprite = new PIXI.Sprite.fromFrame(this.imgSource);

		// this.sprite.anchor.x = 0.5;
		// this.sprite.anchor.y = 1;

		this.updateable = true;
	},
	update: function(){
		this.velocity.x = -this.screen.vel;
		this._super();
		if(this.getPosition().x < -this.sprite.width){
			this.kill = true;
		}
	}
});