"use strict";

var NewsItem = React.createClass({
  formatDate: function(timestamp) {
    return moment(timestamp).format('MMMM Do, YYYY');
  },
  truncateString: function(str, len) {
    var re = /(\.\ |\ )/g,
        match,
        flag = true,
        index = 0;


    while((match = re.exec(str)) && flag === true) {
      if (match.index <= len) {
        index = match.index;
      } else {
        flag = false;
      }
    }

    return str.substr(0, index) + '...';
  },
  render: function() {
    var height = Math.random() > .78  ? ' grid__item--height-2' : '';
    var width = Math.random() > .9 && height === '' ? ' grid__item--width-2' : '';

    var description = this.props.data.metaDescription;

    return (
      <article className={'grid__item news blue' + width + height}>
        <h1 className="news__title">{this.props.data.headline}</h1>
        <hr />
        <p className="news__description">{ description.length > 0 ? this.truncateString(this.props.data.metaDescription, 200) : ''}</p>
        <div className="news__meta-author-container">
          <a className="news__meta-author-link" href={'http://www.freecodecamp.com/' + this.props.data.author.username} >
            <img className="news__meta-author-avatar" src={this.props.data.author.picture} alt={this.props.data.author.username + ' avatar'} />
            <span className="news__meta-author-name">{'@'+this.props.data.author.username}</span>
          </a>
        </div>
        <div className="news__story-meta-container">
          <div className="news__meta">
            <p className="news__meta-date">{this.formatDate(this.props.data.timePosted)}</p>
            <div className="news__meta_upvote-container">
              <span className="news__meta-upvote-count">
                <i className="ion-arrow-graph-up-right"></i>
                {this.props.data.rank}
                <p className="news__meta-upvote-label">upvotes</p>
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }
});

var News = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      iso: null,
    }
  },
  fetchData: function() {
    this.setState({data: data});
  },
  componentDidUpdate: function() {
    if(this.state.iso) {
        this.state.iso.reloadItems();
        this.state.iso.arrange();
    }
  },
  componentDidMount: function() {
    this.fetchData();
    if(!this.state.iso) {
      this.setState({
        iso: new Isotope(ReactDOM.findDOMNode(this.refs.isotopeContainer), {
          itemSelector: '.grid__item',
          layoutMode: 'packery',
          percentPosition: true,
          packery: {
            columnWidth: '.grid__sizer',
            gutter: '.gutter__sizer',
          }
        }),
      });
    } else {
        this.state.iso.reloadItems();
    }
  },
  render: function() {
    var newsItems = this.state.data.map(function(news) {
      return (
        <NewsItem key={news.id} data={news} />
      );
    });

    return (
      <div className="grid" ref="isotopeContainer">
        <div className="grid__sizer"></div>
        <div className="gutter__sizer"></div>
        {newsItems}
      </div>
    );
  }
});

ReactDOM.render(
  <News/>,
  document.getElementById('content')
);
