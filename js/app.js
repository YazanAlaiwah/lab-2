'use strict';
let data1 = [];
let data2 = [];
// let where save the kaywords for the items
let keywords = {};

///////////////////// ask for data //////////////////
$.get('data/page-1.json').then(data => {
  /// loop in the data and build an constructor object and push it to the data1 array to save for the pages then call the render method to render the object
  data.forEach(data => {
    data1.push(
      new bulidData(
        data.image_url,
        data.title,
        data.description,
        data.horns,
        data.keyword
      )
    );
  });
  render(data1);
});

$.get('data/page-2.json').then(data => {
  /// loop in the data and build an constructor object and push it to data2 to save it for the pages
  data.forEach(data => {
    data2.push(
      new bulidData(
        data.image_url,
        data.title,
        data.description,
        data.horns,
        data.keyword
      )
    );
  });
});

//////////////////////// constructor object for data //////////////////

function bulidData(img, title, des, horns, key) {
  this.img = img;
  this.title = title;
  this.des = des;
  this.horns = horns;
  this.key = key;
}

//////////////////// method to render the data /////////////
bulidData.prototype.render = function() {
  //////////////// to render the images
  let template = $('#photo-template').html();
  let html = Mustache.render(template, this);
  $('main').append(html);
  ////////////////
  /////////////////// to render the option selected based on the keyords objects
  if (!keywords[this.key]) {
    //// if the key  is not on the object will add it to not have at again when compear it and render the value of it
    keywords[this.key] = 1;
    var name = this.key;
    let select = $('#option').html();
    let htmlSelect = Mustache.render(select, { ...this, name });
    $('#filter').append(htmlSelect);
  }
};

//////////// invoke the function when some change be in the filter select
$('.filter').change(function() {
  // have the selected value
  let value = $('.filter option:selected')[0].value;
  // check from the selected value and fadeOut/1000fadeIn 1000 debende on that
  if (value === 'default') {
    $('section').fadeIn(100);
  } else {
    $('section').fadeOut(100);
    $('[class~=' + value + ']').fadeIn(100);
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

/////// this function work when the user click on the pages button
$('button').click(function() {
  // reset the keywords object to empty to readd on the good keywords without dublicated
  keywords = {};
  ////// empty the main and the slected filter from the old values to render the new ones
  $('main').empty();
  $('#filter').empty();
  //// ask for the templete from html page for the defulte option to render it after remove it
  let select = $('#option').html();
  let htmlSelect = Mustache.render(select, {
    key: 'default',
    name: 'Filter by Keyword'
  });
  /// append the option templete
  $('#filter').append(htmlSelect);
  //// reset the filter and sort selected every time switch in pages
  $('#filter')[0].value = 'default';
  $('#sort')[0].value = 'default';
  /// check from the button that clicked and invoke the function with the right array of data
  if (this.id == '1') {
    render(data1);
  } else {
    render(data2);
  }
  //// toggle the class blue for the button to give it the color ///// NOT GOOD  /////////
  $('button').toggleClass('blue');
});

///// this function invoke when the above function tell what the array sholud be renderd
function render(array) {
  /// have all the objects of data from the base array and render it
  array.forEach(element => {
    element.render();
  });
  ///// affter the render end we will add the click function on the images when its clicked will inveke the popup
  $('section').click(function() {
    // remove the old pop if its existes
    $('.popup').remove();
    // have all the objects in teh var
    let content = $(this);
    /// prepeer the obj templet for the good values need it for popup
    let obj = {
      title: content.find('h2').text(),
      img: content.find('img').attr('src'),
      des: content.find('p').text()
    };
    //// append it on html page
    let popup = $('#popup').html();
    let htmlpop = Mustache.render(popup, obj);
    $('main').append(htmlpop);
    //// add an exit button in the popup
    $('i').click(function() {
      $('.popup').remove();
    });
  });
}

/////// this function will invoke when the user try to look on spicefic item from the input of search
$('#serch').keyup(function() {
  /// reset the select fitelr to the default
  $('#filter')[0].value = 'default';
  /// build our requler exprssion base on the user input
  var value = new RegExp(this.value.toLowerCase());
  ///// hide all images
  $('section').fadeOut(100);
  ///// loop in the elements in html page to compare it with the user input and use test method then show if its match
  $('section').each(function() {
    if (
      value.test(
        $(this)
          .find('h2')
          .text()
          .toLowerCase()
      )
    ) {
      $(this).fadeIn(100);
    }
  });
});

/////////////////////////////// THANK YOU //////////////////////////////////
