# -*- coding: utf-8 -*-
"""
Created on Thu Jan  7 15:13:45 2021

@author: yueQiu
"""
from __future__ import print_function
import os
import re
import string
import logging
import itertools
import numpy as np
import pandas as pd
import seaborn as sns
from time import time
from pprint import pprint
import collections

import matplotlib.ticker as ticker
import matplotlib.pyplot as plt
%matplotlib inline
sns.set()# Setting seaborn as default style even if use only matplotlib

import nltk
from nltk import sent_tokenize
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

from sklearn import metrics
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import Pipeline
from nltk.stem.snowball import SnowballStemmer

from sklearn.naive_bayes import BernoulliNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from nltk.stem import WordNetLemmatizer
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier

def generate_target_idx(categories,target):
    """
    Generate train_target_idx ---> target: array, shape [n_samples]. Enumerate categories
    """
    target_names_dict = dict(enumerate(categories))
    target_names_dict = {y:x for x,y in target_names_dict.items()}
    return np.array([target_names_dict[k] for k in target])

def total_number_of_files(filepaths,set):
    """
    count total number of files filepath
    """
    sum = 0
    for i in range(len(filepaths)):
        sum += len(filepaths[i])
    print("Total number of files under "+set+" data set :", sum)


def generate_data(path,filenames, categories):
    """
    Fetch original text files and store into list
    """
    dataList = []
    for i in range(len(filenames)):
        for j in range(len(filenames[i])):
            filePath = path+"//"+categories[i]+"//"+filenames[i][j]
            fileObject = open(filePath, "rt")
            text = fileObject.read()
            dataList.append(text)
            fileObject.close()
    return dataList



def corpus(text):
    """
    NLTK tool help to convert text <str> to words list
    The words will be filtered for punctuation, non alphabetic, and stop word
    The words will be converted to lower case
    """
    # split into words
    from nltk.tokenize import word_tokenize
    tokens = word_tokenize(text)
    
    # convert to lower case
    tokens = [w.lower() for w in tokens]
    
    # remove punctuation from each word
    import string
    table = str.maketrans('', '', string.punctuation)
    stripped = [w.translate(table) for w in tokens]
    
    # remove remaining tokens that are not alphabetic
    words = [word for word in stripped if word.isalpha()]
    
    # filter out stop words
    from nltk.corpus import stopwords
    stop_words = set(stopwords.words('english'))
    words = [w for w in words if not w in stop_words]
    return words        


def generate_data_nltk(dataList):
    """
    Given dataList in list<list> format, return 4 lists
    Parameters
    ----------
    text : list[list[<str>]]
        The text from which to be cleaned and tokenized.
        
    Returns:
    ----------
    processed_data:  The list of text data with each cleaned by the 6 rules
    corpus_dict: The list of words extracted from the dataList
    file_sentenses_counts: The list of integer, with each equals the 
                    lengths of sentences of text element in dataList
    file_words_counts:  The list of integer, with each equals the lengths
                        of words of text element in dataList
    
    """
    
    corpus_dict_list = [corpus(text) for text in dataList]
    processed_data = [" ".join(corpus) for corpus in corpus_dict_list]
    corpus_dict = list(itertools.chain.from_iterable(corpus_dict_list))
    file_sentenses_counts = [len(sent_tokenize(text)) for text in dataList]
    file_words_counts = [len(corpus(text)) for text in dataList]         

    return(processed_data, corpus_dict, file_sentenses_counts, file_words_counts)

def categories_distplot_compare(targets_str,frequency,
                                targets_test_str,frequency_test):
    """
    Given data and target for two sets, draw the distribution plot on same axis
    """
    fig, (ax1, ax2) = plt.subplots(2, sharex=True,
                                   figsize=(10, 10), dpi= 80, 
                                   facecolor='w', edgecolor='k')
    fig.suptitle('Categories Distribution of 20NewGroups for Training & Testing Data')
    plt.xticks(rotation=90)
    plt.xlabel('Categories')
    plt.ylabel('Frequency')
    ax1.bar(targets_str,frequency)
    ax2.bar(targets_test_str,frequency_test)


def draw_dist_and_boxplot(dataset,name):
    """
    Draw Distribution plot & boxplot for given data.
    Original plot together with outliers striped plot 
    will be drew
    
    """
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.suptitle('Distribution Plot & Boxplot of '+ name +' Data')

    # Distribution plot with outlier
    sns.distplot(ax=axes[0,0], a=dataset)
    axes[0,0].set_title("Original")

    # Distribution plot without outlier
    datasetTailed = pd.Series( v for v in dataset)
    datasetTailed = datasetTailed[datasetTailed.between(datasetTailed.quantile(.05), datasetTailed.quantile(.95))]
    sns.distplot(ax=axes[0,1], a=datasetTailed)
    axes[0,1].set_title("Without Outliers")
    
    # Boxplot with outlier
    sns.boxplot(ax=axes[1,0], data=dataset, orient="h",showfliers = True)
    axes[1,0].set_title("Original")

    # Boxplot without outlier
    sns.boxplot(ax=axes[1,1], data=dataset, orient="h",showfliers = False)
    axes[1,1].set_title("Without Outliers")
    
def strip_newsgroup_header(text):
    """
    Given text in "news" format, strip the headers, by removing everything
    before the first blank line.
    Parameters
    ----------
    text : str
        The text from which to remove the signature block.
    """
    _before, _blankline, after = text.partition('\n\n')
    return after

def strip_newsgroup_footer(text):
    """
    Given text in "news" format, attempt to remove a signature block.
    As a rough heuristic, we assume that signatures are set apart by either
    a blank line or a line made of hyphens, and that it is the last such line
    in the file (disregarding blank lines at the end).
    Parameters
    ----------
    text : str
        The text from which to remove the signature block.
    """
    lines = text.strip().split('\n')
    for line_num in range(len(lines) - 1, -1, -1):
        line = lines[line_num]
        if line.strip().strip('-') == '':
            break

    if line_num > 0:
        return '\n'.join(lines[:line_num])
    else:
        return text

def strip_newsgroup_quoting(text):
    """
    Given text in "news" format, strip lines beginning with the quote
    characters > or |, plus lines that often introduce a quoted section
    (for example, because they contain the string 'writes:'.)
    Parameters
    ----------
    text : str
        The text from which to remove the signature block.
    """
    _QUOTE_RE = re.compile(r'(writes in|writes:|wrote:|says:|said:'
                       r'|^In article|^Quoted from|^\||^>)')
    good_lines = [line for line in text.split('\n')
                  if not _QUOTE_RE.search(line)]
    return '\n'.join(good_lines)

def strip_header_footer_quotes(data):
    """
    Given text will be striped for header, footer, and quotes
    ----------
    text : str
        The text from which to remove the signature block.
    """
    data = [strip_newsgroup_header(text) for text in data]
    data = [strip_newsgroup_footer(text) for text in data]
    data = [strip_newsgroup_quoting(text) for text in data]
    return data



## Read data from local drive  
train_path = "C://Users//yueQiu//Desktop//data//data//train"
test_path = "C://Users//yueQiu//Desktop//data//data//test"

#########################################
####                EDA               ###
#########################################

## Fetch categories for train & test
train_categories = os.listdir(train_path)
test_categories = os.listdir(train_path)
pprint(list(train_categories))
# pprint(list(test_categories))

## Find total number of files for train & test
train_filenames_2DList = []
test_filenames_2DList = []
for cate in train_categories:
    train_filenames_2DList.append(os.listdir(train_path+'/'+cate))

for cate in test_categories:
    test_filenames_2DList.append(os.listdir(test_path+'/'+cate))
    
total_number_of_files(train_filenames_2DList,"train")
total_number_of_files(test_filenames_2DList,"test")


# Finding frequency of each category in training set
# train_target: list, shape[n_sample]. The names of target classes.
train_target = []
for i in range(len(train_filenames_2DList)):
    for j in range(len(train_filenames_2DList[i])):
        train_target.append(train_categories[i])
        
train_target = np.array(train_target)
targets, frequency = np.unique(train_target, return_counts=True)
targets, frequency

targets_str = np.array(train_categories)
pprint(list(zip(targets_str, frequency)))


# Finding frequency of each category in test set
# test_target: list, shape[n_sample]. The names of target classes.
test_target = []
for i in range(len(test_filenames_2DList)):
    for j in range(len(test_filenames_2DList[i])):
        test_target.append(test_categories[i])
        
test_target = np.array(test_target)
targets_test, frequency_test = np.unique(test_target, return_counts=True)
targets_test, frequency_test

targets_test_str = np.array(test_categories)
# pprint(list(zip(targets_test_str, frequency_test)))

# Enumerate target categories
train_target_idx = generate_target_idx(train_categories,train_target)
test_target_idx = generate_target_idx(test_categories,test_target)
print(train_target_idx)




# train_data ---> dataList: List, [n_sampple]. <class 'str'>
train_data = generate_data(train_path,train_filenames_2DList,train_categories)
test_data = generate_data(test_path,test_filenames_2DList,test_categories)
print(len(train_data))

# Text preprocessing step 1. Remove header, footer, quotes from each text files
train_data = strip_header_footer_quotes(train_data)
test_data = strip_header_footer_quotes(test_data)

# Text preprocessing step 2-7. Remove header, footer, quotes from each text files
train_data, train_corpus_dict, train_file_sentenses, train_file_words_nltk = generate_data_nltk(train_data)
test_data, test_corpus_dict, test_file_sentenses, test_file_words_nltk = generate_data_nltk(test_data)
print(len(train_data))





#########################################
####  MODEL PIPELINE GROUP 3          ###
#########################################

# Design pipelins for Group 3
stemmer = SnowballStemmer('english', ignore_stopwords=True)
class StemmedTfidfVectorizer(TfidfVectorizer):   
    def __init__(self, stemmer, *args, **kwargs):
        super(StemmedTfidfVectorizer, self).__init__(*args, **kwargs)
        self.stemmer = stemmer
    def build_analyzer(self):
        analyzer = super(StemmedTfidfVectorizer, self).build_analyzer()
        return lambda doc: (self.stemmer.stem(word) for word in analyzer(doc.replace('\n', ' ')))

# StemmedTfidfVectorizer(stemmer=stemmer,stop_words='english', sublinear_tf=True)    
SGD_pipeline = Pipeline([
    ('vect', StemmedTfidfVectorizer(stemmer=stemmer,stop_words='english', sublinear_tf=True)    ),
    ('clf', SGDClassifier()),
])

NB_pipeline = Pipeline([
    ('vect', StemmedTfidfVectorizer(stemmer=stemmer,stop_words='english', sublinear_tf=True)    ),
    ('clf',MultinomialNB()),
])

LG_pipeline = Pipeline([
    ('vect', StemmedTfidfVectorizer(stemmer=stemmer,stop_words='english', sublinear_tf=True)    ),
    ('clf',LogisticRegression()),
])

SGD_pipeline.fit(train_data, train_target_idx)
print(SGD_pipeline.score(test_data, test_target_idx))

NB_pipeline.fit(train_data, train_target_idx)
print(NB_pipeline.score(test_data, test_target_idx))

LG_pipeline.fit(train_data, train_target_idx)
print(LG_pipeline.score(test_data, test_target_idx))
#0.6866383198041489
#0.5606236309753898
#0.6321350341450844



#########################################
####  MODEL PIPELINE GROUP 4          ###
#########################################
SGD_pipeline = Pipeline([
    ('vect', StemmedTfidfVectorizer(stemmer=stemmer, stop_words='english', ngram_range = (1,2), binary = True, sublinear_tf=True)),
    ('clf', SGDClassifier()),
])

NB_pipeline = Pipeline([
    ('vect', StemmedTfidfVectorizer(stemmer=stemmer, stop_words='english', ngram_range = (1,2), binary = True, sublinear_tf=True)),
    ('clf',MultinomialNB()),
])

LG_pipeline = Pipeline([
    ('vect', StemmedTfidfVectorizer(stemmer=stemmer, stop_words='english', ngram_range = (1,2), binary = True, sublinear_tf=True)),
    ('clf',LogisticRegression()),
])
SGD_pipeline.fit(train_data, train_target_idx)
print(SGD_pipeline.score(test_data, test_target_idx))

NB_pipeline.fit(train_data, train_target_idx)
print(NB_pipeline.score(test_data, test_target_idx))

LG_pipeline.fit(train_data, train_target_idx)
print(LG_pipeline.score(test_data, test_target_idx))
#0.6684705579177941
#0.5169436928230898
#0.5912897822445561



#########################################
####  MODEL PIPELINE GROUP 6          ###
#########################################
SGD_pipeline = Pipeline([
    ('vect', TfidfVectorizer(tokenizer=LemmaTokenizer(), stop_words='english', ngram_range = (1,2), binary = True, sublinear_tf=True)),
    ('clf', SGDClassifier()),
])

NB_pipeline = Pipeline([
    ('vect', TfidfVectorizer(tokenizer=LemmaTokenizer(), stop_words='english', ngram_range = (1,2), binary = True, sublinear_tf=True)),
    ('clf',MultinomialNB()),
])

LG_pipeline = Pipeline([
    ('vect', TfidfVectorizer(tokenizer=LemmaTokenizer(), stop_words='english', ngram_range = (1,2), binary = True, sublinear_tf=True)),
    ('clf',LogisticRegression()),
])

SGD_pipeline.fit(train_data, train_target_idx)
print(SGD_pipeline.score(test_data, test_target_idx))

NB_pipeline.fit(train_data, train_target_idx)
print(NB_pipeline.score(test_data, test_target_idx))

LG_pipeline.fit(train_data, train_target_idx)
print(LG_pipeline.score(test_data, test_target_idx))
#0.6710475454194047
#0.5195206803247004
#0.5907743847442339


#########################################
####  MODEL PIPELINE GROUP 5          ###
#########################################
class LemmaTokenizer(object):
    def __init__(self):
        self.wnl = WordNetLemmatizer()
    def __call__(self, articles):
        return [self.wnl.lemmatize(t) for t in word_tokenize(articles)]
    
SGD_pipeline = Pipeline([
    ('vect', TfidfVectorizer(tokenizer=LemmaTokenizer(), stop_words='english', sublinear_tf=True)),
    ('clf', SGDClassifier()),
])

NB_pipeline = Pipeline([
    ('vect', TfidfVectorizer(tokenizer=LemmaTokenizer(), stop_words='english', sublinear_tf=True)),
    ('clf',MultinomialNB()),
])

LG_pipeline = Pipeline([
    ('vect', TfidfVectorizer(tokenizer=LemmaTokenizer(), stop_words='english', sublinear_tf=True)),
    ('clf',LogisticRegression()),
])

SGD_pipeline.fit(train_data, train_target_idx)
print(SGD_pipeline.score(test_data, test_target_idx))

NB_pipeline.fit(train_data, train_target_idx)
print(NB_pipeline.score(test_data, test_target_idx))

LG_pipeline.fit(train_data, train_target_idx)
print(LG_pipeline.score(test_data, test_target_idx))
#0.6861229223038269
#0.5656487566035304
#0.630331142893957


#########################################
####            PICKLE                ###
#########################################
import pickle
SGD_pipeline = Pipeline([
    ('vect', TfidfVectorizer(tokenizer=LemmaTokenizer(), stop_words='english', sublinear_tf=True)),
    ('clf', SGDClassifier()),
])
SGD_pipeline.fit(train_data, train_target_idx)
pickle.dump( SGD_pipeline, open( "pipeline.pkl", "wb" ) )

#########################################
####        RETURN PRED LAB           ###
#########################################
def preprocesser(test_data):
    
    

#########################################
####        RETURN PRED LAB           ###
#########################################


#target_names_dict = dict(enumerate(test_categories))
target_names_dict = {0: 'alt.atheism',
 1: 'comp.graphics',
 2: 'comp.os.ms-windows.misc',
 3: 'comp.sys.ibm.pc.hardware',
 4: 'comp.sys.mac.hardware',
 5: 'comp.windows.x',
 6: 'misc.forsale',
 7: 'rec.autos',
 8: 'rec.motorcycles',
 9: 'rec.sport.baseball',
 10: 'rec.sport.hockey',
 11: 'sci.crypt',
 12: 'sci.electronics',
 13: 'sci.med',
 14: 'sci.space',
 15: 'soc.religion.christian',
 16: 'talk.politics.guns',
 17: 'talk.politics.mideast',
 18: 'talk.politics.misc',
 19: 'talk.religion.misc'}

pred = SGD_pipeline.predict(test_data)
pred_labels = np.array([target_names_dict[k] for k in pred])
pred_labels