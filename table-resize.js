function tableResize(selector) {
    'use strict';

    var widths = {};
    var table = $(selector);

    if (localStorage.TableResizeWidths)
        widths = JSON.parse(localStorage.TableResizeWidths);

    return function() {

        for (var seq in widths[selector]) {
            table.find('col:nth-child(' + (parseInt(seq) + 1) + ')').width(widths[selector][seq]);
        }

        table.find('th').wrapInner('<div>').find('div').append('<div class="tableResize"></div>');

        // drag-drop resize
        table.find('th .tableResize').bind('mousedown', dragDropResize)
        // auto resize
        .bind('dblclick', autoResize);
        
    }();

    function dragDropResize(e) {
		
        var mousedown = false;
        var currentCol = undefined;
        var currentX, currentWidth;
        
        currentCol = table.find('col:nth-child(' + ($(this).closest('tr').find('th').index($(this).closest('th')) + 1) + ')');
        mousedown = true;
        currentX = e.pageX;
        currentWidth = currentCol[0].offsetWidth || parseInt(currentCol[0].style.width.substring(0, (currentCol[0].style.width.length) - 2)) || 100;    // 100 is default

        document.addEventListener('mousemove', mousemoveevent, false);
        document.addEventListener('mouseup', mouseupevent, false);

        function mousemoveevent(e) {
            if (mousedown) {
                var width = currentWidth + (e.pageX - currentX);
                if (width < 20)
                    width = 20;

                currentCol.width(width);
                var seq = currentCol.closest('colgroup').find('col').index(currentCol);

                if (widths[selector] == undefined)
                    widths[selector] = {};
                widths[selector][seq] = width;
            }
        }

        function mouseupevent() {
            if (mousedown) {
                mousedown = false;
                document.removeEventListener('mousemove', mousemoveevent, false);
                document.removeEventListener('mouseup', mouseupevent, false);
                localStorage.TableResizeWidths = JSON.stringify(widths);
            }
        };

    };

    function autoResize(e) {

        var textWidth = $('<span class="textWidth"></span>');
        var textWidthJS = textWidth[0];
        table.append(textWidth);

        var index = $(e.target).closest('tr').find('th').index($(e.target).closest('th'));

        var maxWidth = 0;
        var tWidth = 0;
        var rows = table.find('tbody td:nth-child(' + (index + 1) + ')');
        for (var i = 0, len = rows.length; i < len; i++) {
            textWidthJS.innerHTML = rows[i].innerHTML;
            tWidth = textWidthJS.offsetWidth;
            if (tWidth > maxWidth)
                maxWidth = tWidth;
        }

        maxWidth += 10;     // some padding..
        if (maxWidth < 20)
            maxWidth = 20;

        table.find('col:nth-child(' + (index + 1) + ')').width(maxWidth);
        var seq = index;

        if (widths[selector] == undefined)
            widths[selector] = {};
        widths[selector][seq] = maxWidth;
        localStorage.TableResizeWidths = JSON.stringify(widths);

        textWidth.remove();

    };

}