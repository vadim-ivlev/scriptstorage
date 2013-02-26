function iNote(domContainer){
var _container=domContainer;
var CELLS= [];



//Cell number generator
function getNewCellNumber(){
	var n=0;
	for (var i = 0; i < CELLS.length; i++) {
		if (n<=CELLS[i].getNumber())
				n=CELLS[i].getNumber()+1;
	}
	return n;
}


/**
find cell index in CELLS array  by cell number
*/
function getIndexByCellNumber(cellNumber){
	for (var i = 0; i < CELLS.length; i++) {
		if (cellNumber==CELLS[i].getNumber())
			return i;
	}
	return -1;
}



function deleteCell(cellNumber)
{
	var i=getIndexByCellNumber(cellNumber);
	if (i==-1) return;
	CELLS[i].getJQueryCell().remove();
	CELLS.splice(i,1);
}

function inserCellAfter(cellNumber)
{
	var i=getIndexByCellNumber(cellNumber);
	if (i==-1) return;

	var newCell=createNewCell(getNewCellNumber());

	newCell.getJQueryCell().insertAfter($("#cell"+cellNumber));
	CELLS.splice(i+1,0,newCell);
	newCell.setFocus(0,0);
	return newCell;
}

function insertCellBefore(cellNumber)
{
	var i=getIndexByCellNumber(cellNumber);
	if (i==-1) return;

	var newCell=createNewCell(getNewCellNumber());

	newCell.getJQueryCell().insertBefore($("#cell"+cellNumber));
	CELLS.splice(i,0,newCell);
	//CELLS.unshift(newCell);
	newCell.setFocus(0,0);
	return newCell;
}

// function printCells()
// {
// 	var s="";
// 	for (var i = 0; i < CELLS.length; i++) {
// 		s+=" "+CELLS[i].getNumber();
// 	}
// 	console.log("CELLS: "+s);

// }


function globalKeyHandler(event)
{
	var key=event.which;

	var ci=getCellInfo(event);
	var cell=ci.cell;
	var index=ci.index;
	var cellNumber=ci.number;

	//if(key == 13) saveNotebook();

	if(key == 13 && event.shiftKey)
	{
		if ( isCellLast(index))
			appendNewCell(getNewCellNumber());
		moveFocusToNextCell(index);
	}
	else if (key == 38 && cell.cursorOnFirstLine()) //arrow up
	{
		moveFocusToPreviousCell(index);
	}
	else if (key == 40 && cell.cursorOnLastLine()) //arrow down
	{
		moveFocusToNextCell(index);
	}
}

function createNewCell(cellNumber){
	var newCell = new Cell(cellNumber);

	//callbacks
	newCell.setDeleteCallback(deleteCell);
	newCell.setInsertBeforeCallback(insertCellBefore);
	newCell.setInsertAfterCallback(inserCellAfter);
	return newCell;
}

function appendNewCell(cellNumber) {
	var newCell=createNewCell(cellNumber);

	newCell.getJQueryCell().appendTo(_container);
	CELLS.push(newCell);
	//newCell.setFocus(0,0);
	return newCell;
}


function getCellInfo(event)
{
	var c = $(event.target).parents('.cell');
	var cellNumber=c.data("number");
	
	for (var i = 0; i < CELLS.length; i++) {
	if (cellNumber==CELLS[i].getNumber())
		return {cell:CELLS[i], index:i, number:cellNumber};
	}

	return {cell:null, index:-1, number:cellNumber};
}

function isCellFirst(index){
	return (index<=0);
}

function isCellLast(index){
	return (index>=CELLS.length-1);
}


function moveFocusToNextCell(index)
{
	if (isCellLast(index)) return;
	removeFocusAll();
	var nextCell=CELLS[index+1];
	nextCell.setFocus();
	nextCell.setCursorOnFirstLine();

}

function moveFocusToPreviousCell(index)
{

	if (isCellFirst(index)) return;
	removeFocusAll();
	var prevCell=CELLS[ index-1];
	prevCell.setFocus();
	prevCell.setCursorOnLastLine();
}


function removeFocusAll(){
	for (var i = 0; i < CELLS.length; i++) {
		CELLS[i].removeFocus();
	}
}



function setXmlText(xmlText)
{
	var notebook=$(xmlText);
	var cells=notebook.find("cell");

	for (var i = 0; i < cells.length; i++) {
		var cell=$(cells[i]);
		var newCell=appendNewCell(cell.attr('number'));
		newCell.setXml(cell);
	}
}

function getXmlText(notebookName)
{
	var notebook=$("<inote name='"+notebookName+"'/>");
	for (var i = 0; i < CELLS.length; i++) {
		notebook.append(CELLS[i].getXml());
	}
	return notebook.wrap("<wrapper/>").parent().html();
}

function _init(){
	appendNewCell(getNewCellNumber()).setFocus(0,0);;
	_container.bind('keydown',globalKeyHandler);

}

function clear(){
	var cells=_container.find(".cell").remove();
	CELLS=[];
}


//PUBLIC

this.setXmlText=setXmlText;
this.getXmlText=getXmlText;
this.clear=clear;
this.init=_init;

}

