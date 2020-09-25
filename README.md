# biblia-Interface
biblia-interface is an npm package written in TypeScript to help with easier interactions with the [bibliaapi](https://bibliaapi.com/docs/). It contains nearly full documentation for autocomplete and ease of use.
*This FOSS package is not affiliated with the FaithLife corporation, but is meant to help with ease of use for their api*

### Installation
    npm install biblia-interface
### Getting Started

    let  { Biblia } = require('./index.js');
    
    //Takes an optional second parameter of a specific bible version, defaults to "asv"
    let bible = new Biblia("", "byz");
    
### Usage
Nearly every method takes an optional second object parameter with different formatting options offered by bibliaapi.
### Getting a Passage (options)
        bible.getPassage("Matthew 2:1-20")
    		.then(res =>{
            	console.log(res.text)
        })
### Getting a List and Description of Bibles (options)
    //Returns an array of bibles with their information
    bible.getBibles()
        .then(res => {
            console.log(res.bibles[0].title) // "1890 Darby Bible"
        })
### Getting an Updated list of Bible Names
This queries for all the bible names

    bible.getBibleNames()
        .then(res => {
            console.log(res[0]) //darby
        })
### Scanning Text for Verses (options)
    bible.scanText("I like Genesis 1:1 and Revelation 22:21 is cool!")
        .then(res => {
            console.log(res.results[1].passage) //"Revelation 22:21"
        })
### Parsing Bible Verses (options)
    bible.parseText("II Kgs 1:1-2, 3-5")
        .then(res => {
            console.log(res.passages[1].passage) // "2 Kings 1:3–5"
        })
### Searching for text (options)
    
    bible.search("Abraham", {limit: 5}) //The limit option only returns the first 5 results
        .then(res => {
            console.log(res.results[0].title) //"Genesis 22:1"
        })
### Compare Verses
    bible.compare("Genesis 3:1", "Genesis 3:4")
        .then(res => {
            console.log(res.equal); //false
        })
### Change the Bible version
`bible.setBible("Bible_Version")`

For more information on these services, visit the [bibliaapi docs](https://bibliaapi.com/docs/). If you find a bug or an improvement don't hesitate to send a pull request!
