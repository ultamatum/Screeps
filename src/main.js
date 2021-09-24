require('version')
var Union = require('Managers.CreepBuilder');
var SpawnCreep = require('Managers.CreepSpawner');
var roleMiner = require('Roles.Harvester');
var roleUpgrader = require('Roles.Upgrader');
var roleBuilder = require('Roles.Builder');
var roleRepairer = require('Roles.Repairer');


if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION)
{
	Memory.SCRIPT_VERSION = SCRIPT_VERSION
	console.log('New code updated')
}

module.exports.loop = function ()
{
	GarbageCollection();
	RespawnCreeps();
	UpdateSpawnerText();
	UpdateCreeps();
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
	}
}

function RespawnCreeps ()
{
	var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'Miner');
	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'Upgrader');
	var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'Builder');
	var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'Repairer');

	if (miners.length < 5)
	{
		SpawnCreep('sim', Union.CreepJobs.Miner, "", Union.CreepBuilder[Union.CreepJobs.Miner](Game.rooms['sim'].energyCapacityAvailable));
	}
	else if (repairers.length < 1)
	{
		SpawnCreep('sim', Union.CreepJobs.Repairer, "", Union.CreepBuilder[Union.CreepJobs.Repairer](Game.rooms['sim'].energyCapacityAvailable));
	}
	else if (upgraders.length < 2)
	{
		SpawnCreep('sim', Union.CreepJobs.Upgrader, "", Union.CreepBuilder[Union.CreepJobs.Upgrader](Game.rooms['sim'].energyCapacityAvailable));
	}
	else if (builders.length < 3)
	{
		SpawnCreep('sim', Union.CreepJobs.Builder, "", Union.CreepBuilder[Union.CreepJobs.Builder](Game.rooms['sim'].energyCapacityAvailable));
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
