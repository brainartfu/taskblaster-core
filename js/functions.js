function addItem(item, groupId) {
    if (groupId) {
        let group = getItemById(groupId);
        if (group.children) {
            item.pid = groupId;
            group.children.push(item);
            setData(groupId, 'children', group.children);
        }
    } else {
        dataset[dataset.length] = item;
    }
    saveData();
}

function removeItem(id, items) {
    items = items || dataset;
    items.map(function (item) {
        if (item.id == id) {
            items.splice(items.indexOf(item), 1);
            // removeLineById(id);
        } else {
            if (item.children) {
                removeItem(id, item.children);
                return;
            }
        }
    });
}

function copyItem(id, parentId, reRenderFlag) {
    let item = getItemById(id);
    let newItem = { ...item };
    newItem.id = uuid();
    newItem.pid = parentId;
    newItem.y += newItem.h + headerHeight;
    if (parentId) {
        let children = getItemById(parentId).children;
        children.push(newItem);
        setData(parentId, 'children', children);
    } else {
        dataset.push(newItem);
    }
    if (reRenderFlag) {
        renderAll();
    }
}

function moveItem(id, parentId, reRenderFlag) {
    let item = getItemById(id);
    item.pid = parentId;
    removeItem(item.id);
    if (parentId) {
        let children = getItemById(parentId).children;
        children.push(item);
        setData(parentId, 'children', children);
    } else {
        dataset.push(item);
    }
    if (reRenderFlag) {
        renderAll();
    }
}

function setData(id, key, val, items) {
    items = items || dataset;
    items.map(function (item) {
        if (item.id == id) {
            item[key] = val;
            return;
        } else {
            if (item.children) {
                setData(id, key, val, item.children);
            }
        }
    });
}

function getItemById(id, items) {
    items = items || dataset;
    let item = null;
    for (i of items) {
        if (i.id == id) {
            item = i;
            break;
        } else {
            if (i.children) {
                item = getItemById(id, i.children);
                if (item) return item;
            }
        }
    }
    return item;
}

function getParent(id) {
    let item = getItemById(id);
    return getItemById(item.pid);
}

function getSiblings(id) {
    let parent = getParent(id);
    return parent ? parent.children : dataset;
}

function getChildren(id, type = 'all') {
    let children = id ? getItemById(id).children : dataset;
    let items = [];
    for (child of children) {
        if (type == 'all') {
            items[items.length] = child;
        } else {
            if (child.type == type) {
                items[items.length] = child;
            }
        }
        if (child.children) {
            let subItems = getChildren(child.id, type);
            for (let item of subItems) {
                items[items.length] = item;
            }
        }
    }
    return items;
}

function getTerminalGroups() {
    let groups = getChildren(null, 'group');
    let terminalGroups = [];
    let hasChildren = false;
    for (let group of groups) {
        hasChildren = false;
        for (let child of group.children) {
            if (child.type == 'group') {
                hasChildren = true;
                break;
            }
        }
        if (!hasChildren) {
            terminalGroups.push(group);
        }
    }
    return terminalGroups;
}

function getFirstTask() {
    let items = getChildren(null, 'task');
    let task = null;
    for (let item of items) {
        if (item.startDay) {
            task = item;
        }
    }
    return task;
}

function saveData() {
    // let tasks = getChildren(null, 'task');
    $('.code').html('').append(`${JSON.stringify(dataset)}`);
}

function uuid() {
    return Math.round(Math.random() * 10000000);
}