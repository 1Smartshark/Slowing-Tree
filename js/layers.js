addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 12)) mult = mult.times(2)
        if (hasUpgrade('p', 13)) mult = mult.times(10)
        if (hasUpgrade('r', 12)) mult = mult.times(100)
        cap = new Decimal(1e9)
        if (hasUpgrade('r', 22)) cap = cap.times(1e10)
        if (hasUpgrade('r', 23)) cap = cap.times(1e10)
        if (hasMilestone('d1', 0)) cap = cap.times(0)
        if (player.p.points.gte(cap)) mult = mult.times(0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade('p', 31)) exp = exp.times(1.75)
        if (hasUpgrade('r', 31)) exp = exp.times(1.5)
        if (hasUpgrade('r', 32)) exp = exp.times(3)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer) && !hasMilestone("d1", 0)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Boost",
            description: "Points are boosted by prestige.",
            cost: new Decimal(1),
            unlocked() { return !hasUpgrade("p", 19) },
            effect() {
                return player[this.layer].points.add(1).pow(0.7)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect     
        },
        12: {
            title: "The",
            description: "Double prestige points.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("p", 11) },
        },
        13: {
            title: "Stats",
            description: "x10 prestige points",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade("p", 12) },
        },
        21: {
            title: "Unlock",
            description: "x10 points",
            cost: new Decimal(25),
            unlocked() { return hasUpgrade("p", 13) },
        },
        22: {
            title: "The",
            description: "x10 points again",
            cost: new Decimal(200),
            unlocked() { return hasUpgrade("p", 21) },
        },
        23: {
            title: "Layer.",
            description: "Unlock a new layer.",
            cost: new Decimal(1e3),
            unlocked() { return hasUpgrade("p", 22) },
        },
        31: {
            title: "^ Bonus!",
            description: "^1.75 prestige points.",
            cost: new Decimal(1e4),
            unlocked() { return hasUpgrade("p", 23) },
        },
    },
    layerShown(){return !player.p1.unlocked}
})

addLayer("r", {
    name: "rebirth", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#1D99FE",
    branches:["p"],
    requires: new Decimal(1e9), // Can be a function that takes requirement increases into account
    resource: "rebirth points", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('r', 13)) mult = mult.times(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for rebirth points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Boost",
            description: "x100 Points.",
            cost: new Decimal(1),
            unlocked() { return !hasUpgrade("p", 19) },   
        },
        12: {
            title: "The",
            description: "x100 Prestige.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("r", 11) },
        },
        13: {
            title: "Stats",
            description: "x2 Rebirth",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade("r", 12) },
        },
        21: {
            title: "Lower",
            description: "Point hardcap is x1e10",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade("r", 32) },
        },
        22: {
            title: "The",
            description: "Prestige hardcap is x1e10",
            cost: new Decimal(5e3),
            unlocked() { return hasUpgrade("r", 21) },
        },
        23: {
            title: "Softcaps",
            description: "Point and Prestige hardcap is x1e10",
            cost: new Decimal(1e5),
            unlocked() { return hasUpgrade("r", 22) },
        },
        31: {
            title: "Unlock",
            description: "^1.5 Prestige",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade("r", 13) },
        },
        32: {
            title: "The",
            description: "^3 Prestige",
            cost: new Decimal(200),
            unlocked() { return hasUpgrade("r", 31) },
        },
        33: {
            title: "Layer",
            description: "Unlock a new layer",
            cost: new Decimal(1e11),
            unlocked() { return hasUpgrade("r", 23) },
        },
    },
    layerShown(){return hasUpgrade("p", 23) && !player.p1.unlocked || player.r.unlocked && !player.p1.unlocked }
})

addLayer("sr", {
    name: "super rebirth", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Sr", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#1D99FE",
    branches:["r"],
    requires: new Decimal(1e9), // Can be a function that takes requirement increases into account
    resource: "super rebirth points", // Name of prestige currency
    baseResource: "rebirth points", // Name of resource prestige is based on
    baseAmount() {return player.r.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for rebirth points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        let keep = [];
        keep.push("points")
        keep.push("upgrades")
        keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset("c", keep)
    },
    upgrades: {
        11: {
            title: "Boost",
            description: "x100 Points, Prestige, and Rebirth",
            cost: new Decimal(1),
            unlocked() { return true },   
        },
    },
    layerShown(){return !player.sr.unlocked && hasUpgrade("r", 33) }
})

addLayer("d1", {
    name: "downgrade", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D-1", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    branches:["r"],
    color: "#FF0000",
    requires: new Decimal(1e12), // Can be a function that takes requirement increases into account
    resource: "downgrade", // Name of prestige currency
    baseResource: "rebirth points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 33333, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 10, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for downgrade", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones: {
        0: {
            requirementDescription: "Downgrade 1",
            effectDescription: "Mess up reality, for the first time. You will have to visit D-2 for the next. Leave everything behind, and unlock a new layer.",
            done() { return player.d1.points.gte(1) },
            unlocked() { return true },   
        },
    },
    layerShown(){return player.sr.unlocked }
})

addLayer("p1", {
    name: "prestige?", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P?", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    branches:["d1"],
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points?", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p1', 13)) mult = mult.times(2)
        cap = new Decimal(1e9)
        if (player.p1.points.gte(cap)) mult = mult.times(0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade('p', 31)) exp = exp.times(1.75)
        if (hasUpgrade('r', 31)) exp = exp.times(1.5)
        if (hasUpgrade('r', 32)) exp = exp.times(3)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer) && !hasMilestone("d1", 0)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "B00s7",
            description: "P01n7s ar3 b00s734 by pr3s71g3.",
            cost: new Decimal(1),
            unlocked() { return !hasUpgrade("p", 19) },
            effect() {
                return player[this.layer].points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect     
        },
        12: {
            title: "7h3",
            description: "40ub13 p01n7s ga1n.",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("p1", 11) },    
        },
        13: {
            title: "S7a7s",
            description: "40ub13 pr3s71g3? ga1n.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("p1", 12) },    
        },
        21: {
            title: "An4",
            description: "Ha1v3 10x p01n7s 43cr3as3 a7 1K p01n7s. A1s0 x5 p01n7s b3f0r3 1K.",
            cost: new Decimal(7),
            unlocked() { return hasUpgrade("p1", 13) },    
        },
        31: {
            title: "Un10ck",
            description: "40ub13 An4's 3ff3c7.",
            cost: new Decimal(15),
            unlocked() { return hasUpgrade("p1", 21) },    
        },
        32: {
            title: "A",
            description: "40ub13 An4's 3ff3c7... aga1n!",
            cost: new Decimal(40),
            unlocked() { return hasUpgrade("p1", 31) },    
        },
        33: {
            title: "N3w",
            description: "x1.25 An4's 3ff3ct, r37urn1ng 17 70 n0rma1! A1s0 x30 p01n7s b3f0r3 1K.",
            cost: new Decimal(60),
            unlocked() { return hasUpgrade("p1", 32) },    
        },
        34: {
            title: "1ay3r",
            description: "R3a4 7h1r7y-0n3 to 7h1r7y-f0ur aga1n X4. x1000 p01n7s!",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("p1", 33) },    
        },
    },
    layerShown(){return hasMilestone('d1', 0) && !hasMilestone('d2', 0)}
})

addLayer("d2", {
    name: "40wngra43", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D-2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    branches:["p1","d1"],
    color: "#FF0000",
    requires: new Decimal(100e3), // Can be a function that takes requirement increases into account
    resource: "downgrade", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base: "1e3099",
    exponent: 999999, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 10, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for downgrade", onPress(){if (canReset(this.layer) && !hasMilestone("d1", 0)) doReset(this.layer)}},
    ],
    milestones: {
        0: {
            requirementDescription: "Downgrade 2",
            effectDescription: "Alter the timeline again, however text is more stable.",
            done() { return player.d2.points.gte(1) },
            unlocked() { return true },   
        },
    },
    layerShown(){return hasUpgrade("p1", 34) || player.d2.unlocked }
})

addLayer("p2", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    branches:["d2"],
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p2', 13)) mult = mult.times(2)
        if (hasUpgrade('p2', 32)) mult = mult.times(3)
        if (hasUpgrade('r2', 13)) mult = mult.times(10)
        if (hasUpgrade('r2', 32)) mult = mult.times(10)
        cap = new Decimal(1000)
        if (hasUpgrade('r2', 21)) cap = cap.times(5)
        if (hasUpgrade('r2', 31)) cap = cap.times(2)
        if (hasUpgrade('r2', 32)) cap = cap.times(10)
        if (hasUpgrade('r2', 33)) cap = cap.times(10)
        if (hasUpgrade('r2', 34)) cap = cap.times(10)
        if (player.p2.points.gte(cap)) mult = mult.times(0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade('p', 31)) exp = exp.times(1.75)
        if (hasUpgrade('r', 31)) exp = exp.times(1.5)
        if (hasUpgrade('r', 32)) exp = exp.times(3)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer) && !hasMilestone("d2", 1)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Boost",
            description: "Points are slightly boosted by prestige.",
            cost: new Decimal(1),
            unlocked() { return !hasUpgrade("p", 19) },
            effect() {
                return player[this.layer].points.add(1).pow(0.05)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect     
        },
        12: {
            title: "The",
            description: "1.5x points gain.",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("p2", 11) },    
        },
        13: {
            title: "Stats",
            description: "Double prestige gain.",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("p2", 12) },    
        },
        21: {
            title: "And",
            description: "Increase the hardcap to 40 points.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("p2", 13) },    
        },
        31: {
            title: "Unlock",
            description: "Double points and increase the hardcap to 100 points.",
            cost: new Decimal(4),
            unlocked() { return hasUpgrade("p2", 21) },    
        },
        32: {
            title: "A",
            description: "Triple prestige and the hardcap",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade("p2", 31) },    
        },
        33: {
            title: "New",
            description: "x100 points, but halve the hardcap.",
            cost: new Decimal(25),
            unlocked() { return hasUpgrade("p2", 32) },    
        },
        34: {
            title: "Layer",
            description: "Increase the hardcap to 1,000 points",
            cost: new Decimal(200),
            unlocked() { return hasUpgrade("p2", 33) },    
        },
        41: {
            title: "Hardcap",
            description: "Increase the hardcap to 10,000 points",
            cost: new Decimal(10000),
            unlocked() { return hasUpgrade("p2", 34) && hasUpgrade("r2", 31) },    
        },
    },
    layerShown(){return hasMilestone('d2', 0) && !hasMilestone('d3', 0)}
})

addLayer("r2", {
    name: "rebirth", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#1D99FE",
    requires: new Decimal(1000), // Can be a function that takes requirement increases into account
    branches:["p2"],
    resource: "rebirth points", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p2.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p1', 13)) mult = mult.times(2)
        cap = new Decimal(1e9)
        if (player.p1.points.gte(cap)) mult = mult.times(0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade('p', 31)) exp = exp.times(1.75)
        if (hasUpgrade('r', 31)) exp = exp.times(1.5)
        if (hasUpgrade('r', 32)) exp = exp.times(3)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for rebirth points", onPress(){if (canReset(this.layer) && !hasMilestone("d2", 1)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Boost",
            description: "Prestige is boosted by rebirth.",
            cost: new Decimal(1),
            unlocked() { return !hasUpgrade("p", 19) },
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect     
        },
        12: {
            title: "The",
            description: "5x points gain.",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("r2", 11) },    
        },
        13: {
            title: "Stats",
            description: "10x prestige gain.",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("r2", 12) },    
        },
        21: {
            title: "And",
            description: "Increase the prestige hardcap to 5000 prestige. Double rebirth point gain.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("r2", 13) },    
        },
        31: {
            title: "Unlock",
            description: "Double points and increase the hardcap to 10,000 prestige. Also, unlock a new point upgrade.",
            cost: new Decimal(7),
            unlocked() { return hasUpgrade("r2", 21) },    
        },
        32: {
            title: "A",
            description: "10x prestige and the hardcap",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade("r2", 31) },    
        },
        33: {
            title: "New",
            description: "x100 points and prestige, along with the hardcap.",
            cost: new Decimal(25),
            unlocked() { return hasUpgrade("r2", 32) },    
        },
        34: {
            title: "Layer",
            description: "Increase the hardcap to 10M prestige",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("r2", 33) },    
        },
    },
    layerShown(){return hasUpgrade('p2', 34) && !hasMilestone('d3', 0) || hasUpgrade('r2', 11) && !hasMilestone('d3', 0)}
})

addLayer("d3", {
    name: "downgrade", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D-3", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    branches:["r2","d2"],
    color: "#FF0000",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "downgrade", // Name of prestige currency
    baseResource: "rebirth points", // Name of resource prestige is based on
    baseAmount() {return player.r2.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base: "1e3099",
    exponent: 999999, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 10, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for downgrade", onPress(){if (canReset(this.layer) && !hasMilestone("d1", 0)) doReset(this.layer)}},
    ],
    milestones: {
        0: {
            requirementDescription: "Downgrade 3",
            effectDescription: "timewall simulator",
            done() { return player.d3.points.gte(1) },
            unlocked() { return true },   
        },
    },
    layerShown(){return hasUpgrade("p1", 34) && !player.d3.unlocked || player.d2.unlocked && !player.d3.unlocked }
})

addLayer("p3", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    branches:["d3"],
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        cap = new Decimal(1e6)
        if (player.p2.points.gte(cap)) mult = mult.times(0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade('p', 31)) exp = exp.times(1.75)
        if (hasUpgrade('r', 31)) exp = exp.times(1.5)
        if (hasUpgrade('r', 32)) exp = exp.times(3)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer) && !hasMilestone("d2", 1)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Endgame",
            description: "obtains endgame",
            cost: new Decimal(1000010),
            unlocked() { return true },
        },
    },
    layerShown(){return hasMilestone('d3', 0)}
})
