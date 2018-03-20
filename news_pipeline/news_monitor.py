import datetime
import hashlib
import os
import redis
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
import news_api_client
from CloudAMQP_client import CloudAMQPClient

NEWS_SOURCES = [
    'cnn',
    'abc-news',
    'bloomberg',
    'entertainment-weekly',
    'espn',
    'ign',
    'techcrunch',
    'the-new-york-times',
    'the-wall-street-journal',
    'the-washington-post',
    'cnbc',
    'entertainment-weekly',
    'fox-sports',
    'google-news',
    'hacker-news',
    'recode',
    'newsweek',
    'news-scientist'
]

REDIS_HOST = "localhost"
REDIS_PORT = 6379
redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)

CloudAMQP_URL = 'amqp://idefsmvy:nDaMiBMvzbhQ7p3tRwr3CiAdktpNMAWA@skunk.rmq.cloudamqp.com/idefsmvy'
QUEUE_NAME = 'tap-news-scrape-news-task-queue'
cloudAMQP_client = CloudAMQPClient(CloudAMQP_URL, QUEUE_NAME)


NEWS_TIME_OUT_IN_SECONDS = 3600 * 24 * 1
SLEEP_TIME_IN_SECONDS = 10

while(True):
    news_list = news_api_client.getNewsFromSource(NEWS_SOURCES)
    nums_of_new_news = 0
    for news in news_list:
        news_digest = hashlib.md5(news['title'].encode('utf-8')).digest().encode('base64')
        if(redis_client.get(news_digest) is None):
            nums_of_new_news = nums_of_new_news + 1
            news['digest'] = news_digest
            #if publishedAt is none, set it to current UTC time
            if(news['publishedAt'] is None):
                news['publishedAt'] = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
            redis_client.set(news_digest, news)
            redis_client.expire(news_digest, NEWS_TIME_OUT_IN_SECONDS)
            cloudAMQP_client.sendMessage(news)

    print "Fetched %d news." % nums_of_new_news

    cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)