import './NewsPanel.css';
import React from 'react';
import NewsCard from '../NewsCard/NewsCard';
import Auth from '../Auth/Auth';

import _ from 'lodash';

class NewsPanel extends React.Component{
    constructor(){
        super();
        this.state = {news : null};
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount(){
        this.loadMoreNews();
        this.loadMoreNews = _.debounce(this.loadMoreNews, 500);
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll(){
        let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if((window.innerHeight + scrollY) >= (document.body.offsetHeight + 15)){
            console.log('loading more news');
            this.loadMoreNews();
        }
    }

    loadMoreNews(){
        let request = new Request('http://localhost:3000/news', {
            method: 'GET',
            headers: {
                'authorization': 'bearer ' + Auth.getToken()
            },
            cache: false
        });

        fetch(request)
            .then((res) => res.json())
            .then((loadedNews) => {
                this.setState({
                    news: this.state.news ? this.state.news.concat(loadedNews) : loadedNews,
                });
            })       
    }

    //todo: add key={news.digest}
    rendernews(){
        const news_list = this.state.news.map(function(news){
            return (
                <a className='list-group-item' href='#'>
                    <NewsCard news={news} />
                </a>
            )
        });

        return (
            <div className='container-fluid'>
                <div className='list-group'>
                  {news_list}
                </div>
            </div>
        )
    }

    render(){
        if(this.state.news){
            return (
                <div>
                    {this.rendernews()}
                </div>
            )
        } else {
            return (
                <div>
                    Loading...
                </div>
            )
        }
    }
}
export default NewsPanel;