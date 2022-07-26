var roleHauler = {
	/** @param {Creep} creep */
	run: function (creep)
	{
		if (creep.store.getUsedCapacity() == 0)
		{
			if (creep.memory.energyTarget == undefined)
			{
				var targets = creep.room.find(
					FIND_STRUCTURES,
					{
						filter: (structure) =>
						{
							return (
								structure.structureType ==
								STRUCTURE_CONTAINER &&
								structure.store[
									RESOURCE_ENERGY
								] >= 0
							)
						},
					}
				)

				targets = _.sortBy(targets, (t) =>
					t.store.getFreeCapacity(RESOURCE_ENERGY)
				)

				creep.memory.energyTarget = targets[0].id
			}

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
						reusePath: 4,
						visualizePathStyle:
						{
							stroke: '#ffaa00',
						},
					}
				)
			}
			else
			{
				creep.memory.energyTarget = undefined
			}
		}
		else
		{
			var target

			if (target == undefined)
			{
				target = creep.pos.findClosestByPath(
					FIND_STRUCTURES,
					{
						filter: (structure) =>
						{
							return (
								structure.structureType ==
								STRUCTURE_TOWER &&
								structure.store.getUsedCapacity(
									RESOURCE_ENERGY
								) /
								structure.store.getCapacity(
									RESOURCE_ENERGY
								) <
								0.2
							)
						},
					}
				)
			}
			if (target == undefined)
			{
				target = creep.pos.findClosestByPath(
					FIND_STRUCTURES,
					{
						filter: (structure) =>
						{
							return (
								structure.structureType ==
								STRUCTURE_EXTENSION &&
								structure.store.getFreeCapacity(
									RESOURCE_ENERGY
								) > 0
							)
						},
					}
				)
			}

			if (target == undefined)
			{
				target = creep.pos.findClosestByPath(
					FIND_STRUCTURES,
					{
						filter: (structure) =>
						{
							return (
								structure.structureType ==
								STRUCTURE_TOWER &&
								structure.store.getUsedCapacity(
									RESOURCE_ENERGY
								) /
								structure.store.getCapacity(
									RESOURCE_ENERGY
								) <
								0.49
							)
						},
					}
				)
			}

			if (target == undefined)
			{
				target = creep.pos.findClosestByPath(
					FIND_STRUCTURES,
					{
						filter: (structure) =>
						{
							return (
								structure.structureType ==
								STRUCTURE_SPAWN &&
								structure.store.getFreeCapacity(
									RESOURCE_ENERGY
								) > 0
							)
						},
					}
				)
			}

			if (target == undefined)
			{
				target = creep.pos.findClosestByPath(
					FIND_STRUCTURES,
					{
						filter: (structure) =>
						{
							return (
								structure.structureType ==
								STRUCTURE_TOWER &&
								structure.store.getFreeCapacity(
									RESOURCE_ENERGY
								) > 0
							)
						},
					}
				)
			}

			if (target == undefined)
			{
				target = creep.pos.findClosestByPath(
					FIND_STRUCTURES,
					{
						filter: (structure) =>
						{
							return (
								structure.structureType ==
								STRUCTURE_STORAGE &&
								structure.store.getFreeCapacity(
									RESOURCE_ENERGY
								) > 0
							)
						},
					}
				)
			}

			if (target)
			{
				if (
					creep.transfer(
						target,
						RESOURCE_ENERGY
					) == ERR_NOT_IN_RANGE
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
		}
	},
}

module.exports = roleHauler
