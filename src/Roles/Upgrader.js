var roleUpgrader = {

	/** @param {Creep} creep **/
	run: function (creep)
	{

		if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0)
		{
			creep.memory.upgrading = false;
			creep.say('🔄 harvest');
		}
		if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0)
		{
			creep.memory.upgrading = true;
			creep.say('⚡ upgrade');
		}

		if (creep.memory.upgrading)
		{
			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
			{
				creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
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
				var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

				if (creep.harvest(source) == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(source, { reusePath: 4, visualizePathStyle: { stroke: '#ffaa00' } });
				}
			}
		}
	}
};

module.exports = roleUpgrader;
