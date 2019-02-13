document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
  },
  false
);

$(".new-field").hide();

$(".add-field").click(function() {
  $(".new-field").toggle();
});
