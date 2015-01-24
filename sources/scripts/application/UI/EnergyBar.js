/*jshint undef:false */
var EnergyBar = Class.extend({
	init: function (width, height, maxValue, currentValue){

		this.maxValue = maxValue;
		this.text = 'default';
		this.currentValue = currentValue;
		this.container = new PIXI.DisplayObjectContainer();
		this.width = width;
		this.height = height;
		this.backShape = new SimpleSprite('energyBackBar.png');
		this.container.addChild(this.backShape.container);


		this.frontShape = new SimpleSprite('blueBar.png');
		this.container.addChild(this.frontShape.container);
		this.frontShape.container.position.y = this.backShape.container.height / 2 - this.frontShape.container.height / 2;
		// this.frontShape = new PIXI.Graphics();
		// this.frontShape.beginFill(0x00FF00);
		// this.frontShape.drawRect(0,0,width, height);
		// this.container.addChild(this.frontShape);

		// this.frontShape.scale.x = this.currentValue/this.maxValue;
	},
	updateBar: function(currentValue, maxValue){
		if(this.currentValue !== currentValue || this.maxValue !== maxValue && currentValue >= 0){
			this.currentValue = currentValue;
			this.maxValue = maxValue;
			this.frontShape.scale.x = this.currentValue/this.maxValue;
			if(this.frontShape.scale.x < 0){
				this.frontShape.scale.x = 0;
			}
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