module.exports = function(file, onLoadCallback) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = onLoadCallback;
};
