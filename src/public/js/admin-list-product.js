document.addEventListener('DOMContentLoaded', function () {
    var btnConfirm = document.getElementById('btn-comfirm-delete');
    var formDelete = document.getElementById('hidden-form-delete');
    var checkboxAll = $('#checkbox-all');
    var formAction = $('#form-action');
    var btnSubmitAction = $('.btn-submit-action');
    var checkBox = $('input[name="checkIDs[]"]');
    //Change checkboxAll
    checkboxAll.change(function () {
        var ischeckedAll = checkboxAll.prop('checked');
        checkBox.prop('checked', ischeckedAll);
        handleToggleBtnAction();
    });
    //change checkbox
    checkBox.change(function () {
        var ischeckedAll =
            checkBox.length === $('input[name="checkIDs[]"]:checked').length;
        checkboxAll.prop('checked', ischeckedAll);
        handleToggleBtnAction();
    });
    // Disable button action
    function handleToggleBtnAction() {
        var isCheked = $('input[name="checkIDs[]"]:checked').length;
        console.log(isCheked);
        if (isCheked) {
            btnSubmitAction.removeAttr('disabled');
        } else {
            btnSubmitAction.addAttr('disabled');
        }
    }

    $('#delele-product-modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');
        console.log(id);
        btnConfirm.onclick = function () {
            formDelete.action = '/admin/' + id + '/delete?_method=DELETE';
            formDelete.submit();
        };
    });
});
