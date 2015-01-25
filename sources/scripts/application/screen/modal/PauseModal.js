/*jshint undef:false */
var PauseModal = Class.extend({
	init:function(screen){
		this.screen = screen;
		
		this.container = new PIXI.DisplayObjectContainer();
		this.boxContainer = new PIXI.DisplayObjectContainer();
		this.bg = new PIXI.Graphics();
		this.bg.beginFill(0x004d48);
		this.bg.drawRect(0,0,windowWidth, windowHeight);
		this.bg.alpha = 0.0;
		this.container.addChild(this.bg);
		this.container.addChild(this.boxContainer);
		this.background = new SimpleSprite('backPauseModal.png');
		this.boxContainer.addChild(this.background.container);
		// this.background.setPosition(windowWidth / 2 - this.background.getContent().width /2,
		// 	windowHeight / 2 - this.background.getContent().height /2);
		// console.log(windowWidth / 2 - this.background.getContent().width /2);
		this.background.container.position.x = windowWidth / 2 - this.background.getContent().width /2;
		this.background.container.position.y = windowHeight / 2 - this.background.getContent().height /2;

		var bgPos = {x:this.background.container.position.x, y:this.background.container.position.y};
		this.retryButton = new DefaultButton('retryButton.png', 'retryButtonOver.png');
        this.retryButton.build();
        this.retryButton.setPosition(bgPos.x + 135, bgPos.y + 193);
        this.boxContainer.addChild(this.retryButton.getContent());

		var self = this;

        // this.retryButton.addLabel(new PIXI.Text('<', {font:'40px Arial'}),5,5);
        this.retryButton.clickCallback = function(){
            // self.screenManager.prevScreen();
            self.hide(self.screen.resetGame());
        };

        this.continueButton = new DefaultButton('continueButton.png', 'continueButtonOver.png');
        this.continueButton.build();
        this.continueButton.setPosition(bgPos.x + 135, bgPos.y + 288);
        this.boxContainer.addChild(this.continueButton.getContent());
        // this.continueButton.addLabel(new PIXI.Text('<', {font:'40px Arial'}),5,5);
        this.continueButton.clickCallback = function(){
            // self.screenManager.prevScreen();
            self.hide(function(){self.screen.updateable = true;});

        };

        this.pauseLabel = new SimpleSprite('pauseLabel.png');
		this.boxContainer.addChild(this.pauseLabel.container);
        this.pauseLabel.setPosition(bgPos.x + 105, bgPos.y + 91);

		this.boxContainer.position.y = -this.boxContainer.height * 1.5;

	},
	show:function(){
		TweenLite.to(this.bg, 0.5, {alpha:0.8});
		TweenLite.to(this.boxContainer.position, 1, {y:0, ease:'easeOutBack'});
		TweenLite.to(this.boxContainer, 0.5, {alpha:1});
	},
	hide:function(callback){
		var self = this;
		TweenLite.to(this.bg, 0.5, {alpha:0, onComplete:function(){
			if(callback){
				callback();
			}
		}});
		TweenLite.to(this.boxContainer.position, 1, {y:-this.boxContainer.height, ease:'easeInBack'});
		TweenLite.to(this.boxContainer, 0.5, {alpha:0});
	},
	getContent:function(){
		return this.container;
	}
});