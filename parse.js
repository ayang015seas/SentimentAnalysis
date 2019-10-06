var xlsx = require('node-xlsx').default;
var fs = require('fs');
var ss = require('simple-statistics');
// var split = require('split-string-words');



const workSheetsFromBuffer2 = xlsx.parse(fs.readFileSync(`${__dirname}/data2.xlsx`));
const workSheetsFromBuffer3 = xlsx.parse(fs.readFileSync(`${__dirname}/data3.xlsx`));
const workSheetsFromBuffer4 = xlsx.parse(fs.readFileSync(`${__dirname}/data4.xlsx`));
const workSheetsFromBuffer5 = xlsx.parse(fs.readFileSync(`${__dirname}/data5.xlsx`));
const workSheetsFromBuffer6 = xlsx.parse(fs.readFileSync(`${__dirname}/data7.xlsx`));

var data1 = workSheetsFromBuffer2[0].data;
var data2 = workSheetsFromBuffer3[0].data;
var data3 = workSheetsFromBuffer4[0].data;
var data4 = workSheetsFromBuffer5[0].data;
var data5 = workSheetsFromBuffer6[0].data;



// cut off first field
data1.shift();
data2.shift();
data3.shift();
data4.shift();
data5.shift();

var combined = [];
var scores = [];
var words = [];
var rawWords = [];
var commentMap = [];
var overallSentiments;
var objectNumber = 0;

combined.concat(data1);
combined.concat(data2);
combined.concat(data3);
combined.concat(data4);
combined.concat(data5);

var Sentiment = require('sentiment');
var sentiment = new Sentiment();

function analyze(arr) {
	for (var i = 0; i < arr.length; i++) {
		var result = sentiment.analyze(arr[i][0]);
		if (arr[i][0].length < 1 || arr[i][1] == undefined) {
			continue;
		}
		combined.push(result);
		scores.push(result.score);

		words = words.concat(result.words);

		var w = (arr[i][0]);
		rawWords = rawWords.concat(w);


		if (arr[i][1].length > 0) {
			temp = (arr[i][1]).split(" ")[0];
			// temp = split(arr[i][1])[0];
			// console.log(temp);
			var package = {num: parseInt(temp), comment: arr[i][0]};
			commentMap.push(package);
		} else {
			var package = {num: 0, comment: arr[i][0]};
			commentMap.push(package);
		}

	}
}

function createWordMap (wordsArray) {
  // create map for word counts
  var wordsMap = {};
  wordsArray.forEach(function (key) {
    if (wordsMap.hasOwnProperty(key)) {
      wordsMap[key]++;
    } else {
      wordsMap[key] = 1;
    }
  });

  return wordsMap;
}

analyze(data1);
analyze(data2);
analyze(data3);
analyze(data4);
analyze(data5);

var wordMap = createWordMap(words);

// console.log(wordMap);


commentMap.sort((a, b) => (a.num < b.num) ? 1 : -1)

var topscores = [];
var tWords = [];

function analyzeTop(arr) {
	for (var i = 0; i < 80; i++) {
		var res = sentiment.analyze(arr[i].comment);
		topscores.push(res.score);
		// console.log(res.words)
		var w = arr[i].comment;
		// w = w.toString().replace(/['"]+/g, '').split(" ");
		if (w.split(" ").length < 2) {
			temp = w.split(" ");
			tWords = tWords.concat(temp.split(" "));
		} else  {
			tWords = tWords.concat(w.split(" "));
		}
	}
	return tWords;
}

// console.log(tWords)
analyzeTop(commentMap)

var topWordMap = createWordMap(tWords);
var rawWordMap = createWordMap(rawWords);

// parse dictionaryMap 
var items = Object.keys(topWordMap).map(function(key) {
  return [key, topWordMap[key]];
});

items.sort(function(first, second) {
  return second[1] - first[1];
});

var items2 = Object.keys(rawWordMap).map(function(key) {
  return [key, rawWordMap[key]];
});

items2.sort(function(first, second) {
  return second[1] - first[1];
});

console.log(items.slice(0, 40));
console.log(items2.slice(0, 60));

// console.log(topWordMap);
// console.log(rawWordMap);

console.log("OverallScore Mean: " + ss.mean(scores));
console.log("TopScore Standard Deviation: " + ss.standardDeviation(scores));

console.log("TopScore Mean: " + ss.mean(topscores));
console.log("TopScore Standard Deviation: " + ss.standardDeviation(topscores));









