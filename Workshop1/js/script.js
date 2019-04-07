
var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];

// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
}

$(function () {
    loadBookData();
});

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function getBoolean(str) {
    if ("true".startsWith(str)) {
        return true;
    } else if ("false".startsWith(str)) {
        return false;
    } else {
        return null;
    }
}



$(document).ready(function () {
    //語系
    kendo.culture('zh-TW');
    //add_book
    $("#add_book").click(function () {
        $("#add_window").data("kendoWindow").center().open();
    });
    $("#add_window").kendoWindow({
        width: 800,
        title: "新增書籍",
        visible: false,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
    });
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: bookCategoryList,
        index: 0,
        change: function (e) {
            var src = "";
            bookCategoryList.forEach(function (item, index, array) {
                if (item.value === $("#book_category").val()) {
                    src = item.src;
                }
            });
            $('.book-image').attr('src', src);
        }
    });
    var todayDate = kendo.toString(kendo.parseDate(new Date()), 'yyyy-MM-dd');
    $("#bought_datepicker").kendoDatePicker({
        format: "yyyy-MM-dd",
        value: todayDate
    });
    $("#delivered_datepicker").kendoDatePicker({
        format: "yyyy-MM-dd",
    });
    var book_price = 0, book_amount = 0, book_total = 0;
    $("#book_price").kendoNumericTextBox({
        format: "{0:N0}",
        change: function () {
            book_price = this.value();
            book_total = book_price * book_amount;
            $("#book_total").text(kendo.toString(book_total, "n0"));
        }
    });
    $("#book_amount").kendoNumericTextBox({
        format: "{0:N0}",
        change: function () {
            book_amount = this.value();
            book_total = book_price * book_amount;
            $("#book_total").text(kendo.toString(book_total, "n0"));
        }
    });
    $("#save_book").click(function () {
        var newbookdata = {
            "BookId": bookDataFromLocalStorage.length + 1,
            "BookCategory": $("#book_category").val(),
            "BookName": $("#book_name").val(),
            "BookAuthor": $("#book_author").val(),
            "BookBoughtDate": $("#bought_datepicker").val(),
            "BookPublisher": "",
            "BookDeliveredDate": $("#delivered_datepicker").val(),
            "BookPrice": parseInt($("#book_price").val(), 10),
            "BookAmount": parseInt($("#book_amount").val(), 10),
            "BookTotal": book_total
        };
        bookDataFromLocalStorage.push(newbookdata);
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    });

    //book_grid
    var deletedata;
    var wnd = $("#delete_details").kendoDialog({
        modal: false,
        visible: false,
        resizable: false,
        title: false,
        actions: [
            {
                text: 'OK', primary: true, action: function (e) {
                    for (var key in bookDataFromLocalStorage) {
                        if (bookDataFromLocalStorage[key]["BookId"] == deletedata) {
                            bookDataFromLocalStorage.splice(key, 1);
                        }
                    }
                    localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
                }
            },
            { text: 'CANCEL' }
        ],
    }).data("kendoDialog");

    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            pageSize: 20,
        },
        height: 800,
        toolbar: kendo.template($("#template").html()),
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [{
            command: {
                text: "刪除", click: function (e) {
                    e.preventDefault();
                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                    deletedata = dataItem.BookId;
                    wnd.content("確定刪除[" + dataItem.BookName + "]嗎?");
                    wnd.open();
                }
            }
        }, {
            field: "BookId",
            title: "書籍編號",
            type: "number"
        }, {
            field: "BookName",
            title: "書籍名稱",
            type: "string"
        }, {
            field: "BookCategory",
            title: "書籍種類",
            type: "string"
        }, {
            field: "BookAuthor",
            title: "作者",
            type: "string"
        }, {
            field: "BookBoughtDate",
            title: "購買日期",
            type: "date",
            format: "{0:yyyy-MM-dd}"
        }, {
            field: "BookDeliveredDate",
            title: "送達狀態",
            type: "date",
            format: "{0:yyyy-MM-dd}",
                template: "#if (BookDeliveredDate !=null){#" +
                    "<i class='fas fa-truck' title='#: kendo.toString(BookDeliveredDate, 'yyyy-MM-dd') #'></i>" +
                "#}#"
        }, {
            field: "BookPrice",
            title: "金額",
            type: "number",
            format: "{0:N0}元",
            attributes: { style: "text-align:right" }
        }, {
            field: "BookAmount",
            title: "數量",
            type: "number",
            format: "{0:N0}",
            attributes: { style: "text-align:right" }
        }, {
            field: "BookTotal",
            title: "總計",
            type: "number",
            format: "{0:N0}元",
            attributes: { style: "text-align:right" }
        }]
    });


    //search
    $('#search').on('input', function (e) {
        var grid = $('#book_grid').data('kendoGrid');
        var columns = grid.columns;

        var filter = { logic: 'or', filters: [] };
        columns.forEach(function (x) {
            if (x.field) {
                var type = grid.dataSource.options.schema.model.fields[x.field].type;
                if (type == 'string') {
                    filter.filters.push({
                        field: x.field,
                        operator: 'contains',
                        value: e.target.value
                    })
                }
                else if (type == 'number') {
                    if (isNumeric(e.target.value)) {
                        filter.filters.push({
                            field: x.field,
                            operator: 'eq',
                            value: e.target.value
                        });
                    }

                } else if (type == 'date') {
                    var data = grid.dataSource.data();
                    for (var i = 0; i < data.length; i++) {
                        var dateStr = kendo.format(x.format, data[i][x.field]);
                        if (dateStr.startsWith(e.target.value)) {
                            filter.filters.push({
                                field: x.field,
                                operator: 'eq',
                                value: data[i][x.field]
                            })
                        }
                    }
                } else if (type == 'boolean' && getBoolean(e.target.value) !== null) {
                    var bool = getBoolean(e.target.value);
                    filter.filters.push({
                        field: x.field,
                        operator: 'eq',
                        value: bool
                    });
                }
            }
        });
        grid.dataSource.filter(filter);
    });

});





