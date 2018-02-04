const first = ['Mobile', 'Awesome','Mysterious', 'Tremendous', 'Creative', 'Agile','Supreme', 'Incredible', 'Wired', 'Screened', 'Interesting'];
const second =['Blue', 'Black', 'Pink', 'Green', 'Purple', 'Red', 'Lavander', 'Taupe', 'Silver', 'Gold', 'Bronze', 'Blue', 'Indigo'];
const third = ['Owl', 'Lion', 'Tiger', 'Wolf', 'Deer', 'Bear', 'Dolphin', 'Eagle', 'Shark', 'Moth', 'Panther', 'Fish'];
const roomsSoFar = new Set();
module.exports =  generateRoomName = () => {
    let roomName
    do {
        roomName = `${getRandom(first)}${getRandom(second)}${getRandom(third)}`;
    }  while (roomsSoFar.has(roomName)) 

    roomsSoFar.add(roomName)

    return roomName
}
const getRandom = arr => {
    const randomIdx = Math.floor(Math.random()*arr.length)
    //console.log("randomIdx", randomIdx)
    return arr[randomIdx];
}
