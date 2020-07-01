import biblia from "./index";

let bible = new biblia("61824f68b909f9567b206c3a9535b3d1", 'LEB');

// bible.getPassage("john 3:16")
//     .then(res =>{
//         console.log(res);
//     })
//
// bible.search("bread", {
//     passages: "Matthew",
//     mode: "verse",
//
// })
// .then(res =>{
//     console.log(res)
// })
//
//
// bible.getBibleNames()
//     .then(res => {
//         console.log(res)
//     }).catch(err =>{
//     console.log(err)
// })
//
// bible.getBibles({
//     query: "a",
// }).then(res => {
//         console.log(res)
//     }).catch(err =>{
//     console.log(err)
// })
//
// bible.getBibles({
//     limit: 2
// }).then(res => {
//     console.log(res);
// })
//
// bible.parseText("2 kgs 3-4")
// .then(res => console.log(res));
//
// bible.compare("Ge 3:4", "Ge 3:1-10")
// .then(res => console.log(res))
// .catch(err => console.log(err));
//

bible.getPassage("John 3:16-20", {
    html: true,
    style: "fullyFormattedWithFootnotes"
}).then(res =>{
    console.log(res)
})