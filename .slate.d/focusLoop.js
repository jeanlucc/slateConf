// Bindings
// ________

slate.bindAll({
    "tab:ctrl;cmd" : focusNextWindow,
    // Modal binding
    "tab:m;ctrl;cmd:toggle" : focusNextWindow,
});

// End of bindings
// _______________

// Util
// ____

/**
 * Returns the number of windows currently accessible.
 */
function windowsCount()
{
    var screen = slate.screen();
    var numberOfWindowsOnCurrentScreen = 0;
    slate.eachApp(function(app) {
        app.eachWindow(function(window) {
            if (window != undefined &&
                window.title() != "" &&
                window.screen().id() === screen.id()) {
                numberOfWindowsOnCurrentScreen += 1;
            }
        });
    });

    return numberOfWindowsOnCurrentScreen;
}

// End of util
// ___________

// The list of windows of the current screen
var windows;
// The current index in windows
var index;

/**
 * Loops over windows of current screen to create the windows array
 * and initialises the index
 */
function createWindowsArray()
{
    windows = new Array();
    index = 0;

    // Use first screen as default
    var screen = slate.screen();
    if (screen.id() < 0 || screen.id() > slate.screenCount()) {
        screen = slate.screenForRef(0);
    }

    slate.eachApp(function(app) {
        app.eachWindow(function(window) {
            if (window != undefined &&
                window.title() != "" &&
                window.screen().id() === screen.id()) {
                windows.push(window);
            }
        });
    });
}

/**
 * Updates the index and focuses the corresponding window. The windows
 * array is created if needed. The creation of the array is required
 * if the array or the index does not exists, or when the number of
 * windows has changed, or when the window has a null size which
 * usually means that the focused window is on another virtual desktop
 * (space) or when the focus change fails.
 */
function focusNextWindow()
{
    if (undefined == windows ||
        undefined == index ||
        windows.length != windowsCount() ||
        isWindowAt('*', '*', 0, 0)) {
        createWindowsArray();
    }

    if (0 == windows.length) {
        return;
    }

    index += 1;
    if (index >= windows.length) {
        index = 0;
    }

    if (! windows[index].focus()) {
        createWindowsArray();
    }
}
