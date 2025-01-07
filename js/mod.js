let modInfo = {
	name: "Extremely Random Tree",
	author: "Onesmartshark",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.0.0",
	name: "Finisher",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.0.0</h3><br>
		- Finished the game.<br>
		- this took like 20 mins to make lol.
	<h3>v0.0.1</h3><br>
		- Added prestige.<br>
		- Note: versions are sorted by how major the upd is.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
	return new Decimal(0)
	let gain = new Decimal(1)
	if (hasUpgrade('p', 11)) gain = gain.times(upgradeEffect('p', 11))
	if (hasUpgrade('p', 21)) gain = gain.times(10)
	if (hasUpgrade('p', 22)) gain = gain.times(10)
	if (hasUpgrade('r', 11)) gain = gain.times(100)
	cap = new Decimal(1e9)
	if (hasMilestone('d2', 0)) cap = cap.div(1e8)
	if (hasUpgrade('r', 21)) cap = cap.times(1e10)
	if (hasUpgrade('r', 23)) cap = cap.times(1e10)
	if (hasUpgrade('p2', 21)) cap = cap.times(4)
	if (hasUpgrade('p2', 31)) cap = cap.times(2.5)
	if (hasUpgrade('p2', 32)) cap = cap.times(3)
	if (hasUpgrade('p2', 33)) cap = cap.div(2)
	if (hasUpgrade('p2', 34)) cap = cap.div(3)
	if (hasUpgrade('p2', 34)) cap = cap.times(2)
	if (hasUpgrade('p2', 34)) cap = cap.times(10)
	if (hasUpgrade('p2', 41)) cap = cap.times(10)
	if (hasMilestone('d3', 0)) cap = new Decimal(1000000)
	if (player.points.gte(cap)) gain = gain.times(0)
	if (player.points.gte(1e3) && hasMilestone('d1', 0)) gain = gain.times(0.1)
	if (player.points.gte(1e6) && hasMilestone('d1', 0)) gain = gain.times(0.1)
	if (player.points.gte(1e9) && hasMilestone('d1', 0)) gain = gain.times(0.1)
	if (hasUpgrade('p1', 11)) gain = gain.times(upgradeEffect('p1', 11))
	if (hasUpgrade('p1', 12)) gain = gain.times(2)
	if (hasUpgrade('p1', 21) && player.points.lt(1e3)) gain = gain.times(5)
	if (hasUpgrade('p1', 22) && player.points.lt(1e3)) gain = gain.times(5)
	if (hasUpgrade('p1', 31) && player.points.lt(1e3)) gain = gain.times(5)
	if (hasUpgrade('p1', 32) && player.points.lt(1e3)) gain = gain.times(30)
	if (hasUpgrade('p1', 33)) gain = gain.times(1000)
	if (hasUpgrade('p1', 21) && player.points.gte(1e3)) gain = gain.times(2)
	if (hasUpgrade('p1', 31) && player.points.gte(1e3)) gain = gain.times(2)
	if (hasUpgrade('p1', 32) && player.points.gte(1e3)) gain = gain.times(2)
	if (hasUpgrade('p1', 33) && player.points.gte(1e3)) gain = gain.times(1.25)
	if (hasUpgrade('p2', 11)) gain = gain.times(upgradeEffect('p1', 11))
	if (hasUpgrade('p2', 12)) gain = gain.times(1.5)
	if (hasUpgrade('p2', 31)) gain = gain.times(2)
	if (hasUpgrade('p2', 33)) gain = gain.times(100)
	if (hasUpgrade('r2', 11)) gain = gain.times(5)
	if (hasUpgrade('r2', 31)) gain = gain.times(2)
	if (hasUpgrade('r2', 33)) gain = gain.times(100)
	if (hasUpgrade('p3', 11)) gain = gain.times("eee7")
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("ee7"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600000) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}