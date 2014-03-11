/* This file uses experemental results so it may not fonction
 * properly. If you find a way to compare two windows instead of
 * suppose an order in the eachApp() and eachWindow() methods please
 * let me know: jean.luc.colombier@gmail.com */

function place2Windows() {
    // Get current window
    var currentWindow = slate.window();
    // Find another window in same screen.
    var screen = currentWindow.screen();
    var secondWindow = null;
    var numberOfTreatedWindowsOnCurrentScreen = 0;
    var windowsArray = new Array();
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

function swapWindows() {
    // Get current window
    var currentWindow = slate.window();
    // Find another window in same screen.
    var screen = currentWindow.screen();
    var secondWindow = null;
    var windowsArray = new Array();
    slate.eachApp(function(app) {
        app.eachWindow(function(window) {
            if (window != currentWindow && window.screen().id() == screen.id()) {
                secondWindow = window;
                windowsArray.push(window.title());
            }
        });
    });
    if (secondWindow == null) {
        slate.log("mon js slate est mort");
        return;
    }
    for (var win in windowsArray) {
        slate.log(win);
    }
    slate.log("1: " + currentWindow.title() + " 2: " + secondWindow.title());
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

function adjustWindowsSizes() {
    // Get current window
    var currentWindow = slate.window();
    // Find another window in same screen.
    var screen = currentWindow.screen();
    var secondWindow = null;
    slate.eachApp(function(app) {
        app.eachWindow(function(window) {
            if (window.screen().id() == screen.id()) {
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
                   Math.abs(secondWindow.rect().width - screenSizeX/3) < 1) {
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
        } else if (Math.abs(currentWindow.rect().width - screenSizeX/3) < 1 &&
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
                   Math.abs(secondWindow.rect().height - screenSizeY/3) < 1) {
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
        } else if (Math.abs(currentWindow.rect().height - screenSizeY/3) < 1 &&
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
