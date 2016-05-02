var tCtx = document.getElementById('textCanvas').getContext('2d');
var chars = [' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/',
   '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@',
   'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
   'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`',
   'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
   'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}'
];
var bloburl;

tCtx.imageSmoothingEnabled = false;
tCtx.mozImageSmoothingEnabled = false;
tCtx.webkitImageSmoothingEnabled = false;
tCtx.translate(0.5, 0.5);

function createPreview(threshold, ff, fs) {
  //console.log(threshold, ff, fs);

  $('#preview').html('');
  var wholeFont = [];

  for (var i = 0; i < chars.length; i++) {

    var charHeight = getTextHeight(ff, fs);
    tCtx.font = fs + "px " + ff + ', monospace';
    tCtx.canvas.width = tCtx.measureText(chars[i]).width;
    tCtx.canvas.height = charHeight.height;
    tCtx.fillStyle = "black";
    tCtx.fillRect(0, 0, tCtx.canvas.width, tCtx.canvas.height);
    tCtx.font = fs + "px " + ff + ', monospace';
    tCtx.fillStyle = "white";
    tCtx.fillText(chars[i], 0, charHeight.ascent);

    var w = tCtx.canvas.width;
    var h = tCtx.canvas.height;
    var pimage = tCtx.getImageData(0, 0, w, h);


    /*  PNG TO LCD CODE */

    var pixels = pimage.data,
        pixelsLen = pixels.length
        height = pimage.height,
        width = pimage.width,
        unpackedBuffer = [],
        depth = 4;

    // create a new buffer that will be filled with pixel bytes (8 bits per) and then returned
    var buffer = new Uint8ClampedArray(Math.ceil((width * height) / 8));

    // filter pixels to create monochrome image data
    for (var j = 0; j < pixelsLen; j += depth) {

      // just take the red value
      pixelVal = pixels[j + 1] = pixels[j + 2] = pixels[j];

        // do threshold for determining on and off pixel vals
        if (pixelVal > threshold) {
          pixelVal = 1;
        } else {
          pixelVal = 0;
        }

      // push to unpacked buffer list
      unpackedBuffer[j/depth] = pixelVal;

      // modify canvas image data for the browser preview
      pimage.data[j] = pimage.data[j+1] = pimage.data[j+2] = pixelVal === 1 ? 255 : 0;

    }

    // put a new char image on the screen for the preview
    tCtx.putImageData(pimage, 0, 0);
    $('#preview').append('<img src="'+tCtx.canvas.toDataURL()+'"/>');

    // time to pack the buffer
    for (var k = 0; k < unpackedBuffer.length; k++) {
      // math
      var x = Math.floor(k % width);
      var y = Math.floor(k / width);

      // create a new byte, set up page position
      var byte = 0,
          page = Math.floor(y / 8),
          pageShift = 0x01 << (Math.floor(y - 8 * page));

      // is the first page? Just assign byte pos to x value, otherwise add rows to it too
      (page === 0) ? byte = x : byte = x + width * page;

      if (unpackedBuffer[k] === 0) {
        // 'off' pixel
        buffer[byte] &= ~pageShift;
      } else {
        // 'on' pixel
        buffer[byte] |= pageShift;
      }
    }

    for (var q = 0; q < buffer.length; q++) {
     wholeFont.push(buffer[q]);
    }
  }

  var code = "module.exports = {\nmonospace: true,\nwidth: "+tCtx.canvas.width+",\nheight: "+ tCtx.canvas.height +",\nfontData: ["+ wholeFont.toString(16) +"],\nlookup: "+ JSON.stringify(chars) +"\n};";

  // if Blob constructor is available, create objectURL instead of dataURL
  if (window.Blob) {
    var blob = new Blob([code], {type: 'text/javascript'});
    // if bloburl was previousely created, revoke it first for memory
    if (bloburl) {
      window.URL.revokeObjectURL(bloburl);
    }
    bloburl = window.URL.createObjectURL(blob);
    link.href = bloburl;
    link.download = 'oled-js-font.js';

    return;
  }
  link.href = 'data:text/text;charset=utf-8,' + encodeURIComponent(code);
}
