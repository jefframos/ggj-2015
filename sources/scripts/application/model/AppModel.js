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
			new PlayerModel( 0.04,0.8,2,0.15,1),
			new PlayerModel( 0.04,0.7,1.5,0.2,2)
		];

		this.objects = [['ice1.png',1,true],
		['ice2.png',1,true],
		['rock1.png',2,true],
		['rock2.png',2,true],
		['colide_cacto1.png',3,false],
		['colide_cacto2.png',3,false],
		['colide_espinho1.png',3,false],
		['colide_espinho2.png',3,false]];

		this.itens = [['jalapeno.png',2, 300],
		['bacon.png',1, 0.2]];

		this.enemies = [['et.png',2, 300],
		['dinovoador.png',1, 0.5]];

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