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
print(fdist)

isorted_fdist = sorted(fdist.items(), key=operator.itemgetter(1))

sorted_fdist = isorted_fdist.reverse()

fObj = open('frequenceDistribution.txt', 'w')
for key in isorted_fdist:
    fObj.write(key[0] + ' '+ str(key[1]) + '\n')
    
#import matplotlib.pyplot as plt
#fdist.plot(30,cumulative=False)
#plt.show()    


from matplotlib import pyplot as plt
x, y = zip(*isorted_fdist[:60])
plt.plot(x, y)
plt.xticks(rotation=90)
plt.figure(figsize=(100,10))
plt.savefig('wordFreqGraph.png', dpi=100)
plt.show()

import pandas as pd




        