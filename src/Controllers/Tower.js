var TowerController = {
	run: function (tower)
	{
		var closestHostile = tower.pos.findClosestByRange(
			FIND_HOSTILE_CREEPS
		)
		if (closestHostile)
		{
			tower.attack(closestHostile)
		}
		else if (
			tower.energy >
			tower.energyCapacity * 0.5
		)
		{
			Repair(tower)
		}
	},
}

function Repair (tower)
{
	var mostDamagedStructure = tower.pos.findClosestByRange(
		FIND_STRUCTURES,
		{
			filter: (structure) =>
				structure.hits < structure.hitsMax,
		}
	)
	tower.repair(mostDamagedStructure)
}

module.exports = TowerController
