jQuery(document).ready(function($){
    $('.money').mask("#.##0,00", {
        reverse: true
    });

    $('.financial-simulator-form').submit(function (e) {
        e.preventDefault();
        var initial_value_applied = $(this).find('.initial_value_applied').val().replace('.', '').replace(',', '.');
        var estimated_yield = $(this).find('.estimated_yield').val() / 100;
        var time = $(this).find('.time').val();
        var monthly_application = $(this).find('.monthly_application').val().replace('.', '').replace(',', '.');
        var accumulated = 0;
        var total_amount = 0;
        var interest = 0;
        var estimated_monthly_income = 0;
        if (initial_value_applied && estimated_yield && time && monthly_application) {
            accumulated = parseFloat(initial_value_applied) * Math.pow(1 + estimated_yield, time) + monthly_application * (Math.pow(1 + estimated_yield, time) - 1) / estimated_yield;
            total_amount = parseFloat(initial_value_applied) + (time * monthly_application);
            interest = accumulated - total_amount;
            estimated_monthly_income = accumulated / time;
            $(this).find('#_accumulated').html(accumulated.formatMoney(2, ',', '.'));  
            $(this).find('#_total_amount').html(total_amount.formatMoney(2, ',', '.'));
            $(this).find('#_interest').html(interest.formatMoney(2, ',', '.'));
            $(this).find('#_estimated_monthly_income').html(estimated_monthly_income.formatMoney(2, ',', '.'));
            
            if ($(this).find('#_result').hasClass('hidden')) {
                $(this).find('#_result').fadeIn();
                $(this).find('#_result').removeClass('hidden');
                $('html, body').animate({
                    scrollTop: $(this).find("#_result").offset().top
                }, 1000);
            }
        }
    });

    $('._clear').click(function () {
        var form = $(this).parents('form');       
        form.find('.initial_value_applied').val('');
        form.find('.estimated_yield').val('');
        form.find('.time').val('');
        form.find('.monthly_application').val('');
        $.when(form.find('#_result').fadeOut('slow')).done(function () {
            form.find('#_result').addClass('hidden');
        });
    });
});

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};