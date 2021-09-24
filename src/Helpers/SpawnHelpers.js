// Returns all spawns in a specified room
export const GetSpawns = (room) =>
{
	return Game.rooms[room].find(FIND_MY_SPAWNS);
}
