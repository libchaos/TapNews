import cnn_news_scraper as scraper

EXPECTED_NEWS = "One of the things that has characterized Los Angeles over the past quarter century is that the metropolitan area"
CNN_NEWS_URL = "https://edition.cnn.com/2018/02/27/americas/los-angeles-traffic/index.html"

def test_basic():
    news = scraper.extract_news(CNN_NEWS_URL)

    print news
    assert EXPECTED_NEWS in news
    print 'test_basic passed'

if __name__ == "__main__":
    test_basic()