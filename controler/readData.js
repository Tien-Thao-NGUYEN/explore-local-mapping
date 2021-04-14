var k;
var asltList;
var drFixe;
var dr;

var indexAList;

var indexError;
var OK = -2;
var AERROR = -1;

var indexBreakPoint;

var wayComeBack;


function resetAll() {
	indexAList = 0;
	indexError = undefined;
	indexBreakPoint = undefined;
	wayComeBack = undefined;
	$("#estimeTable tbody").empty();
}

function readFile() {
	var fileSelected = document.getElementById('fileInput');
	var fileTobeRead = fileSelected.files[0];

	var fileReader = new FileReader(); 
	fileReader.onload = function (e) {
		var text = fileReader.result;
		fileContentToAsltList(text.substring(0, text.length - 1));/*la dernière caractère est '\n'*/
		updateFiveUpletTableWhenOK();
		updateDRuleTableWhenOK();
	}

  	fileReader.readAsText(fileTobeRead);
}

function stringLC(g, c, r) {
	var lc = g + " ";
	lc += c + " ";
	lc += r;
	return lc;
}

function loadData() {	
	k = parseInt(document.getElementById('numberState').value);

	drFixe = {};// TODO: use Map
	drFixe[stringLC(k, 0, 0)] = 0;
	drFixe[stringLC(0, 0, 0)] = 0;
	drFixe[stringLC(0, 0, k)] = 0;
	dr = {};
	
	resetAll();
	readFile();
}

function putLineInMap(map, line, val) {
	var tabLC = line.split(";");
	for(var lc in tabLC)
		map[tabLC[lc]] = new Link(tabLC[lc], val, -1);
}

function fileContentToAsltList(fileContent) {
	var map = {};
	asltList = [];
	var lines = fileContent.split('\n');
	map[lines[0]] = new Link(lines[0], 1, -1);
	putLineInMap(map, lines[1], 0);
	putLineInMap(map, lines[2], k - 1);
	putLineInMap(map, lines[3], k);
		
	for(var line = 4; line < lines.length; line++){
		var data = lines[line].split(";");
		if("a" == data[0]) {
			if(map[data[4]] === undefined)
				map[data[4]] = new Link(data[4], -1, asltList.length);
			else
				map[data[4]].index = asltList.length;
			
			asltList.push(new ASLT(map[data[1]], map[data[2]], map[data[3]], map[data[4]], false));
		}
		else if("v" == data[0]){
			var vslt = new VSLT(map[data[1]], map[data[2]], map[data[3]], map[data[4]], false);
			asltList[asltList.length - 1].vqueue.push(vslt);
		}
		else {
			if(map[data[0]] === undefined)
				map[data[0]] = new Link(data[0], -1, -2);
			
			var vslt = new VSLT(map[data[1]], map[data[2]], map[data[3]], map[data[4]], false);
			asltList[asltList.length - 1].putVFurtur(data[0], vslt);
		}
	}
}
