class ASLT extends VSLT{
	constructor(link0, link1, link2, linkR, put) {
		super(link0, link1, link2, linkR, put);
		this.vqueue = [];
		this.vfutur = {};
		this.vfuturEstime = {};
	}
	
	putVFurtur(lc, vslt) {
		if(this.vfutur[lc] === undefined)
			this.vfutur[lc] = [];
		
		this.vfutur[lc].push(vslt);
	}
}
