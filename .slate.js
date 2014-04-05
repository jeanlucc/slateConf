// Basic configuration
// ___________________

slate.configAll({
    // general
    keyboardLayout : "azerty",
//    nudgePercentOf : screenSize,  // I don't use this
//    resizePercentOf : screenSize, // I don't use this
//    orderScreensLeftToRight : false,
//    defaultToCurrentScreen : true,
    // focus
    focusCheckWidthMax : 3000, // (works even with not so close windows),
    focusPreferSameApp : false,
    // modal
    modalEscapeKey : "esc",
    // hints (it is bugged but still helpful)
    windowHintsShowIcons : true,
    windowHintsIgnoreHiddenWindows : false,
    windowHintsSpread : true,
    windowHintsOrder : "persist"
});

// End of basic configuration
// __________________________

// Aliases
// _______

// Apps
var terminal  = 'iTerm';
var editor    = '';
var ide       = '';
var navigator = 'Safari';

// congfig
// hint does not work properly on snow leopard (10.6.8)
var my_hint = slate.operation("hint", {
  "characters" : "1234567890AZERTYUIOPQSDFGHJKLMWXCVBN"
});
var my_grid = slate.operation("grid", {
    "grids" : {
        "0" : {"width" : 6, "height" : 6},
        "1" : {"width" : 6, "height" : 6},
    },
    "padding" : 2
});

// Focus
var focus_left      = slate.operation("focus", {"direction" : "left"});
var focus_down      = slate.operation("focus", {"direction" : "down"});
var focus_up        = slate.operation("focus", {"direction" : "up"});
var focus_right     = slate.operation("focus", {"direction" : "right"});

var focus_behind     = slate.operation("focus", {"direction" : "behind"});

var focus_terminal  = slate.operation("focus", {"app" : terminal});
var focus_editor    = slate.operation("focus", {"app" : editor});
var focus_ide       = slate.operation("focus", {"app" : ide});
var focus_navigator = slate.operation("focus", {"app" : navigator});

// End of aliases
// ______________

// Bindings
// ________

slate.bindAll({
    // normal bindings
    // focus
    "left:ctrl;cmd"   : focus_left,
    "down:ctrl;cmd"   : focus_down,
    "up:ctrl;cmd"     : focus_up,
    "right:ctrl;cmd"  : focus_right,
    "return:ctrl;cmd" : focus_behind,
    "j:ctrl;cmd"      : focus_terminal,
    "k:ctrl;cmd"      : focus_editor,
    "l:ctrl;cmd"      : focus_ide,
    "n:ctrl;cmd"      : focus_navigator,
    // hints and grid
    "h:ctrl;cmd"      : my_hint,
    "g:ctrl;cmd"      : my_grid,

    // Modal bindings
    // focus
    "left:m;ctrl;cmd:toggle"   : focus_left,
    "down:m;ctrl;cmd:toggle"   : focus_down,
    "up:m;ctrl;cmd:toggle"     : focus_up,
    "right:m;ctrl;cmd:toggle"  : focus_right,
    "return:m;ctrl;cmd:toggle" : focus_behind,
    "j:m;ctrl;cmd:toggle"      : focus_terminal,
    "k:m;ctrl;cmd:toggle"      : focus_editor,
    "l:m;ctrl;cmd:toggle"      : focus_ide,
    "n:m;ctrl;cmd:toggle"      : focus_navigator,
});

// End of bindings
// _______________

// Load
// ____

/**
 *  Loads a ".js" file by name without ".js" extension in directory
 *  "~/.slate.d". Log a message on error.
 */
function load(fileName)
{
    var path = "~/.slate.d/" + fileName + ".js";
    if (! slate.source(path)) {
        slate.log("Error while loading " + path);
    }
}

load("common")
load("move");
load("throw");
load("tile2windows");
load("focusLoop");

// End of load
// ___________
