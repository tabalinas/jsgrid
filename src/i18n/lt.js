(function(jsGrid) {

    jsGrid.locales.lt = {
        grid: {
            noDataContent: "Nėra duomenų",
            deleteConfirm: "Ar tikrai norite pašalinti šį įrašą?",
            pagerFormat: "Puslapiai: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} iš {pageCount}",
            pagePrevText: "<",
            pageNextText: ">",
            pageFirstText: "<<",
            pageLastText: ">>",
            loadMessage: "Prašome palaukti...",
            invalidMessage: "Įvesti klaidingi duomenys!"
        },

        loadIndicator: {
            message: "Kraunasi..."
        },

        fields: {
            control: {
                searchModeButtonTooltip: "Paieška",
                insertModeButtonTooltip: "Naujas įrašas",
                editButtonTooltip: "Pakeisti",
                deleteButtonTooltip: "Pašalinti",
                searchButtonTooltip: "Surasti",
                clearFilterButtonTooltip: "Išvalyti filtrą",
                insertButtonTooltip: "Pridėti",
                updateButtonTooltip: "Išsaugoti",
                cancelEditButtonTooltip: "Atšaukti"
            }
        },

        validators: {
            required: { message: "Šį lauką privaloma užpildyti" },
            rangeLength: { message: "Įvesta reikšmė yra už galimo diapazono ribų" },
            minLength: { message: "Įvesta per daug trumpa reikšmė" },
            maxLength: { message: "Įvesta per daug ilga reikšmė" },
            pattern: { message: "Įvesta reikšmė neatitinka šablono" },
            range: { message: "Įvesta neleidžiamo diapazono reikšmė" },
            min: { message: "Įvesta per daug maža reikšmė" },
            max: { message: "Įvesta per daug didelė reikšmė" }
        }
    };

}(jsGrid, jQuery));

