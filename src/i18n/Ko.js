(function(jsGrid) {

    jsGrid.locales.ko = {
        grid: {
            noDataContent: "데이터가 없습니다.",
            deleteConfirm: "데이터를 삭제 하겠습니까?",
            pagerFormat: "페이지 : {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} / {pageCount}",
            pagePrevText: "<",
            pageNextText: ">",
            pageFirstText: "<<",
            pageLastText: ">>",
            loadMessage: "잠시 기다려주세요...",
            invalidMessage: "잘못된 데이터가 입력 되었습니다."
        },

        loadIndicator: {
            message: "처리중..."
        },

        fields: {
            control: {
                searchModeButtonTooltip: "검색 모드",
                insertModeButtonTooltip: "등록 모드",
                editButtonTooltip: "수정",
                deleteButtonTooltip: "삭제",
                searchButtonTooltip: "검색",
                clearFilterButtonTooltip: "초기화",
                insertButtonTooltip: "등록",
                updateButtonTooltip: "업데이트",
                cancelEditButtonTooltip: "변경 취소"
            }
        },

        validators: {
            required: { message: "필수 입력" },
            rangeLength: { message: "입력된 값의 길이가 범위를 벗어났습니다." },
            minLength: { message: "입력된 값이 지정된 길이보다 짧습니다." },
            maxLength: { message: "입력된 값의 지정된 길이보다 깁니다." },
            pattern: { message: "입력된 값이 지정된 패턴과 일치하지 않습니다." },
            range: { message: "입력된 값이 범위를 벗어났습니다." },
            min: { message: "입력된 값이 지정된 범위보다 작습니다." },
            max: { message: "입력된 값이 지정된 범위보다 큽니다." }
        }
    };

}(jsGrid, jQuery));
