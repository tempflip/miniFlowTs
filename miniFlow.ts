var MFNODE_KEY_COUNT = 0;
var NODE_MAP = {};

class MfNode {
	_key : number;
	value : number;
	inboundNodes : MfNode[];
	outboundNodes : MfNode[];
	gradients : any;

	constructor(inboundNodes : MfNode[]) {
		this.value = null;
		this.inboundNodes = inboundNodes;
		this.outboundNodes = [];
		this.gradients = {};

		this._key = MFNODE_KEY_COUNT;
		NODE_MAP[this._key] = this;
		MFNODE_KEY_COUNT ++;

		for (var node of this.inboundNodes) {
			node.outboundNodes.push(this);
		}
	}

	forward() : void {}

	backward() : void {}

}

class MfInput extends MfNode {

	constructor(value : number) {
		super([]);
		this.value = value;
	}

	backward() : void {
		let gra = 0;
		for (var n of this.outboundNodes) {
			gra += n.gradients[this._key]
		}
		this.gradients[this._key] = gra;
	}

}

class MfLinear extends MfNode {
	x : MfNode;
	w : MfNode;
	b : MfNode;

	constructor(xNode, wNode, bNode) {
		super([xNode, wNode, bNode]);
		this.x = xNode;
		this.w = wNode;
		this.b = bNode;
	}

	forward() : void {
		//let x = this.inboundNodes[0].value;
		//let w = this.inboundNodes[1].value;
		//let b = this.inboundNodes[2].value;
		this.value = this.x.value * this.w.value + this.b.value;
	}

	backward() : void {
		this.gradients[this.x._key] = 0;
		this.gradients[this.w._key] = 0;
		this.gradients[this.b._key] = 0;
		
		for (var n of this.outboundNodes) {
			let cost = n.gradients[this._key];

			this.gradients[this.x._key] += this.w.value * cost; 
			this.gradients[this.w._key] += this.x.value * cost;
			this.gradients[this.b._key] += cost;

		}
	}
}

class MfCombine extends MfNode {
	nodeList : MfNode[];

	constructor(nodeList : MfNode[]) {
		super(nodeList);
		this.nodeList = nodeList;
	}

	forward() : void {
		let v = 0;
		for (var n of this.nodeList) {
			v += n.value;
		}
		this.value = v;
	}

	backward() : void {
		for (var inBoundNode of this.nodeList) {
			this.gradients[inBoundNode._key] = 0;
		}

		for (var n of this.outboundNodes) {
			let cost = n.gradients[this._key];
			for (var inBoundNode of this.nodeList) {
				this.gradients[inBoundNode._key] += cost;
			}
		}
	}	
}

class MfSigmoid extends MfNode {
	x : MfNode;

	constructor(inputNode : MfNode) {
		super([inputNode]);
		this.x = inputNode;
	}

	forward() : void {
		this.value = 1 / (1 + Math.exp(-1 * this.x.value));
	}

	backward() : void {
		this.gradients[this.x._key] = 0;
	
		for (var n of this.outboundNodes) {
			let cost = n.gradients[this._key];
			this.gradients[this.x._key] += this.value * (1 - this.value) * cost;
		}
	}

}

class MfMSE extends MfNode {
	a : MfNode;
	y : MfNode;
	constructor(actualValueNode : MfNode, predictedValueNode : MfNode) {
		super([actualValueNode, predictedValueNode]);
		this.a = actualValueNode;
		this.y = predictedValueNode;
	}

	forward() : void {
		let mse = Math.pow((this.a.value - this.y.value), 2);
		this.value = mse;
		//console.log('a, y', this.a.value, this.y.value);
	}

	backward() : void {
		this.gradients[this.a._key] = this.y.value - this.a.value;
		this.gradients[this.y._key] = -1. *(this.y.value - this.a.value);
	}

}

function topologicalSort(nodeList: MfNode[]) {
	let G = {};
	let L = [];
	//let nodeMap = {};
	let nl = [];

	for (var n of nodeList) nl.push(n);

	while (nl.length > 0) {
		let n = nl.pop();
		//nodeMap[n._key] = n;

		if (G[n._key] == undefined) {
			G[n._key] = {in : {}, out : {}}
		}

		for (var m of n.outboundNodes) {
			if (G[m._key] == undefined) {
				G[m._key] = {in : {}, out : {}}
			}
			G[m._key]['in'][n._key] = 1;
			G[n._key]['out'][m._key] = 1;
			nl.push(m)
		}
	}
	//console.log(G);

	for (var n of nodeList) nl.push(n);

	while (nl.length > 0) {
		let n = nl.pop();
		L.push(n);
		for (var m of n.outboundNodes) {
			delete G[m._key]['in'][n._key];
			delete G[n._key]['out'][m._key];
		
			if (Object.keys(G[m._key]['in']).length == 0) {
				nl.push(NODE_MAP[m._key]);
			}
		}
	}	
	//console.log(L);
	return L;
}

function forwardGraph(graph) {
	for (var n of graph) {
		n.forward();
	}
}

function forwardAndBackward(graph) {
	forwardGraph(graph);

	for (var i = graph.length-1 ; i >= 0; i--) {
		graph[i].backward();
	}
}

function sgdUpdate(trainables, learningRate) {
	for (var tra of trainables) {


		for (var key in tra.gradients) {
			//console.log(key, tra.gradients[key], tra.value)
			tra.value += tra.gradients[key] * learningRate;
			//console.log('--->', tra.value);
		}
	}
}

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
		inputs.push(new MfInput(0));
	}
	return inputs;
}
///// test



var x1 = new MfInput(5);
var x2 = new MfInput(10);
var x3 = new MfInput(4);

var w1 = new MfInput(0.1);
var b1 = new MfInput(0.5);
var lin1 = new MfLinear(x1, w1, b1);

var w2 = new MfInput(2);
var b2 = new MfInput(5);
var lin2 = new MfLinear(x2, w2, b2);

var w3 = new MfInput(6);
var b3 = new MfInput(6);
var lin3 = new MfLinear(x3, w3, b3);

var com = new MfCombine([lin1, lin2, lin3])

var w4 = new MfInput(6.1);
var b4 = new MfInput(0.5);
var lin4 = new MfLinear(com, w4, b4);

var y = new MfInput(17);
var mse = new MfMSE(y, lin4);

var graph = topologicalSort([x1, x2, w1, w2, w3, w4, b1, b2, b3, b3]);


var epochs = 10;
var stepsPerEpoch = 1;
var learningRate = 0.01;

var trainables = [w1, b1, w2, b2, w3, b3];

for (var i = 0; i < epochs; i++) {
	for (var s = 0; s < stepsPerEpoch; s++) { 
		//for (var rec of testSet) {
			//x.value = rec.x;
			//y.value = rec.y;
			forwardAndBackward(graph);
			sgdUpdate(trainables, learningRate);
		//}
	}

	console.log('Epoch: ', i, 'COST: ', mse.value, '\t');
}

console.log(w1.value, b1.value, w2.value, w2.value, w3.value, b3.value);
