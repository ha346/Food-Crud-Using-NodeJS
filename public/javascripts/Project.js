$(document).ready(function(){
    
    $.getJSON('/food/fetchfoodtype', function (data) {
        data.map((item) => {

            $('#foodtype').append($('<option>').text(item.foodtypename).val(item.foodtypeid))

        })
        $('#foodtype').formSelect()
        
    })

    $('#foodtype').change(function () {
         
        $('#food').empty()

        $('#food').append($('<option diabled selected>').text('Choose your food'))

        $.getJSON('/food/fetchfood', { foodtypeid: $('#foodtype').val() }, function (data) {
           
            data.map((item) => {
            
                $('#food').append($('<option>').text(item.foodname).val(item.foodid))
        })
        $('#food').formSelect()
        })
       
        
    })
})