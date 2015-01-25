/*jshint undef:false */
var AppModel = Class.extend({
	init:function(){
		this.currentPlayerModel = {};

		// source,
		// energy coast,
		// bullet coast,
		// vel,
		// demage,
		// bullet force


// new PlayerModel( 0.04,0.8,2,0.15,1),
// 			new PlayerModel( 0.04,0.7,1.5,0.2,2)

		this.playerModels = [
			new PlayerModel( 0.04,0.8,2,1.15,1),
			new PlayerModel( 0.04,0.7,1.5,1.2,2)
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