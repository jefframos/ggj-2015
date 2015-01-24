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

        var assetsToLoader = ['dist/img/atlas/atlas.json', 'dist/img/atlas/cupcake.json'];


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
        this.hitTouchRight.hitArea = new PIXI.Rectangle(windowWidth * 0.5, 0, windowWidth, windowHeight);

        this.hitTouchLeft = new PIXI.Graphics();
        // this.hitTouchLeft.setInteractive(true);
        this.hitTouchLeft.interactive = true;
        this.hitTouchLeft.beginFill(0);
        this.hitTouchLeft.drawRect(0,0,windowWidth, windowHeight);
        this.addChild(this.hitTouchLeft);
        this.hitTouchLeft.alpha = 0;
        this.hitTouchLeft.hitArea = new PIXI.Rectangle(0, 0, windowWidth * 0.5, windowHeight);
        

        
        this.particleAccum = 50;
        this.gameOver = false;
        var self = this;
        this.leftDown = false;
        this.rightDown = false;
        this.tapAccum = 0;

        

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
        if(this.vel > 0){
            this.vel -= this.accel;
            if(this.onDash){
                this.vel -= this.accel * 2;
            }
            if(this.vel < 0){
                this.vel = 0;
                this.onDash = false;
            }
        }
        this.environment.velocity.x = -this.vel;
        this.tapAccum++;
        if(this.tapAccum > 8){
            this.tapAccum = 8;
        }

        // this.textAcc.setText(this.childs.length);
    },
    dash:function(){
        // if(this.leftDown && this.rightDown){
        // console.log(self);
        this.vel = this.maxVel * 8;
        this.onDash = true;
        this.leftDown = false;
        this.rightDown = false;
        this.red.dash();
        // }
    },
    jump:function(){
        // if(this.leftDown && this.rightDown){
        // console.log(self);
        this.red.jump();
        // }
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
        this.maxVel = 5;
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
        this.red.build(this, windowHeight * 0.7);
        this.layer.addChild(this.red);
        this.red.rotation = -1;
        this.red.setPosition(windowWidth * 0.5 -this.red.getContent().width,windowHeight * 0.7);

        this.gameOver = false;

        // this.red.setPosition(windowWidth * 0.1 +this.red.getContent().width/2,windowHeight /2);
        var scale = scaleConverter(this.red.getContent().width, windowHeight, 0.25);
        //this.red.setScale( scale,scale);
        var self = this;
        var posHelper =  windowHeight * 0.05;
        this.bulletBar = new BarView(windowWidth * 0.1, 10, 1, 1);
        this.addChild(this.bulletBar);
        this.bulletBar.setPosition(250 + posHelper, posHelper);

        this.energyBar = new BarView(windowWidth * 0.1, 10, 1, 1);
        this.addChild(this.energyBar);
        this.energyBar.setPosition(250 + posHelper * 2 + this.bulletBar.width, posHelper);


        this.returnButton = new DefaultButton('simpleButtonUp.png', 'simpleButtonOver.png');
        this.returnButton.build(60, 50);
        this.returnButton.setPosition( windowWidth * 0.95 - 20,windowHeight * 0.95 - 65);
        this.addChild(this.returnButton);
        this.returnButton.addLabel(new PIXI.Text('<', {font:'40px Arial'}),5,5);
        this.returnButton.clickCallback = function(){
            self.screenManager.prevScreen();
        };
        this.initBench = false;

        this.textAcc.setText(this.textAcc.text+'\nendinitApplication');

        this.addListenners();

        
    },
    addListenners:function(){
        var self = this;
        var swipe     = new Hammer.Swipe();
        var hammer    = new Hammer.Manager(renderer.view);
        hammer.add(swipe);

        hammer.on('swipeup', function() {
            self.jump();
        });

        hammer.on('swiperight', function() {
            self.dash();
        });

        document.body.addEventListener('keyup', function(e){
            if(e.keyCode === 87 || e.keyCode === 38){
                // self.removePosition('up');
            }
            else if(e.keyCode === 83 || e.keyCode === 40){
                // self.removePosition('down');
            }
            else if(e.keyCode === 65 || e.keyCode === 37){
                self.leftDown = false;

            }
            else if(e.keyCode === 68 || e.keyCode === 39){
                self.rightDown = false;

            }
        });

        document.body.addEventListener('keydown', function(e){
            if(e.keyCode === 87 || e.keyCode === 38){
                // self.removePosition('up');
            }
            else if(e.keyCode === 83 || e.keyCode === 40){
                // self.removePosition('down');
            }
            else if(e.keyCode === 65 || e.keyCode === 37){
                tapLeft();

            }
            else if(e.keyCode === 68 || e.keyCode === 39){
                tapRight();
            }

        });

        function tapLeft(){
            if(self.leftDown){
                return;
            }
            self.leftDown = true;
            if(!self.onDash || self.onDash && self.vel < self.maxVel){
                self.vel = self.maxVel;
            }
            // self.testJump();
            self.tapAccum = 0;
            // self.rightDown = false;
        }
        function tapRight(){
            if(self.rightDown){
                return;
            }
            self.rightDown = true;
            if(!self.onDash || self.onDash && self.vel < self.maxVel){
                self.vel = self.maxVel;
            }
            // self.testJump();
            self.tapAccum = 0;
            // self.leftDown = false;
        }


        this.hitTouchLeft.mousedown = this.hitTouchLeft.touchstart = function(touchData){
            tapLeft();
        };
        
        this.hitTouchLeft.mouseup = this.hitTouchLeft.touchend = function(touchData){
            // console.log('hitTouchLeft');
            self.leftDown = false;
        };

        
        this.hitTouchRight.mousedown = this.hitTouchRight.touchstart = function(touchData){
            tapRight();
        };
         
        this.hitTouchRight.mouseup = this.hitTouchRight.touchend = function(touchData){
            // console.log('hitTouchRight');
            self.rightDown = false;
        };

        this.textAcc.setText(this.textAcc.text+'\nbuild');
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