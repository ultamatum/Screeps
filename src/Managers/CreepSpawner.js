var GetSpawns = require('Helpers.SpawnHelpers');

const SpawnCreep = (room, creepJob, target, body) =>
{

	// Check params
	if (body.length === 0)
		return ERR_NO_BODYPART;

	// Select Spawn
	let spawn = GetSpawns(room).find(s => !s.spawning);

	if (!spawn)
		return ERR_BUSY; // All spawns are currently busy

	let name = `${creepJob}-${room}-${Game.time % 10000}`;

	let out = spawn.spawnCreep(body, name,
	{
		memory:
		{
			role: creepJob,
			home: room,
			target: target
		}
	});

	if (out === OK)
		console.log("Spawning: " + name);

	return out;
}

module.exports = SpawnCreep;
