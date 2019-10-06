var xlsx = require('node-xlsx').default;
var fs = require('fs');
var ss = require('simple-statistics');
var polarity = require('polarity')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  

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

for (var i = 0; i < combined.length; i++) {
	try {
		var commentNum = combined[i][1].split(" ")[0];
		var parsedInput = combined[i][0].replace(/\W/g, ' ').toLowerCase();
		parsedInput = parsedInput.replace(/\s+/g, " ");

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
		continue;
	}

	var num; 
	if (commentNum != undefined) {
		num = parseInt(commentNum.toString().split(" ")[0]);
	} else {
		num = 0;
	}
}

console.log(jsonObjects);
const csvWriter = createCsvWriter({  
  path: 'cleanedData' + '.csv',
  header: [
    {id: 'comment', title: 'Text'},
    {id: 'num', title: 'Comment Number'},
  ]
});
	csvWriter  
	  .writeRecords(jsonObjects)
	  // Exit after finishing
	  .then(()=> process.exit(0));
