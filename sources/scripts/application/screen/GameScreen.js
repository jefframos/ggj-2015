/*jshint undef:false */
var GameScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();

        this.textAcc = new PIXI.Text('', {font:'15px Arial'});
        this.addChild(this.textAcc);
        this.textAcc.position.y = 20;
        this.textAcc.position.x = windowWidth - 150;

        var assetsToLoader = ['dist/img/atlas/atlas.json'];


        if(assetsToLoader.length > 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.textAcc.setText(this.textAcc.text+'\ninitLoad');
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
       
        this.accelerometer = {};

        this.hitTouchRight = new PIXI.Graphics();
        // this.hitTouchRight.setInteractive(true);
        this.hitTouchRight.interactive = true;

        this.hitTouchRight.beginFill(0);
        this.hitTouchRight.drawRect(0,0,windowWidth, windowHeight);
        this.addChild(this.hitTouchRight);
        this.hitTouchRight.alpha = 0;
        this.hitTouchRight.hitArea = new PIXI.Rectangle(0, 0, windowWidth * 0.5, windowHeight);

        this.hitTouchLeft = new PIXI.Graphics();
        // this.hitTouchLeft.setInteractive(true);
        this.hitTouchLeft.interactive = true;
        this.hitTouchLeft.beginFill(0);
        this.hitTouchLeft.drawRect(0,0,windowWidth, windowHeight);
        this.addChild(this.hitTouchLeft);
        this.hitTouchLeft.alpha = 0;
        this.hitTouchLeft.hitArea = new PIXI.Rectangle(windowWidth * 0.5, 0, windowWidth, windowHeight);
        

        
        this.particleAccum = 50;
        this.gameOver = false;
        var self = this;


        this.hitTouchLeft.mousedown = this.hitTouchLeft.touchstart = function(touchData){
            self.vel = self.maxVel;
        };
         
        this.hitTouchLeft.mouseup = this.hitTouchLeft.touchend = function(touchData){
           
        };

        this.hitTouchRight.mousedown = this.hitTouchRight.touchstart = function(touchData){
           
        };
         
        this.hitTouchRight.mouseup = this.hitTouchRight.touchend = function(touchData){
           
        };

        this.textAcc.setText(this.textAcc.text+'\nbuild');

    },
    onProgress:function(){

        this.textAcc.setText(this.textAcc.text+'\nonProgress');
        this._super();
    },
    onAssetsLoaded:function()
    {
        this.textAcc.setText(this.textAcc.text+'\nAssetsLoaded');
        this.initApplication();
    },
    update:function() {
        this._super();
        if(!this.playerModel)
        {
            return;
        }

        this.updateParticles();
        if(this.vel + this.accel > 0){
            this.vel -= this.accel;
        }
        this.environment.velocity.x = -this.vel;
        // this.textAcc.setText(this.childs.length);
    },
    updateParticles:function(){
        // if(this.particleAccum < 0){
        //     this.particleAccum = this.playerModel.currentEnergy / this.playerModel.maxEnergy * 50 + 8;
        //     var particle = new Particles({x:-0.9, y:-(Math.random() * 0.2 + 0.7)}, 110, 'smoke.png', -0.01);
        //     particle.build();
        //     particle.setPosition(this.red.getPosition().x - this.red.getContent().width + 5,
        //         this.red.getPosition().y- this.red.getContent().height / 2 + 25);
        //     this.addChild(particle);

        // }else{
        //     this.particleAccum --;
        // }
    },
    initApplication:function(){

        this.accel = 0.1;
        this.vel = 0;
        this.maxVel = 2;
        this.environment = new Environment(windowWidth, windowHeight);
        this.environment.build(['env1.png','env2.png','env3.png','env4.png']);
        // environment.velocity.x = -1;
        this.addChild(this.environment);

        this.layerManager = new LayerManager();
        this.layerManager.build('Main');

        this.addChild(this.layerManager);

        //adiciona uma camada
        this.layer = new Layer();
        this.layer.build('EntityLayer');
        this.layerManager.addLayer(this.layer);


        this.playerModel = APP.getGameModel().currentPlayerModel;
        this.playerModel.reset();
        this.red = new Red(this.playerModel);
        this.red.build(this);
        this.layer.addChild(this.red);
        this.red.rotation = -1;
        this.red.setPosition(windowWidth * 0.1 -this.red.getContent().width,windowHeight * 1.2);

        this.gameOver = false;

        // this.red.setPosition(windowWidth * 0.1 +this.red.getContent().width/2,windowHeight /2);
        var scale = scaleConverter(this.red.getContent().width, windowHeight, 0.25);
        TweenLite.to(this.red.spritesheet.position, 1,{x:windowWidth * 0.15 +this.red.getContent().width/2, y:windowHeight /2} );
        this.red.setScale( scale,scale);
        var self = this;
        var posHelper =  windowHeight * 0.05;
        this.bulletBar = new BarView(windowWidth * 0.1, 10, 1, 1);
        this.addChild(this.bulletBar);
        this.bulletBar.setPosition(250 + posHelper, posHelper);

        this.energyBar = new BarView(windowWidth * 0.1, 10, 1, 1);
        this.addChild(this.energyBar);
        this.energyBar.setPosition(250 + posHelper * 2 + this.bulletBar.width, posHelper);


        this.returnButton = new DefaultButton('dist/img/UI/simpleButtonUp.png', 'dist/img/UI/simpleButtonOver.png');
        this.returnButton.build(60, 50);
        this.returnButton.setPosition( windowWidth * 0.95 - 20,windowHeight * 0.95 - 65);
        this.addChild(this.returnButton);
        this.returnButton.addLabel(new PIXI.Text('<', {font:'40px Arial'}),5,5);
        this.returnButton.clickCallback = function(){
            self.screenManager.prevScreen();
        };
        this.initBench = false;

        this.textAcc.setText(this.textAcc.text+'\nendinitApplication');

        
    },
    benchmark:function()
    {
        if(this.initBench){
            return;
        }
        var self = this;
        this.initBench = true;
        this.accBench = 0;
        
        function addEntity(){
            var red = new Red();
            red.build();
            red.setPosition(-90, windowHeight * Math.random());
            self.addChild(red);
            red.velocity.x = 1;
            self.accBench ++;
            if(self.accBench > 300){
                self.initBench = false;
                clearInterval(self.benchInterval);
            }
        }
        this.benchInterval = setInterval(addEntity, 50);
    }
});