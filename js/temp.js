
/* function renderTimeline_() {
    let html = "";
    let ind = 0;
    for (var m = moment(minDay); m.isBefore(maxDay); m.add(1, 'd')) {
        html += `<div class="unit ${ind % 2 == 0 ? 'even' : 'odd'}" style="width:${zoomType.pixel}px;" day="${m.format('YYYY-MM-DD')}">${m.format('M/D')}</div>`;
        ind++;
    }
    $('.timeline').addClass(zoomType.type).append(html);
}

function timelineZoom(scale, delta) {
    $('.unit').width(zoomType.pixel * zoom);
    $('.timeline').css({ left: parseInt($('.timeline').css('left'), 10) + scale < 1 ? delta.x : delta.x * 10 / 9 })
}

function timelineMove(delta) {
    $('.timeline').offset({ left: $('.timeline').offset().left + delta.x });
    let left = parseInt($('.timeline').css('left'), 10);
    let newDay;
    let className;
    let firstElem = $('.unit').first();
    let lastElem = $('.unit').last();
    if (left > 0) {
        newDay = moment(firstElem.attr('day'), "YYYY-MM-DD").add('-1', 'd');
        className = firstElem.hasClass('even') ? 'odd' : 'even';
        $('.timeline')
            .prepend(`<div class="unit ${className}" style="width:${zoomType.pixel}px;" day="${newDay.format('YYYY-MM-DD')}">${newDay.format('M/D')}</div>`)
            .css({ left: left - zoomType.pixel });
        lastElem.remove();
    } else if (left < zoomType.pixel * -1) {
        newDay = moment(lastElem.attr('day'), "YYYY-MM-DD").add('1', 'd');
        className = lastElem.hasClass('even') ? 'odd' : 'even';
        $('.timeline')
            .append(`<div class="unit ${className}" style="width:${zoomType.pixel}px;" day="${newDay.format('YYYY-MM-DD')}">${newDay.format('M/D')}</div>`)
            .css({ left: left + zoomType.pixel });
        firstElem.remove();
    }
} */

function removeDaysBefore(day) {

}
function removeDaysAfter(day) {

}

function getDayByPixel(pixel) {

}

function getPixelByDay(day) {

}