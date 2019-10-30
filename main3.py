# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

import nltk
from nltk.tokenize import sent_tokenize
import operator

fObj = open('cleanedData.csv')

raw = fObj.read()

goodRaw = ""

rawlist = raw.strip().replace('\n', ' ').replace(',', ' ').split(' ')

for word in rawlist:
    if len(word) > 2 and word.isalpha():
        goodRaw = goodRaw + word + " "
    else:
        continue

tokens = sent_tokenize(goodRaw)

from nltk.tokenize import word_tokenize

wordtokens = word_tokenize(goodRaw)

from nltk.probability import FreqDist

from nltk.corpus import stopwords
stop_words=set(stopwords.words("english"))

filtered_wordtokens = []

for w in wordtokens:
    if w not in stop_words:
        filtered_wordtokens.append(w)

fdist = FreqDist(filtered_wordtokens)

isorted_fdist = sorted(fdist.items(), key=operator.itemgetter(1))

sorted_fdist = isorted_fdist.reverse()

fObj = open('frequenceDistribution.txt', 'w')
for key in isorted_fdist:
    fObj.write(key[0] + ' '+ str(key[1]) + '\n')

fObj.close()
    
import matplotlib.pyplot as plt
import numpy as np
#fdist.plot(30,cumulative=False)
#
#
#from matplotlib import pyplot as plt
#x, y = zip(*isorted_fdist[:50])
#plt.xticks(rotation=90)
#plt.ylabel('Counts')
#plt.xlabel('Word')
#plt.plot(x, y)
#plt.title('Word Frequencies')
#plt.show()

fObj = open('cleanedData.csv')

commentDict = {}

for line in fObj:
    current = line.strip().split(',')
    commentDict[current[0]] = int(current[1])
    
sCommentDict = sorted(commentDict.items(), key=operator.itemgetter(1))

sCommentDict.reverse()

fObj = open('commentDistribution.txt', 'w')

for key in sCommentDict:
    fObj.write(key[0] + ' ' + str(key[1]) +'\n')
    
fObj.close()

commentList = []

for x in range(0, len(sCommentDict)):
    commentList.append(sCommentDict[x][1])
    
#num_bins = 10
#n, bins, patches = plt.hist(commentList, num_bins, facecolor='blue', alpha=0.5)
#plt.ylabel('Posts')
#plt.xlabel('Number of Comments')
#plt.title('Amount of Comments on Posts')
#plt.show()

sentimentDict = {}

fObj = open('cleanedData1.csv')

for line in fObj:
    current = line.strip().split(',')
    sentimentDict[current[0]] = int(current[2])

sSentimentDict = sorted(sentimentDict.items(), key=operator.itemgetter(1))

sSentimentDict.reverse()

sentimentList = []

for x in range(0, len(sSentimentDict)):
    sentimentList.append(sSentimentDict[x][1])

counterNeg = 0
counterNeu = 0
counterPos = 0

for x in sentimentList:
    if x < 0:
        counterNeg += 1
    elif x == 0:
        counterNeu += 1
    else:
        counterPos += 1

#plt.bar(['Negative', 'Neutral', 'Positive'], [counterNeg, counterNeu, counterPos])
#plt.ylabel('Number of Posts')
#plt.title('Number of Posts by Sentiment')
#plt.show()

fObj.close()

fObj = open('cleanedData1.csv')

lenCommentList = [] #list of tuples

for line in fObj:
    current = line.strip().split(',')
    lenCommentList.append((current[3],current[1]))
    
xData = []
yData = []

tick_spacing = 10

for z in lenCommentList:
    xData.append(int(z[0]))
    yData.append(int(z[1]))


        
#plt.scatter(xData, yData)
#
#plt.yticks(np.arange(0, 220, 15))
#plt.xticks(np.arange(0, 520,50))
#plt.ylabel('Number of Comments')
#plt.xlabel('Length of Post (Characters)')
#plt.title('Length of Posts vs. Number of Comments')
#
#plt.show()

from nltk.corpus import wordnet

synsLove = []
topicLove = 0
lovePostList = []

# could remove fuck because it is used for other reasons
# LOVE/RELATIONSHIPS

def appendToLove (x):
    for syn in wordnet.synsets(x):
        for l in syn.lemmas():
            if '_' in l.name():
                new = l.name().replace('_',' ')
                synsLove.append(new)
            else:
                synsLove.append(l.name())

appendToLove ('love')
appendToLove ('girlfriend')
appendToLove ('beautiful')
appendToLove ('boyfriend')
appendToLove ('dating')
appendToLove ('kiss')
appendToLove ('sexy')
appendToLove ('hug')
appendToLove ('loving')
appendToLove ('relationship')
appendToLove ('marriage')
appendToLove ('sex')
appendToLove ('cute')
appendToLove ('break up')
appendToLove ('handsome')
appendToLove ('attractive')
appendToLove ('unattractive')
appendToLove ('dick')
synsLove.append ('hot')
synsLove.append ('ugly')
synsLove.append ('attract')
synsLove.append ('couple')
synsLove.append('sleeping with')
synsLove.append('hook up')
synsLove.remove('fuck')
synsLove.remove('enjoy')
synsLove.remove('enjoy')
synsLove.remove('know')
synsLove.remove('bed')
synsLove.remove('excite')
synsLove.remove('know')
synsLove.remove('union')
synsLove.remove('girl')
synsLove.remove('big')
synsLove.remove('giving')
synsLove.remove('liberal')
synsLove.remove('see')
synsLove.remove('tool')



fObj = open('cleanedData1.csv')

for line in fObj:
    current = line.strip().split(',')
    for synonym in synsLove:
        if synonym in current[0] or ('guy' in current[0] and 'girl' in current[0]):
            topicLove += 1
            lovePostList.append(current)
            break

fObj = open('lovePosts.csv', 'w')

for post in lovePostList:
    fObj.write(str(post) + '\n')

fObj.close()

#SCHOOL/CLASSES/PROF/HOMEWORK/ACADEMICS/JOBS
synsSchool = []
topicSchool = 0
schoolPostList = []

def appendToSchool (x):
    for syn in wordnet.synsets(x):
        for l in syn.lemmas():
            if '_' in l.name():
                new = l.name().replace('_',' ')
                synsSchool.append(new)
            else:
                synsSchool.append(l.name())

appendToSchool('school')
appendToSchool('class')
appendToSchool('homework')
appendToSchool('professor')
appendToSchool('teacher')
appendToSchool('exam')
appendToSchool('job')
appendToSchool('internship')
synsSchool.append('resume')
synsSchool.append('midterm')
synsSchool.append('hw')
synsSchool.append('lab')
synsSchool.append('lecture')
synsSchool.append('recitation')
synsSchool.append('final')
synsSchool.append('linkedin')
synsSchool.remove('family')
synsSchool.remove('sort')
synsSchool.remove('year')

fObj = open('cleanedData1.csv')

for line in fObj:
    current = line.strip().split(',')
    for synonym in synsSchool:
        if synonym in current[0]:
            topicSchool += 1
            schoolPostList.append(current)
            break

fObj = open('schoolPosts.csv', 'w')

for post in schoolPostList:
    fObj.write(str(post) + '\n')

fObj.close()

#CAMPUS/LOCATION REF (could analyze)

synsCampus = []
topicCampus = 0
campusPostList = []

def appendToCampus (x):
    for syn in wordnet.synsets(x):
        for l in syn.lemmas():
            if '_' in l.name():
                new = l.name().replace('_',' ')
                synsCampus.append(new)
            else:
                synsCampus.append(l.name())

appendToCampus('campus')
appendToCampus('hall')
appendToCampus('library')
synsCampus.append('huntsman')
synsCampus.append('quad')
synsCampus.append('library')
synsCampus.append('fisher')
synsCampus.append('vanpelt')
synsCampus.append('towne')
synsCampus.append('moore')
synsCampus.append('DRL')
synsCampus.append('rittenhouse')
synsCampus.append('locust')
synsCampus.append('tampons')
synsCampus.append('wawa')
synsCampus.append('amazon')
synsCampus.append('commons')
synsCampus.append('rodin')
synsCampus.append('harrison')
synsCampus.append('radian')
synsCampus.append('domus')
synsCampus.append('bookstore')
synsCampus.append('mcneil')
synsCampus.append('mcclelland')
synsCampus.append('ware')
synsCampus.append('riepe')
synsCampus.append('skirkanich')
synsCampus.append('steinberg')
synsCampus.append('pottruck')
synsCampus.append('hill')
synsCampus.append('new college house')
synsCampus.append('lauder college house')
synsCampus.append('philadelphia')
synsCampus.append('pennsylvania')
appendToCampus('city')
synsCampus.append('van pelt')
appendToCampus('dorm')

fObj = open('cleanedData1.csv')

for line in fObj:
    current = line.strip().split(',')
    for synonym in synsCampus:
        if synonym in current[0]:
            topicCampus += 1
            campusPostList.append(current)
            break

fObj = open('campusPosts.csv', 'w')

for post in campusPostList:
    fObj.write(str(post) + '\n')

fObj.close()

# Life/party
synsLife = []
topicLife = 0
lifePostList = []

def appendToLife (x):
    for syn in wordnet.synsets(x):
        for l in syn.lemmas():
            if '_' in l.name():
                new = l.name().replace('_',' ')
                synsLife.append(new)
            else:
                synsLife.append(l.name())

appendToLife('drunk')
appendToLife('food')
appendToLife('life')
appendToLife('party')
appendToLife('friend')
appendToLife('frat')
synsLife.append('sport')
synsLife.append('athletics')
synsLife.remove('company')
synsLife.append('beer')
synsLife.append('shots')

fObj = open('cleanedData1.csv')

for line in fObj:
    current = line.strip().split(',')
    for synonym in synsLife:
        if synonym in current[0]:
            topicLife += 1
            lifePostList.append(current)
            break

fObj = open('lifePosts.csv', 'w')

for post in lifePostList:
    fObj.write(str(post) + '\n')

fObj.close()

fObj = open('cleanedData1.csv')

totalPosts = 0

for line in fObj:
    totalPosts += 1
        
total = topicLove + topicCampus + topicSchool + topicLife

labels = 'Love Life', 'Campus/Locations', 'Academics/Jobs', 'General/Social Life', 'Other Topics'
sizes = [topicLove, topicCampus, topicSchool, topicLife, totalPosts - total]
colors = ['gold', 'yellowgreen', 'lightcoral', 'lightskyblue', 'orange']

# Plot
#plt.pie(sizes, labels=labels, colors=colors,
#autopct='%1.1f%%', shadow=True, startangle=140)
#
#plt.axis('equal')
#plt.show()
    

#Text,Comment Number,Sentiment Score,Post Length,Comparative,Month Day
fObj.close()

fObj = open('cleanedDataE.csv')

dictDate = {}

for line in fObj:
    current = line.replace('"','').replace(" ","/").strip().split(',')
    current[5] += '/19'
    if len(current[5]) == 6:
        llist = []
        for letter in current[5]:
           llist.append(letter)
        llist.insert(2,'0')
        string = ""
        for l in llist:
            string += l
        current[5] = string
    if current[5] in dictDate:
        dictDate[current[5]].append(current[2])
    else:
        dictDate[current[5]] = [current[2]]

for key in dictDate:
    neg = 0
    neu = 0
    pos = 0
    for sentiment in dictDate[key]:
        if int(sentiment) > 0:
            neg += 1
        elif int(sentiment) == 0:
            neu += 1
        else:
            pos += 1
    dictDate[key] = [neg,neu,pos]

sortedDict = {}

for key in sorted(dictDate.keys()):
    sortedDict[key] = dictDate[key]
    
del sortedDict['10/1/19']
del sortedDict['10/2/19']    
del sortedDict['10/3/19']    
del sortedDict['10/4/19']    
del sortedDict['10/5/19']    
del sortedDict['10/6/19']    
del sortedDict['10/7/19']    
del sortedDict['10/9/19']
 
sortedDict['10/1/19'] = [3, 4, 4]
sortedDict['10/2/19'] = [3, 8, 2]
sortedDict['10/3/19'] = [4, 1, 2]
sortedDict['10/4/19'] = [4, 4, 2]
sortedDict['10/5/19'] = [6, 1, 1]
sortedDict['10/6/19'] = [8, 4, 1]
sortedDict['10/7/19'] = [3, 2, 3]   
sortedDict['10/9/19'] = [1, 2, 7]

dates = []
posV = []
neuV = []
negV = []

for key in sortedDict:
    dates.append(key)
    negV.append(sortedDict[key][0])
    neuV.append(sortedDict[key][1])
    posV.append(sortedDict[key][2])

fig = plt.figure()
ax1 = fig.add_subplot(111)

#ax1.scatter(dates, posV, s=10, c='g', label='positive')
#ax1.scatter(dates, neuV, s=10, c='y', label='neutral')
#ax1.scatter(dates, negV, s=10, c='r', label='negative')
#ax1.set_xticks(dates[::7])
#ax1.set_xticklabels(dates[::7], rotation=45)
#plt.legend(loc='best');
#plt.ylabel('Number of Posts')
#plt.xlabel('Date')
#plt.title('Sentiment Over Time')
#plt.show()
        




    