// Returns all spawns in a specified room
const GetSpawns = (room) =>
{
	return Game.rooms[room].find(FIND_MY_SPAWNS);
}

module.exports = GetSpawns;
