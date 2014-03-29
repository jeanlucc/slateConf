/**
 * This file uses experimental results so it may not fonction
 * properly. If you find a way to compare two windows instead of
 * suppose an order in the eachApp() and eachWindow() methods please
 * let me know: jean.luc.colombier@gmail.com
 */

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
    if (secondWindow == null) {
        return;
    }

    // Perform appropriate action.
    if (isWindowPosition(currentWindow, 0, 0, 1, 1) &&
        isWindowPosition(secondWindow, 0, 0, 1, 1)) {
        // Change to split vertical
        moveWindowAt(currentWindow, 0, 0, 1/2, 1);
        moveWindowAt(secondWindow, 1/2, 0, 1/2, 1);
    } else if (isWindowPosition(currentWindow, 0, 0, 1/2, 1) &&
               isWindowPosition(secondWindow, 1/2, 0, 1/2, 1)) {
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
    if (secondWindow == null) {
        return;
    }

    // Perform appropriate action.
    var currentWindowPos = getScreenRelativeWindowPosition(currentWindow);
    var secondWindowPos = getScreenRelativeWindowPosition(secondWindow);
    moveWindowAt(currentWindow, secondWindow[0], secondWindow[1], secondWindow[2], secondWindow[3]);
    moveWindowAt(secondWindow, currentWindow[0], currentWindow[1], currentWindow[2], currentWindow[3]);
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
function adjustWindowsSizes()
{
    // Get current window
    var currentWindow = slate.window();
    // Find another window in same screen.
    var secondWindow = getSecondWindow(currentWindow);
    if (secondWindow == null) {
        return;
    }

    var biggerTolerancy = 100;

    // Make sure current window is top or left
    var screen = currentWindow.screen();
    var screenOriginX = screen.visibleRect().x;
    var screenOriginY = screen.visibleRect().y;
    var screenSizeX = screen.visibleRect().width;
    var screenSizeY = screen.visibleRect().height;
    var isFocusedWindowTopLeft =
        currentWindow.topLeft().x == screenOriginX &&
        currentWindow.topLeft().y == screenOriginY;
    if (!isFocusedWindowTopLeft) {
        var tmpWindow = secondWindow;
        secondWindow = currentWindow;
        currentWindow = tmpWindow;
    }

    if (currentWindow.rect().height == screenSizeY &&
        secondWindow.rect().height == screenSizeY &&
        secondWindow.rect().y == screenOriginY) {
        // Case split vertical
        if (Math.abs(currentWindow.rect().width - screenSizeX/2) < 1 &&
            Math.abs(secondWindow.rect().x - (screenOriginX + screenSizeX/2)) < 1 &&
            Math.abs(secondWindow.rect().width - screenSizeX/2) < 1) {
            // Make left window wider
            moveWindowAt(currentWindow, 0, 0, 2/3, 1);
            moveWindowAt(secondWindow, 2/3, 0, 1/3, 1);
        } else if (Math.abs(currentWindow.rect().width - 2*screenSizeX/3) < 1 &&
                   Math.abs(secondWindow.rect().x - (screenOriginX + 2*screenSizeX/3)) < 1 &&
                   secondWindow.rect().width - screenSizeX/3 < biggerTolerancy &&
                   screenSizeX/3 - secondWindow.rect().width < 1) {
            // Make left window narrower
            moveWindowAt(currentWindow, 0, 0, 1/3, 1);
            moveWindowAt(secondWindow, 1/3, 0, 2/3, 1);
        } else if (currentWindow.rect().width - screenSizeX/3 < biggerTolerancy &&
                   screenSizeX/3 - currentWindow.rect().width < 1 &&
                   Math.abs(secondWindow.rect().x - (screenOriginX + screenSizeX/3)) < 1 &&
                   Math.abs(secondWindow.rect().width - 2*screenSizeX/3) < 1) {
            // Make two windows equally wide
            moveWindowAt(currentWindow, 0, 0, 1/2, 1);
            moveWindowAt(secondWindow, 1/2, 0, 1/2, 1);
        }

    } else if (currentWindow.rect().width == screenSizeX &&
               secondWindow.rect().width == screenSizeX &&
               secondWindow.rect().x == screenOriginX) {
        // Case split horizontal
        if (Math.abs(currentWindow.rect().height - screenSizeY/2) < 1 &&
            Math.abs(secondWindow.rect().y - (screenOriginY + screenSizeY/2)) < 1 &&
            Math.abs(secondWindow.rect().height - screenSizeY/2) < 1) {
            // Make top window taller
            moveWindowAt(currentWindow, 0, 0, 1, 2/3);
            moveWindowAt(secondWindow, 0, 2/3, 1, 1/3);
        } else if (Math.abs(currentWindow.rect().height - 2*screenSizeY/3) < 1 &&
                   Math.abs(secondWindow.rect().y - (screenOriginY + 2*screenSizeY/3)) < 1 &&
                   secondWindow.rect().height - screenSizeY/3 < biggerTolerancy &&
                   screenSizeY/3 - secondWindow.rect().height < 1) {
            // Make top window shorter
            moveWindowAt(currentWindow, 0, 0, 1, 1/3);
            moveWindowAt(secondWindow, 0, 1/3, 1, 2/3);
        } else if (currentWindow.rect().height - screenSizeY/3 < biggerTolerancy &&
                   screenSizeY/3 - currentWindow.rect().height < 1 &&
                   Math.abs(secondWindow.rect().y - (screenOriginY + screenSizeY/3)) < 1 &&
                   Math.abs(secondWindow.rect().height - 2*screenSizeY/3) < 1) {
            // Make two windows equally tall
            moveWindowAt(currentWindow, 0, 0, 1, 1/2);
            moveWindowAt(secondWindow, 0, 1/2, 1, 1/2);
        }
    }
}

/**
 * Tests the position of the window passed in parameter with a
 * precision of 1 pixel. The x and y parameters corresponds to the
 * coordinates of the top-left corner, w to the width and h to the
 * height of the desired position. Those four values must be between 0
 * and 1 or any string which will be interpreted as a wildcard. For
 * the coordinates (0, 0) is the top-left and (1, 1) is the
 * bottom-right corner of the screen. For the size 1 is the size of
 * the screen.
 */
function isWindowPosition(window, x, y, w, h)
{
    var pos = new Array(x, y, w, h);

    conditions = new Array();
    // Find wildcards
    for (var i = 0; i < pos.length; i++) {
        if (typeof pos[i] === "string") {
            conditions[i] = true;
        } else if (typeof pos[i] !== 'number' || pos[i] > 1 || pos[i] < 0) {
            return false;
        }
    }

    var precision = 1;
    var screen = window.screen();
    var screenOriginX = screen.visibleRect().x;
    var screenOriginY = screen.visibleRect().y;
    var screenSizeX = screen.visibleRect().width;
    var screenSizeY = screen.visibleRect().height;

    if (! conditions[0]) {
        conditions[0] = Math.abs(window.rect().x - (screenOriginX + pos[0] * screenSizeX)) < precision;
    }
    if (! conditions[1]) {
        conditions[1] = Math.abs(window.rect().y - (screenOriginY + pos[1] * screenSizeY)) < precision;
    }
    if (! conditions[2]) {
        conditions[2] = Math.abs(window.rect().width - (pos[2] * screenSizeX)) < precision;
    }
    if (! conditions[3]) {
        conditions[3] = Math.abs(window.rect().height - (pos[3] * screenSizeY)) < precision;
    }

    return conditions[0] && conditions[1] && conditions[2] && conditions[3];
}

/**
 * Moves the window passed in parameter. The x and y parameters
 * corresponds to the coordinates of the top-left corner, w to the
 * width and h to the height of the desired position. Those four
 * values must be between 0 and 1. For the coordinates (0, 0) is the
 * top-left and (1, 1) is the bottom-right corner of the screen. For
 * the size 1 is the size of the screen.
 */
function moveWindowAt(window, x, y, w, h)
{
    var screen = window.screen();
    moveWindowToScreenAt(window, x, y, w, h, screen);
}

/**
 * Moves the window passed in parameter. The x and y parameters
 * corresponds to the coordinates of the top-left corner, w to the
 * width and h to the height of the desired position. Those four
 * values must be between 0 and 1. For the coordinates (0, 0) is the
 * top-left and (1, 1) is the bottom-right corner of the screen. For
 * the size 1 is the size of the screen. The window is moved in the
 * screen passed in parameters.
 */
function moveWindowToScreenAt(window, x, y, w, h, screen)
{
    var screenOriginX = screen.visibleRect().x;
    var screenOriginY = screen.visibleRect().y;
    var screenSizeX = screen.visibleRect().width;
    var screenSizeY = screen.visibleRect().height;

    window.doOperation("move", {
        "x" : screenOriginX + x * screenSizeX,
        "y" : screenOriginY + y * screenSizeY,
        "width" : w * screenSizeX,
        "height" : h * screenSizeY,
        "screen" : screen.id()});
}

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
            if (window != undefined && window.title() != "" && window.screen().id() === screen.id()) {
                numberOfTreatedWindowsOnCurrentScreen += 1;
                if (numberOfTreatedWindowsOnCurrentScreen == 2)
                    secondWindow = window;
            }
        });
    });

    return secondWindow;
}

/**
 * Throws the window to next screen keeping the same position
 * relatively to screen.
 */
function throwToNextScreen()
{
    // Get next screen
    var nextId = (window.screen().id() + 1) % slate.screenCount();
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
    var previousId = (window.screen().id() - 1) % slate.screenCount();
    var screen = slate.screenForRef(nextId);

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
    // Get current window
    var window = slate.window();
    // Get window position relatively to the screen
    var pos = getScreenRelativeWindowPosition(window);

    moveWindowToScreenAt(window, pos[0], pos[1], pos[2], pos[3], screen);
}

/**
 * Returns an array of 4 floats between 0 and 1. The two firsts give
 * the coordinate of the window relatively to the screen, (0, 0) means
 * at top-left and (1, 1) at bottom-right. The next element is the
 * width, 1 means as wide as the screen. The last element is the
 * height, 1 means as high as the screen.
 */
function getScreenRelativeWindowPosition(window)
{
    var screen = window.screen();
    var x = (window.rect().x - screen.visibleRect().x) / screen.visibleRect().width;
    var y = (window.rect().y - screen.visibleRect().y) / screen.visibleRect().height;
    var w = window.rect().width / screen.visibleRect().width;
    var h = window.rect().height / screen.visibleRect().height;

    return new Array(x, y, w, h);
}

slate.bind("o:ctrl;cmd", place2Windows);
slate.bind("i:ctrl;cmd", swapWindows);
slate.bind("p:ctrl;cmd", adjustWindowsSizes);
slate.bind("a:ctrl;cmd", throwToNextScreen);
slate.bind("z:ctrl;cmd", throwToPreviousScreen);
slate.bind("1:ctrl;cmd", throwToFirstScreen);
slate.bind("2:ctrl;cmd", throwToSecondScreen);
slate.bind("3:ctrl;cmd", throwToThirdScreen);

slate.bind("o:m;ctrl;cmd:toggle", place2Windows);
slate.bind("i:m;ctrl;cmd:toggle", swapWindows);
slate.bind("p:m;ctrl;cmd:toggle", adjustWindowsSizes);
slate.bind("a:m;ctrl;cmd:toggle", throwToNextScreen);
slate.bind("z:m;ctrl;cmd:toggle", throwToPreviousScreen);
slate.bind("1:m;ctrl;cmd:toggle", throwToFirstScreen);
slate.bind("2:m;ctrl;cmd:toggle", throwToSecondScreen);
slate.bind("3:m;ctrl;cmd:toggle", throwToThirdScreen);
