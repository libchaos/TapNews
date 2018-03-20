import requests
from json import loads

NEWS_API_KEY = "302adfdb04a548c8a757daacdb96daac"
DEFAULT_SOURCES = ["cnn"]
SORT_BY_TOP = "top"
NEWS_API_ENDPOINT = "http://newsapi.org/v1/"
ARTICLES_API = "articles"

def buildUrl(end_points=NEWS_API_ENDPOINT, api_name=ARTICLES_API):
    return end_points+api_name

def getNewsFromSource(sources=[DEFAULT_SOURCES], sortBy=SORT_BY_TOP):
    articles = []
    for source in sources:
        payload = {'apiKey': NEWS_API_KEY,
                   'source': source,
                   'sortBy': SORT_BY_TOP}
        response = requests.get(buildUrl(), params=payload)
        res_json = loads(response.content)

        if(res_json is not None and res_json['status'] == 'ok'and res_json['source'] is not None):
            for news in res_json['articles']:
                news['source'] = res_json['source']

            articles.extend(res_json['articles'])
    return articles