var roleHauler = {
	/** @param {Creep} creep */
	run: function (creep)
	{
		if (creep.store.getUsedCapacity() == 0)
		{
			var targets = creep.room.find(FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return structure.structureType == STRUCTURE_CONTAINER &&
						structure.store[RESOURCE_ENERGY] >= 0;
				}
			})

			targets = _.sortBy(targets, t => t.store.getFreeCapacity(RESOURCE_ENERGY));

			if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				creep.moveTo(targets[0], { reusePath: 4, visualizePathStyle: { stroke: '#ffaa00' } });
		}
		else
		{
			var target = creep.pos.findClosestByPath(FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				}
			})

			if (target)
			{
				if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
				}
			}
		}
	}
}

module.exports = roleHauler;
