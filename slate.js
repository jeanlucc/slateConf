/* This file uses experimental results so it may not fonction
 * properly. If you find a way to compare two windows instead of
 * suppose an order in the eachApp() and eachWindow() methods please
 * let me know: jean.luc.colombier@gmail.com */

/* Changes the diposition of two windows of the current monitor. The
 * current window is the first window and the second is undefined thus
 * it should not be used if there are more than two windows on the
 * current monitor. However it might work in a good way. The three
 * possible dispositions are: two full screen windows, side-by-side
 * and top-bottom.
 *
 * Note: it does not work if the window has no name. */
function place2Windows() {
    // Get current window
    var currentWindow = slate.window();
    // Find another window in same screen.
    var screen = currentWindow.screen();
    var secondWindow = null;
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
    if (secondWindow == null) {
        return;
    }
    slate.log([currentWindow.title(),
               currentWindow.screen().id(),
               currentWindow.app().name(),
               currentWindow.rect().x,
               currentWindow.rect().y,
               currentWindow.rect().width,
               currentWindow.rect().height,
              ]);
    slate.log([secondWindow.title(),
               secondWindow.screen().id(),
               secondWindow.app().name(),
               secondWindow.rect().x,
               secondWindow.rect().y,
               secondWindow.rect().width,
               secondWindow.rect().height,
              ]);

    // Perform appropriate action.
    var screenOriginX = screen.visibleRect().x;
    var screenOriginY = screen.visibleRect().y;
    var screenSizeX = screen.visibleRect().width;
    var screenSizeY = screen.visibleRect().height;
    if (currentWindow.rect().x == screenOriginX &&
        currentWindow.rect().y == screenOriginY &&
        currentWindow.rect().width == screenSizeX &&
        currentWindow.rect().height == screenSizeY &&
        secondWindow.rect().x == screenOriginX &&
        secondWindow.rect().y == screenOriginY &&
        secondWindow.rect().width == screenSizeX &&
        secondWindow.rect().height == screenSizeY) {
        // Change to split vertical
        secondWindow.doOperation("move", {
            "x" : screenOriginX + screenSizeX/2,
            "y" : screenOriginY,
            "width" : screenSizeX/2,
            "height" : screenSizeY
        });
        currentWindow.doOperation("move", {
            "x" : screenOriginX,
            "y" : screenOriginY,
            "width" : screenSizeX/2,
            "height" : screenSizeY
        });
    } else if (currentWindow.rect().x == screenOriginX &&
               currentWindow.rect().y == screenOriginY &&
               currentWindow.rect().width == screenSizeX/2 &&
               currentWindow.rect().height == screenSizeY &&
               secondWindow.rect().x == screenOriginX + screenSizeX/2 &&
               secondWindow.rect().y == screenOriginY &&
               secondWindow.rect().width == screenSizeX/2 &&
               secondWindow.rect().height == screenSizeY) {
        // Change to split horizontal
        secondWindow.doOperation("move", {
            "x" : screenOriginX,
            "y" : screenOriginY + screenSizeY/2,
            "width" : screenSizeX,
            "height" : screenSizeY/2
        });
        currentWindow.doOperation("move", {
            "x" : screenOriginX,
            "y" : screenOriginY,
            "width" : screenSizeX,
            "height" : screenSizeY/2
        });
    } else {
        // Change to full screen
        secondWindow.doOperation("move", {
            "x" : screenOriginX,
            "y" : screenOriginY,
            "width" : screenSizeX,
            "height" : screenSizeY
        });
        currentWindow.doOperation("move", {
            "x" : screenOriginX,
            "y" : screenOriginY,
            "width" : screenSizeX,
            "height" : screenSizeY
        });
    }
}

/* Inverts the position of two windows of the current monitor. The
 * current window is the first window and the second is undefined thus
 * it should not be used if there are more than two windows on the
 * current monitor. However it might work in a good way. */
function swapWindows() {
    // Get current window
    var currentWindow = slate.window();
    // Find another window in same screen.
    var screen = currentWindow.screen();
    var secondWindow = null;
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
    if (secondWindow == null) {
        slate.log("mon js slate est mort");
        return;
    }
    slate.log([currentWindow.title(),
               currentWindow.screen().id(),
               currentWindow.app().name(),
               currentWindow.rect().x,
               currentWindow.rect().y,
               currentWindow.rect().width,
               currentWindow.rect().height,
              ]);
    slate.log([secondWindow.title(),
               secondWindow.screen().id(),
               secondWindow.app().name(),
               secondWindow.rect().x,
               secondWindow.rect().y,
               secondWindow.rect().width,
               secondWindow.rect().height,
              ]);

    // Perform appropriate action.
    var secondWindowOriginX = secondWindow.rect().x;
    var secondWindowOriginY = secondWindow.rect().y;
    var secondWindowSizeX = secondWindow.rect().width;
    var secondWindowSizeY = secondWindow.rect().height;
    secondWindow.doOperation("move", {
        "x" : currentWindow.rect().x,
        "y" : currentWindow.rect().y,
        "width" : currentWindow.rect().width,
        "height" : currentWindow.rect().height
    });
    currentWindow.doOperation("move", {
        "x" : secondWindowOriginX,
        "y" : secondWindowOriginY,
        "width" : secondWindowSizeX,
        "height" : secondWindowSizeY
    });
}

/* Changes the size of two windows in a particular configuration. The
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
function adjustWindowsSizes() {
    // Get current window
    var currentWindow = slate.window();
    // Find another window in same screen.
    var screen = currentWindow.screen();
    var secondWindow = null;
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
    if (secondWindow == null) {
        return;
    }

    // Make sure current window is top or left
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
    // Perform appropriate action.
    if (!isFocusedWindowTopLeft && (
        currentWindow.rect().x != screenOriginX ||
        currentWindow.rect().y != screenOriginY)) {
        return;
    }
    if (currentWindow.rect().height == screenSizeY &&
        secondWindow.rect().height == screenSizeY &&
        secondWindow.rect().y == screenOriginY) {
        // Split vertical
        if (Math.abs(currentWindow.rect().width - screenSizeX/2) < 1 &&
            Math.abs(secondWindow.rect().x - (screenOriginX + screenSizeX/2)) < 1 &&
            Math.abs(secondWindow.rect().width - screenSizeX/2) < 1) {
            // Make left window wider
            secondWindow.doOperation("move", {
                "x" : screenOriginX + 2*screenSizeX/3,
                "y" : screenOriginY,
                "width" : screenSizeX/3,
                "height" : screenSizeY
            });
            currentWindow.doOperation("move", {
                "x" : screenOriginX,
                "y" : screenOriginY,
                "width" : 2*screenSizeX/3,
                "height" : screenSizeY
            });
        } else if (Math.abs(currentWindow.rect().width - 2*screenSizeX/3) < 1 &&
                   Math.abs(secondWindow.rect().x - (screenOriginX + 2*screenSizeX/3)) < 1 &&
                   secondWindow.rect().width - screenSizeX/3 < 40 &&
                   screenSizeX/3 - secondWindow.rect().width < 1) {
            // Make left window narrower
            secondWindow.doOperation("move", {
                "x" : screenOriginX + screenSizeX/3,
                "y" : screenOriginY,
                "width" : 2*screenSizeX/3,
                "height" : screenSizeY
            });
            currentWindow.doOperation("move", {
                "x" : screenOriginX,
                "y" : screenOriginY,
                "width" : screenSizeX/3,
                "height" : screenSizeY
            });
        } else if (currentWindow.rect().width - screenSizeX/3 < 40 &&
                   screenSizeX/3 - currentWindow.rect().width < 1 &&
                   Math.abs(secondWindow.rect().x - (screenOriginX + screenSizeX/3)) < 1 &&
                   Math.abs(secondWindow.rect().width - 2*screenSizeX/3) < 1) {
            // Make two windows equally wide
            secondWindow.doOperation("move", {
                "x" : screenOriginX + screenSizeX/2,
                "y" : screenOriginY,
                "width" : screenSizeX/2,
                "height" : screenSizeY
            });
            currentWindow.doOperation("move", {
                "x" : screenOriginX,
                "y" : screenOriginY,
                "width" : screenSizeX/2,
                "height" : screenSizeY
            });
        }

    } else if (currentWindow.rect().width == screenSizeX &&
               secondWindow.rect().width == screenSizeX &&
               secondWindow.rect().x == screenOriginX) {
        if (Math.abs(currentWindow.rect().height - screenSizeY/2) < 1 &&
            Math.abs(secondWindow.rect().y - (screenOriginY + screenSizeY/2)) < 1 &&
            Math.abs(secondWindow.rect().height - screenSizeY/2) < 1) {
            // Make top window taller
            secondWindow.doOperation("move", {
                "x" : screenOriginX,
                "y" : screenOriginY + 2*screenSizeY/3,
                "width" : screenSizeX,
                "height" : screenSizeY/3
            });
            currentWindow.doOperation("move", {
                "x" : screenOriginX,
                "y" : screenOriginY,
                "width" : screenSizeX,
                "height" : 2*screenSizeY/3
            });
        } else if (Math.abs(currentWindow.rect().height - 2*screenSizeY/3) < 1 &&
                   Math.abs(secondWindow.rect().y - (screenOriginY + 2*screenSizeY/3)) < 1 &&
                   secondWindow.rect().height - screenSizeY/3 < 40 &&
                   screenSizeY/3 - secondWindow.rect().height < 1) {
            // Make top window shorter
            secondWindow.doOperation("move", {
                "x" : screenOriginX,
                "y" : screenOriginY + screenSizeY/3,
                "width" : screenSizeX,
                "height" : 2*screenSizeY/3
            });
            currentWindow.doOperation("move", {
                "x" : screenOriginX,
                "y" : screenOriginY,
                "width" : screenSizeX,
                "height" : screenSizeY/3
            });
        } else if (currentWindow.rect().height - screenSizeY/3 < 40 &&
                   screenSizeY/3 - currentWindow.rect().height < 1 &&
                   Math.abs(secondWindow.rect().y - (screenOriginY + screenSizeY/3)) < 1 &&
                   Math.abs(secondWindow.rect().height - 2*screenSizeY/3) < 1) {
            // Make two windows equally tall
            secondWindow.doOperation("move", {
                "x" : screenOriginX,
                "y" : screenOriginY + screenSizeY/2,
                "width" : screenSizeX,
                "height" : screenSizeY/2
            });
            currentWindow.doOperation("move", {
                "x" : screenOriginX,
                "y" : screenOriginY,
                "width" : screenSizeX,
                "height" : screenSizeY/2
            });
        }
    } else {
        return;
    }
    // Put the focus on the initial current window
    if (!isFocusedWindowTopLeft) {
        secondWindow.focus();
    }
}

function logMe() {
    // Get current window
    var currentWindow = slate.window();
    // Find another window in same screen.
    var screen = currentWindow.screen();
    var secondWindow = null;
    var numberOfWindowOnCurrentScreen = 0;
    var windowsArray = new Array();
    slate.eachApp(function(app) {
        app.eachWindow(function(window) {
            if (window != undefined && window.title() != "" && window.screen().id() === screen.id()) {
                numberOfWindowOnCurrentScreen += 1;
                secondWindow = window;

                windowsArray.push(
                    [window.title(),
                     window.screen().id(),
                     window.app().name(),
                     window.rect().x,
                     window.rect().y,
                     window.rect().width,
                     window.rect().height,
                    ]
                );
            }
        });
    });
    if (secondWindow == null) {
        slate.log("Mon slate js est mort");
        return;
    }
    for(var i = 0; i < windowsArray.length; i++) {
        slate.log(windowsArray[i]);
    }
    slate.log("n = " + numberOfWindowOnCurrentScreen + " 1 : " + currentWindow.title() + " 2 : " + secondWindow.title());
}

slate.bind("b:ctrl;cmd", logMe);
slate.bind("o:ctrl;cmd", place2Windows);
slate.bind("i:ctrl;cmd", swapWindows);
slate.bind("p:ctrl;cmd", adjustWindowsSizes);
