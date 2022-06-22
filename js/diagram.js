let headerHeight = 25;
let footerHeight = 10;
let lineSource = null;
let panPos = null;
let startPos = null;
let panelOffset = $('.panel').offset();
let originalParentPos = null;
let zoom = 1;
let itemsToBeMoved = [];
let itemsToBeCopied = [];

$(function () {
    $('.panel').on('mousedown', function (e) {
        startPos = { x: e.clientX, y: e.clientY };
        if (e.target.className != 'editor') {
            setEditorValue();
        }
        if (e.button == 0) {
            if (!e.ctrlKey) {
                $('.selected').removeClass('selected');
            }
        } else if (e.button == 1) {
            panPos = startPos;
            e.preventDefault();
            e.stopPropagation();
            $(this).addClass('dragging');
        }
    }).on('mousemove', function (e) {
        if (panPos) {
            let delta = { x: e.clientX - panPos.x, y: e.clientY - panPos.y };
            let offset = $(this).offset();
            $(this).offset({ left: offset.left + delta.x, top: offset.top + delta.y });
            panPos = { x: e.clientX, y: e.clientY };
            timelineMove(delta.x);
            jsPlumb.repaintEverything();
        }
    }).on('mouseup', function (e) {
        if (panPos) {
            let delta = { x: e.clientX - startPos.x, y: e.clientY - startPos.y };
            $(this).css({ left: 0, top: 0 }).removeClass('dragging');
            reRenderItems(delta);
            jsPlumb.repaintEverything();
        }
        if (itemsToBeMoved.length > 0 && e.target.id == 'panel') {
            moveTo();
        }
        startPos = null;
        panPos = null;
    }).on('mousewheel', function (e) {
        if (!panPos) {
            zoomBoard(e, $(this));
        }
    }).on('mouseover', function (e) {
        if (itemsToBeMoved.length > 0) {
            $('.target').removeClass('target');
            $(this).addClass('target');
        }
    }).on('mouseleave', function () {
        $(this).removeClass('target');
    });

    $('.zoom-range').on('input', function () {

    });
    $('.zoom-in').on('click', function (e) {
        $('.zoom-range').val($('.zoom-range').val() * 1 + 0.1)
    });
    $('.zoom-out').on('click', function (e) {
        $('.zoom-range').val($('.zoom-range').val() * 1 - 0.1)
    });
    jsPlumb.setContainer("panel");
});

/* function zoomBoard(zoom, center) {

} */
function zoomBoard(e, ui) {
    let prevZoom = zoom;
    zoom = zoom - 0.1 * Math.sign(e.originalEvent.deltaY);
    if (zoom >= 1.5) zoom = 1.5;
    if (zoom <= 0.5) zoom = 0.5;

    if (zoom != prevZoom) {
        let offset = ui.offset();
        offset = { x: e.pageX - offset.left, y: e.pageY - offset.top }

        let scale = zoom < prevZoom ? 9 / 10 : 10 / 9;
        unitWidth *= scale;

        let tasks = getChildren(null, 'task');
        for (let task of tasks) {
            setData(task.id, 'x', ((task.x - panelOffset.left) * scale) + panelOffset.left);
            setData(task.id, 'y', ((task.y - panelOffset.top) * scale) + panelOffset.top);
            setData(task.id, 'w', task.w * scale);
            setData(task.id, 'h', task.h * scale);
        }

        let pw = $('.panel').width();
        let ph = $('.panel').height();

        let delta = {
            x: pw * (offset.x / pw) * (scale > 1 ? -1 / 9 : 0.1),
            y: ph * (offset.y / ph) * (scale > 1 ? -1 / 9 : 0.1)
        }

        timelineZoom(scale, delta.x);
        reRenderItems(delta);
        resetAllGroupPos();
        jsPlumb.repaintEverything();

        $('.task').resizable("option", "grid", [unitWidth, headerHeight * scale]);
    }
    timelineDelta = parseInt($('.timeline').css('left'), 10) % unitWidth;
}

function renderItems() {
    let html = renderItemsHtml();
    $('.panel').html(html);

    setItemsOffset();

    $('.handle').on('click', function (e) {
        lineSource = $(this).parent().parent().attr('id');
        $('.line-start').removeClass('line-start');
        $(this).addClass('line-start');
        e.preventDefault();
        e.stopPropagation();
    });

    $('.min-max').on('click', function (e) {
        let id = $(this).parent().parent().attr('id');
        toggleMinMaxItem(id);
        e.preventDefault();
        e.stopPropagation();
    });

    $('.group').on('click', function (e) {
        $(this).addClass('selected');
        if (itemsToBeMoved.length > 0) {
            moveTo($(this).attr('id'));
        }
    }).on('mouseover', function (e) {
        if (itemsToBeMoved.length > 0) {
            $('.target').removeClass('target');
            $(this).addClass('target');
        }
        e.preventDefault();
        e.stopPropagation();
    }).on('mouseleave', function () {
        $(this).removeClass('target');
    });

    $('.task').resizable({
        handles: 'e, w, s, se, sw',
        grid: [unitWidth, headerHeight],
        resize: function (e, ui) {
            resizeItem($(this));
        },
        stop: function (e, ui) {
            resizeItem($(this));
        }
    });

    $('.item').draggable({
        snap: true,
        snapTolerance: 10,
        handle: ".title",
        preventCollision: true,
        obstacle: ".obstacle",
        multipleCollisionInteractions: [{
            collider: ".collider",
            obstacle: ".obstacle",
            preventCollision: true,
        }],
        drag: function (e, ui) {
            dragItem(e.target.id, ui);
        },
        start: function (e, ui) {
            let item = getItemById(e.target.id);
            originalParentPos = item.pid ? getMaxPos(getParent(item.id).children) : null;
            setObstacles($(this));
        },
        stop: function (e, ui) {
            snapItem(e.target.id);
        }
    }).on('click', function (e) {
        if (lineSource) {
            let lineId = drawLine(lineSource, $(this).attr('id'));
            lines.push({
                id: lineId,
                source: lineSource,
                target: $(this).attr('id')
            });

            $('.line-start').removeClass('line-start');
            lineSource = null;
        }
        e.preventDefault();
        e.stopPropagation();
    });

    $('.item .header .title').on('dblclick', function () {
        let text = $(this).html();
        let editor = $('<input>')
            .addClass('editor')
            .val(text)
            .on('blur', function () {
                setEditorValue();
            }).on('keyup', function (e) {
                if (e.keyCode == 13) {
                    setEditorValue();
                }
            });
        setTimeout(function () {
            $('.editor').focus();
        })
        $(this).html(editor);
    });

    $('.task .content').on('dblclick', function (e) {
        let text = $(this).html();
        let editor = $('<textarea></textarea>')
            .addClass('editor')
            .val(text)
            .on('blur', function () {
                setEditorValue();
            }).on('keyup', function (e) {
                if (e.ctrlKey && e.keyCode == 13) {
                    setEditorValue();
                }
            });
        setTimeout(function () {
            $('.editor').focus();
        });
        $(this).html(editor);
        e.preventDefault();
        e.stopPropagation();
    });

    jsPlumb.repaintEverything();
}

function snapItem(id) {
    let item = getItemById(id);
    let elem = $(`#${id}`);
    let elemLeft = item.x - panelOffset.left - timelineDelta;
    let targetLeft = panelOffset.left + Math.floor(elemLeft / unitWidth) * unitWidth + timelineDelta;

    if (elemLeft % unitWidth > unitWidth / 2) {
        targetLeft += unitWidth;
    }
    setData(id, 'x', targetLeft);
    elem.offset({ left: targetLeft });

    if (item.pid) {
        resetParentPos(item.pid)
    }

    if (item.type == 'group') {
        resetChildrenPos(item.children)
    }

    jsPlumb.repaintEverything();
}

function dragItem(id, ui) {
    setData(id, 'x', ui.offset.left);
    setData(id, 'y', ui.offset.top);

    let item = getItemById(id);
    if (item.type == 'group') {
        resetChildrenPos(item.children);
    }

    let parent = getParent(id);
    if (parent) {
        let maxPos = getMaxPos(parent.children);
        ui.position.left = ui.offset.left <= maxPos.left ? 0 : ui.position.left - maxPos.left + originalParentPos.left;
        ui.position.top = ui.offset.top <= maxPos.top ? 0 : ui.position.top - maxPos.top + originalParentPos.top;

        resetParentPos(parent.id);
    }

    jsPlumb.repaintEverything();
}

function resizeItem(elem) {
    let id = elem.attr('id');
    setData(id, 'x', elem.offset().left);
    setData(id, 'w', elem.width());
    setData(id, 'h', elem.height());
    let parent = getParent(id);
    if (parent) {
        resetParentPos(parent.id);
    }
    jsPlumb.repaintEverything();
}

function resetParentPos(parentId) {
    let parent = getItemById(parentId);
    let maxPos = getMaxPos(parent.children);

    let deltaY = maxPos.bottom - parent.y - parent.h;
    if (deltaY != 0) {
        pullItems(parent, deltaY);
    }
    setItemPos(parentId, maxPos.left, maxPos.top, maxPos.width, maxPos.height);
    for (let child of parent.children) {
        $(`#${child.id}`).offset({ left: child.x, top: child.y });
    }
    if (parent.pid) {
        resetParentPos(parent.pid);
    }
}

function resetChildrenPos(children) {
    for (let child of children) {
        let offset = $(`#${child.id}`).offset();
        setData(child.id, 'x', offset.left);
        setData(child.id, 'y', offset.top);
        if (child.type == 'group') {
            resetChildrenPos(child.children);
        }
    }
}

function resetAllGroupPos() {
    let groups = getTerminalGroups();
    for (let group of groups) {
        resetParentPos(group.id);
    }
}

function setItemsOffset(items) {
    items = items || dataset;
    for (item of items) {
        $(`#${item.id}`)
            .offset({ left: item.x, top: item.y })
            .width(item.w)
            .height(item.h);
        if (item.type == 'group') {
            setItemsOffset(item.children);
        }
    }
}

function renderItemsHtml(items, parentMinimized) {
    items = items || dataset;
    let html = '';
    for (item of items) {
        html += `<div id=${item.id} class="item obstacle ${item.type} ${item.minimized ? 'minimized' : ''}">`;
        html += `<div class="header">`;
        html += `<div class="title">` + item.title + `</div>`;
        html += `<div class="min-max">`;
        html += `<i class="fa fa-window-${item.minimized ? 'maximize' : 'minimize'}"></i>`;
        html += `</div>`;
        html += `</div>`;
        html += `<div class="content">`;
        if (item.type == 'group') {
            html += renderItemsHtml(item.children, item.minimized);
        } else {
            html += item.content;
        }
        html += `</div>`;
        html += `<div class="footer">`;
        html += `<div class="handle"></div>`;
        html += `</div>`;
        html += `</div>`;
    }
    return html;
}

function drawLine(sourceId, targetId) {
    let source = getItemById(sourceId);
    if (source) {
        if (source.minimizedBy) sourceId = source.minimizedBy;
    }

    let target = getItemById(targetId);
    if (target) {
        if (target.minimizedBy) targetId = target.minimizedBy;
    }

    let conn = jsPlumb.connect({
        source: sourceId.toString(),
        target: targetId.toString(),
        editable: false,
        anchor: "Continuous",
        connector: ["Flowchart", { cornerRadius: 5 }],
        endpoint: ["Dot", { radius: 2 }],
        paintStyle: { strokeWidth: 2, stroke: "#0e7281", outlineWidth: 3, outlineStroke: "transparent" },
        hoverPaintStyle: { strokeWidth: 2, stroke: "red" },
        overlays: [["Arrow", { location: 1, width: 10, length: 10 }]],
        events: {
            click: function (conn) {
                removeLineById(conn.id);
                // removeLine(conn.id);
                // jsPlumb.deleteConnection(conn);
            }
        },
    });
    return conn.id;
}

function renderLines() {
    jsPlumb.setSuspendDrawing(true);
    jsPlumb.reset();
    for (let line of lines) {
        jsPlumb.setSuspendDrawing(false, true);
        drawLine(line.source, line.target);
    }
}

function getMaxPos(items) {
    let maxPos = {};
    let pos = {};

    items.map(function (item) {
        pos = {
            top: item.y,
            left: item.x,
            right: item.x + item.w,
            bottom: item.y + item.h
        };

        if (item.minimized) pos.bottom = item.y + headerHeight;

        pos.top -= headerHeight;
        pos.bottom += footerHeight;

        maxPos.top = !maxPos.top && maxPos.top != 0 ? pos.top : Math.min(maxPos.top, pos.top);
        maxPos.left = !maxPos.left && maxPos.left != 0 ? pos.left : Math.min(maxPos.left, pos.left);
        maxPos.right = !maxPos.right && maxPos.right != 0 ? pos.right : Math.max(maxPos.right, pos.right);
        maxPos.bottom = !maxPos.bottom && maxPos.bottom != 0 ? pos.bottom : Math.max(maxPos.bottom, pos.bottom);
    });
    maxPos.width = maxPos.right - maxPos.left;
    maxPos.height = maxPos.bottom - maxPos.top;
    return maxPos;
}

function reRenderItems(delta, items) {
    items = items || dataset;
    for (let item of items) {
        setItemPos(item.id, item.x + delta.x, item.y + delta.y, item.w, item.h);
        if (item.children) {
            reRenderItems(delta, item.children);
        }
    }
    jsPlumb.repaintEverything();
}

function setItemPos(id, x, y, w, h) {
    setData(id, 'x', x);
    setData(id, 'y', y);
    setData(id, 'w', w);
    setData(id, 'h', h);
    $(`#${id}`).offset({ left: x, top: y }).width(w).height(h);
}

function removeLineById(id) {
    let connections = jsPlumb.getConnections();
    for (let conn of connections) {
        if (conn.id == id) {
            let ind = lines.findIndex(function (obj) {
                return obj.id == id;
            });
            lines.splice(ind, 1);
            jsPlumb.deleteConnection(conn);
            break;
        }
    }
}

function getBottom(id) {
    return $(`#${id}`).offset().top + $(`#${id}`).height();
}

function minimizeItem(item) {
    $(`#${item.id}>.header>.min-max>.fa-window-minimize`).addClass('fa-window-maximize').removeClass('fa-window-minimize');
    pullItems(item, headerHeight - item.h);
    setData(item.id, 'minimized', true);
    $(`#${item.id}`).addClass('minimized');

    if (item.type == 'group') {
        let children = getChildren(item.id);
        for (let child of children) {
            setData(child.id, 'minimizedBy', item.id);
        }
    }

    if (item.pid) {
        resetParentPos(item.pid);
    }
    jsPlumb.repaintEverything();
    renderLines();
}

function maximizeItem(item) {
    $(`#${item.id}>.header>.min-max>.fa-window-maximize`).addClass('fa-window-minimize').removeClass('fa-window-maximize');
    pullItems(item, item.h - headerHeight);
    setData(item.id, 'minimized', false);
    $(`#${item.id}`).removeClass('minimized');

    if (item.type == 'group') {
        let children = getChildren(item.id);
        for (let child of children) {
            setData(child.id, 'minimizedBy', null);
        }
    }

    if (item.pid) {
        resetParentPos(item.pid);
    }
    jsPlumb.repaintEverything();
    renderLines();
}

function toggleMinMaxItem(id) {
    let item = getItemById(id);
    item.minimized ? maximizeItem(item) : minimizeItem(item);
}

function pullItems(item, deltaY) {
    let siblings = getSiblings(item.id);
    let bottom = item.y + (item.minimized ? headerHeight : item.h);
    for (let sibling of siblings) {
        if (sibling.id != item.id) {
            if (sibling.y >= bottom) {
                if (sibling.x > item.x && sibling.x < item.x + item.w || sibling.x + sibling.w > item.x && sibling.x + sibling.w < item.x + item.w) {
                    setData(sibling.id, 'y', sibling.y + deltaY);
                    $(`#${sibling.id}`).offset({ top: sibling.y });
                }
            }
        }
    }
}

function setObstacles(elem) {
    let item = getItemById(elem.attr('id'));
    $('.obstacle').removeClass('obstacle');
    $('.collider').removeClass('collider');
    let siblings = getSiblings(item.id);
    for (let sibling of siblings) {
        $(`#${sibling.id}`).addClass('obstacle');
    }
    $('.task').addClass('obstacle');
    elem.addClass('collider').removeClass('obstacle');
    if (item.type == 'group') {
        let children = getChildren(item.id);
        for (let child of children) {
            $(`#${child.id}`).removeClass('obstacle');
        }
    }
}

function getSelectedItems() {
    let items = [];
    $('.selected').each(function () {
        items[items.length] = getItemById($(this).attr('id'));
    });
    return items;
}

function groupItems(items) {
    let groupId = uuid();
    if (items.length > 1) {
        let children = [];
        let tempPid = items[0].pid;
        for (let item of items) {

            tempPid = item.pid;
        }

        items.map(function (item, ind) {
            children[ind] = item;
            children[ind].pid = groupId;
            removeItem(item.id);
            tempPid = item.pid;
        });
        addItem({
            id: groupId,
            type: 'group',
            title: 'Group',
            children: children
        });
        renderItems();
        resetParentPos(groupId);
        renderLines();
    } else {
        alert('Please select 2 or more tasks to group.');
    }
}

function prepareMoveTo(items) {
    itemsToBeMoved = items;
}

function moveTo(groupId) {
    for (let item of itemsToBeMoved) {
        moveItem(item.id, groupId);
    }
    itemsToBeMoved = [];
    $('.target').removeClass('target');
    renderAll();
}

function prepareCut(items) {
    itemsToBeMoved = items;
}
function prepareCopy(items) {
    itemsToBeCopied = items;
}

function pasteItems() {
    if ($('.group.selected').length > 1) {
        alert('Please make sure the group to be pasted.');
    } else {
        let parentId = $('.group.selected').attr('id');
        parentId = parentId || null;
        if (itemsToBeMoved) {
            let ids = [];
            for (let item of itemsToBeMoved) {
                ids.push(item.id);
            }
            for (let id of ids) {
                moveItem(id, parentId);
            }
            itemsToBeMoved = [];
        }
        if (itemsToBeCopied) {
            let ids = [];
            for (let item of itemsToBeCopied) {
                ids.push(item.id);
            }
            for (let id of ids) {
                copyItem(id, parentId);
            }
            itemsToBeCopied = [];
        }
        renderAll();
    }
}

function renderAll() {
    renderItems();
    resetAllGroupPos();
    renderLines();
}

function setEditorValue() {
    let editor = $('.editor');
    if (editor.length) {
        let value = editor.val();
        if (editor.prop('tagName') == "INPUT") {
            let id = editor.parent().parent().parent().attr('id')
            setData(id, 'title', value);
            $('#titleTxt').val(value);
        } else {
            let id = editor.parent().parent().attr('id')
            setData(id, 'content', value);
            $('#contentTxt').val(value);
        }
        $('.editor').parent().html($('.editor').val());
    }
}