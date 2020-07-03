/////////////////////////////////
// CODING CHALLENGE 8

/*

Suppose that you're working in a small town administration, and you're in charge of two town elements:
1. Parks
2. Streets

It's a very small town, so right now there are only 3 parks and 4 streets. All parks and streets have a name and a build year.

At an end-of-year meeting, your boss wants a final report with the following:
1. Tree density of each park in the town (forumla: number of trees/park area)
2. Average age of each town's park (forumla: sum of all ages/number of parks)
3. The name of the park that has more than 1000 trees
4. Total and average length of the town's streets
5. Size classification of all streets: tiny/small/normal/big/huge. If the size is unknown, the default is normal

All the report data should be printed to the console.

HINT: Use some of the ES6 features: classes, subclasses, template strings, default parameters, maps, arrow functions, destructuring, etc.

*/

var parks, streets;

class TownElement {
    constructor(name, buildYear) {
        this.name = name;
        this.buildYear = buildYear;
    }
}

class Park extends TownElement {
    constructor(name, buildYear, numberOfTrees, area) {
        super(name, buildYear);
        this.numberOfTrees = numberOfTrees;
        this.area = area;
    }
    getTreeDensity() {
        return this.numberOfTrees / this.area;
    }
}

class Street extends TownElement {
    constructor(name, buildYear, length, size='normal') {
        super(name, buildYear);
        this.length = length;
        this.size = size;
    }
}

parks = [
    new Park('Main Park', 1985, 1001, 200, 'big'),
    new Park('JC\'s Park', 2000, 100, 50),
];

streets = [
    new Street('Main Street', 1985, 300, 'huge'),
    new Street('Apple Street', 2010, 500),
];

console.log(':::::::::::PARKS::::::::::::::::::');
console.log('-----------Tree density-----------');
parks.forEach(p =>console.log(`${p.name} : ${p.getTreeDensity()}`));

console.log('-----------Avg Age----------------');
console.log(parks.map(e => new Date().getFullYear() - e.buildYear).reduce((p, c) => p + c) / parks.length);

console.log('---Parks w/more than 1000 trees---');
parks.filter(p => p.numberOfTrees > 1000).forEach(p => console.log(`${p.name} : ${p.numberOfTrees} trees`));

console.log('--=----Streets & Avg length--------');
streets.forEach(({name, size}) => console.log(`${name} (${size})`));
const totalLength = streets.map(s => s.length).reduce((acum, value) => acum += value);
console.log(`Total length: ${totalLength}`);
console.log(`Avg length: ${totalLength / streets.length}`);