"use strict";
Handlebars.registerHelper('truncate', function(str, len) {
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
});

Handlebars.registerHelper('formatDate', function(timestamp) {
  return moment(timestamp).format('MMMM Do, YYYY');
});

var colors = [
  'red',    // '#F0544F', // red
  'blue',   // '#2BA9E0', // blue
  'orange', // '#F37748', // orange
  'yellow', // '#FFBC42', // yellow
  'pink',   // '#DE398B', // pink
  'purple', // '#8572C9', // purple
  'green',  // '#84DCC6' // green
];
var prevColors = [colors.length + 1, colors.length +2, colors.length + 3, colors.length + 4];

var isotopeOptions = {
  itemSelector: '.grid__item',
  layoutMode: 'packery',
  percentPosition: true,
  packery: {
    columnWidth: '.grid__sizer',
    gutter: '.gutter__sizer',
  }
};


$(document).ready(function() {
  var $articles = $('#articles');
  var template = Handlebars.compile($("#news-item").html());

  $.ajax({
    url: 'http://www.freecodecamp.com/news/hot',
    dataType: 'json',
    cache: false,
    success: createElements,
    error: function(xhr, status, error) {
      console.log(status, err.toString());
    }
  })
  function createElements(data) {
    var layout = generateLayout(data.length);

    for (var i = 0; i < data.length; i++) {

      data[i].color = layout[i].color;
      data[i].class = layout[i].class;

      var html = template(data[i]);
      $articles.append(html);
    }

    $('.grid').isotope(isotopeOptions);
  }
});


// double height block every 3-9 blocks,  odd numbers only, no more than 2
// single 2 wide block every 8-12 items which resets counters

function generateLayout(size) {
  var nextDoubleWideBlock = 0,
      nextDoubleHeightBlock,
      dhMultiple,
      dwMultiple,
      layout = [];

  for (var i = 0; i < size; i++) {
    var cls = '';
    if(i === nextDoubleWideBlock) { // double wide block
      cls = 'grid__item--width-2';
      dwMultiple = getEvenNum(6, 12);

      nextDoubleWideBlock = i + dwMultiple;
      nextDoubleHeightBlock = i + getOddNum(1,3);
    } else if (i === nextDoubleHeightBlock) { // double height block
      cls = 'grid__item--height-2';
      nextDoubleHeightBlock = i + getEvenNum(2, nextDoubleWideBlock - i);
    }

    layout[i] = {
      class: cls,
      color: getColor()
    }
  }

  return layout;
}

function getColor() {
  var colorIndex = 0,
      newColor = false;

  do {
    colorIndex = Math.floor(Math.random() * colors.length);
    newColor = prevColors.indexOf(colorIndex) === -1 ? true : false;
  } while ( newColor === false);

  prevColors.push(colorIndex);
  prevColors.shift();

  return colors[colorIndex];
}

function getOddNum(min, max) {
  var num = Math.floor(Math.random() * (max-min)) + min;

  if ((num%2) === 1) {
    // is even
    if ((num%2) === 1 && num === max) {
      num -= 1;
    } else {
      num += 1;
    }
  }

  return num;
}

function getEvenNum(min, max) {
  var num = Math.floor(Math.random() * (max-min)) + min;

  if ((num%2) !== 0) {
    // is odd
    if ((num%2) !== 0 && num === max) {
      num -= 1;
    } else {
      num += 1;
    }
  }

  return num;
}
