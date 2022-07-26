require('version')
var RoomManager = require('Managers.Room')
var roleMiner = require('Roles.Miner')
var roleUpgrader = require('Roles.Upgrader')
var roleBuilder = require('Roles.Builder')
var roleRepairer = require('Roles.Repairer')
var roleHauler = require('Roles.Hauler')
var towerController = require('Controllers.Tower')

if (
	!Memory.SCRIPT_VERSION ||
	Memory.SCRIPT_VERSION != SCRIPT_VERSION
)
{
	Memory.SCRIPT_VERSION = SCRIPT_VERSION
	console.log('New code updated')
}

module.exports.loop = function ()
{
	if (Game.cpu.bucket == 10000)
	{
		console.log('Generated Pixel')
		Game.cpu.generatePixel()
	}

	GarbageCollection()
	UpdateRooms()
	UpdateCreeps()
}

function UpdateRooms ()
{
	for (var roomName in Game.rooms)
	{
		RoomManager.run(Game.rooms[roomName])

		var towers = Game.rooms[roomName].find(
			FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (
						structure.structureType ==
						STRUCTURE_TOWER &&
						structure.store[RESOURCE_ENERGY] > 0
					)
				},
			}
		)
		//Loop through towers in the room)
		for (var tower in towers)
		{
			towerController.run(
				towers[tower],
				Game.rooms[roomName]
			)
		}
	}
}

function UpdateCreeps ()
{
	for (var name in Game.creeps)
	{
		var creep = Game.creeps[name]
		if (creep.memory.role == 'Miner')
		{
			roleMiner.run(creep)
		}

		if (creep.memory.role == 'Upgrader')
		{
			roleUpgrader.run(creep)
		}

		if (creep.memory.role == 'Builder')
		{
			roleBuilder.run(creep)
		}

		if (creep.memory.role == 'Repairer')
		{
			roleRepairer.run(creep)
		}

		if (creep.memory.role == 'Hauler')
		{
			roleHauler.run(creep)
		}
	}
}

function GarbageCollection ()
{
	for (var name in Memory.creeps)
	{
		if (!Game.creeps[name])
		{
			delete Memory.creeps[name]
			console.log(
				'Clearing non-existing creep memory:',
				name
			)
		}
	}
}
