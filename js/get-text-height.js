// thank dog for SO http://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
function getTextHeight(font, size) {
  var text = $('<span>Hg</span>').css({ fontFamily: font, fontSize: size + 'px', color: 'white', padding:0, margin:0 });
  var block = $('<div style="display: inline-block; width: 1px; height: 0px; padding:0; margin:0"></div>');

  var div = $('<div></div>');
  div.append(text, block);

  var body = $('body');
  body.append(div);

  try {
    var result = {};

    block.css({ verticalAlign: 'baseline' });
    result.ascent = block.offset().top - text.offset().top;

    block.css({ verticalAlign: 'bottom' });
    result.height = block.offset().top - text.offset().top;

    result.descent = result.height - result.ascent;
  } finally {
    div.remove();
  }

  return result;
};
