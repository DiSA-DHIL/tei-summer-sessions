document.querySelectorAll("a[href]").forEach((link) => {
  link.setAttribute("target", "_blank");
});
// document.querySelectorAll("time[datetime]").forEach((el) => {
//   const date = new Date(`${el.dateTime}T12:00:00`);
//   const formatted = date.toLocaleString("en-US", {
//     month: "short",
//     day: "2-digit",
//     year: "numeric",
//   });
//   el.innerText = formatted;
// });
// const firstDetails = document.querySelector("details");
// if (firstDetails) {
//   firstDetails.open = true;
// }
