// << CONTROLLER FILE >>

const Controller = function()
{
  //this.down  = new Controller.ButtonInput();
  this.left  = new Controller.ButtonInput();
  this.right = new Controller.ButtonInput();
  this.up    = new Controller.ButtonInput();

  this.keyDownUp = function(type, key_code)
  {
    var down = (type == "keydown") ? true : false;

    switch(key_code)
    {
      case 65: this.left.getInput(down);  break;
      case 87: this.up.getInput(down);    break;
      case 32: this.up.getInput(down);    break;
      case 68: this.right.getInput(down);
      // case 83: this.down.getInput(down);
    }
  };
};

Controller.prototype = { constructor : Controller };

Controller.ButtonInput = function()
{
  this.active = this.down = false;
};

Controller.ButtonInput.prototype =
{
  constructor : Controller.ButtonInput,

  getInput : function(down)
  {
    if (this.down != down) this.active = down;
    this.down = down;
  }
};
