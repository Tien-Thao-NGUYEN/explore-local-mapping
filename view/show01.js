jQuery.fn.scrollTo = function(elem, speed) { 
    $(this).animate({
        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top - ($(this).height()/3)
    }, speed == undefined ? 500 : speed); 
    return this; 
};

function sltToRow(index, slt, clsRow, clsIndex, clsPut, maxVal) { 
	return "<tr class='" + clsRow + "'>" +
				"<td class='raw'></td>" +
				"<td class='" + clsIndex + "'>" + index+ "</td>" + 
				"<td class='slc'>" + slt.link0.lc + "</td>" + 
				"<td>" + slt.link0.stringOfVal() + "</td>" + 
				"<td class='slc'>" + slt.link1.lc + "</td>" + 
				"<td>" + slt.link1.stringOfVal() + "</td>" + 
				"<td class='slc'>" + slt.link2.lc + "</td>" + 
				"<td>" + slt.link2.stringOfVal() + "</td>" + 
				"<td class='slc'>" + slt.linkR.lc + "</td>" + 
				'<td onClick="changeValueWhenClick(\'' + index + '\')">' + slt.linkR.stringOfVal() + "</td>" + 
				"<td class='maxValue'>" + maxVal + "</td>" + 
				"<td class='" + clsPut + "'>" + "</td>" +
			"</tr>";
}

function showFiveUpletTableRaw() {
	var fiveUpletTableBody = $("#fiveUpletTable tbody");
	fiveUpletTableBody.empty();
	for(var aindex in asltList) {
		var aslt = asltList[aindex];
		var clsAPut = aslt.put == true ? "putTrue" : "putFalse";
		fiveUpletTableBody.append(sltToRow(aindex, aslt, 'arow', 'aindex', clsAPut, aslt.linkR.stringOfMaxValue()));
		var vqueue = aslt.vqueue;
		for(var vindex in vqueue) {
			var vslt = vqueue[vindex];
			var clsVPut = vslt.put == true ? "putTrue" : "putFalse";
			fiveUpletTableBody.append(sltToRow(vindex, vslt, 'vrow', 'vindex', clsVPut, ""));
		}
	}
	
	return fiveUpletTableBody;
}

//TODO
function candidatToRow(key, backGround, estime, candidat) {
	return "<tr class='vrow'>" +
				"<td class=" + backGround + ">" + key + "</td>" +
				"<td>" + estime + "</td>" + 
				"<td class='slc'>" + candidat.link0.lc + "</td>" + 
				"<td>" + candidat.link0.stringOfVal() + "</td>" + 
				"<td class='slc'>" + candidat.link1.lc + "</td>" + 
				"<td>" + candidat.link1.stringOfVal() + "</td>" + 
				"<td class='slc'>" + candidat.link2.lc + "</td>" + 
				"<td>" + candidat.link2.stringOfVal() + "</td>" + 
				"<td class='slc'>" + candidat.linkR.lc + "</td>" + 
				"<td>" + candidat.linkR.stringOfVal() + "</td>" + 
			"</tr>";
}

//TODO
function showEstimeTable(aslt) {
	var estimeTable = $("#estimeTable tbody");
	estimeTable.empty();
	
	var keys = Object.keys(aslt.vfutur).sort();
	
	if(keys)
		var minLength = aslt.vfuturEstime[keys[0]].length;
		
	var minEstimeIndex = -1;
	var index = -1;
	
	var oddOrEven = 0;
	for(var key in keys) {
		var candidat = aslt.vfutur[keys[key]];
		var estime = aslt.vfuturEstime[keys[key]];
		
		if(minLength >= estime.length) {
			minEstimeIndex = index;
			minLength = estime.length;
		}
		
		var backGround = oddOrEven == 0 ? 'odd' : 'even';
		for(var c in candidat) {
			estimeTable.append(candidatToRow(keys[key], backGround, estime, candidat[c]));
			index++;
		}
		
		oddOrEven = (oddOrEven + 1) % 2;
	}
	
	if(index != -1)
		$("#estime").scrollTo($(estimeTable.find('tr').eq(minEstimeIndex)));
}

function findIndexRowInTable(aindex, vindex) {
	var row = aindex;
	for(var i = 0; i < aindex; i++)
		row = row + asltList[i].vqueue.length;
		
	return row + vindex + 1;
}

function updateClassFirstColumnInRow(table, irow, cls) {
	var firstColumn = $('td:first', table.find('tr').eq(irow));
	firstColumn.addClass(cls);
}

function updateFiveUpletTableWhenOK() {
	var fiveUpletTableBody = showFiveUpletTableRaw();
	var indexRow = findIndexRowInTable(indexAList, -1);
	
	if(indexAList > 0) {
		var indexRowTreated = findIndexRowInTable(indexAList - 1, -1);
		updateClassFirstColumnInRow(fiveUpletTableBody, indexRowTreated, 'treated');
	}
	
	updateClassFirstColumnInRow(fiveUpletTableBody, indexRow, 'current');
		
	$("#quintuplet").scrollTo(fiveUpletTableBody.find('tr').eq(indexRow));
}

function updateFiveUpletTableWhenError() {
	var fiveUpletTableBody = showFiveUpletTableRaw();
	updateClassFirstColumnInRow(fiveUpletTableBody, findIndexRowInTable(indexAList, indexError), 'error');
	
	for(var i = 0; i < wayComeBack.length - 1; i++)
		updateClassFirstColumnInRow(fiveUpletTableBody, findIndexRowInTable(wayComeBack[i], -1), 'wayComeBack');
	
	var indexRow = findIndexRowInTable(indexBreakPoint, -1);
	updateClassFirstColumnInRow(fiveUpletTableBody, indexRow, 'breakPoint');

	$("#quintuplet").scrollTo(fiveUpletTableBody.find('tr').eq(indexRow));
}

function updateDRuleTableRaw() {
	var druleTableBody = $("#dstRuleTable tbody");
	druleTableBody.empty();
	
	for(var dlc in drFixe)
		druleTableBody.append("<tr class='" + "drFixe" + "'>" +
											"<td class='raw'></td>" +
											"<td>" + dlc+ "</td>" +
											"<td>" + drFixe[dlc]+ "</td>" +
										"</tr>");
										
	for(var dlc in dr)
		druleTableBody.append("<tr class='" + "dr" + "'>" +
											"<td class='raw'></td>" +
											"<td>" + dlc+ "</td>" +
											"<td>" + dr[dlc]+ "</td>" +
										"</tr>");
}

function updateDRuleTableWhenOK() {
	updateDRuleTableRaw();
	var druleTableBody = $("#dstRuleTable tbody");
	var lastIndex = Object.keys(drFixe).length + Object.keys(dr).length -1;
	updateClassFirstColumnInRow(druleTableBody, lastIndex, 'currentDR');
	$("#drule").scrollTo(druleTableBody.find('tr').eq(lastIndex));
}

function updateDRuleTableWhenError(dlc) {
	updateDRuleTableRaw();
	var ind;
	var rule;
	if(dr[dlc] === undefined) {
		ind = 0;
		rule = drFixe;
	}
	else {
		ind = Object.keys(drFixe).length;
		rule = dr;
	}
	
	for(var lc in rule) {
		if(lc === dlc) {
			updateClassFirstColumnInRow($("#dstRuleTable tbody"), ind, 'error');
			$("#drule").scrollTo($("#dstRuleTable tbody").find('tr').eq(ind));
			break;
		}
		
		ind++;
	}
}
