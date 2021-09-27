var roleHauler = {
	/** @param {Creep} creep */
	run: function (creep)
	{
		if (creep.store.getUsedCapacity() == 0)
		{
			var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
			{
				filter: (structure) =>
				{
					return structure.structureType == STRUCTURE_CONTAINER;
				}
			})

			if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				creep.moveTo(target, { reusePath: 4, visualizePathStyle: { stroke: '#ffaa00' } });
		}
		else
		{
			var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				}
			})
		}
	}
}

module.exports = roleHauler;
