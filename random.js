do {
	var sum = 0;
	var list = Array();
	for (var i=1; i <= 40; i++) {
		var b = Math.floor((Math.random() * 100));
		list.push(b);
		sum+= b;
	}
	list.sort(function(a,b){return a - b});
} while ((sum/40 <= 49.9 || sum/40 >= 50.1) || ((list[19]+list[20])/2 != 50) );
console.log(list);
console.log("avg: "+(sum/40));
console.log("median: "+((list[19]+list[20])/2));