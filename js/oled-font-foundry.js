var $threshold = $('#threshold');
var $fontSize = $('#fontSize');
var $fontFamily =  $('#fontFamily');
var $thresholdValue = $('#thresholdValue');
var $fontSizeValue = $('#fontSizeValue');

$threshold.change(function(){
  $thresholdValue.html(this.value);
});

$fontSize.change(function(){
  $fontSizeValue.html(this.value);
});

$('form :input').on('change blur', function() {
  createPreview($threshold.val(), $fontFamily.val(), $fontSize.val());
});

$('form').on('submit', function() {
  return false;
});

$threshold.change();
$fontSize.change();

createPreview($threshold.val(), $fontFamily.val(), $fontSize.val());
