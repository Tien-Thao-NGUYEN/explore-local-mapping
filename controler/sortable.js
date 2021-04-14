/*
$('tbody').sortable({
	var sortOrder = [];

	start: function(event, element){
  	$.map($('[name^=sort]', $sortableTable), function(element){
	  	sortOrder.push(element.value);
  	});
  },
        
	stop: function(event, element) {
    $.each($('tr [name^=sort]', $sortableTable), function(index, element){
	    element.value = sortOrder[index];
    });
  }
});

$('tbody').disableSelection();
*/
