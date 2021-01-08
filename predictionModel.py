# preprocessing
import os
import re
import string
import logging
import itertools
import numpy as np
import pandas as pd
from time import time
import collections

import nltk
from nltk import sent_tokenize
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem.snowball import SnowballStemmer
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize


import timeit
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag
import _pickle as pickle
import string
nltk.data.path.append('./nltk_data')

start = timeit.default_timer()
with open("pickle/pipeline.pkl", 'rb') as f:
    pipeline = pickle.load(f)
    stop = timeit.default_timer()
    print('=> Pickle Loaded in: ', stop - start)


class PredictionModel:
    output = {}

    # constructor
    def __init__(self, text):
        self.output['original'] = text

    def predict(self):

        self.preprocess()

        # preprocessed data
        preprocessed_test_data = self.output['preprocessed']
        # [0]?
        pred = pipeline.predict(preprocessed_test_data)[0]

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

        self.output['prediction'] = np.array(
            [target_names_dict[k] for k in pred])

        return self.output['prediction']

           # Preprocess
    def preprocess(self):
        # lowercase the text
        test_data = self.output['original']
        test_data = self.strip_header_footer_quotes(test_data)
        test_data = self.generate_data_nltk(train_data)

        self.output['preprocessed'] = test_data

    # Helper methods
    def corpus(text):

        from nltk.tokenize import word_tokenize
        tokens = word_tokenize(text)

        # convert to lower case
        tokens = [w.lower() for w in tokens]

        # remove punctuation from each word
        table = str.maketrans('', '', string.punctuation)
        stripped = [w.translate(table) for w in tokens]

        # remove remaining tokens that are not alphabetic
        words = [word for word in stripped if word.isalpha()]

        # filter out stop words
        stop_words = set(stopwords.words('english'))
        words = [w for w in words if not w in stop_words]
        return words


    def generate_data_nltk(dataList):

        corpus_dict_list = [corpus(text) for text in dataList]
        processed_data = [" ".join(corpus)
                                           for corpus in corpus_dict_list]

        return(processed_data)

    def strip_newsgroup_header(text):

        _before, _blankline, after = text.partition('\n\n')
        return after

    def strip_newsgroup_footer(text):

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

        _QUOTE_RE = re.compile(r'(writes in|writes:|wrote:|says:|said:'
                                r'|^In article|^Quoted from|^\||^>)')
        good_lines = [line for line in text.split('\n')
                        if not _QUOTE_RE.search(line)]
        return '\n'.join(good_lines)

    def strip_header_footer_quotes(data):

        data = [strip_newsgroup_header(text) for text in data]
        data = [strip_newsgroup_footer(text) for text in data]
        data = [strip_newsgroup_quoting(text) for text in data]
        return data
