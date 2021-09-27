var RoomManager = {
    /** @param {Room} room **/
    run: function (room)
    {
        if (!room.memory.SetupComplete)
        {
            RoomSetup(room);
        }
    }
}

function RoomSetup(room)
{
    var sources = room.find(FIND_SOURCES);
    var spawns = room.find(FIND_MY_SPAWNS);
    //const costs = new PathFinder.CostMatrix;
    let structures = [].concat(room.find(FIND_SOURCES), room.find(FIND_DEPOSITS), room.find(FIND_MY_SPAWNS));

    for (var source in sources)
    {
        var path = room.findPath(spawns[0].pos, sources[source].pos,
            {
                ignoreCreeps: true,
                swampCost: 1,
            });

        for (var step in path)
        {
            room.createConstructionSite(path[step].x, path[step].y, STRUCTURE_ROAD);
        }
    }

    room.memory.SetupComplete = true;
}

module.exports = RoomManager;
