//import { DATA } from './aplGameJSON.js';
(function () {
	"use strict";

	console.log('v0.0.0');

	let $main = $('#home');
	let $modal = $("#exampleModal");

	let randomNumber = function (max) {
		//returns a number between 0 and max - 1
		return Math.floor(Math.random() * (max));
	}

	let generateUniqueRandomNumbers = function (n, max) {
		let ret = {};
		let retArr = [];
		if (n > max) {
			n = max;
		}
		while (retArr.length < n) {
			let num =randomNumber(max);
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

		let $card = $('<div>', {class:"card"}).appendTo($main);
		let title = $('<h1>', {text: "Who am I?"}).appendTo($card);
		$('<div>', {text: "(Scroll down to answer as needed.)"}).appendTo($card)
		let $images = $('<div>',{class: "row rowfill img-magnifier-container"}).appendTo($card);
		let $footer = $('<footer>',{class: "mt-auto"}).appendTo($card);
		let $btnGroup = $('<footer>',{class: "btn-group d-flex btnfill", role: "group"}).appendTo($footer)

		let imageArr = grabImages(dataObj);

		imageArr.forEach(function (image, index) {
			let $img = $('<img>', {id: "imageHolderMag" + index, src: image[0], class: "imgFill " + image[1]});
			$('<div>', {class: "col-2 col-sm-2 colfill"})
				.append($img)
				.appendTo($images);
			// makeMagnifier("imageHolderMag" + index, 3);
			// addToolTip($img[0]);
		});


		$('<button>', {type: "button", class: "btn btn-success w-100", text: "Metamyelocyte"})
			.click(answerResponse(dataObj, "meta")).appendTo($btnGroup);
		$('<button>', {type: "button", class: "btn btn-warning w-100", text: "Myelocyte"})
			.click(answerResponse(dataObj, "myelo")).appendTo($btnGroup);
		$('<button>', {type: "button", class: "btn btn-danger w-100", text: "Promyelocyte"})
			.click(answerResponse(dataObj, "pro")).appendTo($btnGroup);
	}

	let dialog = function (text) {
		$("#exampleModalLabel").text(text);
		$modal.modal('show');
		console.log('showing modal?');
	}

	let answerResponse = function (dataObj, response) {
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
			} else if (response === "meta") {
				if (dataObj.caseType === "myelo") {
					// called Myelocyte for Metamyelocyte
					responseStr = "Close, but no cigar. This is a myelocyte. Notice that the nucleus is flatter than a metamyelocyte.";
				} else if (dataObj.caseType === "pro") {
					// called Myelocyte for not Promyelocyte
					responseStr = "Oops. This is a Promyelocyte. Remember that promyelocytes have a hoff, pink granules, and bilobed nuclei.";
				}

			} else if (response === "myelo") {
				if (dataObj.caseType === "meta") {
					// called Metamyelocyte for myelocyte
					responseStr = "Close, but no cigar. This is a metamyelocyte. Notice that the nucleus is indented.";
				} else if (dataObj.caseType === "pro") {
					// called Myelocyte for not Promyelocyte
					responseStr = "Oops. This is a Promyelocyte. Remember that promyelocytes have a hoff, pink granules, and bilobed nuclei.";
				}
				
			} else if (response === "pro") {
				if (dataObj.caseType === "myelo") {
					// called Myelocyte for Metamyelocyte
					responseStr = "Nope. This is a myelocyte. The nucleus is not bilobed or indented, it's flat, and there is no hoff.";
				} else if (dataObj.caseType === "meta") {
					// called Myelocyte for not Promyelocyte
					responseStr = "Nice try. This is a metamyelocyte. Metamyelocytes have an indented nucleus, but not a bilobed nucleus, and no hoff.";
				}	
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
			// first cell type
		let caseTypeN = Math.random();
		let caseType = "meta";
		if (caseTypeN < .5) {
			caseType = "myelo";
		} else if (caseTypeN < .7) {
			caseType = "pro";
		}

		let cases = DATA.filter(entry => entry.caseType === caseType);

		//get random parameters
		let listCount = cases.map(entry => entry.imageCount)
		let totalCount = listCount.reduce((a, b) => a + b);

		let randomNum = Math.floor(Math.random() * totalCount) + 1;

		let counter = 0;
		let caseNumber = -1;
		// console.log(randomNum, totalCount);
		listCount.forEach(function(value, ind) {
			counter += value;
			// console.log(counter, caseNumber);
			if (counter > randomNum && caseNumber === -1) {
				caseNumber = ind;
			}
		});

		return cases[caseNumber];
	}

	let grabImages = function (dataObj) {
		let imgArr = generateUniqueRandomNumbers(3, dataObj.imageCount)
			.map(num => [
				"./imgs/" + dataObj.imageType + "/" + dataObj.caseType + "/" + dataObj.case + "/IG_" + num + ".jpg",
				"imgFlip" + randomNumber(1) + randomNumber(1)
			]);
		return imgArr;
	}

	// // create google event tracking
	// ga('create', 'APL|res-APL', 'auto', 'APL|res-APL');
	// ga('create', 'APL|res-sAPL', 'auto', 'APL|res-sAPL');
	// ga('create', 'APL|res-nAPL', 'auto', 'APL|res-nAPL');
	// ga('create', 'sAPL|res-APL', 'auto', 'sAPL|res-APL');
	// ga('create', 'sAPL|res-sAPL', 'auto', 'sAPL|res-sAPL');
	// ga('create', 'sAPL|res-nAPL', 'auto', 'sAPL|res-nAPL');
	// ga('create', 'nAPL|res-APL', 'auto', 'nAPL|res-APL');
	// ga('create', 'nAPL|res-sAPL', 'auto', 'nAPL|res-sAPL');
	// ga('create', 'nAPL|res-nAPL', 'auto', 'nAPL|res-nAPL');

	// Create button function
	$('.newCard').click(function (evt) {
		evt.preventDefault();
		$modal.modal("hide");
		let thisCase = grabCase();
		buildCase(thisCase);
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