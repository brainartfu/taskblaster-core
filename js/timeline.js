let baseDate = new Date();
let basePixel = 0;
let timelineMoved = 0;
let unitWidth = 50;
let timelineDelta = null;

function initTimeline() {
    let task = getFirstTask();
    if (task) {
        baseDate = new Date(task.startDay);
        basePixel = task.x;
    }
    renderTimeline();
}

function renderTimeline() {
    $('.timeline').append(getUnitHtml(baseDate, true)).css({ left: basePixel });
    fillRestDays();
    timelineDelta = parseInt($('.timeline').css('left'), 10) % unitWidth;
}

function timelineMove(deltaX) {
    let left = $('.timeline').css('left').replace('px', '') * 1 + deltaX;
    $('.timeline').css({ left: left });
    timelineMoved += deltaX;
    if (timelineMoved > unitWidth) {
        addDaysBefore();
        $('.unit').last().remove();
        timelineMoved = 0;
    } else if (timelineMoved < unitWidth * -1) {
        addDaysAfter();
        $('.timeline').css({ left: left + unitWidth });
        $('.unit').first().remove();
        timelineMoved = 0;
    }
    timelineDelta = parseInt($('.timeline').css('left'), 10) % unitWidth;
}

function timelineZoom(scale, deltaX) {
    $('.unit').width(unitWidth);
    let left = $('.timeline').css('left').replace('px', '');
    $('.timeline').css({ left: left * scale + deltaX });
    fillRestDays();
}

function fillRestDays() {
    addDaysBefore();
    addDaysAfter();
    removeHiddenDays();
}

function addDaysBefore() {
    let elem = $('.unit').first();
    let date = new Date(elem.attr('date'));
    let flag = !elem.hasClass('even');
    let from = elem.offset().left - $('.timeline-row').offset().left;
    let to = 0;
    let left;
    let html = '';
    for (left = from; left >= to; left = left - unitWidth) {
        date.setDate(date.getDate() - 1);
        html = getUnitHtml(date, flag) + html;
        flag = !flag;
    }
    $('.timeline').prepend(html).css({ left: left });
}

function addDaysAfter() {
    let elem = $('.unit').last();
    let date = new Date(elem.attr('date'));
    let flag = !elem.hasClass('even');
    let from = elem.offset().left + unitWidth;
    let to = $('.timeline-row').offset().left + $('.timeline-row').width();
    let html = '';
    for (let i = from; i <= to; i = i + unitWidth) {
        date.setDate(date.getDate() + 1);
        html += getUnitHtml(date, flag);
        flag = !flag;
    }
    $('.timeline').append(html);
}

function removeHiddenDays() {
    let timelineLeft = $('.timeline-row').offset().left;
    let endPixel = timelineLeft + $('.timeline-row').width();
    $('.unit').each(function () {
        if ($(this).offset().left - timelineLeft > endPixel) {
            $(this).remove();
        }
    });
}

function getUnitHtml(date, flag) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let html = `<div id="${y + '_' + m + '_' + d}"" class="unit ${flag ? 'even' : 'odd'}"`;
    html += ` style="width:${unitWidth}px;"`;
    html += ` date="${y + '-' + m + '-' + d}"`;
    html += ` title="${y + '-' + m + '-' + d}">`;
    html += `${d}`;
    html += `</div>`;
    return html;
}