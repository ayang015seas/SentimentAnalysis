var xlsx = require('node-xlsx').default;
var fs = require('fs');
var ss = require('simple-statistics');

var Sentiment = require('sentiment');
var sentiment = new Sentiment();
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
var jsonObjects = [];
var allWords = [];
var allScores = []

var positiveNum = 0;
var negativeNum = 0;
var neutralNum = 0;

var positiveWords = [];
var negativeWords = [];

var overallDilution = [];
var top100Dilution = [];

combined = combined.concat(data1);
combined = combined.concat(data2);
combined = combined.concat(data3);
combined = combined.concat(data4);
combined = combined.concat(data5);

failures = 0;
// remove all non-alphanumeric characters
for (var i = 0; i < combined.length; i++) {
	try {
		var commentNum = combined[i][1].split(" ")[0];
		var parsedInput = combined[i][0].replace(/\W/g, ' ').toLowerCase();
		var result = sentiment.analyze(parsedInput);
		var popularity = parseInt(commentNum);
		var length = combined[i][0].length;

		positiveWords = positiveWords.concat(result.positive);
		negativeWords = negativeWords.concat(result.negative);

		allWords = allWords.concat(parsedInput.split(" "));
		if (!isNaN(popularity)) {
			jsonObjects.push({num: popularity, comment: parsedInput, score: result.score,
				length: length, comparative: result.comparative});
		}
		else {
			jsonObjects.push({num: 0, comment: parsedInput, score: result.score,
			length: length, comparative: result.comparative});
		}
		if (result.score > 0) {
			positiveNum++;
		} else if (result.score == 0) {
			neutralNum++;
		} else {
			negativeNum++;
		}
	}
	catch (err) {
		console.log("Fail");
		failures++;
		continue;
	}

	var num; 
	if (commentNum != undefined) {
		num = parseInt(commentNum.toString().split(" ")[0]);
	} else {
		num = 0;
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

function sortByWords(wordMap) {
	var items = Object.keys(wordMap).map(function(key) {
  		return [key, wordMap[key]];
	});
	items.sort(function(first, second) {
	  return second[1] - first[1];
	});
	return items;
}

// next, put through the sentiment analysis 
var overallMap = createWordMap(allWords);
var sortedMap = sortByWords(overallMap);

/*
var items = Object.keys(wordMap).map(function(key) {
		return [key, wordMap[key]];
});
items.sort(function(first, second) {
  return second[1] - first[1];
});
*/

top100 = [];
jsonObjects = jsonObjects.sort((a, b) => (a.num < b.num) ? 1 : -1)
top100 = jsonObjects.slice(0, 100);

overallScores = [];
top100Scores = [];
top100Topics = [];

overallLengths = [];
top100Lengths = [];

var top100PositiveNum = 0;
var top100NegativeNum = 0;
var top100NeutralNum = 0;


for (var i = 0; i < top100.length; i++) {
	try {
		top100Scores.push(jsonObjects[i].score);
		top100Topics = top100Topics.concat(jsonObjects[i].comment.split(" "));
		top100Lengths.push(jsonObjects[i].length);
		top100Dilution.push(jsonObjects[i].comparative);

		if (jsonObjects[i].score > 0) {
			top100PositiveNum++;
		} else if (jsonObjects[i].score == 0) {
			top100NeutralNum++;
		} else {
			top100NegativeNum++;
		}
	}
	catch {
		continue;
	}

}
for (var i = 0; i < 499; i++) {
	try	{
		overallScores.push(jsonObjects[i].score);
		overallLengths.push(jsonObjects[i].length);
		overallDilution.push(jsonObjects[i].comparative);
	}
	catch {
		continue;
	}
}

var top100Map = createWordMap(top100Topics);
var top100SortedMap = sortByWords(top100Map);

var positiveWordMap = sortByWords(createWordMap(positiveWords));
var negativeWordMap = sortByWords(createWordMap(negativeWords));


console.log(positiveWordMap);
console.log(negativeWordMap);


// compile statistics 
console.log(" ");
console.log("Top100 Mean Stat " + ss.mean(top100Scores));
console.log("Top100 Median Stat " + ss.median(top100Scores));
console.log("Top100 Standard Deviation " + ss.standardDeviation(top100Scores));
console.log(" ");
console.log("Top100 Length Mean Stat " + ss.mean(top100Lengths));
console.log("Top100 Length Median Stat " + ss.median(top100Lengths));
console.log("Top100 Length Standard Deviation " + ss.standardDeviation(top100Lengths));
console.log(" ");
console.log("Top100 Dilution Mean Stat " + ss.mean(top100Dilution));
console.log("Top100 Dilution Median Stat " + ss.median(top100Dilution));
console.log("Top100 Dilution Standard Deviation " + ss.standardDeviation(top100Dilution));
console.log(" ");
console.log(" ");
console.log(" ");
console.log("All Mean Stat " + ss.mean(overallScores));
console.log("All Median Stat " + ss.median(overallScores));
console.log("All Standard Deviation " + ss.standardDeviation(overallScores));
console.log(" ");
console.log("All Length Mean Stat " + ss.mean(overallLengths));
console.log("All Length Median Stat " + ss.median(overallLengths));
console.log("All Length Standard Deviation " + ss.standardDeviation(overallLengths));
console.log(" ");
console.log("All Dilution Mean Stat " + ss.mean(overallDilution));
console.log("All Dilution Median Stat " + ss.median(overallDilution));
console.log("All Dilution Standard Deviation " + ss.standardDeviation(overallDilution));
console.log(" ");
//console.log(top100);

console.log("Overall Positive Posts: " + positiveNum);
console.log("Overall Negative Posts: " + negativeNum);
console.log("Overall Neutral Posts: " + neutralNum);
console.log(" ");

console.log("Top 100 Positive Posts: " + top100PositiveNum);
console.log("Top 100 Negative Posts: " + top100NegativeNum);
console.log("Top 100 Neutral Posts: " + top100NeutralNum);
console.log(" ");

console.log(combined.length);
console.log('failure rate ' + failures);

// compute overall sentiment 


// console.log(jsonObjects);
// console.log(combined);