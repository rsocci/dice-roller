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
