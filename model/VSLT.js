class VSLT {
	constructor(link0, link1, link2, linkR, put) {
		this.link0 = link0;
		this.link1 = link1;
		this.link2 = link2;
		this.linkR = linkR;
		this.put = put;
	}
	
	getSLC() {
		return [this.link0, this.link1, this.link2];
	}
	
	getSLT() {
		return [this.link0, this.link1, this.link2];
	}
	
	getListIndexSLC() {
		return [this.link0.index, this.link1.index, this.link2.index];
	}
	
	getListIndexSLT() {
		return [this.link0.index, this.link1.index, this.link2.index, this.linkR.index];
	}
}
