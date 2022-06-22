let tempId = 1;
$(function () {

    $('.new-task').on('click', function () {
        let x = parseInt($('.timeline').css('left'), 10) + unitWidth;
        addItem({
            id: ++tempId,
            type: 'task',
            title: 'Task ' + tempId,
            content: 'Content ' + tempId,
            x: x,
            y: 0,
            w: 200,
            h: 100,
        });
        renderItems();
        renderLines();
    });

    $('.delete-task').on('click', function () {
        if ($('.selected').length) {
            $('.selected').each(function () {
                removeItem($(this).attr('id'));
            });
        } else {
            alert('Choose the tasks to be deleted.');
        }
        renderAll();
    });

    $('.minimize-all').on('click', function () {
        for (let item of dataset) {
            minimizeItem(item);
            renderLines();
        }
        $(this).hide();
        $('.maximize-all').show();
    });
    $('.maximize-all').on('click', function () {
        for (let item of dataset) {
            maximizeItem(item);
            renderLines();
        }
        $(this).hide();
        $('.minimize-all').show();
    });


    selectable();
    initPopup();
    renderItems();
    initTimeline();
    jsPlumb.ready(function () {
        renderLines();
    });
});

function selectable() {
    $(".panel").selectable({
        filter: '.task',
        classes: {
            'ui-selecting': 'selected',
            'ui-selected': 'selected'
        },
        stop: function (event, ui) {
            if ($('.item.selected').length > 1) {
                $('#dataForm').hide();
                $('.info').html(`${$('.item.selected').length} items are selected.`).show();
            } else {
                $('.info').hide();
                $('#dataForm').show();
                $('.item.selected').each(function () {
                    let item = getItemById($(this).attr('id'));
                    $('#titleTxt').val(item.title);
                    $('#contentTxt').val(item.content);
                });
            }
        },
    });
}