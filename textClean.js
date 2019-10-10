var xlsx = require('node-xlsx').default;
var fs = require('fs');
var ss = require('simple-statistics');
var polarity = require('polarity')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  

var Sentiment = require('sentiment');
var sentiment = new Sentiment();
// var split = require('split-string-words');

const workSheetsFromBuffer2 = xlsx.parse(fs.readFileSync(`${__dirname}/data2e.xlsx`));
const workSheetsFromBuffer3 = xlsx.parse(fs.readFileSync(`${__dirname}/data3e.xlsx`));
const workSheetsFromBuffer4 = xlsx.parse(fs.readFileSync(`${__dirname}/data4e.xlsx`));
const workSheetsFromBuffer5 = xlsx.parse(fs.readFileSync(`${__dirname}/data5e.xlsx`));
const workSheetsFromBuffer6 = xlsx.parse(fs.readFileSync(`${__dirname}/data6e.xlsx`));


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

var dateMap = {
	"January": 1,
	"February": 2,
	"March": 3,
	"April": 4,
	"May": 5, 
	"June": 6,
	"July": 7,
	"August": 8,
	"September": 9,
	"October": 10,
	"November": 11,
	"December": 12,
}

console.log(dateMap['May']);

combined = combined.concat(data1);
combined = combined.concat(data2);
combined = combined.concat(data3);
combined = combined.concat(data4);
combined = combined.concat(data5);

for (var i = 0; i < combined.length; i++) {
	try {
		var commentNum = combined[i][1].split(" ")[0];
		var dates = combined[i][2].split(" ");
		var month = dateMap[dates[0]];
		var finalDate = "";
		if (month == undefined) {
			finalDate = "10 9"
		} else {
			finalDate = month + " " + dates[1]
		}
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
				length: length, comparative: result.comparative, date: finalDate});
		}
		else {
			jsonObjects.push({num: 0, comment: parsedInput, score: result.score,
			length: length, comparative: result.comparative, date: finalDate});
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

// console.log(jsonObjects);
const csvWriter = createCsvWriter({  
  path: 'cleanedDataE' + '.csv',
  header: [
    {id: 'comment', title: 'Text'},
    {id: 'num', title: 'Comment Number'},
    {id: 'score', title: 'Sentiment Score'},
    {id: 'length', title: 'Post Length'},
    {id: 'comparative', title: 'Comparative'},
    {id: 'date', title: 'Month Day'}
  ]
});
	csvWriter  
	  .writeRecords(jsonObjects)
	  // Exit after finishing
	  .then(()=> process.exit(0));
