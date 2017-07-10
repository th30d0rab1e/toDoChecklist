 // var editingBook = false;
 // var editingBookId; // Empty for now

$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshList();

  console.log('Listeners added.');
  // Function called when the submit button is clicked
  $('#submitBtn').on('click', function(){
    console.log('Submit button clicked.');
    var list = {};
    list.input = $('#inputField').val();
    list.complete = false;
    addToList(list);
  });
//});



  // Function called when delete button is clicked
  $('#whatToDo').on('click', '.deleteBtn', function(){
    var listid = $(this).data('listid');
    console.log($(this));
    console.log('Delete list with id of', listid);
    deleteList(listid);
  });

  // Function called when edit button is clicked
  $('#whatToDo').on('click', '.checker', function(){
    // Set editng to true, used when we submit the form
    // editingBook = true;
    // We attached the entire book object as data to our table row
    // $(this).parent() is the <td>
    // $(this).parent().parent() is the <tr> that we attached our data to
    console.log($(this));
    var list = {};
    list.id = $(this).data('listid');

    console.log(list.id + ' id of checkbox ');
    console.log($(this).is(':checked'));
    if($(this).is(':checked')){
      list.complete = true;
      console.log('path went true ', list.complete);
    } else {
      list.complete = false;
      console.log('path went false ', list.complete);
    }
    console.log("check ", list.complete);
     //$(selected).toggle(this.checked);

    updateList(list);

  });


// CREATE a.k.a. POST a.k.a. INSERT
function addToList(list) {
  $.ajax({
    type: 'POST',
    url: '/list',
    data: list,
    success: function(response) {
      console.log('Response from server.');
      refreshList();
    }
  });
}

// READ a.k.a. GET a.k.a. SELECT
function refreshList() {
  $.ajax({
    type: 'GET',
    url: '/list',
    success: function(response) {
      console.log(response);
      appendToDom(response.lists);
    }
  });
}

// UPDATE a.k.a. PUT
function updateList(list) {
console.log(list);

  // YOUR AJAX CODE HERE
  $.ajax({
    type: 'PUT',
    url: '/list',
    data: list,
    success: function(){
      refreshList();
    }
  });
}

// DELETE
function deleteList(listid) {
  // When using URL params, your url would be...
  // '/list/' + listId

  // YOUR AJAX CODE HERE
  $.ajax({
    type: 'DELETE',
    url: '/list/' + listid,
    success : function(response){
      refreshList();
    }
  });
}

// Append array of books to the DOM
function appendToDom(lists) {
  // Remove books that currently exist in the table
  console.log(lists);

  $('#whatToDo').empty();
  for(var i = 0; i < lists.length; i += 1) {
    var list = lists[i];
    console.log(list, ' list');
    // For each book, append a new row to our table
    $tr = $('<tr></tr>');
    $tr.data('book', list);
    $tr.append('<td>' + list.id + '</td>');
    $tr.append('<td>' + list.whattodo + '</td>');
    if(list.complete === true){
      $tr.append('<td data-listid"' + list.id + '>' + '<input type="checkbox"'  + '"style="' + 'background-color: yellow;" class="checker" value="complete" checked>' + '</td>');
    } else {
      $tr.append('<td data-listid="' + list.id + '>' + '<input type="checkbox"'  + '"class="checker" value="complete">' + '</td>');
    }
    $tr.append('<td><button class="deleteBtn" data-listId="' + list.id + '">Delete</button></td>');
    $('#whatToDo').append($tr);
  }
}
});
