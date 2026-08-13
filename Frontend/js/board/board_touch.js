let touchStartX = 0;
let touchStartY = 0;  
let dragging = false;
let currentTaskId = null;

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
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    dragging = true;
    currentTaskId = taskId;
    startDragging(taskId, status, event);
}

/**
 * Handles the end of a touch event, determining if it should be treated as a click or a drag.
 * @param {TouchEvent} event - The event object representing the touch end event.
 */
function touchEnd(event) {
    dragging = false;
    currentTaskId = null;
    let touchEndX = event.changedTouches[0].clientX;
    let touchEndY = event.changedTouches[0].clientY;
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        // Treat as a click
        return;
    }
    let targetElement = document.elementFromPoint(touchEndX, touchEndY);
    if (targetElement && targetElement.classList.contains('status')) {
        let status = targetElement.id.split('_')[1];
        moveTo(status);
    }
    deleteBorderStyles();
    event.preventDefault();
    init_board();
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

function handleTouchMove(event) {
    if (!dragging || !currentTaskId) return;

    let touch = event.touches[0];

    let dragItem = document.getElementById(`task${currentTaskId}`);
    dragItem.style.position = 'absolute';
    dragItem.style.left = touch.pageX - dragItem.offsetWidth / 2 + 'px';
    dragItem.style.top = touch.pageY - dragItem.offsetHeight / 2 + 'px';

    let dropZone = document.getElementById('status_toDo');
    let dropRect = dropZone.getBoundingClientRect();
    let dragRect = dragItem.getBoundingClientRect();

    if (dragRect.left >= dropRect.left &&
        dragRect.right <= dropRect.right &&
        dragRect.top >= dropRect.top &&
        dragRect.bottom <= dropRect.bottom);
  
    let dropZones = document.getElementsByClassName('status');
            Array.from(dropZones).forEach(dropZone => {
                let dropRect = dropZone.getBoundingClientRect();
                if (touch.clientX > dropRect.left && touch.clientX < dropRect.right &&
                    touch.clientY > dropRect.top && touch.clientY < dropRect.bottom) {
                    dropZone.classList.add('status_selected');
                } else {
                    dropZone.classList.remove('status_selected');
                }
            });

    event.preventDefault();
}

// Attach touchmove and touchend event listeners to the document
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', touchEnd);

/**
 * Handles the click event for addTask button in column "to Do" in mobile mode.
 */
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.column_head_add_btn_mobile');

    const handleClick = function(event) {
        if (window.innerWidth <= 1000) {
            const status = event.currentTarget.getAttribute('data-status');
            redirectToTaskPage(status);
        }
    };

    buttons.forEach(button => {
        button.addEventListener('click', handleClick);
        button.addEventListener('touchstart', function(event) {
            event.preventDefault(); // Prevent the default touch behavior to ensure the function is called
            handleClick(event);
        });
    });
});

