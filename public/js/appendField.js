$(document).ready(function() {
  let counter = 1;

  $('#addrow').on('click', function() {
    const newRow = $('<div class="form-row newPackage">');
    let cols = '';


    cols += '<div class="form-group col-md-6">';
    cols += '<input type="text" class="form-control" name="trackingNumber' + counter + '" required minlength="7" maxlength="64"></input>';
    cols += '</div>';
    cols += '<div class="form-group col-md-2">';
    cols += '<select name="inputType' + counter + '" class="form-control" required>';
    cols += '<option selected value="">Choose...</option>';
    cols += '<option value="shoes">Shoes</option>';
    cols += '<option value="clothes">Clothes</option>';
    cols += '<option value="misc">Misc</option>';
    cols += '</select>';
    cols += '</div>';
    cols += '<div class="form-group col-md-2">';
    cols += '<input type="number" class="form-control" name="inputAmount' + counter + '" required min="1" max="250"></input>';
    cols += '</div>';
    cols += '<div class="form-group col-md-2">';
    cols += '<input type="button" class="ibtnDel btn btn-md btn-danger "  value="Delete">';
    cols += '</div>';
    cols += '</div>';
    newRow.append(cols);
    $('.packages').append(newRow);
    counter++;
  });


  $('.packages').on('click', '.ibtnDel', function(event) {
    $(this).closest('.newPackage').remove();
    counter -= 1;
  });
});
