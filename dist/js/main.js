/*! jefframos 24-01-2015 */
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
    requestAnimFrame(update), meter.tickStart();
    var tempRation = window.innerHeight / windowHeight, ratioRez = resizeProportional ? tempRation < window.innerWidth / realWindowWidth ? tempRation : window.innerWidth / realWindowWidth : 1;
    windowWidthVar = realWindowWidth * ratioRez * ratio, windowHeightVar = realWindowHeight * ratioRez * ratio, 
    windowWidthVar > realWindowWidth && (windowWidthVar = realWindowWidth), windowHeightVar > realWindowHeight && (windowHeightVar = realWindowHeight), 
    renderer.view.style.width = windowWidthVar + "px", renderer.view.style.height = windowHeightVar + "px", 
    APP.update(), renderer.render(APP.stage), meter.tick();
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
        this._super(windowWidth, windowHeight), this.stage.setBackgroundColor(12580351), 
        this.stage.removeChild(this.loadText), this.isMobile = testMobile(), this.appContainer = document.getElementById("rect"), 
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
        this.screenManager.change("Game");
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
}), Bullet = Entity.extend({
    init: function(vel, timeLive) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "bullet", this.target = "enemy", this.fireType = "physical", 
        this.node = null, this.velocity.x = vel.x, this.velocity.y = vel.y, this.timeLive = timeLive, 
        this.power = 1, this.defaultVelocity = 1, this.imgSource = "bullet.png";
    },
    build: function() {
        this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = .5, this.updateable = !0, this.collidable = !0, this.getContent().alpha = 0, 
        TweenLite.to(this.getContent(), .5, {
            alpha: 1
        });
    },
    update: function() {
        this._super(), this.layer.collideChilds(this), this.timeLive--, this.timeLive <= 0 && this.preKill(), 
        this.range = this.width;
    },
    collide: function(arrayCollide) {
        console.log("fireCollide", arrayCollide[0]), this.collidable && "bird" === arrayCollide[0].type && (console.log(arrayCollide[0].type), 
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
}), GameEntiity = SpritesheetEntity.extend({
    init: function(playerModel) {
        this.playerModel = playerModel, this._super(!0);
    },
    setTarget: function(pos) {
        this.target = pos, pointDistance(0, this.getPosition().y, 0, this.target) < 4 || (this.target < this.getPosition().y ? this.velocity.y = -this.upVel : this.target > this.getPosition().y && (this.velocity.y = this.upVel));
    },
    dash: function() {
        this.spritesheet.play("dash"), this.onDash = !0;
    },
    jump: function() {
        this.inJump || (this.inJump = !0, this.velocity.y = -6);
    },
    update: function() {
        return this._super(), this.spritesheet.texture.anchor.x = .5, this.spritesheet.texture.anchor.y = 0, 
        this.getPosition().x > windowWidth + 50 && this.preKill(), this.onDash ? void (this.velocity.y = 0) : (this.velocity.y += this.gravity, 
        this.getPosition().y + this.velocity.y >= this.floorPos && (this.velocity.y = 0, 
        this.inJump = !1, this.spritesheet.play("idle")), void (this.velocity.y < 0 && "jumpUp" !== this.spritesheet.currentAnimation.label ? (console.log("jumpUp"), 
        this.spritesheet.play("jumpUp")) : this.velocity.y > 0 && "jumpDown" !== this.spritesheet.currentAnimation.label && (console.log("jumpDown"), 
        this.spritesheet.play("jumpDown"))));
    },
    destroy: function() {
        this._super();
    }
}), Cow = GameEntiity.extend({
    build: function(screen, floorPos) {
        var motionIdle = new SpritesheetAnimation();
        motionIdle.build("idle", this.getFramesByRange("cupcake0", 1, 23, "", ".png"), 1, !0, null);
        var jumpUp = new SpritesheetAnimation();
        jumpUp.build("jumpUp", this.getFramesByRange("cupcake0", 24, 26, "", ".png"), 4, !1, null);
        var dashMotion = new SpritesheetAnimation();
        dashMotion.build("dash", [ "dash.png" ], 1, !1, null);
        var jumpDown = new SpritesheetAnimation();
        jumpDown.build("jumpDown", this.getFramesByRange("cupcake0", 26, 40, "", ".png"), 4, !1, null), 
        this.spritesheet = new Spritesheet(), this.spritesheet.addAnimation(motionIdle), 
        this.spritesheet.addAnimation(jumpDown), this.spritesheet.addAnimation(jumpUp), 
        this.spritesheet.addAnimation(dashMotion), this.spritesheet.play("jumpUp"), this.screen = screen, 
        this.floorPos = floorPos, this.defaultVel = 50 * gameScale, this.upVel = this.playerModel.velocity * gameScale, 
        this.spritesheet.texture.anchor.x = .5, this.spritesheet.texture.anchor.y = .5, 
        this.rotation = 0, this.gravity = .2;
    }
}), Pig = GameEntiity.extend({
    build: function(screen, floorPos) {
        var motionIdle = new SpritesheetAnimation();
        motionIdle.build("idle", this.getFramesByRange("cupcake0", 1, 23, "", ".png"), 1, !0, null);
        var jumpUp = new SpritesheetAnimation();
        jumpUp.build("jumpUp", this.getFramesByRange("cupcake0", 24, 26, "", ".png"), 4, !1, null);
        var dashMotion = new SpritesheetAnimation();
        dashMotion.build("dash", [ "dash.png" ], 1, !1, null);
        var jumpDown = new SpritesheetAnimation();
        jumpDown.build("jumpDown", this.getFramesByRange("cupcake0", 26, 40, "", ".png"), 4, !1, null), 
        this.spritesheet = new Spritesheet(), this.spritesheet.addAnimation(motionIdle), 
        this.spritesheet.addAnimation(jumpDown), this.spritesheet.addAnimation(jumpUp), 
        this.spritesheet.addAnimation(dashMotion), this.spritesheet.play("jumpUp"), this.screen = screen, 
        this.floorPos = floorPos, this.defaultVel = 50 * gameScale, this.upVel = this.playerModel.velocity * gameScale, 
        this.spritesheet.texture.anchor.x = .5, this.spritesheet.texture.anchor.y = .5, 
        this.rotation = 0, this.gravity = .2;
    }
}), AppModel = Class.extend({
    init: function() {
        this.currentPlayerModel = {}, this.playerModels = [ new PlayerModel("vaca", .04, .8, 2, 8, 1), new PlayerModel("feter.png", .05, .4, 1.5, 4, 2), new PlayerModel("neto.png", .05, .5, 2, 2, 4) ], 
        this.setModel(0);
    },
    setModel: function(id) {
        this.currentID = id, this.currentPlayerModel = this.playerModels[id];
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), PlayerModel = Class.extend({
    init: function(source, ecoast, bcoast, vel, bvel, bforce) {
        this.range = 40, this.maxEnergy = 100, this.maxBulletEnergy = 100, this.currentEnergy = 100, 
        this.currentBulletEnergy = 100, this.recoverBulletEnergy = .5, this.chargeBullet = 2, 
        this.currentBulletForce = 100, this.recoverEnergy = .5, this.imgSource = source ? source : "piangersN.png", 
        this.energyCoast = ecoast ? ecoast : .002, this.bulletCoast = bcoast ? bcoast : .2, 
        this.velocity = vel ? vel : 2, this.bulletVel = bvel ? bvel : 8, this.bulletForce = bforce ? bforce : 1;
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
        var assetsToLoader = [ "dist/img/atlas/atlas.json", "dist/img/atlas/cupcake.json" ];
        assetsToLoader.length > 0 ? (this.loader = new PIXI.AssetLoader(assetsToLoader), 
        this.textAcc.setText(this.textAcc.text + "\ninitLoad"), this.initLoad()) : this.onAssetsLoaded(), 
        this.accelerometer = {}, this.hitTouchRight = new PIXI.Graphics(), this.hitTouchRight.interactive = !0, 
        this.hitTouchRight.beginFill(0), this.hitTouchRight.drawRect(0, 0, windowWidth, windowHeight), 
        this.addChild(this.hitTouchRight), this.hitTouchRight.alpha = 0, this.hitTouchRight.hitArea = new PIXI.Rectangle(.5 * windowWidth, 0, windowWidth, windowHeight), 
        this.hitTouchLeft = new PIXI.Graphics(), this.hitTouchLeft.interactive = !0, this.hitTouchLeft.beginFill(0), 
        this.hitTouchLeft.drawRect(0, 0, windowWidth, windowHeight), this.addChild(this.hitTouchLeft), 
        this.hitTouchLeft.alpha = 0, this.hitTouchLeft.hitArea = new PIXI.Rectangle(0, 0, .5 * windowWidth, windowHeight), 
        this.particleAccum = 50, this.gameOver = !1;
        this.leftDown = !1, this.rightDown = !1, this.tapAccum = 0;
    },
    onProgress: function() {
        this.textAcc.setText(this.textAcc.text + "\nonProgress"), this._super();
    },
    onAssetsLoaded: function() {
        this.textAcc.setText(this.textAcc.text + "\nAssetsLoaded"), this.initApplication();
    },
    update: function() {
        this._super(), this.playerModel && (this.updateParticles(), this.vel > this.maxVel && (this.vel -= this.accel, 
        this.onDash && (this.vel -= 3 * this.accel), this.vel < this.maxVel && (this.vel = this.maxVel, 
        this.onDash = !1, this.first.onDash = !1, this.second.onDash = !1)), this.environment.velocity.x = -this.vel, 
        this.tapAccum++, this.tapAccum > 8 && (this.tapAccum = 8), this.playerModel && this.playerModel.currentBulletEnergy <= this.playerModel.maxBulletEnergy - this.playerModel.recoverBulletEnergy && (this.playerModel.currentBulletEnergy += this.playerModel.recoverBulletEnergy), 
        this.bulletBar && this.bulletBar.updateBar(this.playerModel.currentBulletEnergy, this.playerModel.maxBulletEnergy), 
        this.energyBar && this.energyBar.updateBar(this.playerModel.currentEnergy, this.playerModel.maxEnergy));
    },
    dash: function() {
        if (!(this.playerModel.currentBulletEnergy < this.playerModel.maxBulletEnergy * this.playerModel.bulletCoast)) {
            console.log(this.playerModel.bulletCoast), this.playerModel.currentBulletEnergy -= this.playerModel.maxBulletEnergy * this.playerModel.bulletCoast, 
            this.playerModel.currentBulletEnergy < 0 && (this.playerModel.currentBulletEnergy = 0), 
            this.vel = 6 * this.maxVel, this.onDash = !0, this.leftDown = !1, this.rightDown = !1, 
            this.first.dash();
            var self = this;
            setTimeout(function() {
                self.second.dash();
            }, 100);
        }
    },
    jump: function() {
        if (!this.onDash) {
            this.first.jump();
            var self = this;
            setTimeout(function() {
                self.second.jump();
            }, 100);
        }
    },
    updateParticles: function() {},
    initApplication: function() {
        this.accel = .1, this.vel = 0, this.maxVel = 5, this.environment = new Environment(windowWidth, windowHeight), 
        this.environment.build([ "env1.png", "env2.png", "env3.png", "env4.png" ]), this.addChild(this.environment), 
        this.layerManager = new LayerManager(), this.layerManager.build("Main"), this.addChild(this.layerManager), 
        this.layer = new Layer(), this.layer.build("EntityLayer"), this.layerManager.addLayer(this.layer), 
        this.playerModel = APP.getGameModel().currentPlayerModel, this.playerModel.reset(), 
        this.cow = new Cow(this.playerModel), this.cow.build(this, .7 * windowHeight), this.layer.addChild(this.cow), 
        this.cow.rotation = -1, this.cow.setPosition(.5 * windowWidth, .7 * windowHeight);
        scaleConverter(this.cow.getContent().width, windowHeight, .25);
        this.first = this.cow, this.pig = new Pig(this.playerModel), this.pig.build(this, .7 * windowHeight), 
        this.layer.addChild(this.pig), this.pig.rotation = -1, this.pig.setPosition(.5 * windowWidth - this.pig.getContent().width, .7 * windowHeight), 
        this.second = this.pig, this.gameOver = !1;
        var self = this, posHelper = .05 * windowHeight;
        this.bulletBar = new BarView(.1 * windowWidth, 10, 1, 1), this.addChild(this.bulletBar), 
        this.bulletBar.setPosition(250 + posHelper, posHelper), this.energyBar = new BarView(.1 * windowWidth, 10, 1, 1), 
        this.addChild(this.energyBar), this.energyBar.setPosition(250 + 2 * posHelper + this.bulletBar.width, posHelper), 
        this.returnButton = new DefaultButton("simpleButtonUp.png", "simpleButtonOver.png"), 
        this.returnButton.build(60, 50), this.returnButton.setPosition(.95 * windowWidth - 20, .95 * windowHeight - 65), 
        this.addChild(this.returnButton), this.returnButton.addLabel(new PIXI.Text("<", {
            font: "40px Arial"
        }), 5, 5), this.returnButton.clickCallback = function() {
            self.screenManager.prevScreen();
        }, this.textAcc.setText(this.textAcc.text + "\nendinitApplication"), this.addListenners();
    },
    addListenners: function() {
        function tapLeft() {
            self.leftDown || (self.leftDown = !0, (!self.onDash || self.onDash && self.vel < self.maxVel) && (self.vel = self.maxVel), 
            self.tapAccum = 0);
        }
        function tapRight() {
            self.rightDown || (self.rightDown = !0, (!self.onDash || self.onDash && self.vel < self.maxVel) && (self.vel = self.maxVel), 
            self.tapAccum = 0);
        }
        var self = this, swipe = new Hammer.Swipe(), hammer = new Hammer.Manager(renderer.view);
        hammer.add(swipe), hammer.on("swipeup", function() {
            self.jump();
        }), hammer.on("swiperight", function() {
            self.dash();
        }), document.body.addEventListener("keyup", function(e) {
            87 === e.keyCode || 38 === e.keyCode || 83 === e.keyCode || 40 === e.keyCode || (65 === e.keyCode || 37 === e.keyCode ? self.leftDown = !1 : (68 === e.keyCode || 39 === e.keyCode) && (self.rightDown = !1));
        }), document.body.addEventListener("keydown", function(e) {
            87 === e.keyCode || 38 === e.keyCode || 83 === e.keyCode || 40 === e.keyCode || (65 === e.keyCode || 37 === e.keyCode ? tapLeft() : (68 === e.keyCode || 39 === e.keyCode) && tapRight());
        }), this.hitTouchLeft.mousedown = this.hitTouchLeft.touchstart = function() {
            tapLeft();
        }, this.hitTouchLeft.mouseup = this.hitTouchLeft.touchend = function() {
            self.leftDown = !1;
        }, this.hitTouchRight.mousedown = this.hitTouchRight.touchstart = function() {
            tapRight();
        }, this.hitTouchRight.mouseup = this.hitTouchRight.touchend = function() {
            self.rightDown = !1;
        }, this.textAcc.setText(this.textAcc.text + "\nbuild");
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
        var assetsToLoader = [ "dist/img/ease.png", "dist/img/atlas/atlas.json", "dist/img/UI/simpleButtonOver.png", "dist/img/UI/simpleButtonUp.png" ];
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
        this.easeImg = new SimpleSprite("dist/img/ease.png"), this.addChild(this.easeImg), 
        this.easeImg.setPosition(windowWidth / 2 - this.easeImg.getContent().width / 2, 50);
        var self = this;
        this.btnBenchmark = new DefaultButton("dist/img/UI/simpleButtonUp.png", "dist/img/UI/simpleButtonOver.png"), 
        console.log(this.btnBenchmark.build), this.btnBenchmark.build(300, 100), this.btnBenchmark.setPosition(windowWidth / 2 - this.btnBenchmark.width / 2, windowHeight / 2), 
        this.addChild(this.btnBenchmark), this.btnBenchmark.addLabel(new PIXI.Text("Jogar", {
            align: "center",
            font: "60px Arial",
            wordWrap: !0,
            wordWrapWidth: 300
        }), 70, 15), this.btnBenchmark.clickCallback = function() {
            self.screenManager.change("Choice");
        }, possibleFullscreen() && (this.fullScreen = new DefaultButton("dist/img/UI/simpleButtonUp.png", "dist/img/UI/simpleButtonOver.png"), 
        this.fullScreen.build(40, 20), this.fullScreen.setPosition(.95 * windowWidth - 20, .95 * windowHeight - 35), 
        this.addChild(this.fullScreen), this.fullScreen.addLabel(new PIXI.Text("Full", {
            font: "10px Arial"
        }), 5, 5), this.fullScreen.clickCallback = function() {
            fullscreen();
        });
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
        this.texWidth = 0, this.spacing = 0, this.totTiles = 0, this.currentSprId = 0;
    },
    build: function(imgs, spacing) {
        this.arraySprt = imgs, spacing && (this.spacing = spacing);
        for (var i = 0; i < this.arraySprt.length && !(this.container.width > this.maxWidth); i++) this.currentSprId = i, 
        this.addEnv();
    },
    addEnv: function() {
        this.sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(this.arraySprt[this.currentSprId]));
        var last = this.container.children[this.container.children.length - 1];
        last && (this.sprite.position.x = last.position.x + last.width - 2), this.sprite.position.y = this.maxHeight - this.sprite.height, 
        this.container.addChild(this.sprite);
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
        console.log("this");
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
        this.power = 1, this.defaultVelocity = 1, this.imgSource = label, rotation && (this.rotation = rotation);
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
        this.rotation && (this.getContent().rotation += this.rotation), this.sprite.alpha >= .03 && (this.sprite.alpha -= .03), 
        this.sprite.scale.x >= 1 || (this.sprite.scale.x += .03, this.sprite.scale.y += .03);
    },
    preKill: function() {
        this.updateable = !0, this.kill = !0;
    }
}), meter = new FPSMeter(), resizeProportional = !0, windowWidth = 820, windowHeight = 600, realWindowWidth = 820, realWindowHeight = 600, gameScale = 1.8;

testMobile() && (windowWidth = window.innerWidth * gameScale, windowHeight = window.innerHeight * gameScale, 
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