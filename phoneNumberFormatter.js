// phoneNumberFormatter.js
(function ($) {
    $.fn.phoneNumberFormatter = function () {
        return this.each(function () {
            var $phoneInput = $(this);
            var $countrySelect = $phoneInput.siblings('.country-select');
            var format = '';
            var digits = [];
            var $flagIcon = $phoneInput.siblings('.flag-icon-wrapper');

            $.getJSON('phone-codes.json', function (data) {

                $.each(data, function (index, country) {
                    var countryCode = String(country.cc).toLowerCase();
                    var $option = $('<option>')
                        .val(country.cc)
                        .data('format', country.mask.replace(/#/g, 'X'))
                        .data('countrycode', countryCode)
                        .text(country.cc);
                    if (country.cc == "RU" ) {
                        $option.prop('selected', true);
                    }
                    $countrySelect.append($option);
                });
    
                format = $countrySelect.find('option:selected').data('format');
                var selectedCountryCode = $countrySelect.find('option:selected').data('countrycode');
                $flagIcon.attr('class', '').addClass('flag-icon flag-icon-' + selectedCountryCode);
                applyFormat();
                
            });

            $countrySelect.on('change', function () {
                format = $countrySelect.find('option:selected').data('format');
                var selectedCountryCode = $countrySelect.find('option:selected').data('countrycode');
                $flagIcon.attr('class', '').addClass('flag-icon flag-icon-' + selectedCountryCode);
                digits = [];
                applyFormat();
            });

            $phoneInput.on('keydown', function (e) {
                var digit = String.fromCharCode(e.keyCode);
                if (/\d/.test(digit) && digits.length < format.replace(/[^\dX]/g, '').length) {
                    digits.push(digit);
                } else if (e.keyCode === 8 && digits.length > 0) { // Backspace
                    digits.pop();
                }
                applyFormat();
                return false; // Prevent default
            });

            function applyFormat() {
                var digitsIndex = 0;
                var formatted = Array.from(format).map(function (char) {
                    if (char === 'X') {
                        if (digits.length > digitsIndex) {
                            return digits[digitsIndex++];
                        } else {
                            return '';
                        }
                    } else {
                        return char;
                    }
                }).join('');
                $phoneInput.val(formatted);
            }
        });
    };
})(jQuery);

