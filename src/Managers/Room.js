var respawner = require('Managers.Respawner')
const roomLayout = require('json.RoomLayout')

var RoomManager = {
	/** @param {Room} room **/
	run: function (room)
	{
		var currentTick = Game.time

		if (!room.memory.foundSpace)
		{
			room.memory.foundSpace = false
		}

		if (
			room.memory.checkx == undefined &&
			room.memory.checky == undefined
		)
		{
			room.memory.checkx = 0
			room.memory.checky = 0
		}

		if (
			!room.memory.SetupComplete &&
			room.controller.owner.username == 'Ultamatum'
		)
		{
			RoomSetup(room)
		}

		if (currentTick % 1000 == 0)
		{
			console.log('Updating Room Layout')
			SetupRoomLayout(room)
		}

		if (currentTick % 333 == 0)
		{
			console.log('Building Roads')
			BuildRoads(room)
		}

		respawner.run(room)

		UpdateSpawnerText(room)
	},
}

function UpdateSpawnerText (room)
{
	var spawns = room.find(FIND_MY_SPAWNS)

	for (var spawn in spawns)
	{
		if (spawns[spawn].spawning)
		{
			var spawningCreep =
				Game.creeps[spawns[spawn].spawning.name]
			spawns[spawn].room.visual.text(
				'🛠️' + spawningCreep.memory.role,
				spawns[spawn].pos.x + 1,
				spawns[spawn].pos.y, { align: 'left', opacity: 0.8 }
			)
		}
	}
}

function RoomSetup (room)
{
	// Find an empty 12x12 square to build the room in
	if (room.memory.foundSpace == false)
	{
		FindSpace(room)
	}

	if (room.memory.foundSpace)
	{
		SetupRoomLayout(room)
		BuildContainers(room)
		BuildRoads(room)

		room.memory.SetupComplete = true
	}
}

function FindSpace (room)
{
	var checkx = room.memory.checkx
	var checky = room.memory.checky

	var area = room
		.lookAtArea(
			checky,
			checkx,
			checky + 12,
			checkx + 12,
			true
		)
		.filter(
			(look) =>
			look.terrain != 'plain' &&
			look.terrain != 'swamp' &&
			look.type != 'creep'
		)

	if (area.length == 0)
	{
		room.memory.foundSpace = true
		room.memory.structureCenter = {
			x: checkx + 6,
			y: checky + 6,
		}
	}
	else
	{
		room.memory.checkx++
		if (room.memory.checkx > 37)
		{
			room.memory.checky++
			room.memory.checkx = 0
		}
	}

	if (checky > 37)
	{
		console.log('No space found for room')
		return
	}
}

function SetupRoomLayout (room)
{
	for (
		var i = 0; i < roomLayout.buildings.spawn.pos.length; i++
	)
	{
		var pos = roomLayout.buildings.spawn.pos[i]

		room.createConstructionSite(
			pos.x + room.memory.structureCenter.x,
			pos.y + room.memory.structureCenter.y,
			STRUCTURE_SPAWN
		)
	}

	if (room.controller.level >= 3)
	{
		for (
			var i = 0; i < roomLayout.buildings.tower.pos.length; i++
		)
		{
			var pos = roomLayout.buildings.tower.pos[i]

			room.createConstructionSite(
				pos.x + room.memory.structureCenter.x,
				pos.y + room.memory.structureCenter.y,
				STRUCTURE_TOWER
			)
		}
	}

	for (
		var i = 0; i < roomLayout.buildings.road.pos.length; i++
	)
	{
		var pos = roomLayout.buildings.road.pos[i]

		room.createConstructionSite(
			pos.x + room.memory.structureCenter.x,
			pos.y + room.memory.structureCenter.y,
			STRUCTURE_ROAD
		)
	}

	if (room.controller.level >= 4)
	{
		room.createConstructionSite(
			roomLayout.buildings.storage.pos.x +
			room.memory.structureCenter.x,
			roomLayout.buildings.storage.pos.y +
			room.memory.structureCenter.y,
			STRUCTURE_STORAGE
		)
	}

	if (room.controller.level >= 5)
	{
		room.createConstructionSite(
			roomLayout.buildings.link.pos.x +
			room.memory.structureCenter.x,
			roomLayout.buildings.link.pos.y +
			room.memory.structureCenter.y,
			STRUCTURE_LINK
		)
	}

	for (
		var i = 0; i < roomLayout.buildings.extension.pos.length; i++
	)
	{
		var pos = roomLayout.buildings.extension.pos[i]

		room.createConstructionSite(
			pos.x + room.memory.structureCenter.x,
			pos.y + room.memory.structureCenter.y,
			STRUCTURE_EXTENSION
		)
	}

	if (room.controller.level >= 6)
	{
		room.createConstructionSite(
			roomLayout.buildings.terminal.pos.x +
			room.memory.structureCenter.x,
			roomLayout.buildings.terminal.pos.y +
			room.memory.structureCenter.y,
			STRUCTURE_TERMINAL
		)
	}

	if (room.controller.level >= 6)
	{
		for (
			var i = 0; i < roomLayout.buildings.lab.pos.length; i++
		)
		{
			var pos = roomLayout.buildings.lab.pos[i]

			room.createConstructionSite(
				pos.x + room.memory.structureCenter.x,
				pos.y + room.memory.structureCenter.y,
				STRUCTURE_LAB
			)
		}
	}

	if (room.controller.level >= 8)
	{
		room.createConstructionSite(
			roomLayout.buildings.observer.pos.x +
			room.memory.structureCenter.x,
			roomLayout.buildings.observer.pos.y +
			room.memory.structureCenter.y,
			STRUCTURE_OBSERVER
		)
	}

	if (room.controller.level >= 8)
	{
		room.createConstructionSite(
			roomLayout.buildings.powerSpawn.pos.x +
			room.memory.structureCenter.x,
			roomLayout.buildings.powerSpawn.pos.y +
			room.memory.structureCenter.y,
			STRUCTURE_POWER_SPAWN
		)
	}

	if (room.controller.level >= 8)
	{
		room.createConstructionSite(
			roomLayout.buildings.nuker.pos.x +
			room.memory.structureCenter.x,
			roomLayout.buildings.nuker.pos.y +
			room.memory.structureCenter.y,
			STRUCTURE_NUKER
		)
	}

	for (
		var i = 0; i < roomLayout.buildings.rampart.pos.length; i++
	)
	{
		var pos = roomLayout.buildings.rampart.pos[i]

		room.createConstructionSite(
			pos.x + room.memory.structureCenter.x,
			pos.y + room.memory.structureCenter.y,
			STRUCTURE_RAMPART
		)
	}
}

function BuildContainers (room)
{
	var sources = room.find(FIND_SOURCES)

	for (var i in sources)
	{
		var source = sources[i]

		var path = room.findPath(
			source.pos,
			new RoomPosition(
				room.memory.structureCenter.x,
				room.memory.structureCenter.y,
				room.name
			),
			{
				ignoreCreeps: true,
				swampCost: 1,
			}
		)

		room.createConstructionSite(
			path[1].x,
			path[1].y,
			STRUCTURE_CONTAINER
		)
	}
}

function BuildRoads (room)
{
	var sources = room.find(FIND_SOURCES)

	for (var i in sources)
	{
		// Find shortest path to one of the entrances
		BuildShortestPathToEntrance(room, sources[i].pos)
	}

	BuildShortestPathToEntrance(room, room.controller.pos)

	//BuildPathFromController(room)
}

function BuildShortestPathToEntrance (room, from)
{
	var entrances = [
	{
		pos: new RoomPosition(
			room.memory.structureCenter.x + 7,
			room.memory.structureCenter.y,
			room.name
		),
		range: 0,
	},
	{
		pos: new RoomPosition(
			room.memory.structureCenter.x - 7,
			room.memory.structureCenter.y,
			room.name
		),
		range: 0,
	},
	{
		pos: new RoomPosition(
			room.memory.structureCenter.x,
			room.memory.structureCenter.y + 7,
			room.name
		),
		range: 0,
	},
	{
		pos: new RoomPosition(
			room.memory.structureCenter.x,
			room.memory.structureCenter.y - 7,
			room.name
		),
		range: 0,
	}, ]

	let path = PathFinder.search(from, entrances,
	{
		plainCost: 2,
		swampCost: 7,
		roomCallback: function (roomName)
		{
			let room = Game.rooms[roomName]
			if (!room) return false
			let costs = new PathFinder.CostMatrix()

			room.find(FIND_STRUCTURES).forEach(function (
				structure
			)
			{
				if (
					structure.structureType ===
					STRUCTURE_ROAD
				)
				{
					costs.set(
						structure.pos.x,
						structure.pos.y,
						1
					)
				}
				else if (
					structure.structureType !==
					STRUCTURE_CONTAINER &&
					structure.structureType !==
					STRUCTURE_RAMPART
				)
				{
					costs.set(
						structure.pos.x,
						structure.pos.y,
						0xff
					)
				}
			})

			room.find(FIND_MY_CREEPS).forEach(function (
				creep
			)
			{
				costs.set(creep.pos.x, creep.pos.y, 2)
			})

			return costs
		},
	})

	// Build roads from source to entrance
	for (var i = 1; i < path.path.length; i++)
	{
		room.createConstructionSite(
			path.path[i].x,
			path.path[i].y,
			STRUCTURE_ROAD
		)
	}
}

function BuildPathFromController (room)
{
	var sources = room.find(FIND_SOURCES)

	for (var i in sources)
	{
		let path = PathFinder.search(
			room.controller.pos,
			sources[i].pos,
			{
				plainCost: 2,
				swampCost: 7,
				roomCallback: function (roomName)
				{
					let room = Game.rooms[roomName]
					if (!room) return false
					let costs = new PathFinder.CostMatrix()

					room.find(FIND_STRUCTURES).forEach(
						function (structure)
						{
							if (
								structure.structureType ===
								STRUCTURE_ROAD
							)
							{
								costs.set(
									structure.pos.x,
									structure.pos.y,
									1
								)
							}
							else if (
								structure.structureType !==
								STRUCTURE_CONTAINER &&
								structure.structureType !==
								STRUCTURE_RAMPART
							)
							{
								costs.set(
									structure.pos.x,
									structure.pos.y,
									0xff
								)
							}
						}
					)

					room.find(FIND_MY_CREEPS).forEach(
						function (creep)
						{
							costs.set(
								creep.pos.x,
								creep.pos.y,
								2
							)
						}
					)

					return costs
				},
			}
		)

		// Build roads from source to entrance
		for (var i = 1; i < path.path.length; i++)
		{
			room.createConstructionSite(
				path.path[i].x,
				path.path[i].y,
				STRUCTURE_ROAD
			)
		}
	}
}

module.exports = RoomManager
