var CreepJobs;
(function (CreepJobs)
{
	CreepJobs["Miner"] = "Miner";
	CreepJobs["Upgrader"] = "Upgrader";
	CreepJobs["Repairer"] = "Repairer";
	CreepJobs["Builder"] = "Builder";
})(CreepJobs || (CreepJobs = {}));

export const CreepBuilder = {
	[CreepJobs.Miner]: (energy) =>
	{
		// Can't build this creep with less than 200 energy
		if (energy < 200)
		{
			return [];
		}
		else
		{
			let moveParts = (energy <= 550) ? 1 : 2;
			let carryParts = 1;
			let workParts = Math.min(10, Math.floor((energy - ((moveParts * BODYPART_COST[MOVE]) + (carryParts * BODYPART_COST[CARRY]))) / BODYPART_COST[WORK])); // Use the rest of the energy for work parts
			return [].concat(Array(workParts).fill(WORK), Array(moveParts).fill(MOVE), Array(carryParts).fill(CARRY));
		}
	},
	[CreepJobs.Upgrader]: (energy) =>
	{
		if (energy < 250)
		{
			return [];
		}
		else
		{
			// Max for an upgrader at RCL8 is 15 energy/tick, so we'll cap it there
			// Keep in ratio 3:1
			let workParts = Math.min(15, Math.floor(((energy - BODYPART_COST[CARRY]) * 3 / 4) / BODYPART_COST[WORK]));
			let moveParts = Math.min(8, Math.floor(((energy - BODYPART_COST[CARRY]) * 1 / 4) / BODYPART_COST[MOVE]));
			return [].concat(Array(workParts).fill(WORK), [CARRY], Array(moveParts).fill[MOVE]);
		}
	},
	// TODO: Combine repairer and builder into 1 "engineer", no need to have both really
	[CreepJobs.Repairer]: (energy) =>
	{
		if (energy < 200)
		{
			return [];
		}
		else
		{
			// Keep Work, Carry, Move 1:1:1 ratio
			let parts = Math.min(16, Math.floor(((1 / 2) * energy) / 100));
			return [].concat(Array(parts).fill(WORK), Array(parts).fill(CARRY), Array(parts).fill(MOVE));
		}
	},
	[CreepJobs.Builder]: (energy) =>
	{
		if (energy < 200)
		{
			return [];
		}
		else
		{
			// Keep Work, Carry, Move 1:1:1 ratio
			let parts = Math.min(16, Math.floor(((1 / 2) * energy) / 100));
			return [].concat(Array(parts).fill(WORK), Array(parts).fill(CARRY), Array(parts).fill(MOVE));
		}
	},
}
