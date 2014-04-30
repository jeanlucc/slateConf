/**
 * This file uses experimental results so it may not fonction
 * properly. If you find a way to compare two windows instead of
 * suppose an order in the eachApp() and eachWindow() methods please
 * let me know at jean.luc.colombier@gmail.com
 */

// Bindings
// ________

slate.bindAll({
    "i:ctrl;cmd"          : swapWindows,
    "o:ctrl;cmd"          : place2Windows,
    "p:ctrl;cmd"          : adjust2WindowsSizes,

    // Modal bindings
    "i:m;ctrl;cmd:toggle" : swapWindows,
    "o:m;ctrl;cmd:toggle" : place2Windows,
    "p:m;ctrl;cmd:toggle" : adjust2WindowsSizes,
});

// End of bindings
// _______________

// Util
// ____

/**
 * Returns another window on the same screen than the window passed
 * in parameter. Returns null if the functions fails.
 */
function getSecondWindow(currentWindow)
{
    var secondWindow = null;
    var screen = currentWindow.screen();
    var numberOfTreatedWindowsOnCurrentScreen = 0;
    slate.eachApp(function(app) {
        app.eachWindow(function(window) {
            if (undefined != window && '' != window.title() && window.screen().id() === screen.id()) {
                numberOfTreatedWindowsOnCurrentScreen += 1;
                if (numberOfTreatedWindowsOnCurrentScreen == 2) {
                    secondWindow = window;
                }
            }
        });
    });

    return secondWindow;
}

// End of util
// ___________

/**
 * Inverts the position of two windows of the current monitor. The
 * current window is the first window and the second is undefined thus
 * it should not be used if there are more than two windows on the
 * current monitor. However it might work in a good way.
 */
function swapWindows()
{
    // Get current window
    var currentWindow = slate.window();
    // Find another window in same screen.
    var secondWindow = getSecondWindow(currentWindow);
    if (null === secondWindow) {
        return;
    }

    // Get windows positions.
    var pos1 = getScreenRelativeWindowPosition(currentWindow);
    var pos2 = getScreenRelativeWindowPosition(secondWindow);
    // Swap them
    moveWindowAt(currentWindow, pos2[0], pos2[1], pos2[2], pos2[3]);
    moveWindowAt(secondWindow, pos1[0], pos1[1], pos1[2], pos1[3]);
}

/**
 * Changes the diposition of two windows of the current monitor. The
 * current window is the first window and the second is undefined thus
 * it should not be used if there are more than two windows on the
 * current monitor. However it might work in a good way. The three
 * possible dispositions are: two full screen windows, side-by-side
 * and top-bottom.
 *
 * Note: it does not work if the window has no name.
 */
function place2Windows()
{
    // Get current window
    var currentWindow = slate.window();
    // Find another window in same screen.
    var secondWindow = getSecondWindow(currentWindow);
    if (secondWindow === null) {
        return;
    }

    // Perform appropriate action.
    if (isWindowAt(currentWindow, 0, 0, 1, 1) &&
        isWindowAt(secondWindow, 0, 0, 1, 1)) {
        // Change to split vertical
        moveWindowAt(currentWindow, 0, 0, 1/2, 1);
        moveWindowAt(secondWindow, 1/2, 0, 1/2, 1);
    } else if (isWindowAt(currentWindow, 0, 0, 1/2, 1) &&
               isWindowAt(secondWindow, 1/2, 0, 1/2, 1)) {
        // Change to split horizontal
        moveWindowAt(currentWindow, 0, 0, 1, 1/2);
        moveWindowAt(secondWindow, 0, 1/2, 1, 1/2);
    } else {
        // Change to full screen
        moveWindowAt(currentWindow, 0, 0, 1, 1);
        moveWindowAt(secondWindow, 0, 0, 1, 1);
    }
}

/**
 * Changes the size of two windows in a particular configuration. The
 * current window is the first window and the second is undefined thus
 * it should not be used if there are more than two windows on the
 * current monitor. However it might work in a good way. There are six
 * possible configurations divided in two groups, the windows can be
 * side-by-side or top-bottom. For each group the three possibilities
 * are the two windows occupies a half screen, the first (left or top)
 * window occupies one third of the screeen and the other window
 * occupies the other two-thirds or the opposit (first two-thirds,
 * second a third).
 */
function adjust2WindowsSizes()
{
    // Get current window
    var currentWindow = slate.window();
    // Find another window in same screen.
    var secondWindow = getSecondWindow(currentWindow);
    if (secondWindow === null) {
        return;
    }

    var biggerTolerancy = 100;

    // Make sure current window is top or left
    if (! isWindowAt(currentWindow, 0, 0, '*', '*')) {
        var tmpWindow = secondWindow;
        secondWindow = currentWindow;
        currentWindow = tmpWindow;
    }

    if (isWindowAt(currentWindow, '*', '*', '*', 1) &&
        isWindowAt(secondWindow, '*', 0, '*', 1)) {
        // Case split vertical
        if (isWindowAt(currentWindow, '*', '*', 1/2, '*') &&
            isWindowAt(secondWindow, 1/2, '*', 1/2, '*')) {
            // Make left window wider
            moveWindowAt(currentWindow, 0, 0, 2/3, 1);
            moveWindowAt(secondWindow, 2/3, 0, 1/3, 1);
        } else if (isWindowAt(currentWindow, '*', '*', 2/3, '*') &&
                   isWindowAtWithPrecision(secondWindow, [2/3], ['*'], [1/3, biggerTolerancy], ['*'])) {
            // Make left window narrower
            moveWindowAt(currentWindow, 0, 0, 1/3, 1);
            moveWindowAt(secondWindow, 1/3, 0, 2/3, 1);
        } else if (isWindowAtWithPrecision(currentWindow, ['*'], ['*'], [1/3, biggerTolerancy], ['*']) &&
                   isWindowAt(secondWindow, 1/3, '*', 2/3, '*')) {
            // Make two windows equally wide
            moveWindowAt(currentWindow, 0, 0, 1/2, 1);
            moveWindowAt(secondWindow, 1/2, 0, 1/2, 1);
        }

    } else if (isWindowAt(currentWindow, '*', '*', 1, '*') &&
               isWindowAt(secondWindow, 0, '*', 1, '*')) {
        // Case split horizontal
        if (isWindowAt(currentWindow, '*', '*', '*', 1/2) &&
            isWindowAt(secondWindow, '*', 1/2, '*', 1/2)) {
            // Make top window taller
            moveWindowAt(currentWindow, 0, 0, 1, 2/3);
            moveWindowAt(secondWindow, 0, 2/3, 1, 1/3);
        } else if (isWindowAt(currentWindow, '*', '*', '*', 2/3) &&
                   isWindowAtWithPrecision(secondWindow, ['*'], [2/3], ['*'], [1/3, biggerTolerancy])) {
            // Make top window shorter
            moveWindowAt(currentWindow, 0, 0, 1, 1/3);
            moveWindowAt(secondWindow, 0, 1/3, 1, 2/3);
        } else if (isWindowAtWithPrecision(currentWindow, ['*'], ['*'], ['*'], [1/3, biggerTolerancy]) &&
                   isWindowAt(secondWindow, '*', 1/3, '*', 2/3)) {
            // Make two windows equally tall
            moveWindowAt(currentWindow, 0, 0, 1, 1/2);
            moveWindowAt(secondWindow, 0, 1/2, 1, 1/2);
        }
    }
}
