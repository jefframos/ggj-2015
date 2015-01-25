/*jshint undef:false */
var GameEntiity = SpritesheetEntity.extend({
    init:function(playerModel, screen){
        this.playerModel = playerModel;
        this._super( true );
        this.collidable = true;
        this.range = 40;
        this.type = 'player';
        this.isFirst = false;
        this.particles = [];
        this.screen = screen;
    },
   
    setTarget:function(pos){
        this.target = pos;
        if(pointDistance(0,this.getPosition().y,0, this.target) < 4){
            return;
        }
        if(this.target < this.getPosition().y){
            this.velocity.y = -this.upVel;
        }else if(this.target > this.getPosition().y){
            this.velocity.y = this.upVel;
        }

    },
    effect:function(type, value){
        if(type === 1){
            this.playerModel.currentEnergy += this.playerModel.maxEnergy * value;
            if(this.playerModel.currentEnergy > this.playerModel.maxEnergy){
                this.playerModel.currentEnergy = this.playerModel.maxEnergy;
            }
            var particle3 = new Particles({x:-0.3, y:-(Math.random() * 1 + 0.3)}, 120, 'hp.png', 0);
            particle3.build();
            particle3.setPosition(this.getPosition().x - this.getContent().width /2 + Math.random() * this.getContent().width,
                this.getPosition().y + this.getContent().height / 2 - Math.random() * 40);
            // particle3.velocity.x = -this.getContent().parent.vel/8;
            // console.log(this.getContent().parent);
            this.screen.addChild(particle3);
            // for (var i = 12; i >= 0; i--) {
            //     var particle3 = new Particles({x:-0.3, y:-(Math.random() * 1 + 0.3)}, 120, 'particleGreen.png', 0);
            //     particle3.build();
            //     particle3.setPosition(this.getPosition().x - this.getContent().width /2 + Math.random() * this.getContent().width,
            //         this.getPosition().y + this.getContent().height / 2 - Math.random() * 40);
            //     // particle3.velocity.x = -this.getContent().parent.vel/8;
            //     // console.log(this.getContent().parent);
            //     this.screen.addChild(particle3);
            // }

        }else if(type === 2){
            this.invencibleAccum = value;
        }
    },
    hurt:function(type){
        if(this.onDash && type === this.idType ||  this.invencibleAccum > 0){
            return;
        }
        else if(this.onDash){
            var val = this.playerModel.maxEnergy * (this.playerModel.demage / 5);
            this.playerModel.currentEnergy -= val;
            if(this.playerModel.currentEnergy <= val){
                this.playerModel.currentEnergy = val;
            }

        }else{
            this.playerModel.currentEnergy -= this.playerModel.maxEnergy * this.playerModel.demage;
        }
        if(this.playerModel.currentEnergy <= 0){
            this.dead = true;
            this.collidable = false;
            this.velocity.x = -3;
            // this.updateable = false;
        }

    },
    dash:function(){

        this.spritesheet.play('dash');
        this.onDash = true;
        // if(this.inJump){
        //  return;
        // }
        // this.inJump = true;
        // this.velocity.y = -6;
    },
    jump:function(){
        if(this.inJump){
            return;
        }
        this.inJump = true;
        this.velocity.y = -6;
    },
    update:function(){

        this._super();

        if(this.dead && this.getPosition().x < -80 ){
            this.updateable = false;
        }
        if(this.playerModel && this.playerModel.currentBulletEnergy <= this.playerModel.maxBulletEnergy -this.playerModel.recoverBulletEnergy) {
            this.playerModel.currentBulletEnergy += this.playerModel.recoverBulletEnergy;
        }

        if(this.invencibleAccum > 0 ){
            // console.log('cade a bbbbb', this.invencibleAccum % 5);

            // if(this.invencibleAccum % 5 === 0){
            //     // console.log('cade a porra');

            //     var particle = new Particles({x:-0.3, y:-(Math.random() * 0.2 + 0.3)}, 50, 'particle.png', 0);
            //     particle.build();
            //     particle.setPosition(this.getPosition().x - this.getContent().width /2 + Math.random() * this.getContent().width,
            //         this.getPosition().y + this.getContent().height / 2 - Math.random() * 40);
            //     this.getContent().parent.addChild(particle.getContent());
            //     particle.velocity.x = -this.getContent().parent.vel/2;
            //     particle.alphadecress = 0.01;
            //     particle.scaledecress = Math.random();
            //     this.particles.push(particle);

            // }
            this.invencibleAccum --;
        }

        // for (var i = this.particles.length - 1; i >= 0; i--) {
        //     this.particles[i].update();
        // }
        // this.spritesheet.texture.anchor.x = 0.5;
        // this.spritesheet.texture.anchor.y = 0;
        
        // this.spritesheet.texture.rotation  = this.rotation;//(this.velocity.y * 5) * Math.PI / 180;
        // if(this.rotation > 360){
        //  this.rotation = 0;
        // }
        // TweenLite.to(this, 0.3, {rotation:(this.velocity.y * 5) * Math.PI / 180});
        // this.spritesheet.texture.rotation = this.velocity.y * Math.PI / 180;
        // this.getContent().rotation = this.velocity.y / 10;
        
        if(this.getPosition().x > windowWidth + 50){
            this.preKill();
        }
        if(this.onDash){
            this.velocity.y = 0;
            return;
        }
        this.velocity.y += this.gravity;
        if(this.getPosition().y + this.velocity.y >= this.floorPos){
            this.velocity.y = 0;
            this.inJump = false;
            this.spritesheet.play('idle');
            // console.log('idle');
            // this.setPosition(this.getPosition().x, this.floorPos);
        }
        if(this.velocity.y < 0 && this.spritesheet.currentAnimation.label !== 'jumpUp'){
            console.log('jumpUp');
            this.spritesheet.play('jumpUp');
        }else if(this.velocity.y > 0 && this.spritesheet.currentAnimation.label !== 'jumpDown'){
            console.log('jumpDown');

            this.spritesheet.play('jumpDown');
        }
    },
    destroy:function(){
        this._super();
    }
});