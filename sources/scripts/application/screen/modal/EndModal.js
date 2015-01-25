/*jshint undef:false */
var EndModal = Class.extend({
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
		this.background = new SimpleSprite('backEndModal.png');
		this.boxContainer.addChild(this.background.container);
		// this.background.setPosition(windowWidth / 2 - this.background.getContent().width /2,
		// 	windowHeight / 2 - this.background.getContent().height /2);
		// console.log(windowWidth / 2 - this.background.getContent().width /2);
		this.background.container.position.x = windowWidth / 2 - this.background.getContent().width /2 - 30;
		this.background.container.position.y = windowHeight / 2 - this.background.getContent().height /2 - 20;

		var bgPos = {x:this.background.container.position.x+70, y:this.background.container.position.y+14};
		this.retryButton = new DefaultButton('retryButton.png', 'retryButtonOver.png');
        this.retryButton.build();
        this.retryButton.setPosition(bgPos.x + 135, bgPos.y + 268);
        this.boxContainer.addChild(this.retryButton.getContent());

		var self = this;

        // this.retryButton.addLabel(new PIXI.Text('<', {font:'40px Arial'}),5,5);
        this.retryButton.clickCallback = function(){
            // self.screenManager.prevScreen();
            self.hide(self.screen.resetGame());
        };

        this.exitButton = new DefaultButton('exitButton.png', 'exitButtonOver.png');
        this.exitButton.build();
        this.exitButton.setPosition(bgPos.x + 135, bgPos.y + 363);
        this.boxContainer.addChild(this.exitButton.getContent());
        // this.exitButton.addLabel(new PIXI.Text('<', {font:'40px Arial'}),5,5);
        this.exitButton.clickCallback = function(){
            // self.screenManager.prevScreen();
            self.hide(function(){self.screen.screenManager.change('Wait');});

        };

        this.pauseLabel = new SimpleSprite('score.png');
		this.boxContainer.addChild(this.pauseLabel.container);
        this.pauseLabel.setPosition(bgPos.x + 185, bgPos.y + 101);

		this.boxContainer.position.y = -this.boxContainer.height * 1.5;

		this.points = new PIXI.Text('', {font:'40px Arial Black', wordWrap:true, wordWrapWidth:200, align:'center', fill:'#78bb34'});
        this.boxContainer.addChild(this.points);
        console.log(this.points);
        this.points.position.x = bgPos.x + 135 + this.retryButton.width / 2 - 50;// - 100;// + this.boxContainer.width / 2 - this.points.width / 2;
        this.points.position.y = bgPos.y + 268 - 80;// + this.boxContainer.width / 2 - this.points.width / 2;
        // this.points.position.x = bgPos.y;

	},
	show:function(points){
		var tempI = points;
		if(points < 10){
			tempI = '000' + points;
		}
		else if(points < 100){
			tempI = '00' + points;
		}
		else if(points < 1000){
			tempI = '0' + points;
		}

		// console.log(points,'pointspointspointspointspointspointspointspointspointspointspointspointspoints');
		this.container.parent.setChildIndex(this.container,this.container.parent.children.length -1);

		this.points.setText(tempI);
		this.screen.updateable = false;
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