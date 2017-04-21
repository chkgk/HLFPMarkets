// Page Handling
function instr() {
	$('#instructions').hide();
	$('#instructionsTask').show();
}

function instr2() {
	$('#instructionsTask').hide();
	$('#treatment').show();
	$('input[name=quantity]').focus();
}

function sers(event) {
	event.preventDefault();

	var sers = {};

	for (var i = 1; i<=15; i++) {
		sers['sers'+i] = $('input[name=sers'+i+']:checked').val();
	}

	socket.emit('storeData', sers);

	$('#SERS').hide();
	$('#overconfidence').show();
	$('input[name=overconfidence]').focus();
}

function overconfidence(event) {
	event.preventDefault();
	socket.emit('storeData', {overconfidence: $('input[name=overconfidence]').val() });

	$('#overconfidence').hide();
	$('#feedback').show();
}

function feedback() {
	$('#feedback').hide();
	$('#HATS').show();
}

function hats(event) {
	event.preventDefault();

	socket.emit('storeData', { hats: $('input[name=hats]:checked').val() });

	$('#HATS').hide();
	$('#risktask').show();
}

function risk(e) {
	var next = 0;
	var nextAmount = 0;
	var Current = $('#rNumber').html();

	if (e.data.choice == 'l') {
		next = Current*2;
	} else {
		next = Current*2 +1;
	}

	switch (next) {
		case 2: 
			nextAmount = '75';
			break;
		case 3: 
			nextAmount = '25';
			break;
		case 4: 
			nextAmount = '87,50';
			break;
		case 5: 
			nextAmount = '62,50';
			break;
		case 6: 
			nextAmount = '37,50';
			break;
		case 7: 
			nextAmount = '12,50';
			break;
		case 8: 
			nextAmount = '93,75';
			break;
		case 9: 
			nextAmount = '81,25';
			break;
		case 10: 
			nextAmount = '68,75';
			break;
		case 11: 
			nextAmount = '56,25';
			break;
		case 12: 
			nextAmount = '43,75';
			break;
		case 13: 
			nextAmount = '31,25';
			break;
		case 14: 
			nextAmount = '18,75';
			break;
		case 15: 
			nextAmount = '6,25';
			break;
	}

	if (next <= 15) {
		$('#rNumber').html(next);
		$('#rSureAmount').html(nextAmount);
		$('#rQNumber').html(parseInt($('#rQNumber').html())+1);
	} else {
		// STORE DATA AND MOVE ON!
		socket.emit('storeData', { riskNode: Current, riskChoice: e.data.choice } );

		$('#risktask').hide();
		$('#PROBABILITIES').show();
	}
}

function prob(event) {
	event.preventDefault();

	socket.emit('storeData', { prob: $('input[name=prob]:checked').val() });

	$('#PROBABILITIES').hide();
	$('#PSS').show();
}

function pss(event) {
	event.preventDefault();

	var pss = {};

	for (var i = 1; i<=14; i++) {
		pss['pss'+i] = $('input[name=pss'+i+']:checked').val();
	}

	socket.emit('storeData', pss);

	$('#PSS').hide();
	$('#SVO1').show();
}

function svo1() {
	$('#SVO1').hide();
	$('#SVO2').show();
}

function svo2(event) {
	event.preventDefault();

	var svo = {};

	for (var i = 1; i<=9; i++) {
		svo['svo'+i] = $('input[name=svo'+i+']:checked').val();
	}

	socket.emit('storeData', svo);

	$('#SVO2').hide();
	$('#PSRS').show();
}

function psrs(event) {
	event.preventDefault();

	var psrs = {};

	for (var i = 1; i<=5; i++) {
		psrs['psrs'+i] = $('input[name=psrs'+i+']:checked').val();
	}

	socket.emit('storeData', psrs);

	$('#PSRS').hide();
	$('#dictator').show();
	$('input[name=dictator]').focus();
}

function dictator(event) {
	event.preventDefault();

	socket.emit('storeData', { dictator: $('input[name=dictator]').val() });

	$('#dictator').hide();
	$('#demographics').show();
	$('input[name=age]').focus();
}

function demograph(event) {
	event.preventDefault();
	socket.emit('storeData', {
		age: $('input[name=age]').val(),
		female: $('input[name=female]:checked').val(),
		fieldofstudy: $('input[name=fieldofstudy]').val(),
		studentsince: $('input[name=studentsince]').val(),
		incomeGroup: $('input[name=incomeGroup]:checked').val(),
		smoke: $('input[name=smoke]:checked').val(),
		psychTreatment: $('input[name=psychTreatment]:checked').val(),
		nativeEnglish: $('input[name=nativeEnglish]:checked').val(),
		levelEnglish: $('input[name=levelEnglish]:checked').val(),
		strategy: $('textarea[name=strategy]').val()
	});

	$('#demographics').hide();
	$('#DISTRESS').show();
}

function distress(event) {
	event.preventDefault();

	var distress = {};

	for (var i = 1; i<=6; i++) {
		distress['distress'+i] = $('input[name=distress'+i+']:checked').val();
	}

	socket.emit('storeData', distress);

	$('#DISTRESS').hide();
	$('#selfimage').show();
}

function selfimage(event) {
	event.preventDefault();
	socket.emit('storeData', {
		riskAttitudeGeneral: $('input[name=riskAttitudeGeneral]:checked').val(),
		riskAttitudeFinancial: $('input[name=riskAttitudeFinancial]:checked').val(),
		riskAttitudeLeisure: $('input[name=riskAttitudeLeisure]:checked').val(),
		riskAttitudeEducation: $('input[name=riskAttitudeEducation]:checked').val(),
		riskAttitudeCareer: $('input[name=riskAttitudeCareer]:checked').val(),
		riskAttitudeHealth: $('input[name=riskAttitudeHealth]:checked').val()
	});

	$('#selfimage').hide();
	$('#HASSELS1').show();
}

function hassels(event) {
	event.preventDefault();

	var hassels = {};
	var min, max;

	switch(event.data.page) {
		case 1: 
			min = 1;
			max = 20;
			break;
		case 2: 
			min = 21;
			max = 41;
			break;
	}

	for (var i = min; i<=max; i++) {
		hassels['hassels'+i] = $('input[name=hassels'+i+']').val();
	}

	socket.emit('storeData', hassels);

	$('#HASSELS'+(event.data.page)).hide();
	if (event.data.page < 2) {
		$('#HASSELS'+(event.data.page+1)).show();
		$('input[name=hassels'+(max+1)+']').focus();
	} else {
		$('#HEXACO1').show();
		$('input[name=hexaco1]').focus();
	}
}

function hexaco(event) {
	event.preventDefault();

	var hexaco = {};
	var min, max;

	switch(event.data.page) {
		case 1: 
			min = 1;
			max = 25;
			break;
		case 2: 
			min = 26;
			max = 50;
			break;

		case 3:
			min = 51;
			max = 75;			
			break;

		case 4:
			min = 76;
			max = 100;			
			break;
	}

	for (var i = min; i<=max; i++) {
		hexaco['hexaco'+i] = $('input[name=hexaco'+i+']').val();
	}

	socket.emit('storeData', hexaco);

	$('#HEXACO'+(event.data.page)).hide();
	if (event.data.page < 4) {
		$('#HEXACO'+(event.data.page+1)).show();
		$('input[name=hexaco'+(max+1)+']').focus();
	} else {
		$('#ENDE').show();
		socket.emit('ende');
	}
}


// TASK Handling

function update_chart(demand, quantity) {
	var lineChartData = {
		labels : labels,
		datasets : [
			{
				fillColor : "#cd2015",
				strokeColor : "#cd2015",
				pointColor : "#cd2015",
				pointStrokeColor : "#fff",
				data : demand
			},
			{
				fillColor : "#0886be",
				strokeColor : "#0886be",
				pointColor : "#0886be",
				pointStrokeColor : "#fff",
				data : quantity
			}
		]
		
	}
	var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Line(lineChartData,{animation: false, datasetFill: false, bezierCurve : false, scaleOverlay: true, scaleOverride: true, scaleSteps: 10, scaleStepWidth: 10, scaleStartValue: 0});
}


function order() {
	if ($("input[name=quantity]").val() != "") {
		$("input[name=order]").attr("disabled", "disabled");

		round++;
		
		var quantity = parseFloat($("input[name=quantity]").val());
		var demand = get_demand(round);
		var equant = 0;
		
		if ((quantity - demand) < 0) {
			equant = -1 * (quantity - demand);
		}

		var cost = get_cost(quantity);
		var ecost = get_ecost(equant);
		var totalcost = cost + ecost;


		quantity_history.push(quantity);
		demand_history.push(demand);
		cost_history.push(cost);
		ecost_history.push(ecost);
		totalcost_history.push(totalcost);

		update_chart(demand_history, quantity_history);


		var hist = "<tr><td>"+round+"</td><td>"+quantity+"</td><td>"+demand+"</td><td>"+totalcost+"</td></tr>";
		$("#tablehistory tr:first").after(hist);

		$("input[name=quantity]").val("");
		$("input[name=quantity]").focus();
		$("input[name=order]").removeAttr("disabled");	
		//console.log(quantity_history, demand_history, cost_history, ecost_history, totalcost_history);

		$("#cr").html(round+1);
	}
	if (round >= total_rounds) {
		var total_sum = totalcost_history.reduce(function(pv, cv) { return pv + cv; }, 0);
		var total_avg = Math.round(total_sum / total_rounds * 100)/100;
		payoff = initial_endowment - total_sum;
		if (payoff < 0) { payoff = 0; }
		

		$("input[name=order]").attr("disabled", "disabled");
		$("input[name=quantity]").attr("disabled", "disabled");
		//$("#round").html("Thank you! The experiment is now over.");
		//$("#status").html("<p>Your total costs are "+total_sum+" tokens.<br>("+total_avg+" tokens on average per period)</p><p>Your payoff is "+payoff+" tokens.</p>");


		socket.emit('storeData', { payoff: payoff, quantityhistory: quantity_history.join(','), demandhistory: demand_history.join(',') });

		$('#totalsum').html(total_sum);
		$('#totalavg').html(total_avg);
		$('#payoffpoints').html(payoff);
		$('#payoffeur').html((payoff/10000).toFixed(2));

		$('#treatment').hide();
		$('#SERS').show();
		//$('input[name=overconfidence]').focus();
	}	 
}

function get_demand(round) {
	var dem = Array(20,32,22,42,78,46,98,54,63,25,25,70,81,81,71,15,32,88,75,1,2,39,74,50,32,82,58,27,56,48,78,89,75,0,96,22,50,93,6,4);
	return dem[round-1]; // random demand between 0-100
}

function get_cost(quantity) {
	var marginalcost = 10; // marginal cost of stock
	return quantity * marginalcost;
}

function get_ecost(quantity) {
	var emergency_mc = 40; // marginal cost of emergency delivery
	return quantity * emergency_mc;
}
