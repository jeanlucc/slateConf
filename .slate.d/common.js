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
function isWindowAt(window, x, y, w, h)
{
    var precision = 2;
    return isWindowAtWithPrecision(
        window,
        [x, precision, precision],
        [y, precision, precision],
        [w, precision, precision],
        [h, precision, precision]
    );
}

/**
 * Tests the position of the window passed in parameter with the given
 * precisions in pixel. The x and y parameters corresponds to the
 * coordinates of the top-left corner, w to the width and h to the
 * height of the desired position. Those four arguments are arrays of
 * three elements the first element is the value, the next is the
 * tolerated precision for bigger than expected value and the last is
 * the tolerated precision for smaller than expected value. The values
 * must be between 0 and 1 or any string which will be interpreted as
 * a wildcard. The precision must be an integer greater than 1, any
 * other value will be interpreted as 1. For the coordinates (0, 0) is
 * the top-left and (1, 1) is the bottom-right corner of the
 * screen. For the sizes 1 is the size of the screen.
 */
function isWindowAtWithPrecision(window, x, y, w, h)
{
    if (undefined == window) {
        return false;
    }

    var defaultPrecision = 1;
    var pos = new Array(x[0], y[0], w[0], h[0]);
    var precisionBigger = new Array(x[1], y[1], w[1], h[1]);
    var precisionSmaller = new Array(x[2], y[2], w[2], h[2]);

    conditions = new Array();
    // Find wildcards
    for (var i = 0; i < pos.length; i++) {
        if (typeof pos[i] == "string") {
            conditions[i] = true;
        } else if (typeof pos[i] != 'number' || pos[i] > 1 || pos[i] < 0) {
            return false;
        } else {
            if (typeof precisionBigger[i] != "number" || precisionBigger[i] < 1) {
                precisionBigger[i] = defaultPrecision;
            }
            if (typeof precisionSmaller[i] != "number" || precisionSmaller[i] < 1) {
                precisionSmaller[i] = defaultPrecision;
            }
        }
    }

    var screen = window.screen();
    var screenOriginX = screen.visibleRect().x;
    var screenOriginY = screen.visibleRect().y;
    var screenSizeX = screen.visibleRect().width;
    var screenSizeY = screen.visibleRect().height;

    if (! conditions[0]) {
        conditions[0] =
            ((window.rect().x - (screenOriginX + pos[0] * screenSizeX)) < precisionBigger[0]) &&
            (-(window.rect().x - (screenOriginX + pos[0] * screenSizeX)) < precisionSmaller[0]);
    }

    if (! conditions[1]) {
        conditions[1] =
            ((window.rect().y - (screenOriginY + pos[1] * screenSizeY)) < precisionBigger[1]) &&
            (-(window.rect().y - (screenOriginY + pos[1] * screenSizeY)) < precisionSmaller[1]);
    }

    if (! conditions[2]) {
        conditions[2] =
            ((window.rect().width - (pos[2] * screenSizeX)) < precisionBigger[2]) &&
            (-(window.rect().width - (pos[2] * screenSizeX)) < precisionSmaller[2]);
    }

    if (! conditions[3]) {
        conditions[3] =
            ((window.rect().height - (pos[3] * screenSizeY)) < precisionBigger[3]) &&
            (-(window.rect().height - (pos[3] * screenSizeY)) < precisionSmaller[3]);
    }

    return conditions[0] && conditions[1] && conditions[2] && conditions[3];
}

/**
 * Moves the window passed in parameter. The x and y parameters
 * corresponds to the coordinates of the top-left corner, w to the
 * width and h to the height of the desired position. Those four
 * values must be between 0 and 1. For the coordinates (0, 0) is the
 * top-left and (1, 1) is the bottom-right corner of the screen. For
 * the sizes 1 is the size of the screen. The window is moved in the
 * screen passed in parameters or the screen of the current window if
 * none is given.
 */
function moveWindowAt(window, x, y, w, h, screen)
{
    if (undefined == window) {
        return;
    }

    if (undefined == screen) {
        screen = window.screen();
    }

    window.doOperation(getMoveOperation(x, y, w, h, screen));
}

/**
 * Creates a move operation with the parameters. The x and y
 * parameters corresponds to the coordinates of the top-left corner, w
 * to the width and h to the height of the desired position. Those
 * four values must be between 0 and 1. For the coordinates (0, 0) is
 * the top-left and (1, 1) is the bottom-right corner of the
 * screen. For the sizes 1 is the size of the screen. w and h are
 * saturated thus the window will not exceed screen limits. The window
 * is moved in the screen passed in parameters or the current focused
 * screen if none is given. Returns undefined on error;
 */
function getMoveOperation(x, y, w, h, screen)
{
    if (typeof x != "number" || typeof y != "number" ||
        typeof w != "number" || typeof h != "number" ||
        x < 0 || y < 0 || w < 0 || h < 0 || x > 1 || y > 1) {
        return;
    }

    if (x + w > 1) {
        w = 1 - x;
    }
    if (y + h > 1) {
        h = 1 - y
    }

    if (undefined == screen ||
        screen.id() < 0 || screen.id() > slate.screenCount() ) {
        screen = slate.screen();
    }

    var screenOriginX = screen.visibleRect().x;
    var screenOriginY = screen.visibleRect().y;
    var screenSizeX = screen.visibleRect().width;
    var screenSizeY = screen.visibleRect().height;

    return slate.operation("move", {
        "x" : screenOriginX + x * screenSizeX,
        "y" : screenOriginY + y * screenSizeY,
        "width" : w * screenSizeX,
        "height" : h * screenSizeY,
        "screen" : screen.id()});
}

/**
 * Returns an array of 4 floats between 0 and 1 or undefined in case
 * of failure. The two firsts give the coordinate of the window
 * relatively to the screen, (0, 0) means at top-left and (1, 1) at
 * bottom-right. The next element is the width, 1 means as wide as the
 * screen. The last element is the height, 1 means as high as the
 * screen.
 */
function getScreenRelativeWindowPosition(window)
{
    if (undefined == window || undefined == window.rect()) {
        return;
    }

    var screen = window.screen();
    var x = (window.rect().x - screen.visibleRect().x) / screen.visibleRect().width;
    var y = (window.rect().y - screen.visibleRect().y) / screen.visibleRect().height;
    var w = window.rect().width / screen.visibleRect().width;
    var h = window.rect().height / screen.visibleRect().height;

    return new Array(x, y, w, h);
}
