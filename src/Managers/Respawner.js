var Spawner = require('Managers.Spawner')

var Respawner = {
	run: function (room)
	{
		var miners = _.filter(
			Game.creeps,
			(creep) => creep.memory.role == 'Miner'
		)
		var upgraders = _.filter(
			Game.creeps,
			(creep) => creep.memory.role == 'Upgrader'
		)
		var builders = _.filter(
			Game.creeps,
			(creep) => creep.memory.role == 'Builder'
		)
		var repairers = _.filter(
			Game.creeps,
			(creep) => creep.memory.role == 'Repairer'
		)
		var haulers = _.filter(
			Game.creeps,
			(creep) => creep.memory.role == 'Hauler'
		)

		var energyAvail =
			Game.rooms[room.name].energyCapacityAvailable

		if (miners.length == 0 || haulers.length == 0)
		{
			energyAvail =
				Game.rooms[room.name].energyAvailable
		}

		if (miners.length < 4)
		{
			Spawner.SpawnCreep(
				room.name,
				Spawner.CreepJobs.Miner,
				'',
				Spawner.CreepBuilder[
					Spawner.CreepJobs.Miner
				](energyAvail)
			)
		}
		else if (
			haulers.length <
			room.find(FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (
						structure.structureType ==
						STRUCTURE_CONTAINER
					)
				},
			}).length +
			2
		)
		{
			Spawner.SpawnCreep(
				room.name,
				Spawner.CreepJobs.Hauler,
				'',
				Spawner.CreepBuilder[
					Spawner.CreepJobs.Hauler
				](energyAvail)
			)
		}
		else if (upgraders.length < 4)
		{
			Spawner.SpawnCreep(
				room.name,
				Spawner.CreepJobs.Upgrader,
				'',
				Spawner.CreepBuilder[
					Spawner.CreepJobs.Upgrader
				](energyAvail)
			)
		}
		else if (
			builders.length <
			(room.find(FIND_MY_STRUCTURES,
				{
					filter:
					{
						structureType: STRUCTURE_CONTAINER,
					},
				}).length >= 2 ?
				4 :
				room.find(FIND_CONSTRUCTION_SITES)
				.length /
				25 +
				2)
		)
		{
			Spawner.SpawnCreep(
				room.name,
				Spawner.CreepJobs.Builder,
				'',
				Spawner.CreepBuilder[
					Spawner.CreepJobs.Builder
				](energyAvail)
			)
		}
		else if (
			repairers.length <
			room.find(FIND_STRUCTURES,
			{
				filter: (object) =>
					object.hits < object.hitsMax,
			}).length /
			30 +
			2
		)
		{
			Spawner.SpawnCreep(
				room.name,
				Spawner.CreepJobs.Repairer,
				'',
				Spawner.CreepBuilder[
					Spawner.CreepJobs.Repairer
				](energyAvail)
			)
		}
	},
}

module.exports = Respawner
