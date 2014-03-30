var moveLeft = slate.operation("chain", {
    "operations" : [
        function(window) { moveWindowAt(window, 0, 0, 1/2, 1); },
        function(window) { moveWindowAt(window, 0, 0, 1/3, 1); },
        function(window) { moveWindowAt(window, 0, 0, 2/3, 1); },
    ]
});

var moveRight = slate.operation("chain", {
    "operations" : [
        function(window) { moveWindowAt(window, 1/2, 0, 1/2, 1); },
        function(window) { moveWindowAt(window, 2/3, 0, 1/3, 1); },
        function(window) { moveWindowAt(window, 1/3, 0, 2/3, 1); },
    ]
});

var moveUp = slate.operation("chain", {
    "operations" : [
        function(window) { moveWindowAt(window, 0, 0, 1, 1/2); },
        function(window) { moveWindowAt(window, 0, 0, 1, 1/3); },
        function(window) { moveWindowAt(window, 0, 0, 1, 2/3); },
    ]
});

var moveDown = slate.operation("chain", {
    "operations" : [
        function(window) { moveWindowAt(window, 0, 1/2, 1, 1/2); },
        function(window) { moveWindowAt(window, 0, 2/3, 1, 1/3); },
        function(window) { moveWindowAt(window, 0, 1/3, 1, 2/3); },
    ]
});

var moveCenter = slate.operation("chain", {
    "operations" : [
        function(window) { moveWindowAt(window, 0  , 0  , 1  , 1  ); },
        function(window) { moveWindowAt(window, 1/4, 1/4, 1/2, 1/2); },
        function(window) { moveWindowAt(window, 1/3, 0  , 1/3, 1  ); },
        function(window) { moveWindowAt(window, 0  , 1/3, 1  , 1/3); },
    ]
});

var moveCorner = slate.operation("chain", {
    "operations" : [
        function(window) { moveWindowAt(window, 0  , 0  , 1/2, 1/2); },
        function(window) { moveWindowAt(window, 1/2, 0  , 1/2, 1/2); },
        function(window) { moveWindowAt(window, 0  , 1/2, 1/2, 1/2); },
        function(window) { moveWindowAt(window, 1/2, 1/2, 1/2, 1/2); },
    ]
});

// Bindings
// ________

slate.bindAll({
    "s:ctrl;cmd"          : moveLeft,
    "d:ctrl;cmd"          : moveDown,
    "e:ctrl;cmd"          : moveUp,
    "f:ctrl;cmd"          : moveRight,
    "c:ctrl;cmd"          : moveCenter,
    "v:ctrl;cmd"          : moveCorner,

    // Modal bindings
    "s:m;ctrl;cmd:toggle" : moveLeft,
    "d:m;ctrl;cmd:toggle" : moveDown,
    "e:m;ctrl;cmd:toggle" : moveUp,
    "f:m;ctrl;cmd:toggle" : moveRight,
    "c:m;ctrl;cmd:toggle" : moveCenter,
    "v:m;ctrl;cmd:toggle" : moveCorner,
});

// End of bindings
// _______________
