import * as mf from './miniFlow';

function getTestSet(records, c) {
	var testSet = [];
	var usedKeys = {};
	
	while (testSet.length < c) {
		var k = Math.floor(Math.random() * records.length);
		if (usedKeys[k] == 1) continue;
		usedKeys[k] = 1;
		testSet.push(records[k]);
	}

	return testSet;
}

function buildInputs(record) {
	var inputs = [];
	for (var prop of record.props) {
		inputs.push(new mf.MfInput(0));
	}
	return inputs;
}
///// test

var setX = [
	[1,0,0,0,0,1,0,1,0,0,1,0,0,0,1,1,0,0,0,0,0,1,0,0,0,1,0,0,1,0,1,0,0,0,0,1],
	[0,1,0,0,0,1,0,1,0,0,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,0,0,1,0,0,1,0,0,0,1],
	[1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,0,0,0,1,1,0,0,0,1,0,0,1,0,1,1,0,0,0,1],
	[1,1,1,0,0,1,0,0,1,0,1,0,0,0,0,1,0,0,0,0,1,1,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
	[1,1,0,0,0,1,0,1,1,0,1,0,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0],
	[0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0],
	[0,1,0,0,1,0,0,1,1,0,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0],
	[0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0],
	[0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,0,0,1,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
	[0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
	[0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0,0,0,0,1,0,0,0],
	[0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
	[0,0,0,0,1,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
	[0,0,0,0,1,0,0,0,0,0,1,0,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,1,0],
	[0,0,0,1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,1,0],
	[0,0,0,1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
	[0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,1,1,0,0,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,0,0,0],
	[0,0,1,1,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,1,1,0,0],
	[0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,1,1,0,0],
	[0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,1,1,1,1,1,0,0,0,1,0,0,0,0,1,1,0,0],
	[1,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1,1,0,1,1,1,0,1,0,1,0,0,0,0,1,1,0,0,0,1,1,1,0,0,0,1,0,0,1,0,1,0,0,0,1,1],
	[0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,0,1,0,0,0,0,1,1,0,0,0,1,0,0,1,1],
	[0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,0,1,1,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,1,1],
	[0,0,1,0,0,1,0,0,1,0,1,1,0,0,1,0,1,0,0,1,1,1,1,0,1,1,1,0,0,0,0,0,1,0,0,0],

];
var set0 = [
	[1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1],
	[1,1,1,1,1,0,1,0,0,0,1,0,1,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,1,0,1,1,1,1,1],
	[0,1,1,1,0,0,1,1,0,1,1,0,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,0,1,1,0,1,1,1,0,0],
	[0,0,0,0,0,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,1,1,0],
	[0,0,0,0,0,0,0,1,1,1,1,0,1,1,0,0,1,1,1,0,0,0,0,1,0,1,1,1,1,1,0,0,0,0,0,0],
	[0,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0],
	[0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,1,1,1,0,0,1,0,1,1,1,1,1,0,0,0,1,1,0,0],
	[1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,1,1,1,1,1,1,1,0,0,0],
	[1,1,1,0,0,0,1,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1,1,1,1,0,0,1,0,0,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1,1,1,1,1,0,1,0,0,0,1,0,1,1,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1,1,1,1,1,0,1,0,0,0,1,0,1,1,0,1,1,0,0,1,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0],
	[1,1,1,1,1,0,1,0,0,0,1,0,1,0,0,1,1,0,1,0,0,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0],
	[1,1,1,1,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,1,1,1,1,0,0,0,0,0,0,0],
	[1,1,1,1,1,0,1,0,0,0,1,1,1,0,0,0,0,1,1,0,0,0,1,1,1,1,0,1,1,0,0,1,1,0,0,0],
	[0,0,0,1,1,0,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,1,1,1,1,0,1,1,0,0,1,1,1,0,0],
	[0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,1,1,1,1,0,1,1,0,0,1,1,1,0,0],
	[0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0],
	[0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,0,0,1,0,1,0,0,1,1,0,1,0,1,1,0,0,1,1,1,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,0,0,1,1,0,1,0,1,1,0,0,1,1,1,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,0,1,1,0,0,1,1,1,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,1,1,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,0,1,1,0,0,1,1,1,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,0,0,1,1,0,0,0,0,1,0,1,1,1,1,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,0,0,1,1,1,1,0,0,1,1,0,1,1,1,1,0],
	[0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1],

];

var records = [];
for (var e of setX) {
	records.push({val : 1, props : e});
}
for (var e of set0) {
	records.push({val : 0, props : e});
}

function buildNet(records) {
	var net = [];
	var inputs = [];
	var trainables =[];
	var lins = [];
	for (var prop in records[0].props) {
		var x = new mf.MfInput(Math.random());
		var w = new mf.MfInput(Math.random());
		var b = new mf.MfInput(Math.random());
		var lin = new mf.MfLinear(x, w, b);

		net.push(x, w, b, lin);
		inputs.push(x);
		lins.push(lin);
		trainables.push(w, b);
	}

	var result = new mf.MfCombine(lins);
	//var result = new MfSigmoid(com);
	var y = new mf.MfInput(Math.random());
	var mse = new mf.MfMSE(y, result);

	net.push(result, y, mse);

	return {
		net : net,
		graph : mf.topologicalSort(net),
		inputs : inputs,
		trainables : trainables,
		mse : mse,
		y : y,
		result : result
	}
}

function feedNet(net, props) {
	for (var propIndex = 0; propIndex < props.length; propIndex ++) {
		net.inputs[propIndex].value = props[propIndex];
	}	
}

var net = buildNet(records);


var epochs = 40;
var stepsPerEpoch = 20;
var learningRate = 0.001;



for (var i = 0; i < epochs; i++) {
	for (var s = 0; s < stepsPerEpoch; s++) { 
		var trainSet = getTestSet(records, records.length * 1);
		for (var rec of trainSet) {
			feedNet(net, rec.props);
			net.y.value = rec.val;

			mf.forwardAndBackward(net.graph);
			mf.sgdUpdate(net.trainables, learningRate);
		}
	}

	console.log('Epoch: ', i, 'COST: ', net.mse.value, '\t');
}

//tests
////////////////////

for (var rec of records) {
	feedNet(net, rec.props);
	mf.forwardGraph(net.graph);
	//console.log('rec: ', rec.props);
	//console.log('val: ', rec.val, net.result.value);
	//console.log('val: ', net.result.value);
	//console.log('----------------------');

}

