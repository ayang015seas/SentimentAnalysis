var xlsx = require('node-xlsx').default;
var fs = require('fs');
var ss = require('simple-statistics');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csv = require('csv-parser');

var allDates = [];

function addTo(date, sentiment) {
	var month = date.split(" ")[0];
	var day = date.split(" ")[1];
	var day = month + "" + day;
	if (day in allDates) {
		
	} else {

	}
}


fs.createReadStream('cleanedDataE.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row["Month Day"]);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });