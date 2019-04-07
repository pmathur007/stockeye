#!flask/bin/python

import sys
import tweepy
from twython import Twython
from flask import Flask, render_template, request, redirect, Response
from flask_cors import CORS
from textblob import TextBlob

app = Flask(__name__)
CORS(app)

twitter = Twython("04XLdRImNqO1SROyP9BqWEbOV", "A18ltEyce5T5Fcy14ycNxnKFEKo3kK5TLx4c0RHhIw0izr7NrI")

def get_sentiments(ticker):
    sentiment_data = ""
    twitter = Twython("04XLdRImNqO1SROyP9BqWEbOV", "A18ltEyce5T5Fcy14ycNxnKFEKo3kK5TLx4c0RHhIw0izr7NrI")
    results = twitter.cursor(twitter.search, q=ticker)
    count = 1
    for result in results:
        if (count > 100):
            break
        sentiment_data = sentiment_data + " " + str(sentiment(result['text']))
        count = count + 1
    return sentiment_data

def sentiment(text):
    t = TextBlob(text)
    rating = (t.sentiment.polarity)*(1-t.sentiment.subjectivity)
    return rating

@app.route('/getStockInfo', methods = ['GET'])
def get_stock_info():
    ticker = request.args.get('ticker')
    print(ticker)
    return get_sentiments(ticker)

if __name__ == "__main__":
    app.run()

#curl -G 'https://api.twitter.com/1.1/search/tweets.json' -d 'q=%23archaeology' -h "Authorization: OAuth oauth_consumer_key='04XLdRImNqO1SROyP9BqWEbOV', oauth_nonce='A18ltEyce5T5Fcy14ycNxnKFEKo3kK5TLx4c0RHhIw0izr7NrI', oauth_signature='1072865312591282177-bOcfXYEmJt3Gq8F9LAXke6LSsIMy9p', oauth_signature_method='HMAC-SHA1', oauth_timestamp='1450728725', oauth_token='ZwMX6TR9v6qmJC5u4pYynRaIhiomIWk7788KHB4LWqGuo', oauth_version='1.0'" -s