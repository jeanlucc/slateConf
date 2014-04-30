slate.bindAll({
    "up:ctrl;cmd" : focusUp,
    "left:ctrl;cmd" : focusLeft,
    "right:ctrl;cmd" : focusRight,
    "down:ctrl;cmd" : focusDown,
});

// Utils
// _____

/**
 * Compares the rectangle positions of the two windows. Returns true if
 * they are equal, false otherwise.
 */
function windowsAreEqual(window1, window2)
{
    if (window1.rect().x == window2.rect().x &&
        window1.rect().y == window2.rect().y &&
        window1.rect().width == window2.rect().width &&
        window1.rect().height == window2.rect().height) {
        return true;
    }

    return false;
}

/**
 * Returns true if the given point is within the rectangle of the
 * given window, false otherwise.
 */
function pointInWindowRectangle(point, window)
{
    if (point['x'] <= window.rect().x + window.rect().width &&
        point['x'] >= window.rect().x &&
        point['y'] <= window.rect().y + window.rect().height &&
        point['y'] >= window.rect().y) {
        return true;
    }

    return false;
}

/**
 * Returns true if the given point is within the rectangle of the
 * given window, false otherwise.
 */
function pointStrictlyInWindowRectangle(point, window)
{
    if (point['x'] < window.rect().x + window.rect().width &&
        point['x'] > window.rect().x &&
        point['y'] < window.rect().y + window.rect().height &&
        point['y'] > window.rect().y) {
        return true;
    }

    return false;
}

/**
 * Returns the size interval [xy1[0], xy1[1]] and [xy2[0], xy2[1]]
 * have in common. xy[0] must be less than xy[1].
 */
function intervalAlignSize(xy1, xy2)
{
    return Math.min(xy1[1], xy2[1]) -  Math.max(xy1[0], xy2[0]);
}

// End of Utils
// ____________

/**
 * Focus a window above the current window.
 */
function focusUp()
{
    changeFocus('up');
}

/**
 * Focus a window on the left of the current window.
 */
function focusLeft()
{
    changeFocus('left');
}

/**
 * Focus a window on the right of the current window.
 */
function focusRight()
{
    changeFocus('right');
}

/**
 * Focus a window below the current window.
 */
function focusDown()
{
    changeFocus('down');
}

/**
 * Focus a window in the given direction relative to the current
 * window.
 */
function changeFocus(direction)
{
    var window = slate.window();
    if (undefined == window || '' == window.title()) {
        return;
    }

    var pointsToSearch = findSearchPoints(window, direction);
    var firstPlanWindows = findWindowsOnFirstPlanUnderPoints(pointsToSearch);
    if (0 == firstPlanWindows.length) {
        return;
    } else if (1 == firstPlanWindows.length) {
        var nextWindow = firstPlanWindows[0];
    } else {
        var nextWindow = findBestWindow(firstPlanWindows, window, direction);
    }

    if (undefined != nextWindow && '' != nextWindow.title()) {
        nextWindow.focus();
    }
}

/**
 * Finds a grid of points in the search area. The search area is
 * defined by the window and the direction which can be one of right,
 * left, up or down.
 */
function findSearchPoints(window, direction)
{
    var pointsToSearch = [];

    slate.eachScreen(function(screen) {
        var pointsToSearchForScreen = findSearchPointsForScreen(
            screen, window, direction
        );
        pointsToSearch.push.apply(pointsToSearch, pointsToSearchForScreen);
    });

    return pointsToSearch;
}

/**
 * Finds a grid of points of given screen in the search area. The
 * search area is defined by the window and the direction which can be
 * one of right, left, up or down.
 */
function findSearchPointsForScreen(screen, window, direction)
{
    var upLimit = screen.visibleRect().y;
    var leftLimit = screen.visibleRect().x;
    var rightLimit = screen.visibleRect().x + screen.visibleRect().width;
    var downLimit = screen.visibleRect().y + screen.visibleRect().height;

    if ('up' == direction) {
        downLimit = Math.min(
            downLimit,
            window.rect().y - 1
        );
    } else if ('left' == direction) {
        rightLimit = Math.min(
            rightLimit,
            window.rect().x - 1
        );
    } else if ('right' == direction) {
        leftLimit = Math.max(
            leftLimit,
            window.rect().x + window.rect().width + 1
        );
    } else if ('down' == direction) {
        upLimit = Math.max(
            upLimit,
            window.rect().y + window.rect().height + 1
        );
    } else {
        return array();
    }

    return findPointsInRectangle(
        upLimit,
        leftLimit,
        rightLimit,
        downLimit
    );
}

/**
 * Finds a grid of points within the given limits
 *
 * The grid has the following pattern:
 * .   .   .   .
 *   .   .   .
 * .   .   .   .
 *
 * The space between two lines is given by gridSize and the space
 * between two points of the same line is twice longer.
 */
function findPointsInRectangle(upLimit, leftLimit, rightLimit, downLimit)
{
    var gridSize = 50;
    var points = [];

    for (var y = downLimit; y >= upLimit; y -= gridSize) {
        var xInit = rightLimit;
        xInit -= ((((downLimit - y) / gridSize) % 2) == 0) ? 0 : gridSize;
        for (var x = xInit; x >=  leftLimit; x -= 2*gridSize) {
            points.push({'x': x, 'y': y});
        }
    }

    return points;
}

/**
 * Finds all the windows that are in first plan in the given search
 * area. The given array is modified in the process. Found windows are
 * all different.
 */
function findWindowsOnFirstPlanUnderPoints(pointsToSearch)
{
    var firstPlanWindows = [];
    var notFirstPlanWindows = [];
    var windowUnderPoint;
    var windowOnTop;

    while (pointsToSearch.length > 0) {

        windowUnderPoint = slate.windowUnderPoint(pointsToSearch.pop());

        if (undefined == windowUnderPoint || '' == windowUnderPoint.title()) {
            // Do not consider finder background
            continue;
        }

        if (! isInWindows(windowUnderPoint, firstPlanWindows) &&
            ! isInWindows(windowUnderPoint, notFirstPlanWindows)) {
            // window under point have not been treated.
            updateFirstPlanWindowsWithWindow(
                firstPlanWindows,
                notFirstPlanWindows,
                windowUnderPoint
            );
        }
    }

    return firstPlanWindows;
}

/**
 * Changes the content of firstPlanWindows using the passed window and
 * the other treated windows of notFirstPlanWindows. Windows of
 * firstPlanWindows are removed and inserted in notFirstPlanWindows if
 * the new window is on top of them. The new window is inserted in
 * firstPlanWindows if none of the windows of firstPlanWindows or
 * notFirstPlanWindows is on top of it. It is inserted in
 * notFirstPlanWindows otherwise.
 */
function updateFirstPlanWindowsWithWindow(
    firstPlanWindows,
    notFirstPlanWindows,
    window)
{
    var windowIsOnTop = true;
    for (var i = firstPlanWindows.length - 1; i >= 0; i--) {
        var result = relativeZIndex(window, firstPlanWindows[i]);
        if (1 == result) {
            notFirstPlanWindows.push(firstPlanWindows[i]);
            firstPlanWindows.splice(i, 1);
        } else if (2 == result) {
            windowIsOnTop = false;
        } else if (0 != result) {
            // Another window is on top
            windowIsOnTop = false;
            notFirstPlanWindows.push(firstPlanWindows[i]);
            firstPlanWindows.splice(i, 1);
        }
    }

    if (windowIsOnTop) {
        for (var i = 0, len = notFirstPlanWindows.length; i < len; i++) {
            if (2 == relativeZIndex(window, notFirstPlanWindows[i])) {
                notFirstPlanWindows.push(window);
                return;
            }
        }
        firstPlanWindows.push(window);
    } else {
        notFirstPlanWindows.push(window);
    }
}

/**
 * Returns 0 if the two windows are not comparable, 1 if window1 is on
 * top of window2, 2 if window2 is on top of window1 or 3 if a third
 * window is on top of both windows. To be comparable, the overlap
 * between the two windows must be greater than 10% of the minimum
 * size of the two windows.
 */
function relativeZIndex(window1, window2)
{
    var tolerance = 0.1;
    var rect = intersectRectangle(window1, window2)

    if (null == rect ||
        rect.x2 - rect.x1 < tolerance * Math.min(
            window1.rect().width,
            window2.rect().width
        ) ||
        rect.y2 - rect.y1 < tolerance * Math.min(
            window1.rect().height,
            window2.rect().height
        )) {
        return 0;
    }

    var centerX = Math.round((rect.x1 + rect.x2) / 2);
    var centerY = Math.round((rect.y1 + rect.y2) / 2);
    var window = slate.windowUnderPoint({'x': centerX, 'y': centerY});
    if (windowsAreEqual(window, window1)) {
        return 1;
    } else if (windowsAreEqual(window, window2)) {
        return 2;
    } else {
        return 3;
    }
}

/**
 * Returns a rectangle representing the intersection of the two
 * rectangles of the windows or null if there is no intersection. The
 * rectangle is an object with four fields: x1, x2, y1 and y2 which
 * are the coordinates of the corners and where x1 < x2 and y1 < y2.
 */
function intersectRectangle(window1, window2)
{
    var rect1 = {
        'x1': window1.rect().x,
        'x2': window1.rect().x + window1.rect().width,
        'y1': window1.rect().y,
        'y2': window1.rect().y + window1.rect().height,
    };
    var rect2 = {
        'x1': window2.rect().x,
        'x2': window2.rect().x + window2.rect().width,
        'y1': window2.rect().y,
        'y2': window2.rect().y + window2.rect().height,
    };
    var rect = {
        'x1': Math.max(rect1.x1, rect2.x1),
        'x2': Math.min(rect1.x2, rect2.x2),
        'y1': Math.max(rect1.y1, rect2.y1),
        'y2': Math.min(rect1.y2, rect2.y2),
    };

    if (rect.x1 > rect.x2 || rect.y1 > rect.y2) {
        return null;
    }

    return rect;
}

/**
 * Returns true if the given window is in the given window array
 * (windows), false otherwise. To check wheter or not the window is in
 * the array, the rectangle positions are compared.
 */
function isInWindows(window, windows)
{
    for (var i = 0, len = windows.length; i < len; i++) {
        if (windowsAreEqual(window, windows[i])) {
            return true;
        }
    }

    return false;
}

/**
 * Returns the best candidate among the given windows that is in the
 * given direction relative to the given window.
 */
function findBestWindow(windows, window, direction)
{
    var alignedWindows = windows.slice(0);
    removeNotAlignedWindow(alignedWindows, window, direction);
    if (0 != alignedWindows.length) {
        windows = alignedWindows;
    }

    keepOnlyClosestWindows(windows, window, direction);

    return mostAlignedWindow(windows, window, direction);
}

/**
 * Removes windows from passed window array (windows) that are not
 * aligned with the given window in the given direction. The direction
 * must be one of right, left, up or down, otherwise function returns
 * without modifying the array.
 */
function removeNotAlignedWindow(windows, window, direction)
{
    var exigence = 0.1;
    var xy1;
    var xy2 = [];
    if ('right' == direction || 'left' == direction) {
        xy1 = [
            window.rect().y,
            window.rect().y + window.rect().height
        ];
        for (var i = 0, len = windows.length; i < len; i++) {
            xy2[i] = [
                windows[i].rect().y,
                windows[i].rect().y + windows[i].rect().height
            ];
        }
    } else if ('up' == direction || 'down' == direction) {
        xy1 = [
            window.rect().x,
            window.rect().x + window.rect().width
        ];
        for (var i = 0, len = windows.length; i < len; i++) {
            xy2[i] = [
                windows[i].rect().x,
                windows[i].rect().x + windows[i].rect().width
            ];
        }
    } else {
        return;
    }

    for (var i = windows.length - 1; i >= 0; i--) {
        if (intervalAlignSize(xy1, xy2[i]) <= exigence * (xy1[1] - xy1[0])) {
            windows.splice(i, 1);
        }
    }
}

/**
 * Removes the windows from the given window array (windows) that are
 * not the closest from the given window.
 */
function keepOnlyClosestWindows(windows, window, direction)
{
    var closestDistance = 1000000;
    var distance;

    for (var i = windows.length - 1; i >= 0; i--) {
        distance = distanceCustomManhattan(window, windows[i], direction);
        if (distance > closestDistance) {
            windows.splice(i, 1);
        } else if (distance < closestDistance) {
            windows.splice(i + 1, windows.length - i - 1);
            closestDistance = distance;
        }
    }
}

/**
 * Returns the distance between two windows. The distance is the sum
 * of two components one vertical and one horizontal. If the windows
 * are aligned, the component is null otherwise the component is the
 * pixel difference between the two window borders in the considered
 * direction.
 */
function distanceCustomManhattan(window1, window2)
{
    var distance = 0;

    if (window1.rect().x > window2.rect().x + window2.rect().width) {
        distance += window1.rect().x -
            (window2.rect().x + window2.rect().width) - 1;
    } else if (window2.rect().x > window1.rect().x + window1.rect().width) {
        distance += window2.rect().x -
            (window1.rect().x + window1.rect().width) - 1;
    }

    if (window1.rect().y > window2.rect().y + window2.rect().height) {
        distance += window1.rect().y -
            (window2.rect().y + window2.rect().height) - 1;
    } else if (window2.rect().y > window1.rect().y + window1.rect().height) {
        distance += window2.rect().y -
            (window1.rect().y + window1.rect().height) - 1;
    }

    return distance;
}

/**
 * Returns the window if windows that is the most aligned with the
 * given window in the given direction. The direction must be one of
 * right, left, up or down, otherwise function returns the first
 * element of windows.
 */
function mostAlignedWindow(windows, window, direction)
{
    var xy1;
    var xy2 = [];
    if ('right' == direction || 'left' == direction) {
        xy1 = [
            window.rect().y,
            window.rect().y + window.rect().height
        ];
        for (var i = 0, len = windows.length; i < len; i++) {
            xy2[i] = [
                windows[i].rect().y,
                windows[i].rect().y + windows[i].rect().height
            ];
        }
    } else if ('up' == direction || 'down' == direction) {
        xy1 = [
            window.rect().x,
            window.rect().x + window.rect().width
        ];
        for (var i = 0, len = windows.length; i < len; i++) {
            xy2[i] = [
                windows[i].rect().x,
                windows[i].rect().x + windows[i].rect().width
            ];
        }
    } else {
        return windows[0];
    }

    var alignment;
    var bestWindow;
    var bestAlignement = -1000000;

    for (var i = 0, len = windows.length; i < len; i++) {
        alignment = intervalAlignSize(xy1, xy2[i]);
        if (bestAlignement < alignment) {
            bestWindow = windows[i];
            bestAlignement = alignment;
        }
    }

    if (undefined == bestWindow) {
        return windows[0];
    }

    return bestWindow;
}
