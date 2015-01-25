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

        var assetsToLoader = ['dist/img/atlas/cow.json',
        'dist/img/atlas/effects.json',
        'dist/img/atlas/pig.json',
        'dist/img/atlas/UI.json',
        'dist/img/atlas/dino.json',
        'dist/img/atlas/objects.json',
        'dist/img/atlas/environment.json'];


        if(assetsToLoader.length > 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.textAcc.setText(this.textAcc.text+'\ninitLoad');
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
       
        // this.accelerometer = {};

        // this.hitTouchRight = new PIXI.Graphics();
        // // this.hitTouchRight.setInteractive(true);
        // this.hitTouchRight.interactive = true;

        // this.hitTouchRight.beginFill(0);
        // this.hitTouchRight.drawRect(0,0,windowWidth, windowHeight);
        // this.addChild(this.hitTouchRight);
        // this.hitTouchRight.alpha = 0;
        // this.hitTouchRight.hitArea = new PIXI.Rectangle(windowWidth * 0.5, 0, windowWidth, windowHeight);

        // this.hitTouchLeft = new PIXI.Graphics();
        // // this.hitTouchLeft.setInteractive(true);
        // this.hitTouchLeft.interactive = true;
        // this.hitTouchLeft.beginFill(0);
        // this.hitTouchLeft.drawRect(0,0,windowWidth, windowHeight);
        // this.addChild(this.hitTouchLeft);
        // this.hitTouchLeft.alpha = 0;
        // this.hitTouchLeft.hitArea = new PIXI.Rectangle(0, 0, windowWidth * 0.5, windowHeight);
        

        
        this.particleAccum = 50;
        this.particleAccum2 = 40;
        
        this.gameOver = false;
        var self = this;
        this.leftDown = false;
        this.rightDown = false;
        this.tapAccum = 0;

        this.updateable = false;

        this.levelCounter = 0;
        
        this.waitTuUp = false;
    },
    onProgress:function(){

        this._super();
        this.textAcc.setText(this.loadPercent);
    },
    onAssetsLoaded:function()
    {
        this.textAcc.setText(this.textAcc.text+'\nAssetsLoaded');
        this.initApplication();
    },
    update:function() {
        //console.log('update', this.updateable);
        if(!this.updateable){
            return;
        }
        if(this.labelPoints){
            this.levelCounter ++;
            this.labelPoints.setText(Math.floor(this.levelCounter));
            if(this.waitTuUp && !this.onDash){
                this.waitTuUp = false;
                this.maxVel ++;
                this.vel = this.maxVel;
            }
            if(this.levelCounter % 100 === 0  && this.maxVel < 15){
                console.log(this.levelCounter % 100 && this.maxVel < 8);
                if(this.onDash ){
                    this.waitTuUp = true;
                }else{
                    this.maxVel ++;
                    this.vel = this.maxVel;
                }
            }
            console.log(this.maxVel);
        }
        this._super();

        var i;
        if(this.envArray){
            for (i = this.envArray.length - 1; i >= 0; i--) {
                this.envArray[i].velocity.x = -this.vel * this.envArray[i].velFactor;
            }
        }

        if(this.gameOver){
            this.endModal.show();
            // this.resetGame();
            return;
        }
        // if(!this.playerModel)
        // {
        //     return;
        // }
        if(this.cowDashBar || this.pigDashBar){
            this.updateParticles();
            this.updateObstacles();
            this.updateEnemies();
            this.updateItens();
        }

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
       
        
        if(this.envObjects){
            for (i = this.envObjects.length - 1; i >= 0; i--) {
                this.envObjects[i].velocity.x = -this.vel * this.envObjects[i].velFactor;
            }
        }
        
        if(this.cowDashBar){
            this.cowDashBar.updateBar(this.cow.playerModel.currentBulletEnergy, this.cow.playerModel.maxBulletEnergy);
        }
        if(this.cowEnergyBar){
            this.cowEnergyBar.updateBar(this.cow.playerModel.currentEnergy, this.cow.playerModel.maxEnergy);
        }

        if(this.pigDashBar){
            this.pigDashBar.updateBar(this.pig.playerModel.currentBulletEnergy, this.pig.playerModel.maxBulletEnergy);
        }
        if(this.pigEnergyBar){
            this.pigEnergyBar.updateBar(this.pig.playerModel.currentEnergy, this.pig.playerModel.maxEnergy);
        }

        if(this.energyBar){
            this.energyBar.updateBar(this.cow.playerModel.currentBulletEnergy, this.cow.playerModel.maxBulletEnergy);
        }

        if(this.first){
            if(this.first.dead && !this.second.dead){
                var temp = this.first;
                this.first = this.second;
                this.second = temp;
            }
            if(this.first.dead && this.second.dead){
                this.gameOver = true;
            }
            this.first.isFirst = true;
            this.second.isFirst = false;
        }
        // if(this.debugChildsText){
        //     var k;
        //     var j;
        //     this.childsCounter = 0;
        //     for (k = this.childs.length - 1; k >= 0; k--) {
        //         this.recursiveCounter(this.childs[k]);
        //         this.childsCounter ++;
        //     }
        //     this.debugChildsText.setText(this.childs.length + ' - ' + this.childsCounter);
        // }
        // this.textAcc.setText(this.childs.length);
    },
    resetGame:function(){
        this.destroy();
        this.initApplication();
    },
    recursiveCounter:function(obj){
        if(obj.children){
            for (j = obj.children.length - 1; j >= 0; j--) {
                this.childsCounter ++;
                this.recursiveCounter(obj.children[j]);

            }
        }
        else if(obj.childs){
            for (j = obj.childs.length - 1; j >= 0; j--) {
                this.childsCounter ++;
                this.recursiveCounter(obj.childs[j]);
            }
        }else{
            return;
        }
    },
    dash:function(){
        if(this.first.playerModel.currentBulletEnergy < this.first.playerModel.maxBulletEnergy * this.first.playerModel.bulletCoast){
            return;
        }
        this.first.playerModel.currentBulletEnergy -= this.first.playerModel.maxBulletEnergy * this.first.playerModel.bulletCoast;

        if(this.first.playerModel.currentBulletEnergy < 0){
            this.first.playerModel.currentBulletEnergy = 0;
        }
        this.vel = this.maxDash * 6;
        this.onDash = true;
        this.leftDown = false;
        this.rightDown = false;
        this.first.dash(true);
        this.first.invencibleAccum = 0;
        var self = this;
        setTimeout(function(){
            self.second.dash(false);
        }, 400);
        // }
    },
    change:function(){
        if(this.first.dead || this.second.dead){
            return;
        }
        var temp = this.first;
        this.first = this.second;
        this.second = temp;
        // console.log(this.firstPos, this.secondPos);
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
        }, 400);
        // }
    },
    updateItens:function(){
        if(this.itensAcum < 0){
            var id = Math.floor(APP.getGameModel().itens.length * Math.random());
            var tempModel = APP.getGameModel().itens[id];
            var tempObstacles = new Itens(tempModel[1], tempModel[0], tempModel[2]);
            this.envObjects.push(tempObstacles);
            tempObstacles.build();
            this.layer.addChild(tempObstacles);
            tempObstacles.velFactor = 1;
            tempObstacles.setPosition(windowWidth + windowWidth * 0.2 , windowHeight - 80);
            this.obstaclesAccum = 200 + Math.random() * 20 - (tempModel[0] === 3?Math.random() * 100:0);
            this.itensAcum = 1000;
        }else{
            this.itensAcum --;
        }
    },
    updateEnemies:function(){
        if(this.enemiesAccum < 0){
            var angle = (30 + Math.random()* 70) * Math.PI / 180;
            console.log('AGULO', angle);
            var bulletVel = 2;
            var bullet = new Bullet({x:Math.cos(angle) * bulletVel - this.vel/2,
                y:Math.sin(angle) * bulletVel}, this);
            bullet.build();
            //UTILIZAR O ANGULO PARA CALCULAR A POSIÇÃO CORRETA DO TIRO
            bullet.setPosition(windowWidth, windowHeight * 0.05);
            this.layer.addChild(bullet);
            this.enemiesAccum = 500;
        }else{
            this.enemiesAccum --;
        }
    },
    updateObstacles:function(){
        if(true){
            return;
        }
        if(this.obstaclesAccum < 0){
            var id = Math.floor(APP.getGameModel().objects.length * Math.random());
            console.log(APP.getGameModel().objects, id);
            var tempModel = APP.getGameModel().objects[id];
            var tempObstacles = new Obstacle(tempModel[1], tempModel[0], tempModel[2]);
            this.envObjects.push(tempObstacles);
            tempObstacles.build();
            this.layer.addChild(tempObstacles);
            tempObstacles.velFactor = 1;
            tempObstacles.setPosition(windowWidth + windowWidth * 0.2 , windowHeight - 80);
            this.obstaclesAccum = 200 + Math.random() * 20 - (tempModel[0] === 3?Math.random() * 100:0);
        }else{
            this.obstaclesAccum --;
        }
    },
    updateParticles:function(){
        if(this.particleAccum < 0){
            this.particleAccum = 15 + Math.random() * 20;
            if(this.cow.velocity.y === 0){
                var particle = new Particles({x:-0.3, y:-(Math.random() * 0.2 + 0.3)}, 50, 'smoke1.png', -0.01);
                particle.build();
                particle.setPosition(this.cow.getPosition().x,windowHeight - 80);
                this.addChild(particle);
                particle.velocity.x = -this.vel/2;
            }
        }else{
            this.particleAccum --;
        }

        if(this.particleAccum2 < 0){
            this.particleAccum2 = 15 + Math.random() * 20;
            if(this.pig.velocity.y === 0){
                var particle2 = new Particles({x:-0.3, y:-(Math.random() * 0.2 + 0.3)}, 50, 'smoke1.png', -0.01);
                particle2.build();
                particle2.setPosition(this.pig.getPosition().x,windowHeight - 80);
                this.addChild(particle2);
                particle2.velocity.x = -this.vel/2;
            }
        }else{
            this.particleAccum2 --;
        }

        if(this.first.invencibleAccum > 0 ){
            // console.log('cade a bbbbb', this.invencibleAccum % 5);
            this.vel = this.maxVel * 1.1;
            if(this.first.invencibleAccum % 5 === 0){
                // console.log('cade a porra');

                var particle3 = new Particles({x:-0.3, y:-(Math.random() * 0.2 + 0.3)}, 50, 'nacho.png', Math.random()*0.05);
                particle3.build();
                particle3.setPosition(this.first.getPosition().x - this.first.getContent().width /2 + Math.random() * this.first.getContent().width - 20,
                    this.first.getPosition().y + this.first.getContent().height / 2 - Math.random() * 40);
                particle3.velocity.x = -this.vel/8;
                this.addChild(particle3);

            }
        }
        
    },
    initApplication:function(){


        if(this.hammer){
            this.hammer.off('swipeup');

            this.hammer.off('swiperight');

            this.hammer.off('swipeleft');
        }

        this.levelCounter = 0;
        this.obstaclesAccum = 200;
        this.enemiesAccum = 600;
        this.itensAcum = 1200;
        this.waitTuUp = false;
        this.background = new SimpleSprite('sky.png');
        this.addChild(this.background);

        this.debugChildsText = new PIXI.Text('', {font:'15px Arial'});
        this.addChild(this.debugChildsText);
        this.debugChildsText.position.y = 20;
        this.debugChildsText.position.x = windowWidth - 350;

        this.accel = 0.1;
        this.maxVel = 6;
        this.maxDash = 7;
        this.vel = this.maxVel * 0.5;
        this.envArray = [];

        this.envArray.push(new Environment(windowWidth, windowHeight));
        this.envArray[this.envArray.length - 1].build(['nuvem2.png'], 600, windowHeight * 0.7);
        this.addChild(this.envArray[this.envArray.length - 1]);
        this.envArray[this.envArray.length - 1].velFactor = 0.01;

        this.envArray.push(new Environment(windowWidth, windowHeight));
        this.envArray[this.envArray.length - 1].build(['nuvem1.png'], 750, windowHeight * 0.6);
        this.addChild(this.envArray[this.envArray.length - 1]);
        this.envArray[this.envArray.length - 1].velFactor = 0.012;

        this.envArray.push(new Environment(windowWidth, windowHeight));
        this.envArray[this.envArray.length - 1].build(['montanha2.png'], 80, 75);
        this.addChild(this.envArray[this.envArray.length - 1]);
        this.envArray[this.envArray.length - 1].velFactor = 0.4;


        this.envArray.push(new Environment(windowWidth, windowHeight));
        this.envArray[this.envArray.length - 1].build(['montanha1.png'], 50, 75);
        this.addChild(this.envArray[this.envArray.length - 1]);
        this.envArray[this.envArray.length - 1].velFactor = 0.6;


        this.envArray.push(new Environment(windowWidth, windowHeight));
        this.envArray[this.envArray.length - 1].build(['cacto1.png','cacto2.png','pedra.png','cranio.png'], 300, 75);
        this.addChild(this.envArray[this.envArray.length - 1]);
        this.envArray[this.envArray.length - 1].velFactor = 0.9;


        this.envArray.push(new Environment(windowWidth, windowHeight));
        this.envArray[this.envArray.length - 1].build(['ground.png'], 0, 0);
        this.addChild(this.envArray[this.envArray.length - 1]);
        this.envArray[this.envArray.length - 1].velFactor = 1;


        // this.environment2 = new Environment(windowWidth, windowHeight);
        // this.environment2.build(['cacto1.png','cacto2.png','pedra.png','cranio.png'], 300, 75);
        // // environment2.velocity.x = -1;
        // this.addChild(this.environment2);

        // this.environment = new Environment(windowWidth, windowHeight);
        // this.environment.build(['ground.png'], 0, 0);
        // // environment.velocity.x = -1;
        // this.addChild(this.environment);


        this.layerManager = new LayerManager();
        this.layerManager.build('Main');

        this.addChild(this.layerManager);

        //adiciona uma camada
        this.layer = new Layer();
        this.layer.build('EntityLayer');
        this.layerManager.addLayer(this.layer);

        this.envObjects = [];
        


        this.playerModelCow = APP.getGameModel().playerModels[0];
        this.playerModelCow.reset();


        this.cow = new Cow(this.playerModelCow);
        this.cow.build(this);
       
        this.layer.addChild(this.cow);
        this.cow.rotation = -1;
        
        var scale = scaleConverter(this.cow.getContent().height, windowHeight, 0.25);
        this.cow.setScale( scale,scale);

        var refPos = windowHeight - 73  - this.cow.getContent().height / 2;
        this.firstPos = windowWidth * 0.33;
        console.log(this.firstPos);
        this.cow.setPosition(this.firstPos,refPos);
        this.cow.floorPos = refPos;

        this.first = this.cow;

        this.playerModelPig = APP.getGameModel().playerModels[1];
        this.playerModelPig.reset();

        this.pig = new Pig(this.playerModelPig);
        this.pig.build(this);
        var refPosPig = windowHeight - 50  - this.pig.getContent().height / 2;
        this.layer.addChild(this.pig);
        this.pig.rotation = -1;
        this.secondPos = this.firstPos - this.pig.getContent().width * 1.5;
        this.pig.setPosition(this.secondPos,refPosPig);
        this.pig.floorPos = refPosPig;

        scale = scaleConverter(this.pig.getContent().height, windowHeight, 0.15);
        this.pig.setScale( scale,scale);

        this.second = this.pig;

        this.gameOver = false;

        // this.cow.setPosition(windowWidth * 0.1 +this.cow.getContent().width/2,windowHeight /2);
        var self = this;
        var posHelper =  windowHeight * 0.05;


        this.cowEnergyBar = new EnergyBar('energyBackBar.png', 'blueBar.png', 'cowFace.png');
        this.addChild(this.cowEnergyBar);
        this.cowEnergyBar.setPosition(70 + this.cowEnergyBar.getContent().width + 20,-70);
        
        // this.cowEnergyBar.setPosition(70,50);

        this.pigEnergyBar = new EnergyBar('energyBackBar.png', 'blueBar.png', 'pigface.png');
        this.addChild(this.pigEnergyBar);
        this.pigEnergyBar.setPosition(70,-70);

        // this.pigEnergyBar.setPosition(70 + this.cowEnergyBar.getContent().width + 20,50);

        this.cowDashBar = new EnergyBar('dashBackBar.png', 'iceBar.png', 'dashIco2.png');
        this.addChild(this.cowDashBar);
        this.cowDashBar.setPosition(70 + this.cowEnergyBar.getContent().width + 80,-120);
        // this.cowDashBar.setPosition(130,100);

        this.pigDashBar = new EnergyBar('dashBackBar.png', 'goldBar.png', 'dashIco.png');
        this.addChild(this.pigDashBar);
        this.pigDashBar.setPosition(130,-120);
        // this.pigDashBar.setPosition(70 + this.cowEnergyBar.getContent().width + 80,100);



        this.pauseButton = new DefaultButton('pause.png', 'pause.png');
        this.pauseButton.build();
        this.pauseButton.setPosition( windowWidth  - 20 - this.pauseButton.width, -200);
        this.addChild(this.pauseButton);
        this.pauseButton.clickCallback = function(){
            self.updateable = false;
            self.pauseModal.show();
        };

        this.textAcc.setText(this.textAcc.text+'\nendinitApplication');

        this.dino = new Dino();
        this.dino.build();
        this.addChild(this.dino);
        this.dino.getContent().position.x = -600;
        this.dino.getContent().position.y = -200;

        this.first.spritesheet.position.x = this.firstPos - 500;
        this.second.spritesheet.position.x = this.secondPos - 500;
        TweenLite.to(this.first.spritesheet.position, 1, {delay:0.5, x:this.firstPos - 150, ease:'easeOutCubic'});
        TweenLite.to(this.second.spritesheet.position, 1, {delay:0.5, x:this.secondPos - 80, ease:'easeOutCubic'});
        TweenLite.to(this.dino.getContent().position, 2, {delay:0.8, x:-100, ease:'easeOutCubic', onComplete:function(){
            self.addListenners();
        }});

        this.container.alpha = 0;
        TweenLite.to(this.container, 0.3, {alpha:1});
        // this.addListenners();

        this.updateable = true;


        this.pauseModal = new PauseModal(this);
        this.addChild(this.pauseModal.getContent());

        this.endModal = new EndModal(this);
        this.addChild(this.endModal.getContent());

        

        // for (var i = 3; i >= 0; i--) {
        //     var particle = new Particles({x:0.3 - (Math.random() * 0.6), y:-(Math.random() * 0.2 + 0.3)}, 300 * Math.random() + 300, 'particle.png', -0.01);
        //     particle.build();
        //     particle.setPosition(windowWidth * Math.random(),(windowHeight - 60));
        //     // particle.setPosition(windowWidth * Math.random(),(windowHeight - 80) * Math.random() + 80);
        //     particle.alphadecress = 0.01;
        //     particle.scaledecress = Math.random();
        //     self.addChild(particle);
        // }
        // this.interval = setInterval(function(){
        //     var particle = new Particles({x:0.3 - (Math.random() * 0.6), y:-(Math.random() * 0.2 + 0.3)}, 300 * Math.random() + 300, 'particle.png', -0.01);
        //     particle.build();
        //     particle.setPosition(windowWidth * Math.random(),(windowHeight - 80) * Math.random() + 80);
        //     particle.alphadecress = 0.01;
        //     particle.scaledecress = Math.random();
        //     self.addChild(particle);
        // }, 1300);
    },
    addListenners:function(){
        this.vel = this.maxVel;

        this.labelPoints = new PIXI.Text('', {font:'50px Arial'});
        this.addChild(this.labelPoints);
        this.labelPoints.position.y = windowHeight - 80;
        this.labelPoints.position.x = windowWidth - 80;
        this.labelPoints.setText(0);

        var self = this;
        TweenLite.to(this.dino.getContent().position, 1.8, {x:-600, y: - 500, ease:'easeInCubic', onComplete:function(){
            self.dino.kill = true;
        }});
        TweenLite.to(this.first.spritesheet.position, 1, {delay:0.5, x:this.firstPos, ease:'easeOutCubic'});
        TweenLite.to(this.second.spritesheet.position, 1, {delay:0.5, x:this.secondPos, ease:'easeOutCubic'});
        TweenLite.to(this.cowDashBar.getContent().position, 0.8, {delay:0.7, y:100, ease:'easeOutBack'});
        TweenLite.to(this.pigDashBar.getContent().position, 0.8, {delay:0.9, y:100, ease:'easeOutBack'});
        TweenLite.to(this.cowEnergyBar.getContent().position, 0.6, {delay:1.0, y:50, ease:'easeOutBack'});
        TweenLite.to(this.pigEnergyBar.getContent().position, 0.6, {delay:1.2,y:50, ease:'easeOutBack'});
        TweenLite.to(this.pauseButton.getContent().position, 0.8, {delay:1.4,y:20, ease:'easeOutBack'});



        var swipe     = new Hammer.Swipe();
        this.hammer    = new Hammer.Manager(renderer.view);
        this.hammer.add(swipe);

        this.hammer.on('swipeup', function() {
            if(self.gameOver){
                return;
            }
            self.jump();
        });

        this.hammer.on('swiperight', function() {
            if(self.gameOver){
                return;
            }
            self.dash();
        });

        this.hammer.on('swipeleft', function() {
            if(self.gameOver){
                return;
            }
            self.change();
        });

        document.body.addEventListener('keyup', function(e){
            if(self.gameOver){
                return;
            }
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
            if(self.gameOver){
                return;
            }
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

        // function tapLeft(){
        //     if(self.leftDown){
        //         return;
        //     }
        //     self.leftDown = true;
        //     if(!self.onDash || self.onDash && self.vel < self.maxVel){
        //         self.vel = self.maxVel;
        //     }
        //     // self.testJump();
        //     self.tapAccum = 0;
        //     // self.rightDown = false;
        // }
        // function tapRight(){
        //     if(self.rightDown){
        //         return;
        //     }
        //     self.rightDown = true;
        //     if(!self.onDash || self.onDash && self.vel < self.maxVel){
        //         self.vel = self.maxVel;
        //     }
        //     // self.testJump();
        //     self.tapAccum = 0;
        //     // self.leftDown = false;
        // }


        // this.hitTouchLeft.mousedown = this.hitTouchLeft.touchstart = function(touchData){
        //     if(self.gameOver){
        //         return;
        //     }
        //     tapLeft();
        // };
        
        // this.hitTouchLeft.mouseup = this.hitTouchLeft.touchend = function(touchData){
        //     if(self.gameOver){
        //         return;
        //     }
        //     // console.log('hitTouchLeft');
        //     self.leftDown = false;
        // };

        
        // this.hitTouchRight.mousedown = this.hitTouchRight.touchstart = function(touchData){
        //     if(self.gameOver){
        //         return;
        //     }
        //     tapRight();
        // };
         
        // this.hitTouchRight.mouseup = this.hitTouchRight.touchend = function(touchData){
        //     if(self.gameOver){
        //         return;
        //     }
        //     // console.log('hitTouchRight');
        //     self.rightDown = false;
        // };

        this.textAcc.setText(this.textAcc.text+'\nbuild');
    }
});