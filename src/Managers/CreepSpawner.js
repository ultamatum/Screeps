var GetSpawns = require('Helpers.SpawnHelpers');

const SpawnCreep = (room, creepJob, body) =>
{
	// Check params
	if (body.length === 0)
		return ERR_NO_BODYPART;

	// Select Spawn
	let spawn = GetSpawns(room).find(s => !s.spawning);

	if (!spawn)
		return ERR_BUSY; // All spawns are currently busy

	let out = spawn.spawnCreep(body, `${creepJob}-${room}-${Game.time % 10000}`,
	{
		memory:
		{
			role: creepJob,
			home: room
		}
	});

	return out;
}

module.exports = SpawnCreep;
