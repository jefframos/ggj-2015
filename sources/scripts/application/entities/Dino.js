/*jshint undef:false */
var Dino = Entity.extend({
	init:function(){
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
		this.imgSource = 'bullet.png';
		this.dinoContainer = new PIXI.DisplayObjectContainer();
		this.container = new PIXI.DisplayObjectContainer();

	},
	build: function(){

		this.dinohead = new PIXI.Sprite.fromFrame('dino1.png');
		this.dinohead.anchor.x = 0.1;
		this.dinohead.anchor.y = 0.1;

		this.dinoMouth = new PIXI.Sprite.fromFrame('dino2.png');
		this.dinoMouth.anchor.x = 0.1;
		this.dinoMouth.anchor.y = 0.1;

		this.dinoContainer.addChild(this.dinoMouth);
		this.dinoContainer.addChild(this.dinohead);
		this.updateable = true;
		this.collidable = true;

		this.getContent().alpha = 0;
		TweenLite.to(this.getContent(), 0.5, {alpha:1});

		this.dinoMouth.position.x = 30;
		this.dinoMouth.position.y = 260;

		function repeatTimeline(){
			// tl.restart();
		}
		var tl = new TimelineLite({onComplete:repeatTimeline});
		tl.append(TweenLite.to(this.dinoMouth, 1.5, {rotation: 0.2, ease:'easeInOutCubic'}));
		tl.append(TweenLite.to(this.dinoMouth, 2, {rotation: -0.2, ease:'easeInOutCubic'}));
		// tl.append(TweenLite.to(this.dinoMouth, 2, {rotation: 0, ease:'easeOutCubic'}));

		// function repeatTimeline2(){
		// 	tlBody.restart();
		// }
		// var tlBody = new TimelineLite({onComplete:repeatTimeline2});
		// tlBody.append(TweenLite.to(this.dinoContainer, 2, {rotation: 0.05, ease:'easeOutCubic'}));
		// tlBody.append(TweenLite.to(this.dinoContainer, 4, {rotation: -0.05, ease:'easeInCubic'}));
		// tlBody.append(TweenLite.to(this.dinoContainer, 2, {rotation: 0, ease:'easeOutCubic'}));
		// tlBody.append(TweenLite.to(this.dinoContainer, 3, {rotation: 0.05}));


		function repeatTimeline3(){
			tlRun.restart();
		}
		var tlRun = new TimelineLite({onComplete:repeatTimeline3});
		tlRun.append(TweenLite.to(this.dinoContainer.position, 0.3, {y: 20, ease:'easeOutCubic'}));
		tlRun.append(TweenLite.to(this.dinoContainer.position, 1.2, {y: -10, ease:'easeInOutCubic'}));
		tlRun.append(TweenLite.to(this.dinoContainer.position, 0.6, {y: 20, ease:'easeInOutCubic'}));
		tlRun.append(TweenLite.to(this.dinoContainer.position, 0.6, {y: -10}));

		this.container.addChild(this.dinoContainer);

	},
	getContent:function(){
		return this.container;
	},
	update: function(){
		// this.dinoMouth.rotation += 0.001;
		//this._super();
		// this.timeLive --;
		// if(this.timeLive <= 0){
		// 	this.preKill();
		// }
	}
});