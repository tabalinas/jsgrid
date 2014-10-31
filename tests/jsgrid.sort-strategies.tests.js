$(function() {

    var sortStrategies = jsGrid.sortStrategies;


    module("sortStrategies");

    test("String sorting", function() {
        var data = ["c", "a", "d", "b"];

        data.sort(sortStrategies["String"]);

        deepEqual(data, ["a", "b", "c", "d"]);
    });

    test("Number sorting", function() {
        var data = [5, 3.2, 1e2, 4];

        data.sort(sortStrategies["Number"]);

        deepEqual(data, [3.2, 4, 5, 100]);
    });

    test("Date sorting", function() {
        var date1 = new Date(2010, 0, 1),
            date2 = new Date(2011, 0, 1),
            date3 = new Date(2012, 0, 1);

        var data = [date2, date3, date1];

        data.sort(sortStrategies["Date"]);

        deepEqual(data, [date1, date2, date3]);
    });

    test("NumberAsString sorting", function() {
        var data = [".1", "2.1", "4e5", "2"];

        data.sort(sortStrategies["NumberAsString"]);

        deepEqual(data, [".1", "2", "2.1", "4e5"]);
    });
});
