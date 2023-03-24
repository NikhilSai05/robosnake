
import { MaybeCell, ScreenPart } from "./GameRunner";

export type Player = "A" | "B" | "C" | "D";

export type Motion = "up" | "down" | "left" | "right";

// C uses these moves in order, repeatedly
const cCycle: Motion[] = ["up", "up", "right", "down", "right"];
let cIndex: number = 0;

export function initializeAgent(player: Player): void {
  // only agent C has its own state (for now)
  if (player == "C") cIndex = 0;
}

// screenPart is a 5x5 window with the agent in the center
//Removed from this functions and kept them in different functions for different agents
export function agentMove(player: Player, screenPart: ScreenPart): Motion {
  switch (player) {
    case "A": { // always move right
      return agent_A();
    }
    case "B": { // always random
      return agent_B(screenPart);
    }

    case "C": { // cycle through the moves in cCycle
      return agent_C();
    }

    case "D": { // go for any nearby apple, otherwise random
      return agent_D(screenPart);
    }
  }
}


export function randomMotion(part: ScreenPart): Motion {
  const rnd: number = Math.random() * 4; // random float in the half-open range [0, 4)

  let x: Motion;
  if (rnd < 1) x = "up";
  else if (rnd < 2) x = "down";
  else if (rnd < 3) x = "left";
  else x = "right";

  // try not to hit anything
  if (tryMove(x, part) != "apple" && tryMove(x, part) != "empty") {
    switch (x) {
      case "up": return "down";
      case "right": return "left";
      case "down": return "up";
      case "left": return "right";
    }
  }

  return x;
}

function tryMove(m: Motion, p: ScreenPart): MaybeCell {
  // the snake is positioned in the center at p[2][2]
  switch (m) {
    case "left": return p[2][1];
    case "right": return p[2][3];
    case "up": return p[1][2];
    case "down": return p[3][2];
  }
}


//Function for agent_A
function agent_A(): Motion 
{
  return "right";
}

//Function for agent_B
function agent_B(screenPart:ScreenPart):Motion 
{
  return  randomMotion(screenPart);
}

//Function for agent_c
function agent_C():Motion 
{
  const c: Motion = cCycle[cIndex];
  cIndex++;
  cIndex = cIndex % cCycle.length;
  return c;
}

//function for agent_D
function agent_D(screenPart: ScreenPart): Motion {
  for (let i=0;i<5;i++) 
  {
    for (let j=0;j<5;j++)
     {
      const cell: MaybeCell=screenPart[j][i];
      if (cell=="apple") 
      {
        if (i>3) 
        return "right";

        else if (i<3) 
        return "left";

        else if (j>3) 
        return "down";

        else if (j<3) 
        return "up";
      }
    }
  }
  return randomMotion(screenPart);
}
