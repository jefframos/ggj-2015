/*jshint undef:false */
var AppModel = Class.extend({
	init:function(){
		this.currentPlayerModel = {};

		// source,
		// energy coast,
		// bullet coast,
		// vel,
		// bullet vel,
		// bullet force

		this.playerModels = [
			new PlayerModel('vaca', 0.04,0.8,2,8,1),
			new PlayerModel('feter.png', 0.04,0.7,1.5,4,2)
		];
		this.setModel(0);
	},
	setModel:function(id){
		this.currentID = id;
		this.currentPlayerModel = this.playerModels[id];
	},
	build:function(){

	},
	destroy:function(){

	},
	serialize:function(){
		
	}
});