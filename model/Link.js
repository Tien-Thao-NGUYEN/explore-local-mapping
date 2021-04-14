class Link {
	constructor(lc, val, index) {
		this.lc = lc;
		this.val = val;
		this.index = index;
		this.maxValue = undefined;
	}
	
	stringOfVal() {
		return this.val == -1 ? "?" : this.val.toString();
	}
	
	stringOfMaxValue() {
		return this.maxValue === undefined ? "-" : this.maxValue.toString();
	}
	
	setVal(val) {
		this.val = val;
	}
	
	incVal() {
		this.val++;
	}
	
	canBeInc() {
		return this.val < this.maxValue;
	}

	incValModMaxVal() {
		this.val++;
		if(this.val > this.maxValue)
			this.val = 0;
	}
}
