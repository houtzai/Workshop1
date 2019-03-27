
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

$(document).ready(function () {
    kendo.culture('zh-TW');

    $("#add_book").click(function () {
        $("#add_boo_window").data("kendoWindow").center().open();
    });
    $("#add_boo_window").kendoWindow({
        width: "600px",
        title: "新增書籍",

        visible: false,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
    });

    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookData,
            schema: {
                model: {
                    fields: {
                        BookId: { type: "number" },
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "date" },
                        BookDeliveredDate: { type: "date" },
                        BookPrice: { type: "number" },
                        BookAmount: { type: "number" },
                        BookTotal: { type: "number" }
                    }
                }
            },
            pageSize: 20,
        },
        height: 550,
        groupable: true,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [{
            command: "刪除"
        },{
            field: "BookId",
            title: "書籍編號"
        }, {
            field: "BookName",
            title: "書籍名稱"
        }, {
            field: "BookCategory",
            title: "書籍種類"
        }, {
            field: "BookAuthor",
            title: "作者"
        }, {
            field: "BookBoughtDate",
            title: "購買日期"
        }, {
            field: "BookDeliveredDate",
            title: "送達狀態"
        }, {
            field: "BookPrice",
            title: "金額"
        }, {
            field: "BookAmount",
            title: "數量"
        }, {
            field: "BookTotal",
            title: "總計"
        }]
    });

});