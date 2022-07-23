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
		else
		{
			Repair(tower)
		}
	},

	Repair: function (tower)
	{
		var mostDamagedStructure =
			tower.pos.findClosestByRange(FIND_STRUCTURES,
			{
				filter: (structure) =>
					structure.hits < structure.hitsMax,
			})

		//sort MostDamagedStructure by health
		mostDamagedStructure = _.sortBy(
			mostDamagedStructure,
			(s) => s.hits
		)

		if (mostDamagedStructure)
		{
			tower.repair(mostDamagedStructure)
		}
	},
}
