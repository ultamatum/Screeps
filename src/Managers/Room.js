var Spawner = require('Managers.Spawner')
var RoomManager = {
	/** @param {Room} room **/
	run: function (room)
	{
		//room.memory.SetupComplete = false;
		if (
			!room.memory.SetupComplete &&
			room.controller.owner == 'Ultamatum'
		)
		{
			RoomSetup(room)
		}

		RespawnCreeps(room)
	},
}

function RespawnCreeps (room)
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
		energyAvail = Game.rooms[room.name].energyAvailable
	}

	if (miners.length < 4)
	{
		Spawner.SpawnCreep(
			room.name,
			Spawner.CreepJobs.Miner,
			'',
			Spawner.CreepBuilder[Spawner.CreepJobs.Miner](
				energyAvail
			)
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
		}).length
	)
	{
		Spawner.SpawnCreep(
			room.name,
			Spawner.CreepJobs.Hauler,
			'',
			Spawner.CreepBuilder[Spawner.CreepJobs.Hauler](
				energyAvail
			)
		)
	}
	else if (upgraders.length < 2)
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
	else if (repairers.length < 1)
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
	else if (builders.length < 2)
	{
		Spawner.SpawnCreep(
			room.name,
			Spawner.CreepJobs.Builder,
			'',
			Spawner.CreepBuilder[Spawner.CreepJobs.Builder](
				energyAvail
			)
		)
	}
}

function RoomSetup (room)
{
	var sources = room.find(FIND_SOURCES)
	var spawns = room.find(FIND_MY_SPAWNS)

	for (var source in sources)
	{
		var path = room.findPath(
			spawns[0].pos,
			sources[source].pos,
			{
				ignoreCreeps: true,
				swampCost: 1,
			}
		)

		for (var step in path)
		{
			var canBuild = true
			room.lookAt(path[step].x, path[step].y).forEach(
				function (object)
				{
					if (
						object.type ==
						LOOK_CONSTRUCTION_SITES ||
						object.type == LOOK_DEPOSITS ||
						object.type == LOOK_STRUCTURES ||
						object.type == LOOK_MINERALS ||
						object.type == LOOK_DEPOSITS ||
						object.type == LOOK_SOURCES
					)
						canBuild = false
				}
			)

			if (canBuild)
				room.createConstructionSite(
					path[step].x,
					path[step].y,
					STRUCTURE_ROAD
				)
		}
	}

	var path = room.findPath(
		spawns[0].pos,
		room.controller.pos,
		{
			ignoreCreeps: true,
			swampCost: 1,
		}
	)

	for (var step in path)
	{
		console.log('step')
		var canBuild = true
		room.lookAt(path[step].x, path[step].y).forEach(
			function (object)
			{
				if (
					object.type ==
					LOOK_CONSTRUCTION_SITES ||
					object.type == LOOK_DEPOSITS ||
					object.type == LOOK_STRUCTURES ||
					object.type == LOOK_MINERALS ||
					object.type == LOOK_DEPOSITS ||
					object.type == LOOK_SOURCES
				)
					canBuild = false
			}
		)

		if (canBuild)
			room.createConstructionSite(
				path[step].x,
				path[step].y,
				STRUCTURE_ROAD
			)
	}

	room.memory.SetupComplete = true
}

module.exports = RoomManager
