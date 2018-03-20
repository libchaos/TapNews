import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'scrapers'))

import cnn_news_scraper
from CloudAMQP_client import CloudAMQPClient

DEDUPE_NEWS_TASK_QUEUE_URL = "amqp://mctblifq:g5996oDYMsoqlOTGid7MKKyGn_tKavLh@skunk.rmq.cloudamqp.com/mctblifq"
DEDUPE_NEWS_TASK_QUEUE_NAME = "tap-news-dedupe-news-task-queue"
SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://idefsmvy:nDaMiBMvzbhQ7p3tRwr3CiAdktpNMAWA@skunk.rmq.cloudamqp.com/idefsmvy"
SCRAPE_NEWS_TASK_QUEUE_NAME = "tap-news-scrape-news-task-queue"

scrape_news_queue_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
dedupe_news_queue_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)

SLEEP_TIME_IN_SECONDS = 5

def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        print 'message is broken'
        return
    
    task = msg
    text = None

    #support CNN only
    if task['source'] == 'cnn':
        text = cnn_news_scraper(task['url'])
    else:
        print 'News Source is not support'

    task['text'] = text
    dedupe_news_queue_client.sendMessage(task)


while True:
    if scrape_news_queue_client is not None:
        msg = scrape_news_queue_client.getMessage()
        if msg is not None:
            try:
                handle_message(msg)
            except Exception as e:
                print e
                pass
        scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)