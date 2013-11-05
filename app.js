var Roller = Ember.Application.create({
  LOG_TRANSITIONS: true,
  LOG_BINDINGS: true,
  LOG_VIEW_LOOKUPS: true,
  LOG_STACKTRACE_ON_DEPRECATION: true,
  LOG_VERSION: true,
  debugMode: true
});

Roller.Roll = Ember.Object.extend({
  diceNumber: 0,
  totalRolls: 0,
  numberOfRolls: 0,

  proportion: function() {
    var width = 50 + parseInt(400 * this.get("numberOfRolls") /
      this.get("totalRolls"));
    return "width: " + width + "px;";
  }.property("totalRolls", "numberOfRolls")
});

Roller.Router.map(function() {
  this.resource('roll');
});

Roller.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('roll');
  }
});

Roller.RollRoute = Ember.Route.extend({
  model: function() {
    return [];
  },

  setupController: function(controller, model) {
    controller.set("content", model);
  }
});

Roller.RollController = Ember.Controller.extend({
  actions: {
    rollDice: function() {
      var roll = this.get("rollString"),
        content = [],
        rolls = 0,
        sides = 0,
        errors = "",
        i, rnd, roll_parts;

      // check if anything was typed into text box
      if (roll === undefined) {
        this.set("errors", "Please fill out the text box!");
        return
      }

      // split up the string around the 'd'
      roll_parts = roll.split("d");

      if (roll_parts.length !== 2) {
        // check if given text is correctly formatted
        errors += "You need to enter a value in the format xdy.";
      } else {
        // split up and parse the required numbers
        rolls = parseInt(roll_parts[0]);
        sides = parseInt(roll_parts[1]);

        if (isNaN(rolls) || isNaN(sides)) {
          errors += "Rolls and sides must be numbers.";
        }

        // generate dice rolls if there are no errors
        if (errors.length === 0) {
          for (i = 0; i < sides; i++) {
            content.push(Roller.Roll.create({
              diceNumber: i + 1,
              totalRolls: rolls
            }));
          }

          // roll the dice
          for (i = 0; i < rolls; i ++) {
            rnd = Math.floor(Math.random() * sides);
            content[rnd].incrementProperty("numberOfRolls");
          }
        }
      }

      this.set("content", content);
      this.set("errors", errors);
    }
  }
});

Roller.DiceInputField = Ember.TextField.extend({
  keyDown: function(event) {
    var controller, action;

    // check if enter key was pressed
    if (event.keyCode !== 13) {
      return
    }

    // call the controller's 'rollDice' function
    controller = this.get("controller");
    action = this.get("action");
    controller.send(action, this.get("rollString"), this);
  }
});
