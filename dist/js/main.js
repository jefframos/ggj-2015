/*! jefframos 25-01-2015 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var h, s, max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) h = s = 0; else {
        var d = max - min;
        switch (s = l > .5 ? d / (2 - max - min) : d / (max + min), max) {
          case r:
            h = (g - b) / d + (b > g ? 6 : 0);
            break;

          case g:
            h = (b - r) / d + 2;
            break;

          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
    }
    return {
        h: h,
        s: s,
        l: l
    };
}

function hslToRgb(h, s, l) {
    function hue2rgb(p, q, t) {
        return 0 > t && (t += 1), t > 1 && (t -= 1), 1 / 6 > t ? p + 6 * (q - p) * t : .5 > t ? q : 2 / 3 > t ? p + (q - p) * (2 / 3 - t) * 6 : p;
    }
    var r, g, b;
    if (0 === s) r = g = b = l; else {
        var q = .5 > l ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3), g = hue2rgb(p, q, h), b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(255 * r),
        g: Math.round(255 * g),
        b: Math.round(255 * b)
    };
}

function toHex(n) {
    return n = parseInt(n, 10), isNaN(n) ? "00" : (n = Math.max(0, Math.min(n, 255)), 
    "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16));
}

function rgbToHex(R, G, B) {
    return parseInt("0x" + toHex(R) + toHex(G) + toHex(B));
}

function hexToRgb(hex) {
    var r = hex >> 16, g = hex >> 8 & 255, b = 255 & hex;
    return {
        r: r,
        g: g,
        b: b
    };
}

function addSaturation(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.s *= value, hsl.s > 1 && (hsl.s = 1), hsl.s < 0 && (hsl.s = 0), rgb = hslToRgb(hsl.h, hsl.s, hsl.l), 
    rgbToHex(rgb.r, rgb.g, rgb.b);
}

function pointDistance(x, y, x0, y0) {
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
    return rad / (Math.PI / 180);
}

function scaleConverter(current, max, scale) {
    return console.log(current, max, scale), max * scale / current;
}

function testMobile() {
    return Modernizr.touch;
}

function update() {
    requestAnimFrame(update);
    var tempRation = window.innerHeight / windowHeight, ratioRez = resizeProportional ? tempRation < window.innerWidth / realWindowWidth ? tempRation : window.innerWidth / realWindowWidth : 1;
    windowWidthVar = realWindowWidth * ratioRez * ratio, windowHeightVar = realWindowHeight * ratioRez * ratio, 
    windowWidthVar > realWindowWidth && (windowWidthVar = realWindowWidth), windowHeightVar > realWindowHeight && (windowHeightVar = realWindowHeight), 
    renderer.view.style.width = windowWidthVar + "px", renderer.view.style.height = windowHeightVar + "px", 
    APP.update(), renderer.render(APP.stage);
}

function possibleFullscreen() {
    var elem = renderer.view;
    return elem.requestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
}

function fullscreen() {
    var elem = renderer.view;
    elem.requestFullscreen ? elem.requestFullscreen() : elem.msRequestFullscreen ? elem.msRequestFullscreen() : elem.mozRequestFullScreen ? elem.mozRequestFullScreen() : elem.webkitRequestFullscreen && elem.webkitRequestFullscreen();
}

var DungeonGenerator = Class.extend({
    init: function() {
        this.random = 0, this.numActivesNodes = 0, this.maxDist = 5, this.minNodes = 5, 
        this.seeds = 1, this.rooms = [], this.maxNodes = 10, this.mostDistant = new NodeModel(), 
        this.nodeLock = new NodeModel(), this.firstNode = new NodeModel(), this.keyNode = new NodeModel(), 
        this.precision = 1, this.seed = 0, this.rooms = [];
    },
    generate: function(seed, precision, minMax, bounds, maxLenght, start) {
        this.seed = seed, random = 0, 0 > maxLenght && (maxLenght = 99999), this.minNodes = minMax[0], 
        this.maxNodes = minMax[1], this.precision = precision, this.numActivesNodes = 0, 
        this.maxDist = -999999999, this.seeds = 1;
        var i = 0, j = 0;
        if (this.rooms.length <= 0) for (i = 0; i < bounds[0]; i++) {
            var temp = [];
            for (j = 0; j < bounds[1]; j++) {
                var tempModel = new NodeModel();
                tempModel.position = [ i, j ], temp.push(tempModel);
            }
            this.rooms.push(temp);
        }
        this.generateNodes(start ? start[0] : Math.floor(bounds[0] / 2), start ? start[1] : Math.floor(bounds[1] / 2), null, maxLenght), 
        this.mostDistant.mode = 4;
        var keyDistance = -9999999999;
        for (k = 0; k < this.rooms.length; k++) {
            var item = this.rooms[k];
            for (i = 0; i < item.length; i++) {
                var dist = this.pointDistance(this.mostDistant.position[0], this.mostDistant.position[1], item[i].position[0], item[i].position[1]);
                dist >= keyDistance && item[i].active && item[i].parentId > 0 && (keyDistance = dist, 
                this.keyNode = item[i]), item[i].parentId > 0 && item[i].position[0] === this.mostDistant.parentPosition[0] && item[i].position[1] === this.mostDistant.parentPosition[1] && (this.nodeLock = item[i]);
            }
        }
        this.nodeLock && (this.nodeLock.mode = 5), this.keyNode && (this.keyNode.mode = 6);
    },
    log: function() {
        for (var i = 0; i < this.rooms.length; i++) {
            for (var tempStr = "", item = this.rooms[i], j = 0; j < item.length; j++) 0 === item[j].mode && (tempStr += "| - |"), 
            1 === item[j].mode && (tempStr += "| ♥ |"), 2 === item[j].mode && (tempStr += "| o |"), 
            3 === item[j].mode && (tempStr += "| c |"), 4 === item[j].mode && (tempStr += "| b |"), 
            5 === item[j].mode && (tempStr += "| l |"), 6 === item[j].mode && (tempStr += "| K |");
            console.log(tempStr + "   " + i);
        }
        console.log(this.firstNode);
    },
    generateNodes: function(i, j, parent, maxLeght, forceAdd) {
        if (!((this.numActivesNodes >= this.maxNodes || 0 >= maxLeght) && !forceAdd || this.numActivesNodes > 50)) {
            for (var node = null, jj = 0; jj < this.rooms.length; jj++) for (var item = this.rooms[jj], ii = 0; ii < item.length; ii++) item[ii].position[0] === i && item[ii].position[1] === j && (node = item[ii]);
            if (node) {
                if (node.active && !forceAdd) return void this.minNodes++;
                if (this.minNodes--, node.mode = 2, this.numActivesNodes++, node.active = !0, node.id < 0 && (node.id = this.numActivesNodes, 
                node.seed = this.getNextFloat(), node.applySeed()), parent && 1 !== node.id) {
                    node.parentPosition = parent.position, node.parentId = parent.id, node.parent = parent;
                    var dist = this.pointDistance(parent.position[0], parent.position[1], this.firstNode.position[0], this.firstNode.position[1]);
                    for (node.dist = dist, this.maxDist <= dist && node.parentId > 2 && (this.maxDist = dist, 
                    this.mostDistant = node), node.dist = dist, ri = this.rooms.length - 1; ri >= 0; ri--) {
                        var tempNodeArray = this.rooms[ri];
                        for (nj = tempNodeArray.length - 1; nj >= 0; nj--) tempNodeArray[nj].id === node.parentId && (tempNodeArray[nj].position[1] > node.position[1] ? tempNodeArray[nj].childrenSides[0] = node : tempNodeArray[nj].position[1] < node.position[1] ? tempNodeArray[nj].childrenSides[1] = node : tempNodeArray[nj].position[0] > node.position[0] ? tempNodeArray[nj].childrenSides[2] = node : tempNodeArray[nj].position[0] < node.position[0] && (tempNodeArray[nj].childrenSides[3] = node));
                    }
                    node.parent.position[1] < node.position[1] ? node.childrenSides[0] = node.parent : node.parent.position[1] > node.position[1] ? node.childrenSides[1] = node.parent : node.parent.position[0] < node.position[0] ? node.childrenSides[2] = node.parent : node.parent.position[0] > node.position[0] && (node.childrenSides[3] = node.parent);
                } else node.id = 1, node.mode = 1, this.firstNode = node;
                var has = !1;
                if (this.getNextFloat() < this.seeds || this.minNodes > 0) {
                    this.seeds *= this.precision;
                    for (var tmpArr = [ 0, 0 ], arrayGens = [], rndTest = 1 === node.id, rndValue = rndTest ? .9 : .4, k = 0; 4 > k; k++) if (this.getNextFloat() < rndValue) {
                        has = !0, 0 === k ? tmpArr = [ -1, 0 ] : 1 === k ? tmpArr = [ 1, 0 ] : 2 === k ? tmpArr = [ 0, 1 ] : 3 === k && (tmpArr = [ 0, -1 ]);
                        var objGen = {};
                        objGen.i = i + tmpArr[0], objGen.j = j + tmpArr[1], objGen.parentPosition = [ i, j ], 
                        objGen.parent = node, arrayGens.push(objGen);
                    }
                    for (var n = arrayGens.length - 1; n >= 0; n--) {
                        var obj = arrayGens[n];
                        rndTest || maxLeght--, this.generateNodes(obj.i, obj.j, obj.parent, maxLeght, rndTest);
                    }
                    if (this.minNodes > 0 || this.seeds >= 1) {
                        var tempRnd = this.getNextFloat();
                        tmpArr = .25 > tempRnd ? [ -1, 0 ] : .5 > tempRnd ? [ 1, 0 ] : .75 > tempRnd ? [ 0, 1 ] : [ 0, -1 ], 
                        this.generateNodes(i + tmpArr[0], j + tmpArr[1], node, --maxLeght);
                    }
                }
                has || (node.mode = 3);
            }
        }
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    getNextFloat: function() {
        var x = 1e4 * Math.sin(this.seed++);
        return x - Math.floor(x);
    }
}), Float = Class.extend({
    init: function(seed) {
        this.seed = seed, this.tempAccSeed = this.seed;
    },
    applySeed: function() {
        this.tempAccSeed = this.seed;
    },
    getNextFloat: function() {
        var x = 1e4 * Math.sin(this.tempAccSeed++);
        return x - Math.floor(x);
    }
}), NodeModel = Class.extend({
    init: function() {
        this.position = [], this.dist = 0, this.parentPosition = [], this.childrenSides = [ null, null, null, null ], 
        this.parentId = -1, this.parent = null, this.active = !1, this.mode = 0, this.id = -1, 
        this.seed = -1, this.tempAccSeed = this.seed, this.bg = null, this.mapData = null, 
        this.topTile = {
            x: 0,
            y: 0
        }, this.bottomTile = {
            x: 0,
            y: 0
        }, this.leftTile = {
            x: 0,
            y: 0
        }, this.rightTile = {
            x: 0,
            y: 0
        }, this.placedTiles = [];
    },
    applySeed: function() {
        this.tempAccSeed = this.seed;
    },
    getNextFloat: function() {
        var x = 1e4 * Math.sin(this.tempAccSeed++);
        return x - Math.floor(x);
    }
}), SmartObject = Class.extend({
    init: function() {
        MicroEvent.mixin(this);
    },
    show: function() {},
    hide: function() {},
    build: function() {},
    destroy: function() {}
}), SmartSocket = Class.extend({
    init: function() {
        MicroEvent.mixin(this);
    },
    build: function() {},
    writeObj: function(obj) {
        this.trigger(SmartSocket.WRITE_OBJ, obj);
    },
    readSocketList: function(obj) {
        this.trigger(SmartSocket.READ_SOCKET_SNAPSHOT, obj);
    },
    readObj: function(obj) {
        this.trigger(SmartSocket.READ_OBJ, obj);
    },
    readLast: function(obj) {
        this.trigger(SmartSocket.READ_LAST, obj);
    },
    setReadCallback: function(callback) {
        this.readCallback = callback;
    },
    socketError: function() {
        this.trigger(SmartSocket.SOCKET_ERROR, obj);
    },
    setObj: function(obj) {
        this.trigger(SmartSocket.SET_OBJ, obj);
    },
    updateObj: function(obj) {
        this.trigger(SmartSocket.UPDATE_OBJ, obj);
    },
    destroy: function() {}
});

SmartSocket.UPDATE_OBJ = "updateObj", SmartSocket.READ_OBJ = "readObj", SmartSocket.READ_SOCKET_SNAPSHOT = "readSocketSnapshot", 
SmartSocket.READ_LAST = "readLast", SmartSocket.WRITE_OBJ = "writeObj", SmartSocket.SET_OBJ = "setObj", 
SmartSocket.SOCKET_ERROR = "socketError";

var Application = AbstractApplication.extend({
    init: function() {
        this._super(windowWidth, windowHeight), this.stage.setBackgroundColor(19784), this.stage.removeChild(this.loadText), 
        this.isMobile = testMobile(), this.appContainer = document.getElementById("rect"), 
        this.id = parseInt(1e11 * Math.random()), this.gameModel = new AppModel();
    },
    update: function() {
        this._super();
    },
    build: function() {
        this._super();
        var assetsToLoader = [];
        if (assetsToLoader.length > 0) {
            this.assetsLoader = new PIXI.AssetLoader(assetsToLoader);
            var self = this;
            this.assetsLoader.onComplete = function() {
                self.onAssetsLoaded();
            }, this.assetsLoader.onProgress = function() {
                console.log("onProgress");
            }, this.assetsLoader.load();
        } else this.onAssetsLoaded();
    },
    getGameModel: function() {
        return this.gameModel;
    },
    initApplication: function() {
        this.waitScreen = new WaitScreen("Wait"), this.gameScreen = new GameScreen("Game"), 
        this.endGameScreen = new EndGameScreen("EndGame"), this.choicePlayerScreen = new ChoicePlayerScreen("Choice"), 
        this.screenManager.addScreen(this.waitScreen), this.screenManager.addScreen(this.gameScreen), 
        this.screenManager.addScreen(this.endGameScreen), this.screenManager.addScreen(this.choicePlayerScreen), 
        this.screenManager.change("Wait");
    },
    onAssetsLoaded: function() {
        this.initApplication();
    },
    show: function() {},
    hide: function() {},
    destroy: function() {}
}), BarView = Class.extend({
    init: function(width, height, maxValue, currentValue) {
        this.maxValue = maxValue, this.text = "default", this.currentValue = currentValue, 
        this.container = new PIXI.DisplayObjectContainer(), this.width = width, this.height = height, 
        this.backShape = new PIXI.Graphics(), this.backShape.beginFill(16711680), this.backShape.drawRect(0, 0, width, height), 
        this.container.addChild(this.backShape), this.frontShape = new PIXI.Graphics(), 
        this.frontShape.beginFill(65280), this.frontShape.drawRect(0, 0, width, height), 
        this.container.addChild(this.frontShape), this.frontShape.scale.x = this.currentValue / this.maxValue;
    },
    setFrontColor: function(color) {
        this.frontShape && this.container.removeChild(this.frontShape), this.frontShape = new PIXI.Graphics(), 
        this.frontShape.beginFill(color), this.frontShape.drawRect(0, 0, this.width, this.height), 
        this.container.addChild(this.frontShape);
    },
    setBackColor: function(color) {
        this.backShape && this.container.removeChild(this.backShape), this.backShape = new PIXI.Graphics(), 
        this.backShape.beginFill(color), this.backShape.drawRect(0, 0, this.width, this.height), 
        this.container.addChildAt(this.backShape, 0);
    },
    setText: function(text) {
        this.text !== text && (this.lifebar ? this.lifebar.setText(text) : (this.lifebar = new PIXI.Text(text, {
            fill: "white",
            align: "center",
            font: "10px Arial"
        }), this.container.addChild(this.lifebar)));
    },
    updateBar: function(currentValue, maxValue) {
        (this.currentValue !== currentValue || this.maxValue !== maxValue && currentValue >= 0) && (this.currentValue = currentValue, 
        this.maxValue = maxValue, this.frontShape.scale.x = this.currentValue / this.maxValue, 
        this.frontShape.scale.x < 0 && (this.frontShape.scale.x = 0));
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), EnergyBar = Class.extend({
    init: function(backBar, bar, icoSrc) {
        this.container = new PIXI.DisplayObjectContainer(), this.barContainer = new PIXI.DisplayObjectContainer(), 
        this.backShape = new SimpleSprite(backBar), this.container.addChild(this.barContainer), 
        this.barContainer.addChild(this.backShape.container), this.frontShape = new SimpleSprite(bar), 
        this.barContainer.addChild(this.frontShape.container), this.frontShape.container.position.y = this.backShape.container.height / 2 - this.frontShape.container.height / 2, 
        this.mask = new PIXI.Graphics(), this.mask.beginFill(65280), this.mask.drawRect(0, 0, this.backShape.container.width, this.backShape.container.height), 
        this.barContainer.addChild(this.mask), this.barContainer.mask = this.mask, this.icon = new SimpleSprite(icoSrc), 
        this.icon.container.position.y = this.backShape.container.height / 2 - this.icon.container.height / 2, 
        this.icon.container.position.x = -this.icon.container.width / 2, this.container.addChild(this.icon.container), 
        console.log(this.icon.container);
    },
    updateBar: function(currentValue, maxValue) {
        if (this.currentValue !== currentValue || this.maxValue !== maxValue && currentValue >= 0) {
            this.currentValue = currentValue, this.maxValue = maxValue;
            var tempW = this.frontShape.container.width, pos = -tempW + this.currentValue / this.maxValue * this.frontShape.container.width;
            this.frontShape.container.position.x = pos;
        }
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), Bullet = Entity.extend({
    init: function(vel, timeLive) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "bullet", this.target = "enemy", this.fireType = "physical", 
        this.node = null, this.velocity.x = vel.x, this.velocity.y = vel.y, this.timeLive = timeLive, 
        this.power = 1, this.defaultVelocity = 1, this.imgSource = "cow0001.png";
    },
    build: function() {
        this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = .5, this.updateable = !0, this.collidable = !0, this.getContent().alpha = 0, 
        TweenLite.to(this.getContent(), .5, {
            alpha: 1
        });
    },
    update: function() {
        this._super(), this.velocity.x *= 1.01, this.velocity.y *= 1.01, this.layer.collideChilds(this), 
        this.getPosition().y > windowHeight - 80 && this.preKill(), this.timeLive--, this.timeLive <= 0 && this.preKill(), 
        this.range = this.width;
    },
    collide: function(arrayCollide) {
        console.log("ENEMY BATEU AQUI", arrayCollide[0]), this.collidable && "bird" === arrayCollide[0].type && (console.log(arrayCollide[0].type), 
        this.kill = !0, arrayCollide[0].preKill());
    },
    preKill: function() {
        if (this.collidable) {
            var self = this;
            this.updateable = !0, this.collidable = !1, this.fall = !0, this.velocity = {
                x: 0,
                y: 0
            }, TweenLite.to(this.getContent(), .3, {
                alpha: 0,
                onComplete: function() {
                    self.kill = !0;
                }
            });
        }
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    touch: function(collection) {
        collection.object && "environment" === collection.object.type && collection.object.fireCollide(), 
        this.preKill();
    }
}), Cupcake = SpritesheetEntity.extend({
    init: function() {
        this._super(!0);
    },
    build: function() {
        var self = this, motionIdle = new SpritesheetAnimation();
        motionIdle.build("idle", this.getFramesByRange("cupcake10", 0, 13), 1, !0, null);
        var motionRun = new SpritesheetAnimation();
        motionRun.build("run", this.getFramesByRange("cupcake10", 14, 37), 0, !0, null);
        var motionPounch = new SpritesheetAnimation();
        motionPounch.build("pounch", this.getFramesByRange("cupcake10", 38, 59), -1, !1, function() {
            self.spritesheet.play("idle");
        });
        var motionThrow = new SpritesheetAnimation();
        motionThrow.build("throw", this.getFramesByRange("cupcake10", 60, 107), -2, !1, function() {
            self.spritesheet.play("idle");
        });
        var motionHurt = new SpritesheetAnimation();
        motionHurt.build("hurt", this.getFramesByRange("cupcake10", 108, 123), -2, !1, function() {
            self.spritesheet.play("idle");
        }), this.spritesheet = new Spritesheet(), this.spritesheet.addAnimation(motionIdle), 
        this.spritesheet.addAnimation(motionRun), this.spritesheet.addAnimation(motionPounch), 
        this.spritesheet.addAnimation(motionThrow), this.spritesheet.addAnimation(motionHurt), 
        this.spritesheet.play("idle");
    },
    update: function() {
        this._super();
    },
    destroy: function() {
        this._super();
    }
}), Dino = Entity.extend({
    init: function() {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "bullet", this.target = "enemy", this.fireType = "physical", 
        this.node = null, this.power = 1, this.defaultVelocity = 1, this.imgSource = "bullet.png", 
        this.dinoContainer = new PIXI.DisplayObjectContainer(), this.container = new PIXI.DisplayObjectContainer();
    },
    build: function() {
        function repeatTimeline() {
            tl.restart();
        }
        function repeatTimeline2() {
            tlBody.restart();
        }
        function repeatTimeline3() {
            tlRun.restart();
        }
        this.dinohead = new PIXI.Sprite.fromFrame("dino1.png"), this.dinohead.anchor.x = .1, 
        this.dinohead.anchor.y = .1, this.dinoMouth = new PIXI.Sprite.fromFrame("dino2.png"), 
        this.dinoMouth.anchor.x = .1, this.dinoMouth.anchor.y = .1, this.dinoContainer.addChild(this.dinoMouth), 
        this.dinoContainer.addChild(this.dinohead), this.updateable = !0, this.collidable = !0, 
        this.getContent().alpha = 0, TweenLite.to(this.getContent(), .5, {
            alpha: 1
        }), this.dinoMouth.position.x = 30, this.dinoMouth.position.y = 260;
        var tl = new TimelineLite({
            onComplete: repeatTimeline
        });
        tl.append(TweenLite.to(this.dinoMouth, 2, {
            rotation: .2,
            ease: "easeInOutCubic"
        })), tl.append(TweenLite.to(this.dinoMouth, 2, {
            rotation: -.2,
            ease: "easeInOutCubic"
        }));
        var tlBody = new TimelineLite({
            onComplete: repeatTimeline2
        });
        tlBody.append(TweenLite.to(this.dinoContainer, 2, {
            rotation: .05,
            ease: "easeOutCubic"
        })), tlBody.append(TweenLite.to(this.dinoContainer, 4, {
            rotation: -.05,
            ease: "easeInCubic"
        })), tlBody.append(TweenLite.to(this.dinoContainer, 2, {
            rotation: 0,
            ease: "easeOutCubic"
        })), tlBody.append(TweenLite.to(this.dinoContainer, 3, {
            rotation: .05
        }));
        var tlRun = new TimelineLite({
            onComplete: repeatTimeline3
        });
        tlRun.append(TweenLite.to(this.dinoContainer.position, .3, {
            y: 20,
            ease: "easeOutCubic"
        })), tlRun.append(TweenLite.to(this.dinoContainer.position, 1.2, {
            y: -10,
            ease: "easeInCubic"
        })), tlRun.append(TweenLite.to(this.dinoContainer.position, .6, {
            y: 20,
            ease: "easeOutCubic"
        })), tlRun.append(TweenLite.to(this.dinoContainer.position, .6, {
            y: -10
        })), this.container.addChild(this.dinoContainer);
    },
    getContent: function() {
        return this.container;
    },
    update: function() {}
}), GameEntiity = SpritesheetEntity.extend({
    init: function(playerModel) {
        this.playerModel = playerModel, this._super(!0), this.collidable = !0, this.range = 40, 
        this.type = "player", this.isFirst = !1;
    },
    setTarget: function(pos) {
        this.target = pos, pointDistance(0, this.getPosition().y, 0, this.target) < 4 || (this.target < this.getPosition().y ? this.velocity.y = -this.upVel : this.target > this.getPosition().y && (this.velocity.y = this.upVel));
    },
    hurt: function(type) {
        if (!this.onDash || type !== this.idType) {
            if (this.onDash) {
                var val = this.playerModel.maxEnergy * (this.playerModel.demage / 5);
                this.playerModel.currentEnergy -= val, this.playerModel.currentEnergy <= val && (this.playerModel.currentEnergy = val);
            } else this.playerModel.currentEnergy -= this.playerModel.maxEnergy * this.playerModel.demage;
            this.playerModel.currentEnergy <= 0 && (this.dead = !0, this.collidable = !1, this.velocity.x = -3);
        }
    },
    dash: function() {
        this.spritesheet.play("dash"), this.onDash = !0;
    },
    jump: function() {
        this.inJump || (this.inJump = !0, this.velocity.y = -6);
    },
    update: function() {
        return this._super(), this.dead && this.getPosition().x < -80 && (this.updateable = !1), 
        this.playerModel && this.playerModel.currentBulletEnergy <= this.playerModel.maxBulletEnergy - this.playerModel.recoverBulletEnergy && (this.playerModel.currentBulletEnergy += this.playerModel.recoverBulletEnergy), 
        this.getPosition().x > windowWidth + 50 && this.preKill(), this.onDash ? void (this.velocity.y = 0) : (this.velocity.y += this.gravity, 
        this.getPosition().y + this.velocity.y >= this.floorPos && (this.velocity.y = 0, 
        this.inJump = !1, this.spritesheet.play("idle")), void (this.velocity.y < 0 && "jumpUp" !== this.spritesheet.currentAnimation.label ? (console.log("jumpUp"), 
        this.spritesheet.play("jumpUp")) : this.velocity.y > 0 && "jumpDown" !== this.spritesheet.currentAnimation.label && (console.log("jumpDown"), 
        this.spritesheet.play("jumpDown"))));
    },
    destroy: function() {
        this._super();
    }
}), Obstacle = Entity.extend({
    init: function(type, source, brekeable) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "bullet", this.target = "enemy", this.fireType = "physical", 
        this.node = null, this.power = 1, this.defaultVelocity = 1, this.imgSource = source, 
        this.velFactor = 1, this.idType = type, this.brekeable = brekeable;
    },
    build: function() {
        this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = 1, this.updateable = !0, this.collidable = !0;
    },
    update: function() {
        this._super(), this.layer.collideChilds(this), this.getPosition().x < -this.sprite.width && (this.kill = !0), 
        this.range = this.sprite.width / 2;
    },
    collide: function(arrayCollide) {
        this.collidable && "player" === arrayCollide[0].type && arrayCollide[0].isFirst && (this.kill = this.brekeable, 
        console.log(this.kill), this.collidable = !1, arrayCollide[0].hurt(this.idType));
    },
    preKill: function() {
        if (this.collidable) {
            var self = this;
            this.updateable = !0, this.collidable = !1, this.fall = !0, this.velocity = {
                x: 0,
                y: 0
            }, TweenLite.to(this.getContent(), .3, {
                alpha: 0,
                onComplete: function() {
                    self.kill = !0;
                }
            });
        }
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    touch: function(collection) {
        collection.object && "environment" === collection.object.type && collection.object.fireCollide(), 
        this.preKill();
    }
}), Cow = GameEntiity.extend({
    build: function(screen, floorPos) {
        var motionIdle = new SpritesheetAnimation();
        motionIdle.build("idle", this.getFramesByRange("cow0", 1, 30, "", ".png"), 0, !0, null);
        var jumpUp = new SpritesheetAnimation();
        jumpUp.build("jumpUp", [ "cowup.png" ], 4, !1, null);
        var dashMotion = new SpritesheetAnimation();
        dashMotion.build("dash", [ "cowdash.png" ], 1, !1, null);
        var jumpDown = new SpritesheetAnimation();
        jumpDown.build("jumpDown", [ "cowndown.png" ], 4, !1, null), this.spritesheet = new Spritesheet(), 
        this.spritesheet.addAnimation(motionIdle), this.spritesheet.addAnimation(jumpDown), 
        this.spritesheet.addAnimation(jumpUp), this.spritesheet.addAnimation(dashMotion), 
        this.spritesheet.play("jumpUp"), this.screen = screen, this.floorPos = floorPos, 
        this.defaultVel = 50 * gameScale, this.upVel = this.playerModel.velocity * gameScale, 
        this.spritesheet.texture.anchor.x = .5, this.spritesheet.texture.anchor.y = .5, 
        this.rotation = 0, this.gravity = .2, this.idType = 1;
    },
    dash: function(isFirst) {
        this._super(), isFirst && (this.dashGraphic = new PIXI.Sprite(PIXI.Texture.fromFrame("dashvaca.png")), 
        this.dashGraphic.anchor.x = .9, this.dashGraphic.anchor.y = .5, console.log(this.dashGraphic), 
        this.getContent().parent.addChild(this.dashGraphic), this.dashGraphic.scale.x = this.getContent().scale.x - .5, 
        this.dashGraphic.scale.y = this.getContent().scale.y - .2, this.dashGraphic.position.x = this.getPosition().x, 
        this.dashGraphic.position.y = this.getPosition().y, TweenLite.to(this.dashGraphic.scale, .2, {
            x: this.getContent().scale.x,
            y: this.getContent().scale.y
        }), TweenLite.to(this.dashGraphic.scale, .3, {
            delay: .5,
            x: .2,
            y: .7 * this.dashGraphic.scale.y
        }), TweenLite.to(this.dashGraphic.position, .3, {
            delay: .5,
            x: this.getPosition().x - 230
        }), TweenLite.to(this.dashGraphic, .3, {
            delay: .45,
            alpha: 0
        }));
    }
}), Pig = GameEntiity.extend({
    build: function(screen, floorPos) {
        var motionIdle = new SpritesheetAnimation();
        motionIdle.build("idle", this.getFramesByRange("pig0", 1, 23, "", ".png"), 0, !0, null);
        var jumpUp = new SpritesheetAnimation();
        jumpUp.build("jumpUp", [ "pig0026.png" ], 4, !1, null);
        var dashMotion = new SpritesheetAnimation();
        dashMotion.build("dash", [ "pig0028.png" ], 1, !1, null);
        var jumpDown = new SpritesheetAnimation();
        jumpDown.build("jumpDown", [ "pig0027.png" ], 4, !1, null), this.spritesheet = new Spritesheet(), 
        this.spritesheet.addAnimation(motionIdle), this.spritesheet.addAnimation(jumpDown), 
        this.spritesheet.addAnimation(jumpUp), this.spritesheet.addAnimation(dashMotion), 
        this.spritesheet.play("jumpUp"), this.screen = screen, this.floorPos = floorPos, 
        this.defaultVel = 50 * gameScale, this.upVel = this.playerModel.velocity * gameScale, 
        this.spritesheet.texture.anchor.x = .5, this.spritesheet.texture.anchor.y = .5, 
        this.rotation = 0, this.gravity = .2, this.idType = 2;
    },
    dash: function(isFirst) {
        this._super(), isFirst && (this.dashGraphic = new PIXI.Sprite(PIXI.Texture.fromFrame("dashpig.png")), 
        this.dashGraphic.anchor.x = .95, this.dashGraphic.anchor.y = .5, console.log(this.dashGraphic), 
        this.getContent().parent.addChild(this.dashGraphic), this.dashGraphic.scale.x = this.getContent().scale.x - .5, 
        this.dashGraphic.scale.y = this.getContent().scale.y - .2, this.dashGraphic.position.x = this.getPosition().x, 
        this.dashGraphic.position.y = this.getPosition().y, TweenLite.to(this.dashGraphic.scale, .2, {
            x: this.getContent().scale.x,
            y: this.getContent().scale.y
        }), TweenLite.to(this.dashGraphic.scale, .3, {
            delay: .5,
            x: .2,
            y: .7 * this.dashGraphic.scale.y
        }), TweenLite.to(this.dashGraphic.position, .3, {
            delay: .5,
            x: this.getPosition().x - 230
        }), TweenLite.to(this.dashGraphic, .3, {
            delay: .45,
            alpha: 0
        }));
    }
}), AppModel = Class.extend({
    init: function() {
        this.currentPlayerModel = {}, this.playerModels = [ new PlayerModel(.04, .8, 2, 1.15, 1), new PlayerModel(.04, .7, 1.5, 1.2, 2) ], 
        this.objects = [ [ "ice1.png", 1, !0 ], [ "ice2.png", 1, !0 ], [ "rock1.png", 2, !0 ], [ "rock2.png", 2, !0 ], [ "colide_cacto1.png", 3, !1 ], [ "colide_cacto2.png", 3, !1 ], [ "colide_espinho1.png", 3, !1 ], [ "colide_espinho2.png", 3, !1 ] ], 
        this.setModel(0);
    },
    setModel: function(id) {
        this.currentID = id, this.currentPlayerModel = this.playerModels[id];
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), PlayerModel = Class.extend({
    init: function(ecoast, bcoast, vel, demage, bforce) {
        this.range = 40, this.maxEnergy = 100, this.maxBulletEnergy = 100, this.currentEnergy = 100, 
        this.currentBulletEnergy = 100, this.recoverBulletEnergy = .5, this.chargeBullet = 2, 
        this.currentBulletForce = 100, this.recoverEnergy = .5, this.energyCoast = ecoast ? ecoast : .002, 
        this.bulletCoast = bcoast ? bcoast : .2, this.velocity = vel ? vel : 2, this.demage = demage ? demage : .2, 
        this.bulletForce = bforce ? bforce : 1;
    },
    reset: function() {
        this.currentEnergy = this.maxEnergy, this.currentBulletEnergy = this.maxBulletEnergy;
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), ChoicePlayerScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label);
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var assetsToLoader = [];
        assetsToLoader.length > 0 ? (this.loader = new PIXI.AssetLoader(assetsToLoader), 
        this.initLoad()) : this.onAssetsLoaded();
    },
    onProgress: function() {
        this._super();
    },
    onAssetsLoaded: function() {
        this.initApplication();
    },
    initApplication: function() {
        var self = this;
        this.char1 = new DefaultButton("dist/img/UI/simpleButtonUp.png", "dist/img/UI/simpleButtonOver.png"), 
        this.char1.build(300, 70), this.char1.setPosition(windowWidth / 2 - this.char1.width / 2, windowHeight / 2), 
        this.addChild(this.char1), this.currentID = APP.getGameModel().currentID, this.char1.addLabel(new PIXI.Text("Piangers", {
            align: "center",
            font: "40px Arial",
            wordWrap: !0,
            wordWrapWidth: 300
        }), 20, 15), this.char1.clickCallback = function() {
            0 !== self.currentID && (APP.getGameModel().setModel(0), self.updatePlayers());
        }, this.char2 = new DefaultButton("dist/img/UI/simpleButtonUp.png", "dist/img/UI/simpleButtonOver.png"), 
        this.char2.build(300, 70), this.char2.setPosition(windowWidth / 2 - this.char2.width / 2, windowHeight / 2 + 90), 
        this.addChild(this.char2), this.char2.addLabel(new PIXI.Text("Feter", {
            align: "center",
            font: "40px Arial",
            wordWrap: !0,
            wordWrapWidth: 300
        }), 15, 15), this.char2.clickCallback = function() {
            1 !== self.currentID && (APP.getGameModel().setModel(1), self.updatePlayers());
        }, this.char3 = new DefaultButton("dist/img/UI/simpleButtonUp.png", "dist/img/UI/simpleButtonOver.png"), 
        this.char3.build(300, 70), this.char3.setPosition(windowWidth / 2 - this.char3.width / 2, windowHeight / 2 + 180), 
        this.addChild(this.char3), this.char3.addLabel(new PIXI.Text("Neto", {
            align: "center",
            font: "40px Arial",
            wordWrap: !0,
            wordWrapWidth: 300
        }), 15, 15), this.char3.clickCallback = function() {
            2 !== self.currentID && (APP.getGameModel().setModel(2), self.updatePlayers());
        }, this.play = new DefaultButton("dist/img/UI/simpleButtonUp.png", "dist/img/UI/simpleButtonOver.png"), 
        this.play.build(120, 70), this.play.setPosition(.95 * windowWidth - this.play.width, windowHeight / 2 + 120), 
        this.addChild(this.play), this.play.addLabel(new PIXI.Text("PLAY", {
            align: "center",
            font: "35px Arial",
            wordWrap: !0,
            wordWrapWidth: 300
        }), 15, 15), this.play.clickCallback = function() {
            self.screenManager.change("Game");
        }, this.returnButton = new DefaultButton("dist/img/UI/simpleButtonUp.png", "dist/img/UI/simpleButtonOver.png"), 
        this.returnButton.build(60, 80), this.returnButton.setPosition(.05 * windowWidth, .95 * windowHeight - 65), 
        this.addChild(this.returnButton), this.returnButton.addLabel(new PIXI.Text("<", {
            font: "70px Arial"
        }), 5, 5), this.returnButton.clickCallback = function() {
            self.screenManager.change("Wait");
        }, this.updatePlayers();
    },
    updatePlayers: function() {
        console.log(this.currentID, APP.getGameModel().currentID), this.currentID = APP.getGameModel().currentID, 
        this.playerImg && this.playerImg.getContent().parent && this.playerImg.getContent().parent.removeChild(this.playerImg.getContent()), 
        this.playerImg = new SimpleSprite(APP.getGameModel().currentPlayerModel.imgSource), 
        this.playerImg.container.anchor.x = .5, this.playerImg.container.anchor.y = .5, 
        this.addChild(this.playerImg), this.playerImg.setPosition(windowWidth / 2, 250 - this.playerImg.container.height / 2), 
        TweenLite.from(this.playerImg.getContent().position, .5, {
            y: 250 - this.playerImg.container.height / 2 - 50
        }), TweenLite.from(this.playerImg.getContent(), .5, {
            alpha: 0
        });
    }
}), EndGameScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label);
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var assetsToLoader = [];
        assetsToLoader.length > 0 ? (this.loader = new PIXI.AssetLoader(assetsToLoader), 
        this.initLoad()) : this.onAssetsLoaded();
    },
    onProgress: function() {
        this._super();
    },
    onAssetsLoaded: function() {
        this.initApplication();
    },
    initApplication: function() {
        var self = this;
        this.btnBenchmark = new DefaultButton("dist/img/UI/simpleButtonUp.png", "dist/img/UI/simpleButtonOver.png"), 
        this.btnBenchmark.build(300, 120), this.btnBenchmark.setPosition(windowWidth / 2 - this.btnBenchmark.width / 2, windowHeight / 2), 
        this.addChild(this.btnBenchmark), this.btnBenchmark.addLabel(new PIXI.Text("REINIT", {
            font: "50px Arial"
        }), 25, 15), this.btnBenchmark.clickCallback = function() {
            self.screenManager.change("Game");
        };
    }
}), GameScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label);
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super(), this.textAcc = new PIXI.Text("", {
            font: "15px Arial"
        }), this.addChild(this.textAcc), this.textAcc.position.y = 20, this.textAcc.position.x = windowWidth - 150;
        var assetsToLoader = [ "dist/img/atlas/cow.json", "dist/img/atlas/effects.json", "dist/img/atlas/pig.json", "dist/img/atlas/UI.json", "dist/img/atlas/dino.json", "dist/img/atlas/objects.json", "dist/img/atlas/environment.json" ];
        assetsToLoader.length > 0 ? (this.loader = new PIXI.AssetLoader(assetsToLoader), 
        this.textAcc.setText(this.textAcc.text + "\ninitLoad"), this.initLoad()) : this.onAssetsLoaded(), 
        this.particleAccum = 50, this.particleAccum2 = 40, this.gameOver = !1;
        this.leftDown = !1, this.rightDown = !1, this.tapAccum = 0, this.updateable = !1, 
        this.levelCounter = 0, this.waitTuUp = !1;
    },
    onProgress: function() {
        this._super(), this.textAcc.setText(this.loadPercent);
    },
    onAssetsLoaded: function() {
        this.textAcc.setText(this.textAcc.text + "\nAssetsLoaded"), this.initApplication();
    },
    update: function() {
        if (this.updateable) {
            this.labelPoints && (this.levelCounter++, this.labelPoints.setText(Math.floor(this.levelCounter)), 
            this.waitTuUp && !this.onDash && (this.waitTuUp = !1, this.maxVel++, this.vel = this.maxVel), 
            this.levelCounter % 100 === 0 && (console.log(this.levelCounter % 100 && this.maxVel < 10), 
            this.onDash ? this.waitTuUp = !0 : (this.maxVel++, this.vel = this.maxVel))), this._super();
            var i;
            if (this.envArray) for (i = this.envArray.length - 1; i >= 0; i--) this.envArray[i].velocity.x = -this.vel * this.envArray[i].velFactor;
            if (this.gameOver) return void this.endModal.show();
            if ((this.cowDashBar || this.pigDashBar) && (this.updateParticles(), this.updateObstacles(), 
            this.updateEnemies()), this.vel > this.maxVel && (this.vel -= this.accel, this.onDash && (this.vel -= 5 * this.accel), 
            this.vel < this.maxVel && (this.vel = this.maxVel, this.onDash = !1, this.first.onDash = !1, 
            this.second.onDash = !1)), this.envObjects) for (i = this.envObjects.length - 1; i >= 0; i--) this.envObjects[i].velocity.x = -this.vel * this.envObjects[i].velFactor;
            if (this.cowDashBar && this.cowDashBar.updateBar(this.cow.playerModel.currentBulletEnergy, this.cow.playerModel.maxBulletEnergy), 
            this.cowEnergyBar && this.cowEnergyBar.updateBar(this.cow.playerModel.currentEnergy, this.cow.playerModel.maxEnergy), 
            this.pigDashBar && this.pigDashBar.updateBar(this.pig.playerModel.currentBulletEnergy, this.pig.playerModel.maxBulletEnergy), 
            this.pigEnergyBar && this.pigEnergyBar.updateBar(this.pig.playerModel.currentEnergy, this.pig.playerModel.maxEnergy), 
            this.energyBar && this.energyBar.updateBar(this.cow.playerModel.currentBulletEnergy, this.cow.playerModel.maxBulletEnergy), 
            this.first) {
                if (this.first.dead && !this.second.dead) {
                    var temp = this.first;
                    this.first = this.second, this.second = temp;
                }
                this.first.dead && this.second.dead && (this.gameOver = !0), this.first.isFirst = !0, 
                this.second.isFirst = !1;
            }
            if (this.debugChildsText) {
                var k;
                for (this.childsCounter = 0, k = this.childs.length - 1; k >= 0; k--) this.recursiveCounter(this.childs[k]), 
                this.childsCounter++;
                this.debugChildsText.setText(this.childs.length + " - " + this.childsCounter);
            }
        }
    },
    resetGame: function() {
        this.destroy(), this.initApplication();
    },
    recursiveCounter: function(obj) {
        if (obj.children) for (j = obj.children.length - 1; j >= 0; j--) this.childsCounter++, 
        this.recursiveCounter(obj.children[j]); else {
            if (!obj.childs) return;
            for (j = obj.childs.length - 1; j >= 0; j--) this.childsCounter++, this.recursiveCounter(obj.childs[j]);
        }
    },
    dash: function() {
        if (!(this.first.playerModel.currentBulletEnergy < this.first.playerModel.maxBulletEnergy * this.first.playerModel.bulletCoast)) {
            this.first.playerModel.currentBulletEnergy -= this.first.playerModel.maxBulletEnergy * this.first.playerModel.bulletCoast, 
            this.first.playerModel.currentBulletEnergy < 0 && (this.first.playerModel.currentBulletEnergy = 0), 
            this.vel = 6 * this.maxDash, this.onDash = !0, this.leftDown = !1, this.rightDown = !1, 
            this.first.dash(!0);
            var self = this;
            setTimeout(function() {
                self.second.dash(!1);
            }, 400);
        }
    },
    change: function() {
        if (!this.first.dead && !this.second.dead) {
            var temp = this.first;
            this.first = this.second, this.second = temp;
            {
                this.first.getPosition().x;
            }
            TweenLite.to(this.first.spritesheet.position, .5, {
                x: this.firstPos,
                ease: "easeOutCubic"
            }), TweenLite.to(this.second.spritesheet.position, .5, {
                x: this.secondPos,
                ease: "easeInCubic"
            });
        }
    },
    jump: function() {
        if (!this.onDash) {
            this.first.jump();
            var self = this;
            setTimeout(function() {
                self.second.jump();
            }, 400);
        }
    },
    updateEnemies: function() {
        if (this.enemiesAccum < 0) {
            var angle = (70 + 70 * Math.random()) * Math.PI / 180, bulletVel = 7, bullet = new Bullet({
                x: Math.cos(angle) * bulletVel - this.vel / 2,
                y: Math.sin(angle) * bulletVel
            });
            bullet.build(), bullet.setPosition(windowWidth, .05 * windowHeight), this.layer.addChild(bullet), 
            this.enemiesAccum = 500;
        } else this.enemiesAccum--;
    },
    updateObstacles: function() {
        return;
    },
    updateParticles: function() {
        if (this.particleAccum < 0) {
            if (this.particleAccum = 15 + 20 * Math.random(), 0 === this.cow.velocity.y) {
                var particle = new Particles({
                    x: -.3,
                    y: -(.2 * Math.random() + .3)
                }, 50, "smoke1.png", -.01);
                particle.build(), particle.setPosition(this.cow.getPosition().x, windowHeight - 80), 
                this.addChild(particle), particle.velocity.x = -this.vel / 2;
            }
        } else this.particleAccum--;
        if (this.particleAccum2 < 0) {
            if (this.particleAccum2 = 15 + 20 * Math.random(), 0 === this.pig.velocity.y) {
                var particle2 = new Particles({
                    x: -.3,
                    y: -(.2 * Math.random() + .3)
                }, 50, "smoke1.png", -.01);
                particle2.build(), particle2.setPosition(this.pig.getPosition().x, windowHeight - 80), 
                this.addChild(particle2), particle2.velocity.x = -this.vel / 2;
            }
        } else this.particleAccum2--;
    },
    initApplication: function() {
        this.hammer && (this.hammer.off("swipeup"), this.hammer.off("swiperight"), this.hammer.off("swipeleft")), 
        this.levelCounter = 0, this.obstaclesAccum = 200, this.enemiesAccum = 200, this.waitTuUp = !1, 
        this.background = new SimpleSprite("sky.png"), this.addChild(this.background), this.debugChildsText = new PIXI.Text("", {
            font: "15px Arial"
        }), this.addChild(this.debugChildsText), this.debugChildsText.position.y = 20, this.debugChildsText.position.x = windowWidth - 350, 
        this.accel = .1, this.maxVel = 7, this.maxDash = 7, this.vel = .5 * this.maxVel, 
        this.envArray = [], this.envArray.push(new Environment(windowWidth, windowHeight)), 
        this.envArray[this.envArray.length - 1].build([ "nuvem2.png" ], 600, .7 * windowHeight), 
        this.addChild(this.envArray[this.envArray.length - 1]), this.envArray[this.envArray.length - 1].velFactor = .01, 
        this.envArray.push(new Environment(windowWidth, windowHeight)), this.envArray[this.envArray.length - 1].build([ "nuvem1.png" ], 750, .6 * windowHeight), 
        this.addChild(this.envArray[this.envArray.length - 1]), this.envArray[this.envArray.length - 1].velFactor = .012, 
        this.envArray.push(new Environment(windowWidth, windowHeight)), this.envArray[this.envArray.length - 1].build([ "montanha2.png" ], 80, 75), 
        this.addChild(this.envArray[this.envArray.length - 1]), this.envArray[this.envArray.length - 1].velFactor = .4, 
        this.envArray.push(new Environment(windowWidth, windowHeight)), this.envArray[this.envArray.length - 1].build([ "montanha1.png" ], 50, 75), 
        this.addChild(this.envArray[this.envArray.length - 1]), this.envArray[this.envArray.length - 1].velFactor = .6, 
        this.envArray.push(new Environment(windowWidth, windowHeight)), this.envArray[this.envArray.length - 1].build([ "cacto1.png", "cacto2.png", "pedra.png", "cranio.png" ], 300, 75), 
        this.addChild(this.envArray[this.envArray.length - 1]), this.envArray[this.envArray.length - 1].velFactor = .9, 
        this.envArray.push(new Environment(windowWidth, windowHeight)), this.envArray[this.envArray.length - 1].build([ "ground.png" ], 0, 0), 
        this.addChild(this.envArray[this.envArray.length - 1]), this.envArray[this.envArray.length - 1].velFactor = 1, 
        this.layerManager = new LayerManager(), this.layerManager.build("Main"), this.addChild(this.layerManager), 
        this.layer = new Layer(), this.layer.build("EntityLayer"), this.layerManager.addLayer(this.layer), 
        this.envObjects = [], this.playerModelCow = APP.getGameModel().playerModels[0], 
        this.playerModelCow.reset(), this.cow = new Cow(this.playerModelCow), this.cow.build(this), 
        this.layer.addChild(this.cow), this.cow.rotation = -1;
        var scale = scaleConverter(this.cow.getContent().height, windowHeight, .25);
        this.cow.setScale(scale, scale);
        var refPos = windowHeight - 73 - this.cow.getContent().height / 2;
        this.firstPos = .33 * windowWidth, console.log(this.firstPos), this.cow.setPosition(this.firstPos, refPos), 
        this.cow.floorPos = refPos, this.first = this.cow, this.playerModelPig = APP.getGameModel().playerModels[1], 
        this.playerModelPig.reset(), this.pig = new Pig(this.playerModelPig), this.pig.build(this);
        var refPosPig = windowHeight - 50 - this.pig.getContent().height / 2;
        this.layer.addChild(this.pig), this.pig.rotation = -1, this.secondPos = this.firstPos - 1.5 * this.pig.getContent().width, 
        this.pig.setPosition(this.secondPos, refPosPig), this.pig.floorPos = refPosPig, 
        scale = scaleConverter(this.pig.getContent().height, windowHeight, .15), this.pig.setScale(scale, scale), 
        this.second = this.pig, this.gameOver = !1;
        var self = this;
        this.cowEnergyBar = new EnergyBar("energyBackBar.png", "blueBar.png", "cowFace.png"), 
        this.addChild(this.cowEnergyBar), this.cowEnergyBar.setPosition(70 + this.cowEnergyBar.getContent().width + 20, -70), 
        this.pigEnergyBar = new EnergyBar("energyBackBar.png", "blueBar.png", "pigface.png"), 
        this.addChild(this.pigEnergyBar), this.pigEnergyBar.setPosition(70, -70), this.cowDashBar = new EnergyBar("dashBackBar.png", "iceBar.png", "dashIco2.png"), 
        this.addChild(this.cowDashBar), this.cowDashBar.setPosition(70 + this.cowEnergyBar.getContent().width + 80, -120), 
        this.pigDashBar = new EnergyBar("dashBackBar.png", "goldBar.png", "dashIco.png"), 
        this.addChild(this.pigDashBar), this.pigDashBar.setPosition(130, -120), this.pauseButton = new DefaultButton("pause.png", "pause.png"), 
        this.pauseButton.build(), this.pauseButton.setPosition(windowWidth - 20 - this.pauseButton.width, -200), 
        this.addChild(this.pauseButton), this.pauseButton.clickCallback = function() {
            self.updateable = !1, self.pauseModal.show();
        }, this.textAcc.setText(this.textAcc.text + "\nendinitApplication"), this.dino = new Dino(), 
        this.dino.build(), this.addChild(this.dino), this.dino.getContent().position.x = -600, 
        this.dino.getContent().position.y = -200, this.first.spritesheet.position.x = this.firstPos - 500, 
        this.second.spritesheet.position.x = this.secondPos - 500, TweenLite.to(this.first.spritesheet.position, 1, {
            delay: .5,
            x: this.firstPos - 150,
            ease: "easeOutCubic"
        }), TweenLite.to(this.second.spritesheet.position, 1, {
            delay: .5,
            x: this.secondPos - 80,
            ease: "easeOutCubic"
        }), TweenLite.to(this.dino.getContent().position, 2, {
            delay: .8,
            x: -100,
            ease: "easeOutCubic",
            onComplete: function() {
                self.addListenners();
            }
        }), this.container.alpha = 0, TweenLite.to(this.container, .3, {
            alpha: 1
        }), this.updateable = !0, this.pauseModal = new PauseModal(this), this.addChild(this.pauseModal.getContent()), 
        this.endModal = new EndModal(this), this.addChild(this.endModal.getContent());
        for (var i = 3; i >= 0; i--) {
            var particle = new Particles({
                x: .3 - .6 * Math.random(),
                y: -(.2 * Math.random() + .3)
            }, 300 * Math.random() + 300, "particle.png", -.01);
            particle.build(), particle.setPosition(windowWidth * Math.random(), windowHeight - 60), 
            particle.alphadecress = .01, particle.scaledecress = Math.random(), self.addChild(particle);
        }
        this.interval = setInterval(function() {
            var particle = new Particles({
                x: .3 - .6 * Math.random(),
                y: -(.2 * Math.random() + .3)
            }, 300 * Math.random() + 300, "particle.png", -.01);
            particle.build(), particle.setPosition(windowWidth * Math.random(), (windowHeight - 80) * Math.random() + 80), 
            particle.alphadecress = .01, particle.scaledecress = Math.random(), self.addChild(particle);
        }, 1300);
    },
    addListenners: function() {
        this.vel = this.maxVel, this.labelPoints = new PIXI.Text("", {
            font: "50px Arial"
        }), this.addChild(this.labelPoints), this.labelPoints.position.y = windowHeight - 80, 
        this.labelPoints.position.x = windowWidth - 80, this.labelPoints.setText(0);
        var self = this;
        TweenLite.to(this.dino.getContent().position, 1.8, {
            x: -600,
            y: -500,
            ease: "easeInCubic",
            onComplete: function() {
                self.dino.kill = !0;
            }
        }), TweenLite.to(this.first.spritesheet.position, 1, {
            delay: .5,
            x: this.firstPos,
            ease: "easeOutCubic"
        }), TweenLite.to(this.second.spritesheet.position, 1, {
            delay: .5,
            x: this.secondPos,
            ease: "easeOutCubic"
        }), TweenLite.to(this.cowDashBar.getContent().position, .8, {
            delay: .7,
            y: 100,
            ease: "easeOutBack"
        }), TweenLite.to(this.pigDashBar.getContent().position, .8, {
            delay: .9,
            y: 100,
            ease: "easeOutBack"
        }), TweenLite.to(this.cowEnergyBar.getContent().position, .6, {
            delay: 1,
            y: 50,
            ease: "easeOutBack"
        }), TweenLite.to(this.pigEnergyBar.getContent().position, .6, {
            delay: 1.2,
            y: 50,
            ease: "easeOutBack"
        }), TweenLite.to(this.pauseButton.getContent().position, .8, {
            delay: 1.4,
            y: 20,
            ease: "easeOutBack"
        });
        var swipe = new Hammer.Swipe();
        this.hammer = new Hammer.Manager(renderer.view), this.hammer.add(swipe), this.hammer.on("swipeup", function() {
            self.gameOver || self.jump();
        }), this.hammer.on("swiperight", function() {
            self.gameOver || self.dash();
        }), this.hammer.on("swipeleft", function() {
            self.gameOver || self.change();
        }), document.body.addEventListener("keyup", function(e) {
            self.gameOver || 87 === e.keyCode || 38 === e.keyCode || 83 === e.keyCode || 40 === e.keyCode || (65 === e.keyCode || 37 === e.keyCode ? self.leftDown = !1 : (68 === e.keyCode || 39 === e.keyCode) && (self.rightDown = !1));
        }), document.body.addEventListener("keydown", function(e) {
            self.gameOver || 87 === e.keyCode || 38 === e.keyCode || 83 === e.keyCode || 40 === e.keyCode || (65 === e.keyCode || 37 === e.keyCode ? tapLeft() : (68 === e.keyCode || 39 === e.keyCode) && tapRight());
        }), this.textAcc.setText(this.textAcc.text + "\nbuild");
    }
}), WaitScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label);
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var assetsToLoader = [ "dist/img/atlas/splash.json" ];
        assetsToLoader.length > 0 ? (this.loader = new PIXI.AssetLoader(assetsToLoader), 
        this.initLoad()) : this.onAssetsLoaded(), TweenLite.to(this.container, .5, {
            alpha: 1
        });
    },
    onProgress: function() {
        this._super();
    },
    onAssetsLoaded: function() {
        this.initApplication();
    },
    initApplication: function() {
        function repeatTimeline() {
            tl.restart();
        }
        function repeatTimeline2() {
            tl2.restart();
        }
        function repeatTimeline3() {
            tl3.restart();
        }
        this.bgImg = new SimpleSprite("splashBg.jpg"), this.addChild(this.bgImg), this.posImg = new SimpleSprite("pos.png"), 
        this.addChild(this.posImg), this.logo = new SimpleSprite("logo.png"), this.addChild(this.logo), 
        this.logo.setPosition(windowWidth / 2 - this.logo.getContent().width / 2, .05 * windowHeight);
        var self = this;
        this.goButton = new DefaultButton("goButton.png", "goButtonOver.png"), this.goButton.build(300, 100), 
        this.goButton.setPosition(windowWidth / 2 - this.goButton.width / 2, windowHeight / 2), 
        this.addChild(this.goButton), this.goButton.clickCallback = function() {
            clearInterval(self.interval), self.screenManager.change("Game");
        }, this.creditsButton = new DefaultButton("creditsButton.png", "creditsButtonOver.png"), 
        this.creditsButton.build(300, 100), this.creditsButton.setPosition(windowWidth / 2 - this.creditsButton.width / 2, windowHeight / 2 + 120), 
        this.addChild(this.creditsButton), this.lights = new SimpleSprite("lights.png"), 
        this.addChild(this.lights), this.lights.setPosition(windowWidth - .05 * this.lights.getContent().width + 80, 150);
        var tl = new TimelineLite({
            onComplete: repeatTimeline
        });
        this.lights.container.anchor.x = .95, this.lights.container.anchor.y = .05, tl.append(TweenLite.to(this.lights.container, 4, {
            rotation: .2,
            ease: "easeInOutCubic"
        })), tl.append(TweenLite.to(this.lights.container, 8, {
            rotation: -.2,
            ease: "easeInOutCubic"
        })), tl.append(TweenLite.to(this.lights.container, 4, {
            rotation: 0,
            ease: "easeInOutCubic"
        })), this.frescura1 = new SimpleSprite("folhas1.png"), this.addChild(this.frescura1), 
        this.frescura1.setPosition(50, windowHeight + 10);
        var tl2 = new TimelineLite({
            onComplete: repeatTimeline2
        });
        this.frescura1.container.anchor.y = 1, tl2.append(TweenLite.to(this.frescura1.container, 3, {
            rotation: .2,
            ease: "easeInOutCubic"
        })), tl2.append(TweenLite.to(this.frescura1.container, 6, {
            rotation: -.2,
            ease: "easeInOutCubic"
        })), tl2.append(TweenLite.to(this.frescura1.container, 3, {
            rotation: 0,
            ease: "easeInOutCubic"
        })), this.frescura2 = new SimpleSprite("folhas2.png"), this.addChild(this.frescura2), 
        this.frescura2.setPosition(.8 * windowWidth, windowHeight + 20);
        var tl3 = new TimelineLite({
            onComplete: repeatTimeline3
        });
        this.frescura2.container.anchor.x = .5, this.frescura2.container.anchor.y = 1, this.frescura2.container.scale.y = 1.5, 
        tl3.append(TweenLite.to(this.frescura2.container, 3, {
            rotation: .2,
            ease: "easeInOutCubic"
        })), tl3.append(TweenLite.to(this.frescura2.container, 6, {
            rotation: -.2,
            ease: "easeInOutCubic"
        })), tl3.append(TweenLite.to(this.frescura2.container, 3, {
            rotation: 0,
            ease: "easeInOutCubic"
        }));
        for (var i = 8; i >= 0; i--) {
            var particle = new Particles({
                x: .3 - .6 * Math.random(),
                y: -(.2 * Math.random() + .3)
            }, 300 * Math.random() + 300, "particle.png", -.01);
            particle.build(), particle.setPosition(windowWidth * Math.random(), (windowHeight - 80) * Math.random() + 80), 
            particle.alphadecress = .01, particle.scaledecress = Math.random(), self.addChild(particle);
        }
        this.interval = setInterval(function() {
            var particle = new Particles({
                x: .3 - .6 * Math.random(),
                y: -(.2 * Math.random() + .3)
            }, 300 * Math.random() + 300, "particle.png", -.01);
            particle.build(), particle.setPosition(windowWidth * Math.random(), (windowHeight - 80) * Math.random() + 80), 
            particle.alphadecress = .01, particle.scaledecress = Math.random(), self.addChild(particle);
        }, 900);
    },
    transitionOut: function(nextScreen, container) {
        var self = this;
        TweenLite.to(this.container, .5, {
            alpha: 0,
            onComplete: function() {
                self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn();
            }
        });
    }
}), EndModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), this.boxContainer = new PIXI.DisplayObjectContainer(), 
        this.bg = new PIXI.Graphics(), this.bg.beginFill(19784), this.bg.drawRect(0, 0, windowWidth, windowHeight), 
        this.bg.alpha = 0, this.container.addChild(this.bg), this.container.addChild(this.boxContainer), 
        this.background = new SimpleSprite("backEndModal.png"), this.boxContainer.addChild(this.background.container), 
        this.background.container.position.x = windowWidth / 2 - this.background.getContent().width / 2, 
        this.background.container.position.y = windowHeight / 2 - this.background.getContent().height / 2;
        var bgPos = {
            x: this.background.container.position.x,
            y: this.background.container.position.y
        };
        this.retryButton = new DefaultButton("retryButton.png", "retryButtonOver.png"), 
        this.retryButton.build(), this.retryButton.setPosition(bgPos.x + 135, bgPos.y + 268), 
        this.boxContainer.addChild(this.retryButton.getContent());
        var self = this;
        this.retryButton.clickCallback = function() {
            self.hide(self.screen.resetGame());
        }, this.exitButton = new DefaultButton("exitButton.png", "exitButtonOver.png"), 
        this.exitButton.build(), this.exitButton.setPosition(bgPos.x + 135, bgPos.y + 363), 
        this.boxContainer.addChild(this.exitButton.getContent()), this.exitButton.clickCallback = function() {
            self.hide(function() {
                self.screen.screenManager.change("Wait");
            });
        }, this.pauseLabel = new SimpleSprite("pauseLabel.png"), this.boxContainer.addChild(this.pauseLabel.container), 
        this.pauseLabel.setPosition(bgPos.x + 105, bgPos.y + 91), this.boxContainer.position.y = 1.5 * -this.boxContainer.height;
    },
    show: function() {
        this.screen.updateable = !1, TweenLite.to(this.bg, .5, {
            alpha: .8
        }), TweenLite.to(this.boxContainer.position, 1, {
            y: 0,
            ease: "easeOutBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 1
        });
    },
    hide: function(callback) {
        TweenLite.to(this.bg, .5, {
            alpha: 0,
            onComplete: function() {
                callback && callback();
            }
        }), TweenLite.to(this.boxContainer.position, 1, {
            y: -this.boxContainer.height,
            ease: "easeInBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 0
        });
    },
    getContent: function() {
        return this.container;
    }
}), PauseModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), this.boxContainer = new PIXI.DisplayObjectContainer(), 
        this.bg = new PIXI.Graphics(), this.bg.beginFill(19784), this.bg.drawRect(0, 0, windowWidth, windowHeight), 
        this.bg.alpha = 0, this.container.addChild(this.bg), this.container.addChild(this.boxContainer), 
        this.background = new SimpleSprite("backPauseModal.png"), this.boxContainer.addChild(this.background.container), 
        this.background.container.position.x = windowWidth / 2 - this.background.getContent().width / 2, 
        this.background.container.position.y = windowHeight / 2 - this.background.getContent().height / 2;
        var bgPos = {
            x: this.background.container.position.x,
            y: this.background.container.position.y
        };
        this.retryButton = new DefaultButton("retryButton.png", "retryButtonOver.png"), 
        this.retryButton.build(), this.retryButton.setPosition(bgPos.x + 135, bgPos.y + 193), 
        this.boxContainer.addChild(this.retryButton.getContent());
        var self = this;
        this.retryButton.clickCallback = function() {
            self.hide(self.screen.resetGame());
        }, this.continueButton = new DefaultButton("continueButton.png", "continueButtonOver.png"), 
        this.continueButton.build(), this.continueButton.setPosition(bgPos.x + 135, bgPos.y + 288), 
        this.boxContainer.addChild(this.continueButton.getContent()), this.continueButton.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0;
            });
        }, this.pauseLabel = new SimpleSprite("pauseLabel.png"), this.boxContainer.addChild(this.pauseLabel.container), 
        this.pauseLabel.setPosition(bgPos.x + 105, bgPos.y + 91), this.boxContainer.position.y = 1.5 * -this.boxContainer.height;
    },
    show: function() {
        TweenLite.to(this.bg, .5, {
            alpha: .8
        }), TweenLite.to(this.boxContainer.position, 1, {
            y: 0,
            ease: "easeOutBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 1
        });
    },
    hide: function(callback) {
        TweenLite.to(this.bg, .5, {
            alpha: 0,
            onComplete: function() {
                callback && callback();
            }
        }), TweenLite.to(this.boxContainer.position, 1, {
            y: -this.boxContainer.height,
            ease: "easeInBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 0
        });
    },
    getContent: function() {
        return this.container;
    }
}), FirebaseSocket = SmartSocket.extend({
    init: function(url) {
        this._super(), this.dataRef = new Firebase(url), this.dataRef.limit(1);
    },
    build: function() {
        var self = this;
        this.lastMessagesQuery = this.dataRef.endAt().limit(2), this.lastMessagesQuery.on("child_added", function(snapshot) {
            self.readLast(snapshot.val());
        }, function(errorObject) {
            self.socketError(errorObject);
        }), this.dataRef.on("child_added", function(snapshot) {
            self.readSocketList(snapshot.val());
        }, function(errorObject) {
            self.socketError(errorObject);
        }), this.dataRef.on("value", function(data) {
            self.readObj(data.val());
        }, function(errorObject) {
            self.socketError(errorObject);
        });
    },
    writeObj: function(obj) {
        this._super(obj), this.dataRef.push(obj);
    },
    setObj: function(obj) {
        this._super(obj), this.dataRef.set(obj);
    },
    updateObj: function(obj) {
        this._super(obj), this.dataRef.update(obj);
    },
    destroy: function() {}
}), InputManager = Class.extend({
    init: function(parent) {
        var game = parent, self = this;
        this.vecPositions = [], document.body.addEventListener("mouseup", function() {
            game.player && (game.mouseDown = !1);
        }), document.body.addEventListener("mousedown", function() {
            game.player && APP.getMousePos().x < windowWidth && APP.getMousePos().y < windowHeight - 70 && (game.mouseDown = !0);
        }), document.body.addEventListener("keyup", function(e) {
            if (game.player) {
                if (87 === e.keyCode || 38 === e.keyCode && game.player.velocity.y < 0) self.removePosition("up"); else if (83 === e.keyCode || 40 === e.keyCode && game.player.velocity.y > 0) self.removePosition("down"); else if (65 === e.keyCode || 37 === e.keyCode && game.player.velocity.x < 0) self.removePosition("left"); else if (68 === e.keyCode || 39 === e.keyCode && game.player.velocity.x > 0) self.removePosition("right"); else if (32 === e.keyCode) game.player.hurt(5); else if (49 === e.keyCode || 50 === e.keyCode || 51 === e.keyCode || 52 === e.keyCode || 81 === e.keyCode || 69 === e.keyCode) {
                    var id = 1;
                    50 === e.keyCode ? id = 2 : 51 === e.keyCode ? id = 3 : 52 === e.keyCode && (id = 4), 
                    game.useShortcut(id - 1);
                }
                game.player.updatePlayerVel(self.vecPositions);
            }
        }), document.body.addEventListener("keydown", function(e) {
            game.player && (87 === e.keyCode || 38 === e.keyCode ? (self.removePosition("down"), 
            self.addPosition("up")) : 83 === e.keyCode || 40 === e.keyCode ? (self.removePosition("up"), 
            self.addPosition("down")) : 65 === e.keyCode || 37 === e.keyCode ? (self.removePosition("right"), 
            self.addPosition("left")) : (68 === e.keyCode || 39 === e.keyCode) && (self.removePosition("left"), 
            self.addPosition("right")), game.player.updatePlayerVel(self.vecPositions));
        });
    },
    removePosition: function(position) {
        for (var i = this.vecPositions.length - 1; i >= 0; i--) this.vecPositions[i] === position && this.vecPositions.splice(i, 1);
    },
    addPosition: function(position) {
        for (var exists = !1, i = this.vecPositions.length - 1; i >= 0; i--) this.vecPositions[i] === position && (exists = !0);
        exists || this.vecPositions.push(position);
    }
}), Environment = Class.extend({
    init: function(maxWidth, maxHeight) {
        this.velocity = {
            x: 0,
            y: 0
        }, this.texture = "", this.sprite = "", this.container = new PIXI.DisplayObjectContainer(), 
        this.updateable = !0, this.arraySprt = [], this.maxWidth = maxWidth, this.maxHeight = maxHeight, 
        this.texWidth = 0, this.spacing = 0, this.totTiles = 0, this.currentSprId = 0, this.floorPos = 0, 
        this.velFactor = 1;
    },
    build: function(imgs, spacing, floorPos) {
        this.arraySprt = imgs, this.floorPos = floorPos, spacing && (this.spacing = spacing);
        for (var i = 0; i < this.arraySprt.length && !(this.container.width > this.maxWidth); i++) this.currentSprId = i, 
        this.addEnv();
    },
    addEnv: function() {
        this.sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(this.arraySprt[this.currentSprId]));
        var last = this.container.children[this.container.children.length - 1];
        last && (this.sprite.position.x = last.position.x + last.width + this.velocity.x - 2 + this.spacing), 
        this.sprite.position.y = this.maxHeight - this.sprite.height - this.floorPos, this.container.addChild(this.sprite);
    },
    update: function() {
        if (!this.container.children) return void console.log(this.container);
        for (var i = this.container.children.length - 1; i >= 0; i--) this.container.children[i].position.x + this.container.children[i].width < 0 && this.container.removeChild(this.container.children[i]), 
        this.container.children[i].position.x += this.velocity.x;
        var last = this.container.children[this.container.children.length - 1];
        last.position.x + last.width - 20 < this.maxWidth && (this.currentSprId++, this.currentSprId >= this.arraySprt.length && (this.currentSprId = 0), 
        this.addEnv());
    },
    getContent: function() {
        return this.container;
    }
}), Paralax = Class.extend({
    init: function(maxWidth) {
        this.velocity = {
            x: 0,
            y: 0
        }, this.texture = "", this.sprite = "", this.container = new PIXI.DisplayObjectContainer(), 
        this.updateable = !0, this.arraySprt = [], this.maxWidth = maxWidth, this.texWidth = 0, 
        this.spacing = 0, this.totTiles = 0;
    },
    build: function(img, spacing) {
        spacing && (this.spacing = spacing), this.texture = PIXI.Texture.fromFrame(img), 
        this.texWidth = this.texture.width, this.totTiles = Math.ceil(this.maxWidth / this.texWidth) + 1;
        for (var i = 0; i < this.totTiles; i++) this.sprite = new PIXI.Sprite(this.texture), 
        this.sprite.position.x = (this.texWidth + this.spacing) * i, this.container.addChild(this.sprite);
    },
    update: function() {
        Math.abs(this.container.position.x + this.velocity.x) >= this.texWidth + this.totTiles * this.spacing ? this.container.position.x = 0 : this.container.position.x += this.velocity.x, 
        this.container.position.y += this.velocity.y;
    },
    getContent: function() {
        return this.container;
    }
}), Particles = Entity.extend({
    init: function(vel, timeLive, label, rotation) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 40, this.width = 1, 
        this.height = 1, this.type = "fire", this.target = "enemy", this.fireType = "physical", 
        this.node = null, this.velocity.x = vel.x, this.velocity.y = vel.y, this.timeLive = timeLive, 
        this.power = 1, this.defaultVelocity = 1, this.imgSource = label, this.alphadecress = .03, 
        this.scaledecress = .03, rotation && (this.rotation = rotation);
    },
    build: function() {
        this.updateable = !0, this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = .5, this.sprite.alpha = 0, this.sprite.scale.x = .2, this.sprite.scale.y = .2, 
        TweenLite.to(this.sprite, .5, {
            alpha: 1
        });
    },
    update: function() {
        this._super(), this.timeLive--, this.timeLive <= 0 && this.preKill(), this.range = this.width, 
        this.rotation && (this.getContent().rotation += this.rotation), this.sprite.alpha >= this.alphadecres && (this.sprite.alpha -= this.alphadecres), 
        this.sprite.scale.x >= 1 || (this.sprite.scale.x += this.scaledecress, this.sprite.scale.y += this.scaledecress);
    },
    preKill: function() {
        this.updateable = !0, this.kill = !0;
    }
}), resizeProportional = !0, windowWidth = 1136, windowHeight = 640, realWindowWidth = 1136, realWindowHeight = 640, gameScale = 1.4;

testMobile() && (gameScale = 1.8, windowWidth = window.innerWidth * gameScale, windowHeight = window.innerHeight * gameScale, 
realWindowWidth = windowWidth, realWindowHeight = windowHeight);

var windowWidthVar = window.innerWidth, windowHeightVar = window.innerHeight, renderer = PIXI.autoDetectRenderer(realWindowWidth, realWindowHeight, null, !1, !0);

document.body.appendChild(renderer.view), renderer.view.style.width = windowWidth + "px", 
renderer.view.style.height = windowHeight + "px";

var APP;

APP = new Application(), APP.build(), APP.show();

var ratio = 1, initialize = function() {
    PIXI.BaseTexture.SCALE_MODE = PIXI.scaleModes.NEAREST, requestAnimFrame(update);
};

!function() {
    var App = {
        init: function() {
            initialize();
        }
    };
    App.init();
}();