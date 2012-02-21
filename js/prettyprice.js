$(function () {
    function addSep(s, sep) {
        s += '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(s)) {
            s = s.replace(rgx, '$1' + sep + '$2');
        }
        return s;
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
                    if (newPrice != undefined) priceContainer.text(' $' + addSep(newPrice, ',') + '.00');
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
        },
        'www.amazon.co.uk': function () {
            function fix() {
                $.each($('span.price, b.priceLarge'), function () {
                    var priceContainer = $(this),
                        price = priceContainer.text().replace(/^\s+|\s+$/g, '').split('.'),
                        newPrice = roundPrice(price[0].replace('£', '').replace(',', ''), price[1]);
                    if (newPrice != undefined) priceContainer.text(' £' + addSep(newPrice, ',') + '.00');
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
        },
        'www.amazon.de': function () {
            function fix() {
                $.each($('span.price, b.priceLarge'), function () {
                    var priceContainer = $(this),
                        price = priceContainer.text().replace(/^\s+|\s+$/g, '').split(','),
                        newPrice = roundPrice(price[0].replace('EUR ', '').replace('.', ''), price[1]);
                    if (newPrice != undefined) priceContainer.text(' EUR ' + addSep(newPrice, '.') + ',00');
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
