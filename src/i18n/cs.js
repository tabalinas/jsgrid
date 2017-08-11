(function(jsGrid) {

    jsGrid.locales.cs = {
        grid: {
            noDataContent: "Nenalezena žádná data",
            deleteConfirm: "Opravdu chcete smazat data?",
            pagerFormat: "Stránky: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} z {pageCount}",
            pagePrevText: "<",
            pageNextText: ">",
            pageFirstText: "<<",
            pageLastText: ">>",
            loadMessage: "Čekejte prosím ...",
            invalidMessage: "Vložili jste neplatná data!"
        },

        loadIndicator: {
            message: "Nahrávám..."
        },

        fields: {
            control: {
                searchModeButtonTooltip: "Přepnout na hledání",
                insertModeButtonTooltip: "Přepnout na vlkádání",
                editButtonTooltip: "Upravit",
                deleteButtonTooltip: "Smazat",
                searchButtonTooltip: "Hledat",
                clearFilterButtonTooltip: "Smazat filtr",
                insertButtonTooltip: "Vložit",
                updateButtonTooltip: "Upravit",
                cancelEditButtonTooltip: "Zrušit editaci"
            }
        },

        validators: {
            required: { message: "Povinné pole" },
            rangeLength: { message: "Délka hodnoty je vetší než je definováno" },
            minLength: { message: "Hodnota je příliš krátká" },
            maxLength: { message: "Hodnota je příliš dlouhá" },
            pattern: { message: "Hodnota neodpovídá nadefinovanému vzoru" },
            range: { message: "Hodnota je mimo rozsah" },
            min: { message: "Hodnota je příliš malá" },
            max: { message: "Hodnota je příliš vysoká" }
        }
    };

}(jsGrid, jQuery));
