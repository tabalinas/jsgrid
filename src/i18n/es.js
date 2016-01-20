(function(jsGrid) {

    jsGrid.locales.es = {
        grid: {
            noDataContent: "No encontrado",
            deleteConfirm: "Esta seguro?",
            pagerFormat: "Paginas: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}",
            pagePrevText: "Anterior",
            pageNextText: "Siguiente",
            pageFirstText: "Primero",
            pageLastText: "Ultimo",
            loadMessage: "Espere, por favor...",
            invalidMessage: "Datos inválidos!"
        },

        loadIndicator: {
            message: "Cargando..."
        },

        fields: {
            control: {
                searchModeButtonTooltip: "Cambia a búsqueda",
                insertModeButtonTooltip: "Cambia a inserción",
                editButtonTooltip: "Editar",
                deleteButtonTooltip: "Suprimir",
                searchButtonTooltip: "Buscar",
                clearFilterButtonTooltip: "Borrar filtro",
                insertButtonTooltip: "Insertar",
                updateButtonTooltip: "Actualizar",
                cancelEditButtonTooltip: "Cancelar edición"
            }
        },

        validators: {
            required: { message: "Campo requerido" },
            rangeLength: { message: "La longitud del valor esta fuera del intervalo definido" },
            minLength: { message: "La longitud del valor esta demasiado largo" },
            maxLength: { message: "La longitud del valor esta demasiado corto" },
            pattern: { message: "Valor no coincide con el patrón definido" },
            range: { message: "Valor fuera del intervalo definido" },
            min: { message: "Valor demasiado alto" },
            max: { message: "Valor demasiado bajo" }
        }
    };

}(jsGrid, jQuery));
