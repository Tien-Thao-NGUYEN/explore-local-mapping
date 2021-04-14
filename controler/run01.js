console.log("run01.js");

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

function findBreakPointIndex(sortedIndexList) {
	wayComeBack = [];
	var lastIndex = sortedIndexList.pop();
	while(lastIndex != -1) {
		wayComeBack.push(lastIndex);
		var aslt = asltList[lastIndex];
		if(aslt.put && aslt.linkR.canBeInc())
			return lastIndex;
		
		sortedIndexList = [...new Set(sortedIndexList.concat(asltList[lastIndex].getListIndexSLC()))].sort((a, b) => a - b);
		lastIndex = sortedIndexList.pop();
	}
	
	return -1;
}

function findBreakPointIndexWhenAsltError(aslt) {
	return findBreakPointIndex([...new Set(aslt.getListIndexSLC())].sort((a, b) => a - b));
}

function findBreakPointIndexWhenVsltError(vslt) {
	return findBreakPointIndex([...new Set(vslt.getListIndexSLT())].sort((a, b) => a - b));
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

function maxValue() {
	if(indexAList == 0)
		return 2;
	else if(asltList[indexAList - 1].linkR.maxValue == k - 2)
		return k - 2;
	
	var maxed = 1;
	for(var i = 0; i < indexAList; i++)
		if(maxed < asltList[i].linkR.val)
			maxed = asltList[i].linkR.val;
	
	return maxed + 1;
}


var tour = 1;
function oneStep(show=true) {
	console.log(tour);
	tour++;
	if(indexAList == -1) {
		console.log("Done !!!, indexAList = ", indexAList)
		return;
	}
	else if(indexAList == asltList.length) {
		//save
		console.log(dr);
		// TODO: //backFistChange
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
				getMapEstime(aslt);
				showEstimeTable(aslt);
			}
			
			indexAList++;
				
			if(show) {
				updateFiveUpletTableWhenOK();
				updateDRuleTableWhenOK();
			}
		}
		else {//vqueue error : indexError >= 0
			indexBreakPoint = findBreakPointIndexWhenVsltError(aslt.vqueue[indexError]);
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
		indexBreakPoint = findBreakPointIndexWhenAsltError(aslt);
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

//cho nay chinh sua : thay vi tu 0 den k - 2, cho tu 0 den maxVal + 1

function getMapEstime(aslt) {
	/*var length = -1;
	if(aslt.linkR.maxValue == k - 2)
		length = k - 1;
	else{
		if(aslt.linkR.val == aslt.linkR.maxValue)
			length = aslt.linkR.maxValue + 2;
		else
			length = aslt.linkR.maxValue + 1;
	} */
	var length = k - 1;
	
	aslt.vfuturEstime = {};
	var keys = Object.keys(aslt.vfutur);
	for(var key in keys) {
		var estime = [...Array(length).keys()];
		var vsltList = aslt.vfutur[keys[key]];
		for(var iVslt in vsltList) {
			var vslt = vsltList[iVslt];
			var slc = vslt.getSLC();
			for(var il in slc) {
				var link = slc[il]; 
				if(link.val == -1) {
					for(var v = 0; v < length; v++) {
						link.setVal(v);
						var existeVal = getDRes(sltToDstLC(vslt));
						if(existeVal !== undefined && existeVal !== vslt.linkR.val)
							estime[v] = undefined;
					}
					
					link.setVal(-1);
					break;
				}
			}
		}
		
		aslt.vfuturEstime[keys[key]] = estime.filter(function (e) {return e !== undefined;});
	}
}

function changeValueWhenClick(indexAList) {
	var aslt = asltList[indexAList];
	if(aslt.put) {
		aslt.linkR.incValModMaxVal();
		var dlc = sltToDstLC(aslt);
		dr[dlc] = aslt.linkR.val;
		updateFiveUpletTableWhenOK();
		updateDRuleTableWhenOK();
	}
}
