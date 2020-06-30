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
// bible.getBibleNames()
//     .then(res => {
//         console.log(res)
//     }).catch(err =>{
//     console.log(err)
// })

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
// })
bible.parseText("2 kgs 3-4")
.then(res => console.log(res));