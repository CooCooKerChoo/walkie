$("#page_details").on("pagecontainerbeforeshow", function()
{
    // use your DB data
    var data = db[clicked_route];
    $("#distance").html(data.distance);
    $("#duration").html(data.duration);
    // ...
});