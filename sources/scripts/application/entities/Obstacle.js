/*jshint undef:false */
var Obstacle = Entity.extend({
	init:function(type, source, brekeable, screen, particle){
		this._super( true );
		this.updateable = false;
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
		this.idType = type;
		this.brekeable = brekeable;
		this.screen = screen;
		this.particle = particle;
	},
	build: function(){

		this.sprite = new PIXI.Sprite.fromFrame(this.imgSource);

		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 1;

		this.updateable = true;
		this.collidable = true;
	},
	update: function(){
		this._super();
		this.layer.collideChilds(this);
		if(this.getPosition().x < -this.sprite.width){
			this.kill = true;
		}
		this.range = this.sprite.width / 2;
	},
	collide:function(arrayCollide){
		if(this.collidable){
			if(arrayCollide[0].type === 'player' && arrayCollide[0].isFirst){
				// this.kill = this.brekeable;//preKill();
				// console.log(this.kill);
				this.preKill();
				// arrayCollide[0].preKill();
				this.collidable = false;
				arrayCollide[0].hurt(this.idType);
			}
		}
	},
	preKill:function(){
		for (var i = 4; i >= 0; i--) {
			var particle3 = new Particles({x:-this.screen.vel * Math.random() - 3, y:-(Math.random() * 5 + 7)}, 120, this.particle, Math.random() * 0.1);
	        particle3.build();
	        particle3.gravity = 0.2 + Math.random();
	        particle3.alphadecres = 0.08;
	        particle3.setPosition(this.getPosition().x - (Math.random() * this.getContent().width + this.getContent().width * 0.1) / 2,
	            this.getPosition().y - Math.random() * 50 - this.getContent().width / 4);
	        this.screen.addChild(particle3);
		}
		this.kill = true;
		// var self = this;
		// TweenLite.to(this.getContent(), 0.3, {alpha:0, onComplete:function(){self.kill = true;}});
	},
	pointDistance: function(x, y, x0, y0){
		return Math.sqrt((x -= x0) * x + (y -= y0) * y);
	},
	touch: function(collection){
		if(collection.object && collection.object.type === 'environment'){
			collection.object.fireCollide();
		}
		this.preKill();
	},
});