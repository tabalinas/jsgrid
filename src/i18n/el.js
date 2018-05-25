(function(jsGrid) {

    jsGrid.locales.el = {
        grid: {
            noDataContent: "Δεν βρέθηκαν δεδομένα",
            deleteConfirm: "Θέλετε σίγουρα να κάνετε οριστική διαγραφή των δεδομένων;",
            pagerFormat: "Σελίδες: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} από {pageCount}",
            pagePrevText: "<",
            pageNextText: ">",
            pageFirstText: "<<",
            pageLastText: ">>",
            loadMessage: "Παρακαλώ περιμένετε...",
            invalidMessage: "Η τιμή που δώσατε δεν είναι έγκυρη!"
        },

        loadIndicator: {
            message: "Φόρτωση..."
        },

        fields: {
            control: {
                searchModeButtonTooltip: "Αναζήτηση",
                insertModeButtonTooltip: "Εισάγετε φίλτρο",
                editButtonTooltip: "Επεξεργασία",
                deleteButtonTooltip: "Διαγραφή",
                searchButtonTooltip: "Εύρεση",
                clearFilterButtonTooltip: "Αφαίρεση φίλτρου",
                insertButtonTooltip: "Εισαγωγή",
                updateButtonTooltip: "Αποθήκευση",
                cancelEditButtonTooltip: "Ακύρωση"
            }
        },

        validators: {
            required: { message: "Είναι υποχρεωτικό πεδίο" },
            rangeLength: { message: "Το πλήθος των χαρακτήρων είναι εκτός των αποδεκτών ορίων" },
            minLength: { message: "Το πλήθος των χαρακτήρων είναι μικρότερο το ορίου" },
            maxLength: { message: "Το πλήθος των χαρακτήρων ξεπερνάει το όριο" },
            pattern: { message: "Η τιμή που δώσατε δεν είναι έγκυρη" },
            range: { message: "Η τιμή που δώσατε είναι εκτός των αποδεκτών ορίων" },
            min: { message: "Η τιμή που δώσατε είναι πολύ μικρή" },
            max: { message: "Η τιμή που δώσατε είναι πολύ μεγάλη" }
        }
    };

}(jsGrid, jQuery));
