console.log("run.js");

function sltToDstLC(slt) {
	return stringLC(slt.link0.val, slt.link1.val, slt.link2.val);
}

function getDRes(dlc) {
	if(drFixe[dlc] === undefined)
		return dr[dlc];
	else
		return drFixe[dlc];
}

function checkVQueue(vqueue) {
	for(var iv in vqueue) {
		var vslt = vqueue[iv];
		var dlc = sltToDstLC(vslt);
		var dres = getDRes(dlc);
		
		if(dres === undefined){
			dr[dlc] = vslt.linkR.val;
			vslt.put = true;
		}
		else if(dres != vslt.linkR.val)
			return parseInt(iv);
	}
	
	return OK;
}

function asltToSortedIndexList(aslt) {
	return [...new Set([aslt.link0.index, aslt.link1.index, aslt.link2.index])].sort((a, b) => a - b);
}

function vsltToSortedIndexList(vslt) {
	return [...new Set([vslt.link0.index, vslt.link1.index, vslt.link2.index, vslt.linkR.index])].sort((a, b) => a - b);
}

function findBreakPointIndex() {
	wayComeBack = [];
	var sortedIndexList = (indexError == AERROR) ? 
							asltToSortedIndexList(asltList[indexAList]) : 
							vsltToSortedIndexList(asltList[indexAList].vqueue[indexError]);
	
	var lastIndex = sortedIndexList.pop();
	while(lastIndex != -1) {
		wayComeBack.push(lastIndex);
		var aslt = asltList[lastIndex];
		if(aslt.put && aslt.linkR.canBeInc())
			return lastIndex;
		
		sortedIndexList = [...new Set(sortedIndexList.concat(asltToSortedIndexList(asltList[lastIndex])))].sort((a, b) => a - b);
		lastIndex = sortedIndexList.pop();
	}
	
	return -1;
}

function removeVQueue(vqueue) {
	for(var iv = vqueue.length - 1; iv >= 0; iv--) {
		var vslt = vqueue[iv];
		if(vslt.put) {
			var dlc = sltToDstLC(vslt);
			delete dr[dlc];
			vslt.put = false;
		}
	}
}

function backToBreakPoint() {
	if(indexError == AERROR)
		indexAList--;	
	
	for(var ia = indexAList; ia > indexBreakPoint; ia--) {
		var aslt = asltList[ia];
		removeVQueue(aslt.vqueue)
		
		if(aslt.put) {
			var dlc = sltToDstLC(aslt);
			delete dr[dlc];
			aslt.put = false;
		}
		
		aslt.linkR.setVal(-1);
		aslt.linkR.maxValue = undefined;
	}
	
	removeVQueue(asltList[indexBreakPoint].vqueue);
	
	indexAList = indexBreakPoint;
	indexError = undefined;
	indexBreakPoint = undefined;
}

function oneStep(show=true) {
	if(indexAList == -1) {
		console.log("Done !!!, indexAList = ", indexAList)
		return;
	}
	else if(indexAList == asltList.length) {
		//save
		console.log(dr);
		// TODO: //backFistChnage
		indexAList--;
	}
	
	var aslt = asltList[indexAList];
	var dlc = sltToDstLC(aslt);
	if(aslt.put) {//<-
		aslt.linkR.incVal();
		dr[dlc] = aslt.linkR.val; 
	}
	else {//->
		var dres = getDRes(dlc);
		if(dres === undefined) {//not existe
			aslt.linkR.setVal(0);
			dr[dlc] = 0;
			aslt.put = true;
			aslt.linkR.maxValue = maxValue();
		}
		else {
			if(dres == k - 1)//existe F
				indexError = AERROR;
			else{//existe !F
				aslt.linkR.setVal(dres);
				aslt.linkR.maxValue = maxValue();
			}
		}
	}
	
	if(indexError != AERROR) {//aslt ok
		indexError = checkVQueue(aslt.vqueue);
		if(indexError == OK) {//vqueue ok
			//TODO can phai process mapCandidat va estime o day de biet co di tiep hay ko
			if(show) {
				getMapCandidat();
				getMapEstime();
				showEstimeTable();
			}
			
			indexAList++;
				
			if(show) {
				updateFiveUpletTableWhenOK();
				updateDRuleTableWhenOK();
			}
		}
		else {//vqueue error : indexError >= 0
			indexBreakPoint = findBreakPointIndex();
			if(indexBreakPoint != -1) {//existe bp >= 0
				if(show){
					updateFiveUpletTableWhenError();
					var dlc = sltToDstLC(aslt.vqueue[indexError]);
					updateDRuleTableWhenError(dlc);
				}
					
				backToBreakPoint();
			}
			else{//not existe bp
				indexAList = -1;
				//console.log("indexAList", indexAList)
			}
		}
	}
	else {//aslt error
		indexBreakPoint = findBreakPointIndex();
		if(indexBreakPoint != -1) {//existe bp >= 0
			if(show) {
				updateFiveUpletTableWhenError();
				updateDRuleTableWhenError(dlc);
			}
				
			backToBreakPoint();
		}
		else {//not existe bp
			indexAList = -1;
			//console.log("indexAList", indexAList)
		}
	}
}


function getMapCandidat() {
	mapCandidat = {};
	for(var ia = indexAList + 1; ia < asltList.length; ia++) {
		var vsltCandidat = [];
		var vqueue = asltList[ia].vqueue;
		for(var iv = 0; iv < vqueue.length; iv++) {
			var vslt = vqueue[iv];
			var slc = vslt.getSLC();
			
			var cmp = 0;
			for(var i = 0; i < slc.length; i++)
				if(slc[i].val != -1)
					cmp++;
							
			if(cmp >= 2 && vslt.linkR.val != -1)
				vsltCandidat.push(vslt);
		}
		
		if(vsltCandidat.length > 0)
			mapCandidat[asltList[ia].linkR.lc] = vsltCandidat;
	}
}

function getMapEstime() {
	mapEstime = {};
	var keys = Object.keys(mapCandidat);
	for(var key in keys) {
		var estime = [...Array(k - 1).keys()];
		var candidat = mapCandidat[keys[key]];
		for(var ic in candidat) {
			var c = candidat[ic];
			var slc = c.getSLC();
			for(var il in slc) {
				var link = slc[il]; 
				if(link.val == -1) {
					for(var v = 0; v <= k - 2; v++) {
						link.setVal(v);
						var existeVal = getDRes(sltToDstLC(c));
						if(existeVal !== undefined && existeVal !== c.linkR.val)
							estime[v] = undefined;
					}
					
					link.setVal(-1);
					break;
				}
			}
		}
		
		mapEstime[keys[key]] = estime.filter(function (e) {return e !== undefined;});
	}
}

//cai nay chi goi khi indexAList++;
function maxValue() {
	if(indexAList == 0)
		return 2;
	else if(asltList[indexAList - 1].linkR.maxValue == k - 2)
		return k - 2;
	
	var existe = 1;
	for(var i = 0; i < indexAList; i++)
		if(existe < asltList[i].linkR.val)
			existe = asltList[i].linkR.val;
	
	return existe + 1;
}

//viet code de generer estimation