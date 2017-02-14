var MFNODE_KEY_COUNT = 0;
var NODE_MAP = {};

export class MfNode {
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

export class MfInput extends MfNode {

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

export class MfLinear extends MfNode {
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

export class MfCombine extends MfNode {
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

export class MfSigmoid extends MfNode {
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

export class MfMSE extends MfNode {
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

export function topologicalSort(nodeList: MfNode[]) {
	let G = {};
	let L = [];
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
	return L;
}

export function forwardGraph(graph) {
	for (var n of graph) {
		n.forward();
	}
}

export function forwardAndBackward(graph) {
	forwardGraph(graph);

	for (var i = graph.length-1 ; i >= 0; i--) {
		graph[i].backward();
	}
}

export function sgdUpdate(trainables, learningRate) {
	for (var tra of trainables) {


		for (var key in tra.gradients) {
			//console.log(key, tra.gradients[key], tra.value)
			tra.value += tra.gradients[key] * learningRate;
			//console.log('--->', tra.value);
		}
	}
}

