var maki : string = 'hali';

class MfNode {
	value : number;
	inboundNodes : MfNode[];
	outboundNodes : MfNode[];

	constructor(value : number) {
		this.value = value;
		this.inboundNodes = [];
		this.outboundNodes = [];
	}

}

class MfInput extends MfNode {

	constructor(value : number) {
		super(value);
	}


}

