let touchStartX = 0;
let touchStartY = 0;
let dragging = false;
let currentTaskId = null;

// A card is picked up only after the finger rests on it for this long.
// Moving further than the tolerance before that means the user is scrolling.
const LONG_PRESS_MS = 350;
const LONG_PRESS_TOLERANCE_PX = 10;
let longPressTimer = null;

/**
 * Handles the start of a dragging event for a task.
 * @param {string} taskId - The ID of the task being dragged.
 * @param {string} status - The current status of the task.
 * @param {Event} event - The event object representing the drag or touch start event.
 */
function startDragging(taskId, status, event) {
    if (event.type === 'dragstart') {
        registerTaskId(taskId);
        markAddableColumns(status);
        document.getElementById('status_bar_id').style.display = 'flex';
    } else if (event.type === 'touchstart') {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        registerTaskId(taskId);
        markAddableColumns(status);
        document.getElementById('status_bar_id').style.display = 'flex';
    }
}

/**
 * Handles the start of a touch event for a task.
 * @param {string} taskId - The ID of the task being touched.
 * @param {string} status - The current status of the task.
 * @param {TouchEvent} event - The event object representing the touch start event.
 */
function touchStart(taskId, status, event) {
    // iOS starts a native HTML5 drag on a long press of a draggable element -
    // it would fight our touch drag and cancel it. A finger means touch drag
    // only; the attribute stays "true" for the mouse on the desktop.
    let card = document.getElementById(`task${taskId}`);
    if (card) card.draggable = false;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    currentTaskId = taskId;
    dragging = false;
    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(() => {
        longPressTimer = null;
        dragging = true;
        startDragging(taskId, status, event);
        liftCard(taskId);
    }, LONG_PRESS_MS);
}

/**
 * Gives feedback that the long press was recognised and the card can be moved.
 * @param {string} taskId - The ID of the task being picked up.
 */
function liftCard(taskId) {
    let card = document.getElementById(`task${taskId}`);
    if (card) card.classList.add('lifted');
    if (navigator.vibrate) navigator.vibrate(30);
}

/**
 * Forgets a touch that turned out to be a scroll, a tap or was cancelled.
 */
function cancelLongPress() {
    clearTimeout(longPressTimer);
    longPressTimer = null;
    currentTaskId = null;
}

/**
 * The browser ended the touch sequence itself (touchcancel) - e.g. because
 * it started scrolling. If a card was already picked up, put it back.
 */
function abortTouchDrag() {
    let taskId = currentTaskId;
    let wasDragging = dragging;
    cancelLongPress();
    dragging = false;
    if (wasDragging) {
        document.getElementById(`task${taskId}`)?.classList.remove('lifted');
        deleteBorderStyles();
        init_board();
    }
}

/**
 * Handles the end of a touch event, determining if it should be treated as a click or a drag.
 * @param {TouchEvent} event - The event object representing the touch end event.
 */
function touchEnd(event) {
    // The listener sits on document, so every tap on the page ends up here.
    // Only touches that grew into a drag (see touchStart) are ours - for a
    // short tap the browser must be free to fire its click.
    if (!dragging) {
        cancelLongPress();
        return;
    }
    dragging = false;
    let taskId = currentTaskId;
    currentTaskId = null;
    let touchEndX = event.changedTouches[0].clientX;
    let touchEndY = event.changedTouches[0].clientY;
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;
    if (Math.abs(deltaX) < LONG_PRESS_TOLERANCE_PX && Math.abs(deltaY) < LONG_PRESS_TOLERANCE_PX) {
        // Picked up, but put down again in place: no move, and no click either.
        document.getElementById(`task${taskId}`)?.classList.remove('lifted');
        deleteBorderStyles();
        event.preventDefault();
        return;
    }
    // The dragged card has pointer-events: none, so this is what lies beneath it:
    // a field of the mobile status bar, or - on wider screens - a column.
    let targetElement = document.elementFromPoint(touchEndX, touchEndY);
    let column = targetElement && targetElement.closest('.board_column');
    if (targetElement && targetElement.classList.contains('status')) {
        moveTo(targetElement.id.split('_')[1]);   // moveTo re-renders the board itself
    } else if (column) {
        moveTo(column.dataset.status);
    } else {
        deleteBorderStyles();
        init_board();                             // nothing hit: put the card back
    }
    event.preventDefault();
}

document.addEventListener('DOMContentLoaded', function() {
    let dropZones = document.getElementsByClassName('status');
    Array.from(dropZones).forEach(dropZone => {
        dropZone.addEventListener('touchstart', function(event) {
            this.classList.add('status_selected');
            touchStart(this.id.split('_')[1], '', event);
        });
        dropZone.addEventListener('touchend', function() {
            this.classList.remove('status_selected');
        });
    });
});

function freezeDraggedCard(dragItem) {
    // offsetWidth/Height are the layout size - unlike getBoundingClientRect
    // they ignore the scale() of the lifted card, so it does not grow twice.
    dragItem.style.width = dragItem.offsetWidth + 'px';
    dragItem.style.height = dragItem.offsetHeight + 'px';
    dragItem.style.position = 'fixed';
    dragItem.style.zIndex = '9';
    dragItem.style.pointerEvents = 'none';
}

function positionDraggedCard(dragItem, touch) {
    dragItem.style.left = touch.clientX - dragItem.offsetWidth / 2 + 'px';
    dragItem.style.top = touch.clientY - dragItem.offsetHeight / 2 + 'px';
}

function updateStatusHighlights(touch) {
    Array.from(document.getElementsByClassName('status')).forEach(dropZone => {
        let rect = dropZone.getBoundingClientRect();
        let inZone = touch.clientX > rect.left && touch.clientX < rect.right &&
            touch.clientY > rect.top && touch.clientY < rect.bottom;
        dropZone.classList.toggle('status_selected', inZone);
    });
}

function handleTouchMove(event) {
    let touch = event.touches[0];
    if (!dragging) {
        // Finger moved before the long press fired: this is a scroll. Let the
        // browser have it and forget the card.
        if (currentTaskId && (Math.abs(touch.clientX - touchStartX) > LONG_PRESS_TOLERANCE_PX ||
                              Math.abs(touch.clientY - touchStartY) > LONG_PRESS_TOLERANCE_PX)) {
            cancelLongPress();
        }
        return;
    }
    let dragItem = document.getElementById(`task${currentTaskId}`);
    if (!dragItem) return;
    if (dragItem.style.position !== 'fixed') freezeDraggedCard(dragItem);
    positionDraggedCard(dragItem, touch);
    updateStatusHighlights(touch);
    highlightColumn(document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.board_column'));
    event.preventDefault();
}

// Attach touchmove and touchend event listeners to the document
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', touchEnd);
// The browser took the gesture over (scrolling, selection): never start or
// continue a drag from it.
document.addEventListener('touchcancel', abortTouchDrag);

// A long press on a card is ours. Without this Android and Chrome's device
// mode open their context menu and cancel the touch - the drag would break.
document.addEventListener('contextmenu', function(event) {
    if (currentTaskId !== null || dragging) event.preventDefault();
});

