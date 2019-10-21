import matplotlib.pyplot as plt
import numpy as np
import csv

import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.cbook as cbook

from datetime import datetime
from dateutil.parser import parse

dates = [];
sentiments = [];


with open('cleanedDataE.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
    	day = row[5].split(" ")[0];
    	month = row[5].split(" ")[1];
    	complete = "2019-" + month + "-" + day
    	#dobj = datetime.strptime(complete, '%Y-%m-%d')
	print(row[2])
	try:
		sentiments.append(int(row[2]))
		dobj = datetime.strptime(complete, '%Y-%m-%d')
		dates.append(complete)
	except:
		print("Error")
	print(complete)

plt.rcParams["figure.figsize"] = (8, 8)
fig, ax = plt.subplots()

ax.xaxis.set_major_locator(mdates.WeekdayLocator(interval=2))
ax.xaxis.set_major_formatter(mdates.DateFormatter("%y-%m-%d"))

ax.plot(np.array(dates), np.array(sentiments));


