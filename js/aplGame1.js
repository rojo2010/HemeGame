//import { DATA } from './aplGameJSON.js';

var score = 0;
var cardcount = 0;

(function () {
	"use strict";

	console.log('v0.0.0');

	let $main = $('#home');
	let $modal = $("#exampleModal");

	let randomNumber = function (min, max) {
		//returns a number between 0 and max - 1
		return Math.floor(Math.random() * (max - min +1)) + min;
	}
//	let clearcount = function (n) {
//		count = 0+n;
//		console.log(count);
//	}

//	let canvas = document.getElementById("exampleModal");
//	var ctx = canvas.getContext("2d");
	
//	let drawscore = function(score) {
  //		ctx.fillText(`Score: ${score}`, 8, 20);
	//	}

	let scorecard = function (){
		score++;
		}

	let generateUniqueRandomNumbers = function (n, max) {
		let ret = {};
		let retArr = [];
		if (n > max) {
			n = max;
		}
		while (retArr.length < n) {
			let num =randomNumber(1,max);
			if (!ret.hasOwnProperty(num)) {
				ret[num] = 1;
				retArr.push(num);
			}
		}
		return retArr;
	}

	let buildCase = function (dataObj) {
		console.log('buildCase');
		$main.empty();

		let $card = $('<div>', {class:"card w-500 h-300"}).appendTo($main);
		let title = $('<h1>', {text: "Who am I?"}).appendTo($card);
		//$('<div>', {text: "(Scroll down to answer as needed.)"}).appendTo($card)
		let $images = $('<div>',{class: "row rowfill img-magnifier-container"}).appendTo($card);
		let $sidebar = $('<div>',{class: "sidebar"}).appendTo($card);
		let $btnGroup = $('<div>',{class: "sidebar"},{class: "btn-group flex-column btnfill"}).appendTo($sidebar)
		let $scorecard = $('<div>',{class: "sidebar"}).appendTo($card);
        $('<label>', { id: "lblScore", text: score }).appendTo($scorecard); // Display score
		let imageArr = grabImages(dataObj);

		imageArr.forEach(function (image, index) {
			let $img = $('<img>', {id: "imageHolderMag" + index, width: 350, height: 350, src: image[0], class: "imgFill " + image[1]});
			$('<div>', {class: "col-15 col-sm-15 colfill"})
				.append($img)
				.appendTo($images);
			// makeMagnifier("imageHolderMag" + index, 3);
			// addToolTip($img[0]);
		});


		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "metamyelocyte"})
			.click(answerResponse(dataObj, "meta")).appendTo($btnGroup);
		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "myelocyte"})
			.click(answerResponse(dataObj, "myelo")).appendTo($btnGroup);
		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "promyelocyte"})
			.click(answerResponse(dataObj, "pro")).appendTo($btnGroup);
		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "blast"})
			.click(answerResponse(dataObj, "blast")).appendTo($btnGroup);
		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "erythroid"})
			.click(answerResponse(dataObj, "eryth")).appendTo($btnGroup);
		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "neutrophil"})
			.click(answerResponse(dataObj, "neut")).appendTo($btnGroup);		
		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "band"})
			.click(answerResponse(dataObj, "band")).appendTo($btnGroup);
		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "lymphocyte"})
			.click(answerResponse(dataObj, "lym")).appendTo($btnGroup);		
		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "megakaryocyte"})
			.click(answerResponse(dataObj, "mega")).appendTo($btnGroup);
		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "eosinophil"})
			.click(answerResponse(dataObj, "eo")).appendTo($btnGroup);
		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "histiocyte"})
			.click(answerResponse(dataObj, "hist")).appendTo($btnGroup);
		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "plasma cell"})
			.click(answerResponse(dataObj, "plasma")).appendTo($btnGroup);	
		$('<button>', {type: "button", class: "btn btn-primary w-1", text: "smudge cell"})
			.click(answerResponse(dataObj, "smudge")).appendTo($btnGroup);
		}

	let dialog = function (text) {
		$("#exampleModalLabel").text(text);
		$modal.modal('show');
		console.log('showing modal?');
		
	}

	let answerResponse = function (dataObj, response, score) {
		return function (evt) {
			evt.preventDefault();
			let responseStr = "Not sure what happened... Sorry...";
			

			// gtag('event', "answer_question", {
			//   'event_category': "btn-click",
			//   'value': 
			//   // 'event_label': <label>,
			// });

			if (window.hasOwnProperty("ga")) {
				ga('send', {
				  hitType: 'event',
				  eventCategory: 'click',
				  eventAction: 'answer',
				  eventLabel: "caseType:" + dataObj.caseType + "|res:" + response,
				});
			}
            if (dataObj.caseType === response) {
                responseStr = "Nailed it!";
                scorecard();
                var lblScore = document.getElementById("lblScore");
                lblScore.innerHTML = score;

			} else {responseStr = "try again"
			}

			if (dataObj.response) {
				responseStr = responseStr + " " + dataObj.response;
			}

			console.log(responseStr);
			dialog(responseStr);
		};
	};

	

	let addToolTip = function (element) {
		let $newElem = $(element.outerHTML).removeClass("imgFill").addClass("tooltipImg");

		const tooltip = new bootstrap.Tooltip(element, {
			title: $newElem[0].outerHTML,
			html: true,
			boundary: $main[0]
		})
	}
	let makeMagnifier = function (imgID, zoom) {
		//possible edit: https://www.therogerlab.com/sandbox/pages/how-to-magnify-an-html-element-in-javascript?s=0ea4985d74a189e8b7b547976e7192ae.bed70530af6f69d50b5f5d5c4d9c4de7

		var img, glass, w, h, bw;
		img = document.getElementById(imgID);
		/*create magnifier glass:*/
		glass = document.createElement("DIV");
		glass.setAttribute("class", "img-magnifier-glass");
		/*insert magnifier glass:*/
		img.parentElement.insertBefore(glass, img);
		/*set background properties for the magnifier glass:*/
		glass.style.backgroundImage = "url('" + img.src + "')";
		glass.style.backgroundRepeat = "no-repeat";
		glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
		bw = 3;
		w = glass.offsetWidth / 2;
		h = glass.offsetHeight / 2;
		/*execute a function when someone moves the magnifier glass over the image:*/
		glass.addEventListener("mousemove", moveMagnifier);
		img.addEventListener("mousemove", moveMagnifier);
		/*and also for touch screens:*/
		glass.addEventListener("touchmove", moveMagnifier);
		img.addEventListener("touchmove", moveMagnifier);
		function moveMagnifier(e) {
			var pos, x, y;
			/*prevent any other actions that may occur when moving over the image*/
			e.preventDefault();
			/*get the cursor's x and y positions:*/
			pos = getCursorPos(e);
			x = pos.x;
			y = pos.y;
			/*prevent the magnifier glass from being positioned outside the image:*/
			if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
			if (x < w / zoom) {x = w / zoom;}
			if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
			if (y < h / zoom) {y = h / zoom;}
			/*set the position of the magnifier glass:*/
			glass.style.left = (x - w) + "px";
			glass.style.top = (y - h) + "px";
			/*display what the magnifier glass "sees":*/
			glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
		}
		function getCursorPos(e) {
			var a, x = 0, y = 0;
			e = e || window.event;
			/*get the x and y positions of the image:*/
			a = img.getBoundingClientRect();
			/*calculate the cursor's x and y coordinates, relative to the image:*/
			x = e.pageX - a.left;
			y = e.pageY - a.top;
			/*consider any page scrolling:*/
			x = x - window.pageXOffset;
			y = y - window.pageYOffset;
			return {x : x, y : y};
		}
	};

	let grabCase = function () {
		let megdiff = 1
		let smudgediff = 2
		let plasmadiff = 3
		let histiodiff = 4
		let eodiff = 5
		let blastdiff = 6
		let lymdiff = 7
		let bandiff = 8
		let prodiff = 9
		let erythdiff = 11
		let myelodiff = 13
		let neutdiff = 16
		let metdiff = 17

		
		// first cell type
		let caseTypeN = Math.random()*20;
		let caseType = "meta";
		if (caseTypeN > neutdiff) {
			caseType = "neut";
		} else if (caseTypeN > myelodiff) {
			caseType = "myelo";
		} else if (caseTypeN > erythdiff) {
			caseType = "eryth";
		} else if (caseTypeN > prodiff) {
			caseType = "pro";
		} else if (caseTypeN > bandiff) {
			caseType = "band";
		} else if (caseTypeN > lymdiff) {
			caseType = "lym";
		} else if (caseTypeN > blastdiff) {
			caseType = "blast";
		} else if (caseTypeN > eodiff) {
			caseType = "eo";
		} else if (caseTypeN > histiodiff) {
			caseType = "hist";
		} else if (caseTypeN > plasmadiff) {
			caseType = "plasma";
		} else if (caseTypeN > smudgediff) {
			caseType = "smudge";
		} else if (caseTypeN > megdiff) {
			caseType = "mega";
		}
		let cases = DATA.filter(entry => entry.caseType === caseType);

		//get random parameters
	//	let listCount = cases.map(entry => entry.imageCount)
	//	let totalCount = listCount.reduce((a, b) => a + b);

	//	let randomNum = Math.floor(Math.random() * totalCount) + 1;

	//	let counter = 0;
	//	let caseNumber = -1;
		// console.log(randomNum, totalCount);
	//	listCount.forEach(function(value, ind) {
	//		counter += value;
	//		// console.log(counter, caseNumber);
	//		if (counter > randomNum && caseNumber === -1) {
	//			caseNumber = ind;
	//		}
	//	});

		return cases[0];
	}
	
	let grabImages = function (dataObj) {
		let imgArr = generateUniqueRandomNumbers(1, dataObj.imageCount)
			.map(num => [
				"./imgs/" + dataObj.imageType + "/" + dataObj.caseType + "/IG_" + num + ".jpg",
				"imgFlip" + randomNumber(1) + randomNumber(1)
			]);
		return imgArr;
	}
	
	// Create button function
	$('.newCard').click(function (evt) {
		evt.preventDefault();
		$modal.modal("hide");
		let thisCase = grabCase();
		buildCase(thisCase);
		cardcount++; // Increment the card count
	});
	$('#usBtn').click(function (evt) {
		evt.preventDefault();
		console.log("you clicked a button");
		$("#tut").hide();
		$("#home").hide();
		$("#aboutus").show();
		if (!$("#usBtn").hasClass("active")) {
			$("#usBtn").addClass("active");
			$("#homeBtn").removeClass("active");
			$("#tutorBtn").removeClass("active");
		}
	});
	$('#homeBtn').click(function (evt) {
		evt.preventDefault();
		console.log("you clicked a button");
		$("#aboutus").hide();
		$("#tut").hide();
		$("#home").show();
		if (!$("#homeBtn").hasClass("active")) {
			$("#usBtn").removeClass("active");
			$("#homeBtn").addClass("active");
			$("#tutorBtn").removeClass("active");
		}		
	});
	$('#tutorBtn').click(function (evt) {
		evt.preventDefault();
		console.log("you clicked a button");
		$("#aboutus").hide();
		$("#tut").show();
		$("#home").hide();
		if (!$("#tutorBtn").hasClass("active")) {
			$("#usBtn").removeClass("active");
			$("#homeBtn").removeClass("active");
			$("#tutorBtn").addClass("active");
		}		
	});


	
	return;
}())
