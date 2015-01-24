/*jshint undef:false */
var EnergyBar = Class.extend({
	init: function (backBar, bar, icoSrc){

		
		this.container = new PIXI.DisplayObjectContainer();
		this.barContainer = new PIXI.DisplayObjectContainer();
		this.backShape = new SimpleSprite(backBar);
		this.container.addChild(this.barContainer);
		this.barContainer.addChild(this.backShape.container);


		this.frontShape = new SimpleSprite(bar);
		this.barContainer.addChild(this.frontShape.container);
		this.frontShape.container.position.y = this.backShape.container.height / 2 - this.frontShape.container.height / 2;

		this.mask = new PIXI.Graphics();
		this.mask.beginFill(0x00FF00);
		this.mask.drawRect(0,0,this.backShape.container.width, this.backShape.container.height);
		this.barContainer.addChild(this.mask);
		this.barContainer.mask = this.mask;
		
		this.icon = new SimpleSprite(icoSrc);
		this.icon.container.position.y = this.backShape.container.height / 2 - this.icon.container.height / 2;
		this.icon.container.position.x =  - this.icon.container.width / 2;
		this.container.addChild(this.icon.container);
		console.log(this.icon.container);
	},
	updateBar: function(currentValue, maxValue){
		if(this.currentValue !== currentValue || this.maxValue !== maxValue && currentValue >= 0){
			this.currentValue = currentValue;
			this.maxValue = maxValue;
			var tempW = this.frontShape.container.width;
			var pos = - tempW + (this.currentValue/this.maxValue * this.frontShape.container.width);
			this.frontShape.container.position.x = pos;
			// if(this.frontShape.container.position.x < 0){
			// 	this.frontShape.container.position.x = 0;
			// }
		}
	},
	getContent: function(){
		return this.container;
	},
	setPosition: function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	},
});