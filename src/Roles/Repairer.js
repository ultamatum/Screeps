var masterCreep = require('Roles.MasterCreep')

var roleRepairer = {
	/** @param {Creep} creep **/
	run: function (creep)
	{
		if (
			creep.memory.repairing &&
			creep.store[RESOURCE_ENERGY] == 0
		)
		{
			creep.memory.repairing = false
			creep.say('🔄 refuel')
		}
		else if (
			!creep.memory.repairing &&
			creep.store.getFreeCapacity() == 0
		)
		{
			creep.memory.repairing = true
			creep.memory.repairTarget = null
			creep.say('⚡ repair')
		}

		if (creep.memory.repairing)
		{
			if (
				!creep.memory.repairTarget ||
				Game.getObjectById(
					creep.memory.repairTarget
				) == null
			)
			{
				GetNewRepairTarget(creep)
			}
			else if (
				Game.getObjectById(
					creep.memory.repairTarget
				).hits ==
				Game.getObjectById(
					creep.memory.repairTarget
				).hitsMax
			)
			{
				GetNewRepairTarget(creep)
			}

			if (
				creep.repair(
					Game.getObjectById(
						creep.memory.repairTarget
					)
				) == ERR_NOT_IN_RANGE
			)
			{
				creep.moveTo(
					Game.getObjectById(
						creep.memory.repairTarget
					),
					{
						visualizePathStyle:
						{
							stroke: '#ffffff',
						},
					}
				)
			}
		}
		else
		{
			masterCreep.getEnergy(creep)
		}
	},
}

function GetNewRepairTarget (creep)
{
	var mostDamagedStructure = creep.room.find(
		FIND_STRUCTURES,
		{
			filter: (structure) =>
			{
				return (
					(structure.hits / structure.hitsMax) *
					100 <=
					10 &&
					structure.structureType !=
					STRUCTURE_WALL
				)
			},
		}
	)

	if (mostDamagedStructure.length == 0)
	{
		mostDamagedStructure = creep.room.find(
			FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (
						(structure.hits /
							structure.hitsMax) *
						100 <=
						80 &&
						structure.structureType !=
						STRUCTURE_WALL &&
						structure.structureType !=
						STRUCTURE_ROAD &&
						structure.structureType !=
						STRUCTURE_RAMPART
					)
				},
			}
		)
	}

	if (mostDamagedStructure.length == 0)
	{
		mostDamagedStructure = creep.room.find(
			FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (
						(structure.structureType ==
							STRUCTURE_ROAD ||
							structure.structureType ==
							STRUCTURE_RAMPART) &&
						(structure.hits /
							structure.hitsMax) *
						100 <=
						80
					)
				},
			}
		)
	}

	if (mostDamagedStructure.length == 0)
		mostDamagedStructure = creep.room.find(
			FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (
						structure.structureType ==
						STRUCTURE_WALL &&
						structure.hits < structure.hitsMax
					)
				},
			}
		)

	if (mostDamagedStructure.length == 0)
		mostDamagedStructure = creep.room.find(
			FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (
						structure.hits < structure.hitsMax
					)
				},
			}
		)

	mostDamagedStructure = _.sortBy(
		mostDamagedStructure,
		(s) => creep.pos.getRangeTo(s)
	)

	mostDamagedStructure = _.sortBy(
		mostDamagedStructure,
		(s) => (s.hits / s.hitsMax) * 100.0
	)

	if (mostDamagedStructure.length > 0)
		creep.memory.repairTarget =
		mostDamagedStructure[0].id
}

module.exports = roleRepairer
