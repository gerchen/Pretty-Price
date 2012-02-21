$(function () {
    function addCommas(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    function roundPrice(integral, fractional) {
        if ((integral.substr(-1) === '9' && integral.length > 1) || (fractional && fractional[0] === '9')) {
            integral = '' + (integral - 0 + 1);
            if (integral.substr(-1) === '9' && integral.length > 1)
                // If previous fix did something like 538.99 -> 539.00, then we can round once more.
                integral = '' + (integral - 0 + 1);
            return integral;
        }
    }
    var fixer = {
        'www.amazon.com': function () {
            function fix() {
                $.each($('span.price, b.priceLarge'), function () {
                    var priceContainer = $(this),
                        price = priceContainer.text().replace(/^\s+|\s+$/g, '').split('.'),
                        newPrice = roundPrice(price[0].replace('$', '').replace(',', ''), price[1]);
                    if (newPrice != undefined) priceContainer.text(' $' + addCommas(newPrice + '.00'));
                });
            }
            function dynamicFix() {
                var serp = $('div#btfResults');
                if (!serp.attr('PP_Fixed')) {
                    fix();
                    serp.attr('PP_Fixed', true);
                }
            }
            fix();
            setInterval(dynamicFix, 200);
        }
    }[window.location.hostname];

    if (fixer != undefined) fixer();
});
