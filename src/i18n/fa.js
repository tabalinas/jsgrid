(function(jsGrid) {

    jsGrid.locales.fa = {
        grid: {
            noDataContent: "پیدا نشد",
            deleteConfirm: "آیا مطمئن هستید؟",
            pagerFormat: "صفحه: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} از {pageCount}",
            pagePrevText: "قبلی",
            pageNextText: "بعدی",
            pageFirstText: "ابتدا",
            pageLastText: "انتها",
            loadMessage: "لطفا  منتظر باشید ...",
            invalidMessage: "اطلاعات نامعتبر است!"
        },

        loadIndicator: {
            message: "در حال بارگذاری ..."
        },

        fields: {
            control: {
                searchModeButtonTooltip: "تغییر به حالت جستجو",
                insertModeButtonTooltip: "تغییر به حالت درج",
                editButtonTooltip: "تغییر به حالت ویرایش",
                deleteButtonTooltip: "حذف",
                searchButtonTooltip: "جستجو",
                clearFilterButtonTooltip: "پاک کردن فیلترها",
                insertButtonTooltip: "درج",
                updateButtonTooltip: "به روز رسانی",
                cancelEditButtonTooltip: "لغو ویرایش"
            }
        },

        validators: {
            required: { message: "فیلد اجباری است" },
            rangeLength: { message: "طول مقدار وارد شده از حداکثر تعریف شده بیشتر است" },
            minLength: { message: "تعداد کاراکتر وارد شده خیلی کم است" },
            maxLength: { message: "تعداد کاراکتر وارد شده خیلی زیاداست" },
            pattern: { message: "مقدار وارد شده با الگوی تعریف شده مطابقت ندارد" },
            range: { message: "مقدار وارد شده خارج از بازه معتبر است" },
            min: { message: "مقدار وارد شده خیلی کوچک است" },
            max: { message: "مقدار وارد شده خیلی بزرگ است" }
        }
    };

}(jsGrid, jQuery));
