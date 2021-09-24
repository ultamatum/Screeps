var roleHarvester = {

	/** @param {Creep} creep **/
	run: function (creep)
	{
		if (creep.store.getFreeCapacity() > 0)
		{
			var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

			if (creep.harvest(source) == ERR_NOT_IN_RANGE)
			{
				creep.moveTo(source, { reusePath: 4, visualizePathStyle: { stroke: '#ffaa00' } });
			}
		}
		else
		{
			var target = creep.pos.findClosestByPath(FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_SPAWN);
				}
			});

			if (target)
			{
				if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
				}
			}
		}
	}
};

module.exports = roleHarvester;