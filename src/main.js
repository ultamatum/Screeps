require('version')
var Spawner = require('Managers.Spawner');
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
	var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'Miner');
	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'Upgrader');
	var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'Builder');
	var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'Repairer');
	var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'Hauler');

	if (miners.length < 5)
	{
		Spawner.SpawnCreep('sim', Spawner.CreepJobs.Miner, "", Spawner.CreepBuilder[Spawner.CreepJobs.Miner](Game.rooms['sim'].energyCapacityAvailable));
	}
	else if (haulers.length < 2)
	{
		Spawner.SpawnCreep('sim', Spawner.CreepJobs.Hauler, "", Spawner.CreepBuilder[Spawner.CreepJobs.Hauler](Game.rooms['sim'].energyCapacityAvailable));
	}
	else if (repairers.length < 1)
	{
		Spawner.SpawnCreep('sim', Spawner.CreepJobs.Repairer, "", Spawner.CreepBuilder[Spawner.CreepJobs.Repairer](Game.rooms['sim'].energyCapacityAvailable));
	}
	else if (upgraders.length < 2)
	{
		Spawner.SpawnCreep('sim', Spawner.CreepJobs.Upgrader, "", Spawner.CreepBuilder[Spawner.CreepJobs.Upgrader](Game.rooms['sim'].energyCapacityAvailable));
	}
	else if (builders.length < 5)
	{
		Spawner.SpawnCreep('sim', Spawner.CreepJobs.Builder, "", Spawner.CreepBuilder[Spawner.CreepJobs.Builder](Game.rooms['sim'].energyCapacityAvailable));
	}
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
