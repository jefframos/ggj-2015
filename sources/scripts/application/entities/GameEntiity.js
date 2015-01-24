/*jshint undef:false */
var GameEntiity = SpritesheetEntity.extend({
    init:function(playerModel){
        this.playerModel = playerModel;
        this._super( true );
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

        if(this.playerModel && this.playerModel.currentBulletEnergy <= this.playerModel.maxBulletEnergy -this.playerModel.recoverBulletEnergy) {
            this.playerModel.currentBulletEnergy += this.playerModel.recoverBulletEnergy;
        }
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