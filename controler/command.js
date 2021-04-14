function nStep(n) {
	for(var i = 0; i < n - 1; i++)
		if(indexAList != -1)
			oneStep(false);
	
	oneStep(true);
}

function runUntilIndexAList(index, show) {
	while(indexAList != index) {
		oneStep(show);
	}
}

function nStepWithSpeed(n, speed) {
	setTimeout(function () {
		if(n == 0)
			console.log("Done");
		else {	
			oneStep(true);
			if(n > 0)
				nStepWithSpeed(n - 1, speed);
		}
	}, speed);
}