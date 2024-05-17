// directionIcons.ts

export const getDirectionIcon = (instruction: string) => {
  switch (true) {
    case instruction.toLowerCase().includes("turn left"):
      return "turn-left";
    case instruction.toLowerCase().includes("turn right"):
      return "turn-right";
    case instruction.toLowerCase().includes("fork left"):
      return "fork-left";
    case instruction.toLowerCase().includes("fork right"):
      return "fork-right";
    case instruction.toLowerCase().includes("continue"):
      return "straight";
    case instruction.toLowerCase().includes("take exit"):
      return "exit-to-app";
    case instruction.toLowerCase().includes("merge"):
      return "merge";
    case instruction.toLowerCase().includes("u-turn left"):
      return "u-turn-left";
    case instruction.toLowerCase().includes("u-turn right"):
      return "u-turn-right";
    case instruction.toLowerCase().includes("north"):
      return "north";
    case instruction.toLowerCase().includes("north east"):
      return "north-east";
    case instruction.toLowerCase().includes("north west"):
      return "north-west";
    case instruction.toLowerCase().includes("south"):
      return "south";
    case instruction.toLowerCase().includes("south east"):
      return "south-east";
    case instruction.toLowerCase().includes("south west"):
      return "south-west";
    case instruction.toLowerCase().includes("east"):
      return "east";
    case instruction.toLowerCase().includes("west"):
      return "west";
    case instruction.toLowerCase().includes("slight right"):
      return "turn-slight-right";
    case instruction.toLowerCase().includes("slight left"):
      return "turn-slight-left";
    case instruction.toLowerCase().includes("sharp right"):
      return "turn-sharp-right";
    case instruction.toLowerCase().includes("sharp left"):
      return "turn-sharp-left";
    case instruction.toLowerCase().includes("ramp left"):
      return "ramp-left";
    case instruction.toLowerCase().includes("ramp right"):
      return "ramp-right";
    case instruction.toLowerCase().includes("roundabout left"):
      return "roundabout-left";
    case instruction.toLowerCase().includes("roundabout right"):
      return "roundabout-right";
    default:
      return "place";
  }
};
