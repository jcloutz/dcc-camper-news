var str = "Learn more at http://jswiz.net. This course will include topics on: What Express.js is and why we would want to use it as our server-side framework. How to";

function truncate(str, length) {
  var re = /(\.\ |\ )/g,
      match,
      flag = true,
      index = 0;


  while((match = re.exec(str)) && flag === true) {
    if (match.index <= length) {
      index = match.index;
    } else {
      flag = false;
    }
  }

  return str.substr(0, index) + '...';
}

console.log(truncate(str, 35));
