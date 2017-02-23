(function(jsGrid) {

    jsGrid.locales.it = {
        grid: {
            noDataContent: "Nessun risultato",
            deleteConfirm: "Sei sicuro ?",
            pagerFormat: "Pagine: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} di {pageCount}",
            pagePrevText: "<",
            pageNextText: ">",
            pageFirstText: "<<",
            pageLastText: ">>",
            loadMessage: "Attendere prego ...",
            invalidMessage: "Dati non validi!"
        },

        loadIndicator: {
            message: "Caricamento in corso..."
        },

        fields: {
            control: {
                searchModeButtonTooltip: "Modallità ricerca",
                insertModeButtonTooltip: "Modalità inserimento",
                editButtonTooltip: "Modifica",
                deleteButtonTooltip: "Cancella",
                searchButtonTooltip: "Cerca",
                clearFilterButtonTooltip: "Cancella filtri",
                insertButtonTooltip: "Inserisci",
                updateButtonTooltip: "Aggiorna",
                cancelEditButtonTooltip: "Annulla"
            }
        },

        validators: {
            required: { message: "Campo richiesto" },
            rangeLength: { message: "La dimensione del valore del campo è fuori dell'intervallo definito" },
            minLength: { message: "Il valore del campo è troppo breve" },
            maxLength: { message: "Il valore del campo è troppo lungo" },
            pattern: { message: "Il valore del campo non corrisponde alla configurazione definita" },
            range: { message: "Il valore del campo è al di fuori dell'intervallo definito" },
            min: { message: "Il valore del campo è troppo piccolo" },
            max: { message: "Il valore del campo è troppo grande" }
        }
    };

}(jsGrid, jQuery));

