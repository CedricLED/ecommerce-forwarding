function yesnoCheck(that) {
  if (that.value == 'B') {
    document.getElementById('checkID').style.display = 'block';
    document.getElementById('photoId').required = true;
  } else {
    document.getElementById('checkID').style.display = 'none';
    document.getElementById('photoId').required = false;
  }
}
