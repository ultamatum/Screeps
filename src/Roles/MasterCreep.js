var MasterCreep = {
	getEnergy: function (creep)
	{
		// Get an energy target and save it to the creeps memory
		if (creep.memory.energyTarget == undefined)
		{
			var energy = creep.room.find(FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (
						(structure.structureType ==
							STRUCTURE_CONTAINER ||
							structure.structureType ==
							STRUCTURE_STORAGE) &&
						structure.store[RESOURCE_ENERGY] >=
						100
					)
				},
			})

			energy = _.sortBy(energy, (s) =>
				s.store.getFreeCapacity(RESOURCE_ENERGY)
			)

			if (energy.length != 0)
			{
				creep.memory.energyTarget = energy[0].id
			}
		}

		//If we found a target we move to it, otherwise we mine a source
		if (creep.memory.energyTarget != undefined)
		{
			if (
				creep.withdraw(
					Game.getObjectById(
						creep.memory.energyTarget
					),
					RESOURCE_ENERGY
				) == ERR_NOT_IN_RANGE
			)
			{
				creep.moveTo(
					Game.getObjectById(
						creep.memory.energyTarget
					),
					{
						visualizePathStyle:
						{
							stroke: '#ffaa00',
						},
					}
				)
			}
			else
			{
				//Reset the energy target once we've filled up
				creep.memory.energyTarget = undefined
			}
		}
		else
		{
			var sources = creep.room.find(FIND_SOURCES)
			sources = _.sortBy(sources, (s) =>
				creep.pos.getRangeTo(s)
			)

			if (
				creep.harvest(sources[0]) ==
				ERR_NOT_IN_RANGE
			)
			{
				creep.moveTo(sources[0],
				{
					visualizePathStyle:
					{
						stroke: '#ff0000',
					},
				})
			}
		}
	},
}

module.exports = MasterCreep
