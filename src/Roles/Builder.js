var masterCreep = require('Roles.MasterCreep')

var roleBuilder = {
	/** @param {Creep} creep **/
	run: function (creep)
	{
		if (
			creep.memory.building &&
			creep.store[RESOURCE_ENERGY] == 0
		)
		{
			creep.memory.building = false
			creep.say('🔄 refuel')
		}
		if (
			!creep.memory.building &&
			creep.store.getFreeCapacity() == 0
		)
		{
			creep.memory.building = true
			creep.say('🚧 build')
		}

		if (creep.memory.building)
		{
			var target = creep.pos.findClosestByPath(
				FIND_CONSTRUCTION_SITES
			)

			if (target)
			{
				if (
					creep.build(target) == ERR_NOT_IN_RANGE
				)
				{
					creep.moveTo(target,
					{
						visualizePathStyle:
						{
							stroke: '#ffffff',
						},
					})
				}
			}
			else
			{
				creep.moveTo(14, 34)
			}
		}
		else
		{
			masterCreep.getEnergy(creep)
		}
	},
}

module.exports = roleBuilder
