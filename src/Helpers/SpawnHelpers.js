// Returns all spawns in a specified room
const GetSpawns = (room) =>
{
	var spawns = Game.rooms[room].find(FIND_MY_SPAWNS);
	return spawns;
}

module.exports = GetSpawns;
