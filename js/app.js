// let data = [];
// let where save the kaywords for the items
let keywords = {};

///////////////////// ask for data //////////////////
$.get('./data/page-1.json').then(data => {
  /// loop in the data and build an constructor object then call the render method to render the object
  data.forEach(data => {
    new bulidData(
      data.image_url,
      data.title,
      data.description,
      data.horns,
      data.keyword
    ).render();
    //// save the kaywords in keywords object
    keywords[data.keyword] = true;
  });
  /////// call keys function to render the keywords in the select element
  keys();
  ///// remove the first section after render cause the css and its useless now
  $('section')[0].remove();
});

//////////////////////// constructor object for data //////////////////

function bulidData(img, title, des, horns, key) {
  this.img = img;
  this.title = title;
  this.des = des;
  this.horns = horns;
  this.key = key;
  //   data.push(this);
}

//////////////////// method to render the data /////////////
bulidData.prototype.render = function() {
  // have a cope from the section
  let section = $($('#photo-template').clone());
  /// give it a class with the keyword for filter the items in filter function
  section[0].className += ' ' + this.key;
  section.attr('title', this.title);
  section.attr('data-title', this.title);
  section.attr('data-horns', this.horns);
  // ask for its children elements to give the data [0] = h1 , [1]=img, [2] = p
  let newS = section.children();
  newS[0].innerText = this.title;
  newS[1].src = this.img;
  newS[2].innerText = this.des;
  // append it to the DOM
  section.appendTo('main');
};

///////////// keys function to render the keywords in the select element
function keys() {
  // loop in the keywords object
  for (const key in keywords) {
    /// give the data to the option element
    let option = $($('option').clone()[0]);
    option[0].value = key;
    option[0].text = key;
    option.appendTo('.filter');
  }
}

//////////// invoke the function when some change be in the filter select
$('.filter').change(function() {
  // have the selected value
  let value = $('.filter option:selected')[0].value;
  // check from the selected value and hide/show debende on that
  if (value === 'default') {
    $('section').show();
  } else {
    $('section').hide();
    $('[class~=' + value + ']').show();
  }
});

////// invoke the function when some change be in the sort select

$('.sort').change(function() {
  // check from the selected value and invoke the function that response to the user input
  if (this.value === 'name') {
    sortName();
  } else if (this.value === 'horns') {
    sortHorns();
  }
});

/////// sort by name function
function sortName() {
  //// have all the section element
  let list = $('main').children('section');
  // Bind list to the sort method so we don't have to travel up all these properties more than once.
  var sortList = Array.prototype.sort.bind(list);
  sortList(function(a, b) {
    // Cache dataset attr from the first element (a) and the next sibling (b)
    a = a.dataset.title;
    b = b.dataset.title;
    // Returning -1 will place element `a` before element `b`
    if (a < b) {
      return -1;
    }
    // Returning 1 will do the opposite
    if (a > b) {
      return 1;
    }
    // Returning 0 leaves them as-is
    return 0;
  });
  /// empty all the section in the main
  $('main').empty();
  /// loop in the new list sorted array and append it in the main element
  for (let index = 0; index < list.length; index++) {
    document.getElementsByTagName('main')[0].appendChild(list[index]);
  }
}

/////// sort by horns function
function sortHorns() {
  //// have all the section element
  let list = $('main').children('section');
  // Bind list to the sort method so we don't have to travel up all these properties more than once.
  var sortList = Array.prototype.sort.bind(list);
  sortList(function(a, b) {
    // Cache inner content from the first element (a) and the next sibling (b)
    a = Number(a.dataset.horns);
    b = Number(b.dataset.horns);
    // Returning -1 will place element `a` before element `b`
    if (a < b) {
      return -1;
    }
    // Returning 1 will do the opposite
    if (a > b) {
      return 1;
    }
    // Returning 0 leaves them as-is
    return 0;
  });
  /// empty all the section in the main
  $('main').empty();
  /// loop in the new list sorted array and append it in the main element
  for (let index = 0; index < list.length; index++) {
    document.getElementsByTagName('main')[0].appendChild(list[index]);
  }
}
