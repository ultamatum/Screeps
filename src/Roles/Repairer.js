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
		if (
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
				).hits ==
				Game.getObjectById(
					creep.memory.repairTarget
				).hitsMax
			)
			{
				var mostDamagedStructure = creep.room.find(
					FIND_STRUCTURES,
					{
						filter: (structure) =>
						{
							return (
								(structure.hits /
									structure.hitsMax) *
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
									structure.hits <
									structure.hitsMax
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
									structure.hits <
									structure.hitsMax
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
			var energy = creep.room.find(FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (
						structure.structureType ==
						STRUCTURE_CONTAINER &&
						structure.store[RESOURCE_ENERGY] >=
						100
					)
				},
			})

			energy = _.sortBy(energy, (s) =>
				creep.pos.getRangeTo(s)
			)

			if (energy.length != 0)
			{
				if (
					creep.withdraw(
						energy[0],
						RESOURCE_ENERGY
					) == ERR_NOT_IN_RANGE
				)
				{
					creep.moveTo(energy[0],
					{
						visualizePathStyle:
						{
							stroke: '#ffaa00',
						},
					})
				}
			}
			//else
			//{
			//	var sources = creep.room.find(FIND_SOURCES);
			//	sources = _.sortBy(sources, s => creep.pos.getRangeTo(s));
			//
			//	if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE)
			//	{
			//		creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ff0000' } });
			//	}
			//}
		}
	},
}

module.exports = roleRepairer
