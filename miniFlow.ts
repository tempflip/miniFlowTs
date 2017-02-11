var MFNODE_KEY_COUNT = 0;
var NODE_MAP = {};

class MfNode {
	_key : number;
	value : number;
	inboundNodes : MfNode[];
	outboundNodes : MfNode[];

	constructor(inboundNodes : MfNode[]) {
		this.value = null;
		this.inboundNodes = inboundNodes;
		this.outboundNodes = [];
		this._key = MFNODE_KEY_COUNT;
		NODE_MAP[this._key] = this;
		MFNODE_KEY_COUNT ++;

		for (var node of this.inboundNodes) {
			node.outboundNodes.push(this);
		}
	}

	forward() : void {}

}

class MfInput extends MfNode {

	constructor(value : number) {
		super([]);
		this.value = value;
	}


}

class MfLinear extends MfNode {

	constructor(xNode, wNode, bNode) {
		super([xNode, wNode, bNode]);
	}

	forward() : void {
		let x = this.inboundNodes[0].value;
		let w = this.inboundNodes[1].value;
		let b = this.inboundNodes[2].value;
		this.value = x * w + b;
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

function forwardAndBackward(graph) {
	for (var n of graph) {
		n.forward();
	}
}
///// test



var x = new MfInput(10);
var w1 = new MfInput(4);
var b1 = new MfInput(5);

var w2 = new MfInput(0.1);
var b2 = new MfInput(0.2);

var w3 = new MfInput(2)
var b3 = new MfInput(0.6)

var lin1 = new MfLinear(x, w1, b1);
var lin2 = new MfLinear(lin1, w2, b2);
var lin3 = new MfLinear(lin2, w3, b3);

//var graph = topologicalSort([x, w1, b1, w2, b2, lin1, lin2]);
var graph = topologicalSort([x, w1, b1, w2, b2, w3, b3]);
forwardAndBackward(graph);


console.log(lin1.value);
console.log(lin2.value);
console.log(lin3.value);
