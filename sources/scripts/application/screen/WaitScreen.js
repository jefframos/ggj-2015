/*jshint undef:false */
var WaitScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();

        

        // var assetsToLoader = ['dist/img/atlas/cow.json',
        // 'dist/img/atlas/effects.json',
        // 'dist/img/atlas/pig.json',
        // 'dist/img/atlas/UI.json',
        // 'dist/img/atlas/dino.json',
        // 'dist/img/atlas/objects.json',
        // 'dist/img/atlas/environment.json'];

        var assetsToLoader = ['dist/img/atlas/splash.json'];


        if(assetsToLoader.length > 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }

        TweenLite.to(this.container, 0.5, {alpha:1});
         
    },
    onProgress:function(){
        this._super();
    },
    onAssetsLoaded:function()
    {
        this.initApplication();
    },
    initApplication:function(){
        this.bgImg = new SimpleSprite('splashBg.jpg');
        this.addChild(this.bgImg);


        this.posImg = new SimpleSprite('pos.png');
        this.addChild(this.posImg);


        this.logo = new SimpleSprite('logo.png');
        this.addChild(this.logo);
        this.logo.setPosition(windowWidth / 2 - this.logo.getContent().width / 2, windowHeight * 0.05);

        var self = this;
        this.goButton = new DefaultButton('goButton.png', 'goButtonOver.png');
        this.goButton.build(300,100);
        this.goButton.setPosition( windowWidth / 2 - this.goButton.width / 2,windowHeight / 2);
        this.addChild(this.goButton);
        this.goButton.clickCallback = function(){
            clearInterval(self.interval);
            self.screenManager.change('Game');
        };

        this.creditsButton = new DefaultButton('creditsButton.png', 'creditsButtonOver.png');
        this.creditsButton.build(300,100);
        this.creditsButton.setPosition( windowWidth / 2 - this.creditsButton.width / 2,windowHeight / 2 + 120);
        this.addChild(this.creditsButton);

        this.lights = new SimpleSprite('lights.png');
        this.addChild(this.lights);
        this.lights.setPosition(windowWidth - this.lights.getContent().width * 0.05 + 80, 150);

        function repeatTimeline(){
            tl.restart();
        }
        var tl = new TimelineLite({onComplete:repeatTimeline});
        this.lights.container.anchor.x = 0.95;
        this.lights.container.anchor.y = 0.05;
        tl.append(TweenLite.to(this.lights.container, 4, {rotation: 0.2, ease:'easeInOutCubic'}));
        tl.append(TweenLite.to(this.lights.container, 8, {rotation: -0.2, ease:'easeInOutCubic'}));
        tl.append(TweenLite.to(this.lights.container, 4, {rotation: 0, ease:'easeInOutCubic'}));

        this.frescura1 = new SimpleSprite('folhas1.png');
        this.addChild(this.frescura1);
        this.frescura1.setPosition(50, windowHeight + 10);

        function repeatTimeline2(){
            tl2.restart();
        }
        var tl2 = new TimelineLite({onComplete:repeatTimeline2});
        // this.frescura1.container.anchor.x = 0.95;
        this.frescura1.container.anchor.y = 1;
        tl2.append(TweenLite.to(this.frescura1.container, 3, {rotation: 0.2, ease:'easeInOutCubic'}));
        tl2.append(TweenLite.to(this.frescura1.container, 6, {rotation: -0.2, ease:'easeInOutCubic'}));
        tl2.append(TweenLite.to(this.frescura1.container, 3, {rotation: 0, ease:'easeInOutCubic'}));


        this.frescura2 = new SimpleSprite('folhas2.png');
        this.addChild(this.frescura2);
        this.frescura2.setPosition(windowWidth * 0.8, windowHeight + 20);

        function repeatTimeline3(){
            tl3.restart();
        }
        var tl3 = new TimelineLite({onComplete:repeatTimeline3});
        this.frescura2.container.anchor.x = 0.5;
        this.frescura2.container.anchor.y = 1;
        this.frescura2.container.scale.y = 1.5;
        tl3.append(TweenLite.to(this.frescura2.container, 3, {rotation: 0.2, ease:'easeInOutCubic'}));
        tl3.append(TweenLite.to(this.frescura2.container, 6, {rotation: -0.2, ease:'easeInOutCubic'}));
        tl3.append(TweenLite.to(this.frescura2.container, 3, {rotation: 0, ease:'easeInOutCubic'}));

        
        // // {fill:'white', align:'center', font:'12px Arial', wordWrap:true, wordWrapWidth:60}

        // this.btnBenchmark.addLabel(new PIXI.Text('Jogar', { align:'center', font:'60px Arial', wordWrap:true, wordWrapWidth:300}),70,15);
        // this.btnBenchmark.clickCallback = function(){
        //     self.screenManager.change('Choice');
        // };

        // if(possibleFullscreen()){
        //     this.fullScreen = new DefaultButton('dist/img/UI/simpleButtonUp.png', 'dist/img/UI/simpleButtonOver.png');
        //     this.fullScreen.build(40, 20);
        //     this.fullScreen.setPosition( windowWidth * 0.95 - 20,windowHeight * 0.95 - 35);
        //     this.addChild(this.fullScreen);
        //     this.fullScreen.addLabel(new PIXI.Text('Full', {font:'10px Arial'}),5,5);
        //     this.fullScreen.clickCallback = function(){
        //         fullscreen();
        //     };
        // }
        for (var i = 8; i >= 0; i--) {
            var particle = new Particles({x:0.3 - (Math.random() * 0.6), y:-(Math.random() * 0.2 + 0.3)}, 300 * Math.random() + 300, 'particle.png', -0.01);
            particle.build();
            particle.setPosition(windowWidth * Math.random(),(windowHeight - 80) * Math.random() + 80);
            particle.alphadecress = 0.01;
            particle.scaledecress = Math.random();
            self.addChild(particle);
        }
        this.interval = setInterval(function(){
            var particle = new Particles({x:0.3 - (Math.random() * 0.6), y:-(Math.random() * 0.2 + 0.3)}, 300 * Math.random() + 300, 'particle.png', -0.01);
            particle.build();
            particle.setPosition(windowWidth * Math.random(),(windowHeight - 80) * Math.random() + 80);
            particle.alphadecress = 0.01;
            particle.scaledecress = Math.random();
            self.addChild(particle);
        }, 900);
    },
    transitionOut:function(nextScreen, container)
    {
        var self = this;
        TweenLite.to(this.container, 0.5, {alpha:0, onComplete:function(){
            self.destroy();
            container.removeChild(self.getContent());
            nextScreen.transitionIn();
        }});
        
    },
});