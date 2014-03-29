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

    slate.log("TEST");
    // Perform appropriate action.
    if (isWindowPosition(currentWindow, 0, 0, 1, 1) &&
        isWindowPosition(secondWindow, 0, 0, 1, 1)) {
        // Change to split vertical
        slate.log("Two full");
        moveWindowAt(currentWindow, 0, 0, 1/2, 1);
        moveWindowAt(secondWindow, 1/2, 0, 1/2, 1);
    } else if (isWindowPosition(currentWindow, 0, 0, 1/2, 1) &&
               isWindowPosition(secondWindow, 1/2, 0, 1/2, 1)) {
        // Change to split horizontal
        slate.log("split vertical");
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
    var currentWindowOriginX = currentWindow.rect().x;
    var currentWindowOriginY = currentWindow.rect().y;
    var currentWindowSizeX = currentWindow.rect().width;
    var currentWindowSizeY = currentWindow.rect().height;
    currentWindow.doOperation("move", {
        "x" : secondWindow.rect().x,
        "y" : secondWindow.rect().y,
        "width" : secondWindow.rect().width,
        "height" : secondWindow.rect().height
    });
    secondWindow.doOperation("move", {
        "x" : currentWindowOriginX,
        "y" : currentWindowOriginY,
        "width" : currentWindowSizeX,
        "height" : currentWindowSizeY
    });
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
 * precision of ten pixels. The x and y parameters corresponds to the
 * coordinates of the top-left corner, w to the width and h to the
 * height of the desired position. Those four values must be between 0
 * and 1. For the coordinates (0, 0) is the top-left and (1, 1) is the
 * bottom-right corner of the screen. For the size 1 is the size of
 * the screen.
 */
function isWindowPosition(window, x, y, w, h)
{
    var precision = 10;
    var screen = window.screen();
    var screenOriginX = screen.visibleRect().x;
    var screenOriginY = screen.visibleRect().y;
    var screenSizeX = screen.visibleRect().width;
    var screenSizeY = screen.visibleRect().height;

    if (Math.abs(window.rect().x - (screenOriginX + x * screenSizeX)) < precision &&
        Math.abs(window.rect().y - (screenOriginY + y * screenSizeY)) < precision &&
        Math.abs(window.rect().width - (w * screenSizeX)) < precision  &&
        Math.abs(window.rect().height - (h * screenSizeY)) < precision) {
        return true;
    }

    slate.log(window.title()),
    slate.log(window.rect().x + ' // ' + Math.abs(window.rect().x - (screenOriginX + x * screenSizeX)));
    slate.log(window.rect().y + ' // ' + Math.abs(window.rect().y - (screenOriginY + y * screenSizeY)));
    slate.log(window.rect().width + ' // ' + Math.abs(window.rect().width - (w * screenSizeX)));
    slate.log(window.rect().height + ' // ' + Math.abs(window.rect().height - (h * screenSizeY)));

    return false;
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
    var screenOriginX = screen.visibleRect().x;
    var screenOriginY = screen.visibleRect().y;
    var screenSizeX = screen.visibleRect().width;
    var screenSizeY = screen.visibleRect().height;

    window.doOperation("move", {
        "x" : screenOriginX + x * screenSizeX,
        "y" : screenOriginY + y * screenSizeY,
        "width" : w * screenSizeX,
        "height" : h * screenSizeY});
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

    return secondWindow
}

slate.bind("o:ctrl;cmd", place2Windows);
slate.bind("i:ctrl;cmd", swapWindows);
slate.bind("p:ctrl;cmd", adjustWindowsSizes);
