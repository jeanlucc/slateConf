// Bindings
// ________

slate.bindAll({
    "a:ctrl;cmd"          : throwToPreviousScreen,
    "z:ctrl;cmd"          : throwToNextScreen,
    "1:ctrl;cmd"          : throwToFirstScreen,
    "2:ctrl;cmd"          : throwToSecondScreen,
    "3:ctrl;cmd"          : throwToThirdScreen,

    // Modal bindings
    "a:m;ctrl;cmd:toggle" : throwToPreviousScreen,
    "z:m;ctrl;cmd:toggle" : throwToNextScreen,
    "1:m;ctrl;cmd:toggle" : throwToFirstScreen,
    "2:m;ctrl;cmd:toggle" : throwToSecondScreen,
    "3:m;ctrl;cmd:toggle" : throwToThirdScreen,
});

// End of bindings
// _______________

/**
 * Throws the window to next screen keeping the same position
 * relatively to screen.
 */
function throwToNextScreen()
{
    // Get next screen
    var nextId = (slate.screen().id() + 1) % slate.screenCount();
    var screen = slate.screenForRef(nextId);

    throwToScreen(screen);
}

/**
 * Throws the window to previous screen keeping the same position
 * relatively to screen.
 */
function throwToPreviousScreen()
{
    // Get previous screen
    var previousId = (slate.screen().id() - 1) % slate.screenCount();
    // Correction for js negative modulo.
    previousId = (previousId + slate.screenCount()) % slate.screenCount();
    var screen = slate.screenForRef(previousId);

    throwToScreen(screen);
}

/**
 * Throws the window to first screen keeping the same position
 * relatively to screen.
 */
function throwToFirstScreen()
{
    // Get first screen
    var screen = slate.screenForRef("0");

    throwToScreen(screen);
}

/**
 * Throws the window to second screen keeping the same position
 * relatively to screen.
 */
function throwToSecondScreen()
{
    // Get second screen
    var screen = slate.screenForRef("1");

    throwToScreen(screen);
}

/**
 * Throws the window to third screen keeping the same position
 * relatively to screen.
 */
function throwToThirdScreen()
{
    // Get third screen
    var screen = slate.screenForRef("2");

    throwToScreen(screen);
}

/**
 * Throws the window to the given screen keeping the same position
 * relatively to screen.
 */
function throwToScreen(screen)
{
    if (screen.id() < 0 || screen.id() >= slate.screenCount()) {
        return;
    }

    // Get current window
    var window = slate.window();
    if (undefined === window) {
        return;
    }

    // Get window position relatively to the screen
    var pos = getScreenRelativeWindowPosition(window);

    moveWindowAt(window, pos[0], pos[1], pos[2], pos[3], screen);
}
