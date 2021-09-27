var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep)
	{

		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0)
		{
			creep.memory.building = false;
			creep.say('🔄 harvest');
		}
		if (!creep.memory.building && creep.store.getFreeCapacity() == 0)
		{
			creep.memory.building = true;
			creep.say('🚧 build');
		}

		if (creep.memory.building)
		{
			var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

			if (target)
			{
				if (creep.build(target) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
				}
			}
			else
			{
				creep.moveTo(14, 34);
			}
		}
		else
		{
			var energy = creep.pos.findClosestByPath(FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (structure.structureType == STRUCTURE_CONTAINER) &&
						structure.store[RESOURCE_ENERGY] > 0;
				}
			});

			/*if (energy)
			{
				if (creep.withdraw(energy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(energy, { visualizePathStyle: { stroke: '#ffaa00' } })
				}
			}
			else
			{*/
			var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

			if (creep.harvest(source) == ERR_NOT_IN_RANGE)
			{
				creep.moveTo(source, { reusePath: 4, visualizePathStyle: { stroke: '#ffaa00' } });
			}
			//}
		}
	}
};

module.exports = roleBuilder;
