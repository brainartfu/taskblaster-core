function initPopup() {
    $.contextMenu({
        selector: '.panel',
        animation: { duration: 10, show: 'fadeIn', hide: 'fadeOut' },
        hideOnSecondTrigger: true,
        items: {
            "new": {
                name: "New Task",
                icon: "fa-file-o",
                callback: function (key, options, e) {
                    let x = Math.floor(e.pageX / unitWidth) * unitWidth + timelineDelta;
                    addItem({
                        id: ++tempId,
                        type: 'task',
                        title: 'Task ' + tempId,
                        content: 'Content ' + tempId,
                        x: x,
                        y: e.pageY,
                        w: 200,
                        h: 100,
                    });
                    renderAll();
                }
            },
            /* "cut": {
                name: "Cut",
                icon: "cut",
                callback: function () {
                    let items = getSelectedItems();
                    prepareCut(items);
                }
            },
            "copy": {
                name: "Copy",
                icon: "copy",
                callback: function () {
                    let items = getSelectedItems();
                    prepareCopy(items);
                }
            },
            "paste": {
                name: "Paste",
                icon: "paste",
                callback: function (a, b) {
                    console.log(a, b)
                    pasteItems();
                }
            },
            "sep2": "-", */
            "group": {
                name: "Group",
                icon: "fa-object-group",
                callback: function () {
                    let items = getSelectedItems();
                    groupItems(items);
                }
            },
            "ungroup": {
                name: "UnGroup",
                icon: "fa-object-ungroup",
                callback: function () {
                    let items = getSelectedItems();
                    for (let item of items) {
                        if (item.type == 'group') {
                            let ids = [];
                            for (let child of item.children) {
                                ids.push(child.id);
                            }
                            for (let id of ids) {
                                moveItem(id, item.pid);
                            }
                            removeItem(item.id);
                        }
                    }
                    renderAll();
                }
            },
            "moveTo": {
                name: "Move to ...",
                icon: "fa-object-group",
                callback: function () {
                    let items = getSelectedItems();
                    prepareMoveTo(items);
                }
            },
            "sep3": "-",
            "delete": {
                name: "Delete",
                icon: "delete",
                callback: function () {
                    let items = getSelectedItems();
                    for (let item of items) {
                        removeItem(item.id);
                    }
                    renderAll();
                }
            },
        }
    });
    $(".panel").bind("contextmenu", function (e) {
        let target = null;
        for (let elem of e.originalEvent.path) {
            if ($(elem).hasClass('item')) {
                target = $(elem);
                break;
            }
        }
        if (target) {
            var ids = $('.selected').map(function (index) { return this.id; });
            if ($.inArray(target.attr('id'), ids) < 0) {
                $('.selected').removeClass('selected');
                target.addClass('selected');
            }
        }
        return true;
    });
}
