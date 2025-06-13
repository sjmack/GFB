/* Global Frequency Map Browser
 | Copyright (c) 2011 Children's Hospital & Research Center Oakland
 | Version 1.0.0 DATE HERE
 | Licensed under the GNU General Public License v3.0: http://www.gnu.org/licenses/gpl.html
*/
var allele1;
var srcFrame;

//alleles with only admixed or mig populations
const admixedAlleles = [
    "A*68:15", "A*24:22", "A*02:60", "A*34:03", "A*74:09", "A*74:11", "A*03:12", "A*26:07", "A*68:08", "A*33:05", 
    "B*07:20", "B*15:42", "B*08:12", "B*35:33", "B*57:06", "B*40:27", "B*51:13", "B*78:05", "B*51:44N", 
    "C*15:09", "C*06:08", "C*06:09", "C*08:13", "C*16:08", "C*17:04", 
    "DRB1*01:06", "DRB1*13:22", "DRB1*13:16", "DRB1*03:06", "DRB1*16:07", "DRB1*11:15", "DRB1*13:21", "DRB1*14:16", 
    "DRB1*14:24", "DRB1*13:14"
]; 

function importHTML() 
{
 	srcFrame = document.getElementById("hiddenContent");
 	srcFrame.src = document.systemselect.system.value;
	setTimeout("resetCombos()",150); 
}

function copyHTML(target,quarry)
{
 srcContent="";
 if (srcFrame.contentDocument)
 {
	srcContent=srcFrame.contentDocument.getElementById(quarry).innerHTML;	
 }
 else if (srcFrame.contentWindow)
 {
	srcContent=srcFrame.contentWindow.document.getElementById(quarry).innerHTML;
 }
 document.getElementById(target).innerHTML = srcContent;
}

function applyBlank()
{
	document.getElementById("leftmap").innerHTML="<img id = 'left' src='images/blank_map.gif'>";
	document.getElementById("rightmap").innerHTML="<img id = 'right' src='images/blank_map.gif'>";
}

let lastAllele1 = 'A*01:01';
let lastAllele2 = 'B*07:02';

function showMap(){

	document.getElementById('cancelButton').innerHTML = "<input type='button' value='Clear Maps' class='movebutton' onclick='clearMaps()'></input>"

	allele1=document.leftallele.allele.value;
	if(allele1 != lastAllele1){
		lastAllele1 = allele1;
		changeMaps(allele1, 'leftmap', 'left');
	}

	allele2=document.rightallele.allele.value;

	if(allele2 != lastAllele2){
		lastAllele2 = allele2;
		changeMaps(allele2, 'rightmap', 'right')
	}
	
}

function changeMaps(selectedAllele, mapId, imgId){

	let map = document.getElementById(mapId);
	let currentMap = document.querySelector(`#${mapId} img`);

	//fade current map out
	//currentMap.style.transition = "opacity 0.5s ease-out";
	currentMap.style.opacity = 0;

	//pre-load new map
	let newMap = new Image();
	
	//slight timeout for admixed maps, since it appears much faster due to it being a local image
	if(admixedAlleles.includes(selectedAllele)){
		setTimeout(function(){
			newMap.src = 'images/admixed.gif'
		}, 100)

	} else{
		newMap.src = "https://github.com/liviatran/pypopMaps/blob/main/" + selectedAllele + ".jpg?raw=true";
	}

	//wait until new map is finished loading, then display
	newMap.onload = function () {
		setTimeout(function () {
			map.innerHTML = `<img id='${imgId}' src='${newMap.src}'>`;
		}, 150)
	};
}


function clearMaps()
{
	document.getElementById("cancelButton").innerHTML="";
	
	//set lastAllele variables to blank so it will force reset to the original alleles
	lastAllele1 = ''
	lastAllele2 = ''
	
	document.getElementById('showButton').innerHTML = "<input type='button' value='Show Maps' class='movebutton' onclick='showMap()'></input>"
	
	applyBlank();
	resetCombos();
}

function goBack(side)
{
	switch(side)
	{
		case 1:
		document.leftallele.allele[document.leftallele.allele.selectedIndex-1].selected="1";
		showMap();
		break;

		case 2:
		document.rightallele.allele[document.rightallele.allele.selectedIndex-1].selected="1";
		showMap();
		break;
	}
}

function goForward(side)
{
	switch(side)
	{
		case 1:
		document.leftallele.allele[document.leftallele.allele.selectedIndex+1].selected="1";
		showMap();
		break;

		case 2:
		document.rightallele.allele[document.rightallele.allele.selectedIndex+1].selected="1";
		showMap();
		break;
	}
}

function resetCombos()
{
	var changeelement;

	copyHTML("left-locus-combo","hla-loci");
	copyHTML("right-locus-combo","hla-loci");

	document.getElementsByName('hlalocus')[1].locus[2].selected="1";

	changeelement = document.getElementsByName("hlalocus")[1];
	changeelement.name = "rightlocus";

	changeelement = document.getElementsByName("hlalocus")[0];
	changeelement.name = "leftlocus";

	copyHTML("left-v2-allele","hla-a_v2");

	changeelement = document.getElementsByName("hla-a-allele")[0];
	changeelement.name = "leftallele";

	copyHTML("right-v2-allele","hla-b_v2");

	changeelement = document.getElementsByName("hla-b-allele")[0];
	changeelement.name = "rightallele";

}

function synchBox(combo)
{

 var srcform = combo.form.name;
 var combindx = combo.selectedIndex;

 	console.log(srcform)
	console.log(combo)
 if (!document.getElementsByName(srcform)[0]) 
	{						    
		switch (combo.form.name.indexOf("right"))
			{
				case -1: 
				srcform = combo.form.name.replace("left",document.getElementsByName('hlalocus')[0].locus.value+"-");
				break;
				default: 
				srcform = combo.form.name.replace("right",document.getElementsByName('hlalocus')[1].locus.value+"-");
			}		
	}

	switch(combo.form.name.indexOf("3")) 
	{
		case -1:
		document.getElementsByName(srcform)[0].allele[combindx].selected="1";
	}
	showMap();
}

function switchLocus(combo)
{
	var changeelement;

	//replace drop downs with locus specific alleles
	copyHTML(combo.form.name.replace("locus","")+"-v2-allele",combo.value+"_v2");

	//rename form name (replaced by locus specific form name - need to switch back)
	changeelement = document.getElementsByName(combo.value+"-allele")[0];
	changeelement.name = combo.form.name.replace("locus","")+"allele";

	showMap();
}

function showPage(pageId) {

	// hide both ui elements
	document.getElementById("about").style.display = "none";
	document.getElementById("compare").style.display = "none";

	// showw page based on tab
	document.getElementById(pageId).style.display = "block";

	// styles for active link
	if (pageId === "compare") {
	  document.body.style.backgroundColor =  "#f8f2eb";
	  document.getElementById("compareLink").classList.add("active");
	  document.getElementById("aboutLink").classList.remove("active");
	} else {
	  document.body.style.backgroundColor =  "white";
	  document.getElementById("aboutLink").classList.add("active");
	  document.getElementById("compareLink").classList.remove("active");
	}
  }