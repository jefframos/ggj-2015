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

        var assetsToLoader = ['dist/img/atlas/atlas.json',
        'dist/img/atlas/cupcake.json',
        'dist/img/atlas/cow.json',
        'dist/img/atlas/environment.json'];


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

        if(this.vel > this.maxVel){
            this.vel -= this.accel;
            if(this.onDash){
                this.vel -= this.accel * 5;
            }
            if(this.vel < this.maxVel){
                this.vel = this.maxVel;
                this.onDash = false;
                this.first.onDash = false;
                this.second.onDash = false;
            }
        }
        this.environment.velocity.x = -this.vel;
        this.environment2.velocity.x = -this.vel * 0.9;
        this.environment3.velocity.x = -this.vel * 0.6;
        this.environment4.velocity.x = -this.vel * 0.4;
        
        if(this.playerModel && this.playerModel.currentBulletEnergy <= this.playerModel.maxBulletEnergy -this.playerModel.recoverBulletEnergy) {
            this.playerModel.currentBulletEnergy += this.playerModel.recoverBulletEnergy;
        }
        if(this.bulletBar){
            this.bulletBar.updateBar(this.playerModel.currentBulletEnergy, this.playerModel.maxBulletEnergy);
        }
        if(this.energyBar){
            this.energyBar.updateBar(this.playerModel.currentEnergy, this.playerModel.maxEnergy);
        }
        // this.textAcc.setText(this.childs.length);
    },
    dash:function(){
        if(this.playerModel.currentBulletEnergy < this.playerModel.maxBulletEnergy * this.playerModel.bulletCoast){
            return;
        }
        console.log(this.playerModel.bulletCoast);
        this.playerModel.currentBulletEnergy -= this.playerModel.maxBulletEnergy * this.playerModel.bulletCoast;

        if(this.playerModel.currentBulletEnergy < 0){
            this.playerModel.currentBulletEnergy = 0;
        }
        this.vel = this.maxVel * 6;
        this.onDash = true;
        this.leftDown = false;
        this.rightDown = false;
        this.first.dash();
        var self = this;
        setTimeout(function(){
            self.second.dash();
        }, 100);
        // }
    },
    change:function(){
        var temp = this.first;
        this.first = this.second;
        this.second = temp;
        console.log(this.firstPos, this.secondPos);
        var tempPos = this.first.getPosition().x;
        // this.first.spritesheet.position.x = this.second.getPosition().x;
        // this.second.spritesheet.position.x = tempPos;
        TweenLite.to(this.first.spritesheet.position, 0.5, {x:this.firstPos, ease:'easeOutCubic'});
        TweenLite.to(this.second.spritesheet.position, 0.5, {x:this.secondPos, ease:'easeInCubic'});
    },
    jump:function(){
        // if(this.leftDown && this.rightDown){
        // console.log(self);
        if(this.onDash){
            return;
        }
        this.first.jump();
        var self = this;
        setTimeout(function(){
            self.second.jump();
        }, 100);
        // }
    },
    updateParticles:function(){
        // if(this.particleAccum < 0){
        //     this.particleAccum = this.playerModel.currentEnergy / this.playerModel.maxEnergy * 50 + 8;
        //     var particle = new Particles({x:-0.9, y:-(Math.random() * 0.2 + 0.7)}, 110, 'smoke.png', -0.01);
        //     particle.build();
        //     particle.setPosition(this.cow.getPosition().x - this.cow.getContent().width + 5,
        //         this.cow.getPosition().y- this.cow.getContent().height / 2 + 25);
        //     this.addChild(particle);

        // }else{
        //     this.particleAccum --;
        // }
    },
    initApplication:function(){
        // var paralaxLayer1 = new Paralax(this.canvasArea.x);
        // paralaxLayer1.build('tree2.png', 100);
        // this.addChild(paralaxLayer1);
        // paralaxLayer1.velocity.x = -0.5;
        // paralaxLayer1.getContent().position.y = 420;
        // this.textAcc.setText(this.textAcc.text+'\ninitApplication');
        this.background = new SimpleSprite('sky.png');
        this.addChild(this.background);

        this.accel = 0.1;
        this.vel = 0;
        this.maxVel = 5;


        this.environment4 = new Environment(windowWidth, windowHeight);
        this.environment4.build(['montanha2.png'], 80, 75);
        // environment4.velocity.x = -1;
        this.addChild(this.environment4);

        this.environment3 = new Environment(windowWidth, windowHeight);
        this.environment3.build(['montanha1.png'], 50, 75);
        // environment3.velocity.x = -1;
        this.addChild(this.environment3);

        this.environment2 = new Environment(windowWidth, windowHeight);
        this.environment2.build(['cacto1.png','cacto2.png','pedra.png','cranio.png'], 300, 75);
        // environment2.velocity.x = -1;
        this.addChild(this.environment2);

        this.environment = new Environment(windowWidth, windowHeight);
        this.environment.build(['ground.png'], 0, 0);
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


        this.cow = new Cow(this.playerModel);
        this.cow.build(this);
       
        this.layer.addChild(this.cow);
        this.cow.rotation = -1;
        
        var scale = scaleConverter(this.cow.getContent().height, windowHeight, 0.25);
        this.cow.setScale( scale,scale);

        var refPos = windowHeight - 75  - this.cow.getContent().height / 2;
        this.firstPos = windowWidth * 0.5;
        console.log(this.firstPos);
        this.cow.setPosition(this.firstPos,refPos);
        this.cow.floorPos = refPos;

        this.first = this.cow;

        this.pig = new Pig(this.playerModel);
        this.pig.build(this);
        var refPosPig = windowHeight - 80  - this.pig.getContent().height / 2;
        this.layer.addChild(this.pig);
        this.pig.rotation = -1;
        this.secondPos = windowWidth * 0.5 -this.pig.getContent().width;
        this.pig.setPosition(this.secondPos,refPosPig);
        this.pig.floorPos = refPosPig;

        this.second = this.pig;

        this.gameOver = false;

        // this.cow.setPosition(windowWidth * 0.1 +this.cow.getContent().width/2,windowHeight /2);
        var self = this;
        var posHelper =  windowHeight * 0.05;
        this.bulletBar = new BarView(windowWidth * 0.1, 10, 1, 1);
        this.addChild(this.bulletBar);
        this.bulletBar.setPosition(250 + posHelper, posHelper);

        this.energyBar = new BarView(windowWidth * 0.1, 10, 1, 1);
        this.addChild(this.energyBar);
        this.energyBar.setPosition(250 + posHelper * 2 + this.bulletBar.width, posHelper);


        // this.returnButton = new DefaultButton('simpleButtonUp.png', 'simpleButtonOver.png');
        // this.returnButton.build(60, 50);
        // this.returnButton.setPosition( windowWidth * 0.95 - 20,windowHeight * 0.95 - 65);
        // this.addChild(this.returnButton);
        // this.returnButton.addLabel(new PIXI.Text('<', {font:'40px Arial'}),5,5);
        // this.returnButton.clickCallback = function(){
        //     self.screenManager.prevScreen();
        // };
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

        hammer.on('swipeleft', function() {
            self.change();
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
    }
});