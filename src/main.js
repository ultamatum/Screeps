require('version')
var RoomManager = require('Managers.Room');
var roleMiner = require('Roles.Miner');
var roleUpgrader = require('Roles.Upgrader');
var roleBuilder = require('Roles.Builder');
var roleRepairer = require('Roles.Repairer');
var roleHauler = require('Roles.Hauler');


if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION)
{
	Memory.SCRIPT_VERSION = SCRIPT_VERSION
	console.log('New code updated')
}

module.exports.loop = function ()
{
	GarbageCollection();
	UpdateRooms();
	RespawnCreeps();
	UpdateSpawnerText();
	UpdateCreeps();
}

function UpdateRooms ()
{
	for (var roomName in Game.rooms)
	{
		RoomManager.run(Game.rooms[roomName]);
	}
}

function UpdateCreeps ()
{
	for (var name in Game.creeps)
	{
		var creep = Game.creeps[name];
		if (creep.memory.role == 'Miner')
		{
			roleMiner.run(creep);
		}

		if (creep.memory.role == 'Upgrader')
		{
			roleUpgrader.run(creep);
		}

		if (creep.memory.role == 'Builder')
		{
			roleBuilder.run(creep);
		}

		if (creep.memory.role == 'Repairer')
		{
			roleRepairer.run(creep);
		}

		if (creep.memory.role == 'Hauler')
		{
			roleHauler.run(creep);
		}
	}
}

function RespawnCreeps ()
{

}

function UpdateSpawnerText ()
{
	if (Game.spawns['Spawn1'].spawning)
	{
		var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
		Game.spawns['Spawn1'].room.visual.text(
			'🛠️' + spawningCreep.memory.role,
			Game.spawns['Spawn1'].pos.x + 1,
			Game.spawns['Spawn1'].pos.y, { align: 'left', opacity: 0.8 });
	}
}

function GarbageCollection ()
{
	for (var name in Memory.creeps)
	{
		if (!Game.creeps[name])
		{
			delete Memory.creeps[name];
			console.log('Clearing non-existing creep memory:', name);
		}
	}
}
