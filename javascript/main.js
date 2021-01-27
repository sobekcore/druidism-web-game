// MAIN FILE (MVC Component)

window.addEventListener("load", function(event)
  {
    "use strict";

    // << Constants >>
    const ZONE_PREFIX = "../zones/zone";
    const ZONE_SUFFIX = ".json";

    // << Looped music playing >>
    var music = new Audio("../audio/music.ogg");
    music.loop = true;
    window.addEventListener("keydown", function() { music.play(); });

    // << Classes >>
    const AssetsManager = function()
    {
      this.tile_set_image = undefined;
    };

    AssetsManager.prototype =
    {
      constructor: Game.AssetsManager,

      requestJSON:function(url, callback)
      {
        let request = new XMLHttpRequest();

        request.addEventListener("load", function(event)
        {
          callback(JSON.parse(this.responseText));
        }, { once: true });

        request.open("GET", url);
        request.send();
      },

      requestImage:function(url, callback)
      {
        let image = new Image();

        image.addEventListener("load", function(event)
        {
          callback(image);
        }, { once:true });

        image.src = url;
      }
    };

    // << Functions >>
    var keyDownUp = function(event)
    {
      controller.keyDownUp(event.type, event.keyCode);
    };

    var resize = function(event)
    {
      display.resize(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
        game.world.height / game.world.width
      );

      display.render();

      var rectangle = display.context.canvas.getBoundingClientRect();

      p.style.left = rectangle.left + "px";
      p.style.top = rectangle.top + "px";
      p.style.fontSize = (game.world.tile_set.tile_size * rectangle.height / game.world.height) / 2.1 + "px";
    };

    var render = function()
    {
      // Sound toggle
      if(change == true)
      {
        if(play_sound == true)
        { document.getElementById("mute").src = "../graphics/audio-icon.svg";
          music.muted = false; change = false; }
        else if(play_sound == false)
        { document.getElementById("mute").src = "../graphics/audio-mute-icon.svg";
          music.muted = true; change = false; }
      }

      var frame = undefined;

      display.drawMap(
        assets_manager.tile_set_image,
        game.world.tile_set.columns,
        game.world.graphical_map,
        game.world.columns,
        game.world.tile_set.tile_size
      );

      for(let index = game.world.mushrooms.length - 1; index > -1; --index)
      {
        let mushroom = game.world.mushrooms[index];

        frame = game.world.tile_set.frames[mushroom.frame_value];

        display.drawObject(
          assets_manager.tile_set_image, frame.x, frame.y,
          mushroom.x + Math.floor(mushroom.width * 0.5 - frame.width * 0.5) + frame.offset_x,
          mushroom.y + frame.offset_y, frame.width, frame.height
        );
      }

      frame = game.world.tile_set.frames[game.world.player.frame_value];

      display.drawObject(
        assets_manager.tile_set_image, frame.x, frame.y,
        game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x,
        game.world.player.y + frame.offset_y, frame.width, frame.height
      );

      for(let index = game.world.grass.length - 1; index > -1; --index)
      {
        let grass = game.world.grass[index];

        frame = game.world.tile_set.frames[grass.frame_value];

        display.drawObject(
          assets_manager.tile_set_image, frame.x, frame.y,
          grass.x + frame.offset_x,
          grass.y + frame.offset_y, frame.width, frame.height
        );
      }

      for(let index = game.world.complete.length - 1; index > -1; --index)
      {
        let complete = game.world.complete[index];

        frame = game.world.tile_set.frames[complete.frame_value];

        display.drawObject(
          assets_manager.tile_set_image, frame.x, frame.y,
          complete.x + Math.floor(complete.width * 0.5 - frame.width * 0.5) + frame.offset_x,
          complete.y + frame.offset_y, frame.width, frame.height
        );
      }

      p.innerHTML = "Mushrooms: " + game.world.mushroom_count;

      display.render();
    };

    var update = function()
    {
      if(controller.left.active) { game.world.player.moveLeft (); }
      if(controller.right.active) { game.world.player.moveRight(); }
      if(controller.up.active) { game.world.player.jump(); controller.up.active = false; }

      game.update();

      if(game.world.door)
      {
        engine.stop();

        assets_manager.requestJSON(ZONE_PREFIX + game.world.door.destination_zone + ZONE_SUFFIX, (zone) =>
        {
          game.world.setup(zone);
          engine.start();
        });

        return;
      }
    };

    // << Objects >>
    var assets_manager = new AssetsManager();
    var controller     = new Controller();
    var display        = new Display(document.querySelector("canvas"));
    var game           = new Game() ;
    var engine         = new Engine(1000/30, render, update);

    var p = document.createElement("p");
    p.innerHTML = "Mushrooms: 0";
    document.body.appendChild(p);

    // << Initialize >>
    display.buffer.canvas.height = game.world.height;
    display.buffer.canvas.width = game.world.width;
    display.buffer.imageSmoothingEnabled = false;

    assets_manager.requestJSON(ZONE_PREFIX + game.world.zone_id + ZONE_SUFFIX, (zone) =>
      {
        game.world.setup(zone);

        assets_manager.requestImage("../graphics/druidism.png", (image) =>
          {
            assets_manager.tile_set_image = image;

            resize();
            engine.start();
          }
        );
      }
    );

    window.addEventListener("keydown", keyDownUp);
    window.addEventListener("keyup", keyDownUp);
    window.addEventListener("resize", resize);
  }
);
