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
			var energy = creep.room.find(FIND_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (structure.structureType == STRUCTURE_CONTAINER) &&
						structure.store[RESOURCE_ENERGY] > 0;
				}
			});

			energy = _.sortBy(energy, s => creep.pos.getRangeTo(s));

			if (energy.length != 0)
			{
				if (creep.withdraw(energy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(energy[0], { visualizePathStyle: { stroke: '#ffaa00' } })
				}
			}
			else
			{
				creep.moveTo(14, 34);
			}
		}
	}
};

module.exports = roleBuilder;
