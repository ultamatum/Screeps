require('version')
var roleHarvester = require('roles.harvester');
var roleUpgrader = require('roles.upgrader');
var roleBuilder = require('roles.builder');
var roleRepairer = require('roles.repairer');

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

function UpdateCreeps()
{
    for (var name in Game.creeps)
    {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'Harvester' || creep.memory.role == 'harvester')
        {
            roleHarvester.run(creep);
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

function RespawnCreeps()
{
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'Harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'Upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'Builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'Repairer')

    if (harvesters.length < 10)
    {
        Game.spawns['Spawn1'].room.memory.harvesterCount += 1;

        var newName = 'Harvester' + Game.time;
        console.log('Spawning new Harvester: ' + newName);
        if (Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName,
            {
                memory: {
                    role: 'Harvester',
                    sourceId: Game.spawns['Spawn1'].room.memory.harvesterCount % Game.spawns['Spawn1'].room.find(FIND_SOURCES).length
                }
            }) == -6
            && harvesters.length == 0)
        {
            // Enter emergency mode
            // AKA set everything to harvester because we've run out and theres no energy left to make more

            for (var name in Game.creeps)
            {
                var creep = Game.creeps[name];
                creep.memory.role = 'Harvester';
            }
        };
    } else if (repairers.length < 4)
    {
        var newName = 'Repairer' + Game.time;
        console.log('Spawning new Repairer: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE], newName,
            { memory: { role: 'Repairer' } });

    } else if (upgraders.length < 2)
    {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new Upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE], newName,
            { memory: { role: 'Upgrader' } });
    } else if (builders.length < 2)
    {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new Builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE], newName,
            { memory: { role: 'Builder' } });
    }
}

function UpdateSpawnerText()
{
    if (Game.spawns['Spawn1'].spawning)
    {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }
}

function GarbageCollection()
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