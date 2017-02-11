var maki : string = 'hali';

class MfNode {
	value : number;
	inboundNodes : MfNode[];
	outboundNodes : MfNode[];

	constructor(inboundNodes : MfNode[]) {
		this.value = null;
		this.inboundNodes = inboundNodes;
		this.outboundNodes = [];

		for (var node of this.inboundNodes) {
			node.outboundNodes.push(this);
		}
	}

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
		var x = this.inboundNodes[0].value;
		var w = this.inboundNodes[1].value;
		var b = this.inboundNodes[2].value;
		this.value = x * w + b;
	}
}


///// test
var x = new MfInput(10);
var w1 = new MfInput(4);
var b1 = new MfInput(5);

var w2 = new MfInput(0.1);
var b2 = new MfInput(0.2);

var lin1 = new MfLinear(x, w1, b1);
var lin2 = new MfLinear(lin1, w2, b2);

lin1.forward();
lin2.forward();

console.log(lin1);
console.log(lin2);

