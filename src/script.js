jQuery(document).ready(function($){
    // mask
    $('.money').mask("#.##0,00", {
        reverse: true
    });    
    function drawChart(element) {
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Meses');
        data.addColumn('number', 'Dinheiro acumulado');
        data.addColumn('number', 'Dinheiro investido');
        data.addColumn('number', 'Total em juros');
      
        var data_ = [];
        var accumulated;
        var initial_value_applied = $(element).parents('form').find('.initial_value_applied').val().replace('.', '').replace(',', '.');
        var monthly_application = $(element).parents('form').find('.monthly_application').val().replace('.', '').replace(',', '.');        
        var estimated_yield = $(element).parents('form').find('.estimated_yield').val() / 100;
        var time = $('.time').val();
        var formatter = new google.visualization.NumberFormat({ decimalSymbol: ',', groupingSymbol: '.', negativeColor: 'red', negativeParens: true, prefix: 'R$ ' });
        var invested = parseFloat(initial_value_applied);
        var yield_total = 0;
        for(var i = 1; i <= time; i++) { 
            accumulated = parseFloat(initial_value_applied) * Math.pow(1 + estimated_yield, i) + monthly_application * (Math.pow(1 + estimated_yield, i) - 1) / estimated_yield;
            invested += parseFloat(monthly_application);
            yield_total = accumulated - invested;
            data_.push([i, { v: accumulated, f: accumulated.toFixed(2) }, { v: invested, f: invested.toFixed(2) }, { v: yield_total, f: yield_total.toFixed(2) }]);
        }       
        data.addRows(data_);
        formatter.format(data, 1);
        formatter.format(data, 2);
        formatter.format(data, 3);
        var options = {
            chart: {
                title: 'Gráfico do dinheiro em relação ao tempo',
                subtitle: 'em reais (R$)'
            },
            height: 350,
            axes: {

            },
            vAxis: {
                title: 'Dinheiro',
                logScale:true,
                format: 'R$ #,###'
            },
            hAxis: {
                title: 'Meses',
                logScale: false,
                format: time > 1 ? '# meses' : '# mes'
            },
            bars: 'vertical' // Required for Material Bar Charts.
        };     
        
        if(time > 12) {
            var chart = new google.charts.Line(element);
            chart.draw(data, google.charts.Line.convertOptions(options));
        }
        else{
            var chart = new google.charts.Bar(element);
            chart.draw(data, google.charts.Bar.convertOptions(options));
        }   
        

        
    }

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

            $(this).find('.chart_div').fadeIn();
            $(this).find('.chart_div').removeClass('hidden');
            var element = $(this).find('.chart_div')[0];
            google.charts.load('current', { 'packages': ['line', 'bar'] });
            google.charts.setOnLoadCallback(function () { drawChart(element) });
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