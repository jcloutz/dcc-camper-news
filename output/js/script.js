"use strict";

Handlebars.registerHelper('truncate', function (str, len) {
  var re = /(\.\ |\ )/g,
      match,
      flag = true,
      index = 0;

  while ((match = re.exec(str)) && flag === true) {
    if (match.index <= len) {
      index = match.index;
    } else {
      flag = false;
    }
  }

  return str.substr(0, index) + '...';
});

Handlebars.registerHelper('formatDate', function (timestamp) {
  return moment(timestamp).format('MMMM Do, YYYY');
});

var colors = ['red', // '#F0544F', // red
'blue', // '#2BA9E0', // blue
'orange', // '#F37748', // orange
'yellow', // '#FFBC42', // yellow
'pink', // '#DE398B', // pink
'purple', // '#8572C9', // purple
'green'];

// '#84DCC6' // green
var isotopeOptions = {
  itemSelector: '.grid__item',
  layoutMode: 'packery',
  percentPosition: true,
  packery: {
    columnWidth: '.grid__sizer',
    gutter: '.gutter__sizer'
  }
};

$(document).ready(function () {
  var $articles = $('#articles');
  var template = Handlebars.compile($("#news-item").html());
  var $window = $(window);
  var isotopeInitialized = false;
  var $grid = $('.grid');

  $.ajax({
    url: 'http://www.freecodecamp.com/news/hot',
    dataType: 'json',
    cache: false,
    success: createElements,
    error: function error(xhr, status, _error) {
      console.log(status, err.toString());
    }
  });

  function initializeIsotope() {
    var width = $window.width();
    if (width >= 768 && isotopeInitialized === false) {
      $grid.isotope(isotopeOptions);
      isotopeInitialized = true;
      console.log('Isotope Initialized.');
    } else if (width < 768 && isotopeInitialized === true) {
      $grid.isotope('destroy');
      isotopeInitialized = false;
      console.log('Isotope Destroyed');
    }
  }

  function createElements(data) {
    var high = Math.max.apply(Math, data.map(function (v) {
      return v.rank;
    }));
    var divider = Math.floor(high / 3);
    console.log(divider);

    for (var i = 0; i < data.length; i++) {
      if (data[i].rank >= divider * 2) {
        // top 1/3
        data[i].class = "grid__item--width-2";
      } else if (data[i].rank >= divider) {
        // middle 1/3
        data[i].class = "grid__item--height-2";
      } else {
        data[i].class = '';
      }
      data[i].color = getColor();
      data[i].animationDelay = i * .1;
      //data[i].class = layout[i].class;

      var html = template(data[i]);
      $articles.append(html);
    }

    initializeIsotope();
    $window.resize(function () {
      initializeIsotope();
    });
  } // end crete elements
});

var prevColors = [colors.length + 1, colors.length + 2, colors.length + 3, colors.length + 4];

function getColor() {
  var colorIndex = 0,
      newColor = false;

  do {
    colorIndex = Math.floor(Math.random() * colors.length);
    newColor = prevColors.indexOf(colorIndex) === -1 ? true : false;
  } while (newColor === false);

  prevColors.push(colorIndex);
  prevColors.shift();

  return colors[colorIndex];
}

function getOddNum(min, max) {
  var num = Math.floor(Math.random() * (max - min)) + min;

  if (num % 2 === 1) {
    // is even
    if (num % 2 === 1 && num === max) {
      num -= 1;
    } else {
      num += 1;
    }
  }

  return num;
}

function getEvenNum(min, max) {
  var num = Math.floor(Math.random() * (max - min)) + min;

  if (num % 2 !== 0) {
    // is odd
    if (num % 2 !== 0 && num === max) {
      num -= 1;
    } else {
      num += 1;
    }
  }

  return num;
}